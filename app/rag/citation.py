def extract_citations(response):

    citations = []

    citation_id = 1

    if "citations" in response:

        for citation in response["citations"]:

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

                source = source_uri.split("/")[-1]

                snippet = (
                    ref.get(
                        "content",
                        {}
                    ).get(
                        "text",
                        ""
                    )[:300]
                )

                citations.append(
                    {
                        "id": citation_id,
                        "source": source,
                        "page": int(page),
                        "snippet": snippet
                    }
                )

                citation_id += 1

    return citations