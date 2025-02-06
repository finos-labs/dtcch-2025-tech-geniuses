import json
import boto3

client = boto3.client("bedrock-agent-runtime")


def lambda_handler(event, context):
    query = event["query"]
    company_id = event["company_id"]

    # Extract and Generate response given a user query
    query_response = client.retrieve_and_generate(
        input={"text": query},
        retrieveAndGenerateConfiguration={
            "knowledgeBaseConfiguration": {
                "knowledgeBaseId": "KNOWLEDGE_BASE_ID",
                "modelArn": "anthropic.claude-3-5-sonnet-20241022-v2:0",
                "orchestrationConfiguration": {
                    "queryTransformationConfiguration": {"type": "QUERY_DECOMPOSITION"}
                },
                "retrievalConfiguration": {
                    "vectorSearchConfiguration": {
                        "filter": {
                            "equals": {"key": "Company_ID", "value": company_id},
                        }
                    }
                },
            },
            "type": "KNOWLEDGE_BASE",
        },
    )

    # Convert the sources into response format
    documents = []
    for chunk in query_response["citations"]:
        for reference in chunk["retrievedReferences"]:
            metadata = reference["metadata"]
            documents.append(
                {
                    "content": reference["content"]["text"],
                    "metadata": metadata,
                }
            )

    response = {
        "answer": query_response["output"]["text"],
        "documents": documents,
    }

    return response
