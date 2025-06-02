import json
import openai
import os
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from typing import List
import logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Set your OpenAI API key (either hardcoded or via environment variable)
openai.api_key = os.environ.get("OPENAI_API_KEY")  # Best practice: use environment variable

def lambda_handler(event, context):
    user_content = "make up a new word"
    try:
        # Make an OpenAI API call
        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "give a summary of the content with markdown"},
                {"role": "user", "content": user_content}
            ]
        )
        
        # Extract the message
        reply = response.choices[0].message.content

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',  # CORS header
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': json.dumps({'message': reply})
        }

    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }




