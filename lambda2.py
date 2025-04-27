import json
import openai
import os
import requests
import json
import typing
import bs4
import dotenv
#import IPython.display 
#from typing import List
#from dotenv import load_dotenv
#from bs4 import BeautifulSoup
#from IPython.display import Markdown, display, update_display

def lambda_handler(event, context):
    api_key = "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"
    print("Received event:", json.dumps(event))
   
    MODEL = 'gpt-4o-mini'
    body = json.loads(event.get('body', '{}'))
    url = body.get('url')
    ####

    responseMessage = 'Test response from POST Lambdas! Url entered is: ' + url
    responseMessage += ' API key is: ' + api_key
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',  # Temporary for testing; tighten later
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, x-api-key'
        },
        'body': json.dumps({
            'message': responseMessage
        })
    }