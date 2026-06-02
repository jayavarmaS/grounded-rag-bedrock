# Company Policy RAG

A grounded retrieval-augmented generation (RAG) assistant for answering questions about company policies using AWS Bedrock knowledge bases.

## Overview

This project provides a FastAPI backend and a simple frontend interface for submitting questions and receiving answers with cited document references. It uses AWS Bedrock to retrieve policy documents from a knowledge base and generate grounded responses with evidence snippets.

## Features

- FastAPI backend with `/chat` endpoint
- Frontend UI for asking questions and viewing answers
- AWS Bedrock `retrieve_and_generate` integration
- Citation extraction from retrieved references
- JSON response model with structured citations

## Project Structure

- `app/main.py` — FastAPI application and static frontend mounting
- `app/api/chat.py` — API router for chat requests
- `app/services/bedrock.py` — AWS Bedrock retrieval and generation code
- `app/rag/citation.py` — Citation extraction and formatting
- `app/utils/config.py` — environment configuration loader
- `app/schemas/` — request and response Pydantic models
- `frontend/` — static UI assets

## Requirements

- Python 3.11+ recommended
- AWS credentials configured for Bedrock access
- `AWS_REGION`, `KNOWLEDGE_BASE_ID`, and `MODEL_ID` set in `.env`

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

3. Create a `.env` file with the following values:

   ```env
   AWS_REGION=us-west-2
   KNOWLEDGE_BASE_ID=<your-knowledge-base-id>
   MODEL_ID=<your-bedrock-model-id>
   ```

## Running the Application

Start the FastAPI server with Uvicorn:

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Open the frontend in your browser:

- `http://127.0.0.1:8000/frontend/index.html`

## API Usage

### POST /chat

Request body:

```json
{
  "question": "What is the company vacation policy?"
}
```

Successful response:

```json
{
  "answer": "<generated answer>",
  "citations": [
    {
      "id": 1,
      "source": "<document-name>",
      "page": 3,
      "snippet": "<evidence snippet>"
    }
  ]
}
```

## Frontend

The frontend is a simple static page located in `frontend/`:

- `index.html` — user interface
- `script.js` — chat request logic
- `style.css` — styling

The UI posts questions to `http://127.0.0.1:8000/chat` and displays the answer with retrieved citations.

## Notes

- Ensure AWS credentials are available in your environment or through the AWS CLI configuration.
- The Bedrock client uses `boto3` and the `bedrock-agent-runtime` service name.
- Citation extraction relies on Bedrock response metadata fields.

## License

This repository does not include a license. Add a license file if you want to publish or share this project publicly.

