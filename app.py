from flask import Flask, render_template, request, jsonify
import os
import json
from dotenv import load_dotenv
from flask_cors import CORS
from google import genai
from google.genai import types

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
# Enable CORS for all routes and origins
CORS(app)

# Get API key with validation
api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("ERROR: GEMINI_API_KEY environment variable is not set!")
    print("Please create a .env file with your API key or set it in your environment.")
    print("Example: GEMINI_API_KEY=your_api_key_here")

# Initialize the Gemini AI client only if API key exists
client = None
if api_key:
    try:
        client = genai.Client(api_key=api_key)
        print("Successfully initialized Gemini AI client")
    except Exception as e:
        print(f"Error initializing Gemini AI client: {str(e)}")

@app.route('/generate-compounds', methods=['POST'])
def generate_compounds():
    # Check if client is initialized
    if not client:
        return jsonify({"error": "API client not initialized. Please check your GEMINI_API_KEY."}), 500
        
    try:
        # Get parameters from request
        data = request.get_json()
        
        # Validate required parameters
        if not data:
            return jsonify({"error": "No parameters provided"}), 400
            
        # Extract parameters with defaults
        compound_type = data.get('type', 'branched chain with 2+ functional groups')
        num_compounds = data.get('number', 10)
        min_carbon = data.get('min_carbon', 5)
        functional_groups = data.get('functional_groups', [])
        additional_specs = data.get('additional_specs', '')
        
        # Validate number parameter
        try:
            num_compounds = int(num_compounds)
            if num_compounds < 1 or num_compounds > 100:
                return jsonify({"error": "Number must be between 1 and 100"}), 400
        except ValueError:
            return jsonify({"error": "Number must be an integer"}), 400
            
        # Construct prompt for Gemini
        functional_groups_text = ""
        if functional_groups:
            functional_groups_text = f" including {', '.join(functional_groups)} groups"
            
        additional_text = ""
        if additional_specs:
            additional_text = f" with {additional_specs}"
            
        prompt = f"Generate {num_compounds} IUPAC names for {compound_type} compounds{functional_groups_text}{additional_text} with at least {min_carbon} carbon chain length.\n\nAnswer in JSON format ONLY as an array of objects with 'name' property.\n\n also prefer Dihydroxybutane-2,3-dioic acid otation instead of 2,3-dihydroxybutanedioic acid!"
        
        print(f"Sending prompt to Gemini: {prompt}")
        
        # Call Gemini API
        model = "gemini-2.0-flash-lite"
        response = client.models.generate_content(
            model=model,
            contents=[
                types.Content(
                    role="user",
                    parts=[types.Part.from_text(text=prompt)],
                ),
            ],
        )
        
        # Parse response
        try:
            # Extract JSON from potential text/markdown response
            response_text = response.text
            if "```json" in response_text:
                json_str = response_text.split("```json")[1].split("```")[0].strip()
            elif "```" in response_text:
                json_str = response_text.split("```")[1].split("```")[0].strip()
            else:
                json_str = response_text.strip()
                
            compounds = json.loads(json_str)
            return jsonify({
                "compounds": compounds,
            })
        except Exception as e:
            return jsonify({"error": f"Failed to parse response: {str(e)}", "raw_response": response.text}), 500
            
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@app.route('/api/', methods=['GET'])
def api():
    return """
    <html>
        <head>
            <title>Compound Name Generator API</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
                h1 { color: #333; }
                pre { background: #f4f4f4; padding: 15px; border-radius: 5px; }
                code { font-family: monospace; }
            </style>
        </head>
        <body>
            <h1>Compound Name Generator API</h1>
            <p>Send POST requests to <code>/generate-compounds</code> with the following JSON structure:</p>
            <pre>
{
  "type": "aromatic",
  "number": 5,
  "min_carbon": 8,
  "functional_groups": ["carboxylic acid", "hydroxyl"],
  "additional_specs": "water soluble"
}
            </pre>
            <p>See the README.md for more details.</p>
        </body>
    </html>
    """

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')