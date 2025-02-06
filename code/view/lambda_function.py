import json
import boto3

client = boto3.client("dynamodb")
llm = boto3.client("bedrock-runtime")


def lambda_handler(event, context):
    # Query the database to get the latest values
    query_response = client.scan(
        TableName="REPORT-table",
    )
    items = query_response["Items"]

    growth_rate = 0
    response = {"growth_rate": 0, "benchmark": "15 %", "summary": "", "company": []}

    # Convert the database items into our response format
    for item in items:
        growth_rate += float(item["Growth Rate"]["N"])
        response["company"].append(
            {
                "Price to Earnings Ratio": float(item["Price to Earnings Ratio"]["N"]),
                "ROA": float(item["ROA"]["N"]),
                "Revenue": float(item["Revenue"]["N"]),
                "Net Profit Margin": float(item["Net Profit Margin"]["N"]),
                "ROE": float(item["ROE"]["N"]),
                "EPS": float(item["EPS"]["N"]),
                "Growth Rate": float(item["Growth Rate"]["N"]),
                "Market Cap": float(item["Market Cap"]["N"]),
                "GHG Emissions": float(item["GHG Emissions"]["N"]),
                "ID": item["ID"]["S"],
                "Company Name": item["Company Name"]["S"],
                "Symbol": item["Symbol"]["S"],
            }
        )

    response["growth_rate"] = f"{growth_rate / len(items)} %"

    # Summarize the table data using LLM
    summary = llm.invoke_model(
        body=json.dumps(
            {
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": 200,
                "top_k": 250,
                "stop_sequences": [],
                "temperature": 1,
                "top_p": 0.999,
                "messages": [
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": "You are a financial expert. I will give you a list of tech companies and their financial data. Please summarize the data in 100 words or less",
                            },
                            {"type": "text", "text": str(response["company"])},
                        ],
                    }
                ],
            }
        ),
        modelId="anthropic.claude-3-5-sonnet-20241022-v2:0",
        accept="application/json",
        contentType="application/json",
    )

    response["summary"] = json.loads(summary["body"].read().decode("utf-8"))["content"][
        0
    ]["text"]

    return response
