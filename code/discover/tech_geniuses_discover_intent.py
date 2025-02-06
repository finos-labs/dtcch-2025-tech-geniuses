import boto3
import json

bedrock_runtime = boto3.client("bedrock-runtime")

expected_out='''
{
"qualifiers": [
    "Innovation",
    "Carbon Reduction",
    "Circular Economy",
    "Sustainability Rating",
    "Market Capitalisation"
]
}'''

def lambda_handler(event, context):
    basic_query = event["query"]

    # Get Qualifiers

    prompt = f"""Given below is the user typed query. find the qualifiers or intents for the query. The qualifiers help the user to better rewrite the query so as to get the most contextualized and relevant search results for it.
    Note: The list of qualifiers should have minimum 1 item and maximum upto 5 to 6 items. 
    The result shoild be output in the form of JSON. An example for your reference is given below. 
    Example:
    Query: Financial and environmental performance of new product lines developed with sustainability practices.
    Expected output:
    {expected_out}
    Query:{basic_query}
    """

    request_payload = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 200,
        "temperature": 0.7,
        "top_k": 50,
        "top_p": 0.9,
        "messages": [
        {
            "role": "user",
            "content": [
            {
                "type": "text",
                "text": prompt
            }
            ]
        }
        ]
    }
    body = json.dumps(request_payload)
    response = bedrock_runtime.invoke_model(
        modelId="anthropic.claude-3-5-sonnet-20241022-v2:0", 
        contentType="application/json",
        accept="application/json",
        body=body
    )
    response_body = json.loads(response["body"].read().decode("utf-8"))
    qualifier_json = response_body["content"][0]["text"]

    try:
        response_json = json.loads(qualifier_json)
    except json.JSONDecodeError:
        response_json = qualifier_json  

    return response_json
