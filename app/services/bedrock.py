import boto3

from app.utils.config import (
    AWS_REGION,
    KNOWLEDGE_BASE_ID,
    MODEL_ID
)

from app.rag.citation import (
    extract_citations
)

client = boto3.client(
    "bedrock-agent-runtime",
    region_name=AWS_REGION
)


def retrieve_answer(question: str):

    response = client.retrieve_and_generate(
        input={
            "text": question
        },
        retrieveAndGenerateConfiguration={
            "type": "KNOWLEDGE_BASE",
            "knowledgeBaseConfiguration": {
                "knowledgeBaseId": KNOWLEDGE_BASE_ID,
                "modelArn": (
                    f"arn:aws:bedrock:{AWS_REGION}"
                    "::foundation-model/"
                    f"{MODEL_ID}"
                )
            }
        }
    )

    answer = response["output"]["text"]

    citations = extract_citations(
        response
    )

    print("\n========== CITATIONS ==========")
    print(citations)
    print("===============================\n")

    return {
        "answer": answer,
        "citations": citations
    }