import json
import os
import urllib.request
import boto3

# AWS region set from environment variables, defaulting to "us-west-2"
AWS_REGION = os.environ.get("AWS_REGION", "us-west-2")

# Function to check if a specific environment variable is set and has a meaningful value
def is_env_var_set(env_var: str) -> bool:
    return env_var in os.environ and os.environ[env_var] not in ("", "0", "false", "False")

# Function to get a secret either from an environment variable or from AWS Secrets Manager
def get_from_secretstore_or_env(key: str) -> str:
    if is_env_var_set(key):
        return os.environ[key]
    
    session = boto3.session.Session()
    secrets_manager = session.client(service_name="secretsmanager", region_name=AWS_REGION)
    
    try:
        secret_value = secrets_manager.get_secret_value(SecretId=key)
    except Exception as e:
        raise e
    
    secret: str = secret_value["SecretString"]
    return secret

# **NOTE**: Before running this function, ensure you add your API key to AWS Secrets Manager:
# 1. Go to the AWS Secrets Manager console.
# 2. Click "Store a new secret".
# 3. Choose "Other type of secrets" and enter your API key as a key-value pair (e.g., Key: "TAVILY_API_KEY", Value: "your-api-key-value").
# 4. Give your secret a name (e.g., "TAVILY_API_KEY").
# 5. Follow the prompts to finish storing the secret.
# The function will retrieve your API key from Secrets Manager automatically.

# Retrieve the TAVILY API key either from environment or Secrets Manager
TAVILY_API_KEY = get_from_secretstore_or_env("TAVILY_API_KEY")

# Function that performs the AI-powered search using the Tavily API
def tavily_ai_search(search_query: str) -> str:
    base_url = "https://api.tavily.com/search"
    
    headers = {"Content-Type": "application/json", "Accept": "application/json"}
    
    payload = {
        "api_key": TAVILY_API_KEY.split(":\"")[1][:-2],  # Extract API key
        "query": search_query,  # The search query passed to the function
        "search_depth": "advanced",  # Search depth setting
        "include_images": False,  # No images will be included in results
        "include_answer": False,  # Exclude answer from results
        "include_raw_content": False,  # Exclude raw content
        "max_results": 5,  # Limit to 5 results
        "include_domains": ["https://www.fool.com"],  # Only include this domain
        "exclude_domains": [],  # No domains excluded
    }
    
    data = json.dumps(payload).encode("utf-8")
    
    request = urllib.request.Request(base_url, data=data, headers=headers)
    
    try:
        response = urllib.request.urlopen(request)
        response_data = response.read().decode("utf-8")
        return response_data
    except urllib.error.HTTPError as e:
        print(e.code)
    
    return ""

# AWS Lambda handler function that gets invoked when an event is triggered
def lambda_handler(event, context):
    search_query = ""
    
    body = event["body"]
    body_parsed = json.loads(body)
    search_query = body_parsed.get("search_query")
    
    search_results = tavily_ai_search(search_query)
    
    return {
        'statusCode': 200,
        'body': search_results
    }
