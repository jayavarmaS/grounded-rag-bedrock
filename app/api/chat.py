from fastapi import APIRouter

from app.schemas.request import (
    ChatRequest
)

from app.schemas.response import (
    ChatResponse
)

from app.services.bedrock import (
    retrieve_answer
)

from app.logs.logger import (
    logger
)

router = APIRouter()


@router.post(
    "/chat",
    response_model=ChatResponse
)
async def chat(
    request: ChatRequest
):

    result = retrieve_answer(
        request.question
    )

    logger.info(
        f"Question: {request.question}"
    )

    logger.info(
        f"Answer: {result['answer']}"
    )

    logger.info(
        f"Citations Found: "
        f"{len(result['citations'])}"
    )

    for citation in result["citations"]:

        logger.info(
            f"Citation: "
            f"{citation['source']} "
            f"| Page {citation['page']}"
        )

        logger.info(
            f"Evidence: "
            f"{citation['snippet']}"
        )

    logger.info(
        "-" * 80
    )

    return ChatResponse(
        answer=result["answer"],
        citations=result["citations"]
    )