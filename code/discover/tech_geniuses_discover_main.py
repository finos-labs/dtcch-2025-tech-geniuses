import boto3
import json

bedrock_runtime = boto3.client("bedrock-runtime")
kendra = boto3.client('kendra')

indexid = '95d4e1a8-d057-4d1a-9d40-706812bbc5ca'
indexid2 = '895463ff-4c67-4905-8435-f4d4b6212f96'


json_schema_out ='''
{  
    "suggested_query":[list_of_suggested_queries],
    "data": [  
        {  
            "keyword": "example_keyword_1",
            "title" : ["title_1", "title_2", "title_3"]
        },  
        {  
            "keyword": "example_keyword_2",  
            "title" : ["title_4", "title_5"]
        },  
        {  
            "keyword": "example_keyword_3", 
            "title" : ["title_6"]
        }  
    ] 
} '''

def lambda_handler(event, context):
    query = event["query"]
    qualifiers = event["qualifiers"]

    unique_ids = set()
    unique_ids_2 = set()

    search_res_json = {
        "answer": "",
        "values": []
    }
    response_json = {
        "rewrite_query":"",
        "answer": "",
        "values": [],
        "add_answer": "",
        "add_values": [],
        "keyword":""
    }

    # Rewrite Query

    REWRITE_PROMPT = f"""You are a helpful assistant. You help users search for the answers to their questions.
    You have access to Search index with 100's of documents. Rewrite the following user question into a single useful and MEANINGFUL search query to find the most relevant documents.
    The number of rewrites should only be 1.
    Do not include 'AND', 'OR' to connect between the qualifiers. Just rewrite it meaningful.

    Qualifiers = {qualifiers}

    If 'Qualifiers' is not empty:
        the rewritten query should be rewritten such that it contains all given qualifiers, so that it search for the documents pertinent/relevant to the given qualifiers.
    Note: inclusion of Qualifiers (if Qualifiers not empty) while rewriting query is very important.

    User Question = {query}
    (Output only the rewritten query)
    Rewritten Query:
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
                "text": REWRITE_PROMPT
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
    rewritten_query = response_body["content"][0]["text"]

    response_json["rewrite_query"] = rewritten_query

    # Call Kendra
    response = kendra.query(
        IndexId = indexid,
        QueryText = rewritten_query,
        PageSize = 20
    )

    for query_result in response["ResultItems"]:
        result_type = query_result["Type"]

        if result_type == "ANSWER" or result_type == "QUESTION_ANSWER":
            search_res_json["answer"] = query_result["DocumentExcerpt"]["Text"]
            response_json["answer"] = query_result["DocumentExcerpt"]["Text"]

        if result_type == "DOCUMENT" or result_type == "ANSWER" or result_type == "QUESTION_ANSWER":
            title = query_result.get("DocumentTitle", {}).get("Text", "Untitled")
            excerpt = query_result["DocumentExcerpt"]["Text"]

            attributes = {attr["Key"]: attr["Value"]["StringValue"] for attr in query_result.get("DocumentAttributes", [])}
            
            company_id = attributes.get("Company_ID", "")
            source_uri = attributes.get("_source_uri", "")
            if source_uri.endswith(".txt"):
                source_uri = attributes.get("setsource", "")

            document_entry = {
                "title": title,
                "excerpt": excerpt,
                "Document_Name": attributes.get("Document_Name", ""),
                "Document_Category": attributes.get("Document_Category", ""),
                "source_uri": source_uri,
                "Company_Name": attributes.get("Company_Name", ""),
                "Company_ID": company_id,
                "Document_Type": attributes.get("Document_Type", ""),
            }

            search_res_json["values"].append(document_entry)

            if company_id not in unique_ids:
                response_json["values"].append(document_entry)
                unique_ids.add(company_id) 

    # call kendra for additional values

    response2 = kendra.query(
        IndexId = indexid2,
        QueryText = rewritten_query,
        PageSize = 20
    )

    for query_result in response2["ResultItems"]:
        result_type = query_result["Type"]

        if result_type == "ANSWER" or result_type == "QUESTION_ANSWER":
            response_json["add_answer"] = query_result["DocumentExcerpt"]["Text"]

        if result_type == "DOCUMENT" or result_type == "ANSWER" or result_type == "QUESTION_ANSWER":
            title = query_result.get("DocumentTitle", {}).get("Text", "Untitled")
            excerpt = query_result["DocumentExcerpt"]["Text"]

            attributes = {attr["Key"]: attr["Value"]["StringValue"] for attr in query_result.get("DocumentAttributes", [])}
            
            company_id = attributes.get("Company_ID", "")
            source_uri = attributes.get("_source_uri", "")

            document_entry = {
                "title": title,
                "excerpt": excerpt,
                "Document_Name": attributes.get("Document_Name", ""),
                "Document_Category": attributes.get("Document_Category", ""),
                "source_uri": source_uri,
                "Company_Name": attributes.get("Company_Name", ""),
                "Company_ID": company_id,
                "Document_Type": attributes.get("Document_Type", ""),
            }

            if company_id not in unique_ids_2:
                response_json["add_values"].append(document_entry)
                unique_ids_2.add(company_id)

    # Post Search features

    Suggested_prompt= f"""
    Given, 
    JSON data returned by the document Search service:
    {search_res_json}

    User query:
    {rewritten_query}
    
    Task 1:
    analyze the "values">"excerpt", "title" for each document entry. Identify the most relevant key phrases, key metrics, key topics, or key themes that apply to the search results. These key phrases should act as custom filters to categorize the documents in the search results. Each key phrase should be associated with the corresponding subset of documents to which it applies.

    The identified key phrases should be correctly mapped to the title of the relevant documents. Include all respective titles in a list format, as shown in the JSON Schema. Avoid repeating titles for a single key phrase. Finally, output the list of key phrases in JSON format as given below:
    ***
    
    Task 2:
    You need to suggest 3 - 5 next queries based on the current user query and the search result 'values' to get better results.
    
    Note:
    The user specified qualifier parameters for the given user query are:
    {qualifiers}
    The given query takes into consideration these qualifiers. So you should also take these qualifiers into consideration while generating the suggested queries.

    Important note 1: The suggested queries should have a deeper insight to the search document result:'values'>'excerpt' in JSON given, The query that user entered and the parameters supplied as qualifiers (if any). Make the query longer if you consider that makes it deeper and has potential to give user better result by using it.
    Important note 2: The suggested queries SHOULD NOT contain any PII data to it. The queries eventhough it should be deeper, it should also restrict from inclining towards any particular company, company specific terms or scenarios. So refrain from including PII data.

    This suggested queries need to be output as a list in the below output JSON schema.
    ***
    

    Note: Output only the required JSON result.

    Sample output JSON Schema:
    {json_schema_out}
    """

    request_payload = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 4000,
        "temperature": 0.7,
        "top_k": 50,
        "top_p": 0.9,
        "messages": [
        {
            "role": "user",
            "content": [
            {
                "type": "text",
                "text": Suggested_prompt
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
    suggested_res = response_body["content"][0]["text"]

    try:
        response_json["keyword"] = json.loads(suggested_res)
    except json.JSONDecodeError:
        response_json["keyword"] = suggested_res 

    unique_ids.clear()
    unique_ids_2.clear()

    return response_json
