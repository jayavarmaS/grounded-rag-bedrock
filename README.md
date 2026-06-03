# Company Policy RAG

A grounded retrieval-augmented generation (RAG) assistant for answering questions about company policies using AWS Bedrock knowledge bases.

## Overview

This project includes a FastAPI backend and a static frontend for asking questions, retrieving policy documents, and returning grounded answers with citations.

## Architecture Flow

1. The user enters a question in the browser UI.
2. Frontend `frontend/script.js` sends a POST request to the backend `/chat` endpoint.
3. The backend `app/api/chat.py` receives the question and passes it to the Bedrock service implementation in `app/services/bedrock.py`.
4. Bedrock retrieves relevant policy documents from the knowledge base and generates an answer with supporting citations.
5. The backend formats the answer and citation metadata using `app/rag/citation.py`.
6. The frontend displays the response and renders citation cards with links to open PDF documents at the referenced page.

## File Structure

```
.
├── README.md
├── pyproject.toml
├── .env                 # AWS and environment configuration
├── app
│   ├── main.py          # FastAPI app, CORS setup, and static mount
│   ├── api
│   │   └── chat.py      # /chat router and request handling
│   ├── services
│   │   └── bedrock.py   # AWS Bedrock retrieval and generation logic
│   ├── rag
│   │   └── citation.py  # Citation extraction and formatting helpers
│   ├── schemas
│   │   ├── request.py   # Chat request schema
│   │   └── response.py  # Chat response schema
│   ├── utils
│   │   └── config.py    # Environment loading and config helpers
│   └── logs
│       └── logger.py    # Logging setup
├── frontend
│   ├── index.html       # Static chat UI
│   ├── script.js        # Frontend request/citation logic
│   └── style.css        # Page styling
└── runtimes_log
```

## How It Works

- `app/main.py` initializes FastAPI, enables CORS, includes the chat router, and mounts the `frontend/` directory at `/frontend`.
- `app/api/chat.py` exposes a POST `/chat` endpoint that accepts a JSON question payload.
- `app/services/bedrock.py` handles the AWS Bedrock API call to retrieve documents and generate the final answer.
- `app/rag/citation.py` converts retrieved references into structured citations for the frontend.
- `frontend/script.js` sends the question, parses the backend response, and renders the answer plus clickable citation cards.
- `frontend/getPdfUrl()` supports both direct HTTPS links and S3-style PDF sources while preserving query strings and page fragments.

## Requirements

- Python 3.11+
- AWS credentials configured for Bedrock access
- Environment variables such as `AWS_REGION`, `KNOWLEDGE_BASE_ID`, and `MODEL_ID`

## Installation

1. Create and activate a Python virtual environment:

   ```bash
   python -m venv .venv
   .\.venv\Scripts\activate
   ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

   If `requirements.txt` is not available, install from `pyproject.toml`:

   ```bash
   pip install -e .
   ```

3. Create a `.env` file with your AWS and Bedrock config:

   ```env
   AWS_REGION=ap-south-1
   KNOWLEDGE_BASE_ID=<your-knowledge-base-id>
   MODEL_ID=<your-bedrock-model-id>
   ```

## Running the App

Start the FastAPI server:

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Then open:

- `http://127.0.0.1:8000/frontend/index.html`

## API Usage

### POST /chat

Request body:

```json
{
  "question": "What is the company vacation policy?"
}
```

Response format:

```json
{
  "answer": "<generated answer>",
  "citations": [
    {
      "id": 1,
      "source": "<document-name>",
      "page": 3,
      "snippet": "<evidence snippet>",
      "url": "<document-url>"
    }
  ]
}
```

## Frontend Behavior

- The browser UI submits the entered question to `/chat`.
- Returned results show the generated answer and a list of source cards.
- Clicking a source card opens a citation modal.
- PDF source links are rendered with `Open PDF at page ...` and preserve existing query parameters.

## Notes

- Make sure AWS credentials are available in the environment or via AWS CLI config.
- The project is built for a basic RAG workflow and can be extended for additional knowledge sources, document types, or UI improvements.

## License

This repository does not include a license. Add one if you want to share the project publicly.

