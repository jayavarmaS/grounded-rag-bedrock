import boto3

from app.utils.config import AWS_REGION


def generate_presigned_url(
    source_uri: str
):

    if not source_uri:
        return ""

    if not source_uri.startswith(
        "s3://"
    ):
        return source_uri

    path = source_uri[
        len("s3://"):
    ]

    bucket, key = path.split(
        "/",
        1
    )

    s3 = boto3.client(
        "s3",
        region_name=AWS_REGION
    )

    url = s3.generate_presigned_url(
        "get_object",

        Params={
            "Bucket": bucket,
            "Key": key,

            "ResponseContentDisposition":
            "inline"
        },

        ExpiresIn=3600
    )

    return url


def extract_citations(
    response
):

    citations = []

    citation_id = 1

    if "citations" not in response:

        return citations

    for citation in response[
        "citations"
    ]:

        for ref in citation.get(
            "retrievedReferences",
            []
        ):

            metadata = ref.get(
                "metadata",
                {}
            )

            source_uri = metadata.get(
                "x-amz-bedrock-kb-source-uri",
                ""
            )

            page = metadata.get(
                "x-amz-bedrock-kb-document-page-number",
                0
            )

            snippet = ""

            if "content" in ref:

                snippet = ref[
                    "content"
                ].get(
                    "text",
                    ""
                )

            source = (
                source_uri.split("/")[-1]
                if source_uri
                else "Unknown"
            )

            presigned_url = (
                generate_presigned_url(
                    source_uri
                )
            )

            print(
                "Generated URL:",
                presigned_url
            )

            citations.append(
                {
                    "id":
                    citation_id,

                    "source":
                    source,

                    "page":
                    int(page),

                    "snippet":
                    snippet,

                    "url":
                    presigned_url
                }
            )

            citation_id += 1

    return citations