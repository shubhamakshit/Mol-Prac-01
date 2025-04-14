# Chemical Compound Name Generator API

A Flask-based REST API that leverages Google's Gemini AI to generate IUPAC names for chemical compounds based on user-specified parameters.

## Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd compound-name-generator-api
```

2. Install the required packages:
```bash
pip install -r requirements.txt
```

3. Set up your environment variables:
```bash
# Create a .env file
echo "GEMINI_API_KEY=your_api_key_here" > .env
```

## Running the API

Start the Flask server:
```bash
python app.py
```

The API will be available at `http://localhost:5000/`.

## API Usage

### Endpoint: `/generate-compounds`

**Method**: POST

**Request Body Parameters**:

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `type` | string | Type of compound (e.g., "branched chain", "aromatic", "cyclic") | "branched chain with 2+ functional groups" |
| `number` | integer | Number of compounds to generate (1-100) | 10 |
| `min_carbon` | integer | Minimum carbon chain length | 5 |
| `functional_groups` | array | List of specific functional groups to include | [] |
| `additional_specs` | string | Additional specifications or properties | "" |

**Example Request**:
```bash
curl -X POST http://localhost:5000/generate-compounds \
  -H "Content-Type: application/json" \
  -d '{
    "type": "aromatic",
    "number": 5,
    "min_carbon": 8,
    "functional_groups": ["carboxylic acid", "hydroxyl"],
    "additional_specs": "water soluble"
  }'
```

**Example Response**:
```json
[
  {
    "name": "4-hydroxy-3-methoxybenzoic acid"
  },
  {
    "name": "3,4-dihydroxybenzoic acid"
  },
  {
    "name": "4-(2-hydroxyethyl)benzoic acid"
  },
  {
    "name": "3-hydroxy-4-methoxybenzoic acid"
  },
  {
    "name": "2,4-dihydroxybenzoic acid"
  }
]
```

## Error Handling

The API returns appropriate HTTP status codes and error messages for different types of errors:

- `400 Bad Request`: Invalid parameters
- `500 Internal Server Error`: Server-side errors

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Your Google Gemini API key |

## Dependencies

- Flask: Web framework
- Google Generative AI: Client for Google's Gemini AI
- python-dotenv: For loading environment variables

## License

[Choose an appropriate license]

## Author

Date created: 2025-04-14
Author: shubhamakshit

## Notes

This API is for educational and research purposes. It does not include authentication mechanisms and should not be deployed publicly without proper security measures.