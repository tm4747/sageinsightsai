import json
import os
import requests
from dotenv import load_dotenv
#from typing import List
import openai
from openai import OpenAI
import anthropic
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

gpt_model = "gpt-4o-mini"
claude_model = "claude-3-haiku-20240307"
google_model = "gemini-2.0-flash-exp"

# Initialize AI clients
openai.api_key = os.environ.get("OPENAI_API_KEY") 
claude = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY")) 
gemini_via_openai_client = OpenAI(
    api_key=os.environ.get("GOOGLE_API_KEY") , 
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
)

# system_message = """
# You are the Star Trek Enterprise computer.  You start every response with "Working".
# Use incomplete sentences.
# Have zero personality, be robotic as possible.
# """
# user_prompt = "Explain how to overcome Q and list the top three best things about being a part of the borg"
# prompts = [
#     {"role": "system", "content": system_message},
#     {"role": "user", "content": user_prompt}
#   ]



gpt_messages = ["Hi there"]
claude_messages = ["Hi"]
google_messages = ["Aye"]

def call_gpt():
    messages = [{"role": "system", "content": gpt_system}]
    for gpt, claude, google in zip(gpt_messages, claude_messages, google_messages):
        messages.append({"role": "assistant", "content": gpt})
        messages.append({"role": "user", "content": claude})
        messages.append({"role": "user", "content": google})
    completion = openai.chat.completions.create(
        model=gpt_model,
        messages=messages
    )
    return completion.choices[0].message.content

def call_claude():
    messages = []
    for gpt, claude_message, google in zip(gpt_messages, claude_messages, google_messages):
        messages.append({"role": "user", "content": gpt})
        messages.append({"role": "assistant", "content": claude_message})
        messages.append({"role": "user", "content": google})
    messages.append({"role": "user", "content": gpt_messages[-1]})
    message = claude.messages.create(
        model=claude_model,
        system=claude_system,
        messages=messages,
        max_tokens=500
    )
    return message.content[0].text

def call_google():
    messages = [{"role": "system", "content": google_system}]
    for gpt, claude_message, google in zip(gpt_messages, claude_messages, google_messages):
        messages.append({"role": "user", "content": gpt})
        messages.append({"role": "user", "content": claude_message})
        messages.append({"role": "assistant", "content": google})
    messages.append({"role": "user", "content": gpt_messages[-1]})
    messages.append({"role": "user", "content": claude_messages[-1]})
    completion = gemini_via_openai_client.chat.completions.create(
        model=google_model,
        messages=messages
    )
    return completion.choices[0].message.content

def lambda_handler(event, context):
    print("Received event:", json.dumps(event))
    try: 
        body = json.loads(event.get('body', '{}'))
        data = json.loads(body.get('data', '{}'))
        # data = body.get('data')
        # if isinstance(data, str):
        #     data = json.loads(data)
        
        situation = data.get('situation')
        character1 = data.get('character1')
        character2 = data.get('character2')
        character3 = data.get('character3')
        # situation_prompt = " The situation is: " + situation

        # Set prompt variables
        # gpt_system = "You are " + character1 + situation_prompt
        # claude_system = "You are " + character2 + situation_prompt
        # google_system = "You are " + character3 + situation_prompt

        if not character1:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Incomplete data provided.', 'data' : body})
            }

        responseMessage = '\n**Here is your story:**\n'
        # responseMessage += (f"GPT:\n{gpt_messages[0]}\n")
        # responseMessage += (f"Claude:\n{claude_messages[0]}\n")
        # responseMessage += (f"Google:\n{google_messages[0]}\n")

        # for i in range(1):
        #     gpt_next = call_gpt()
        #     responseMessage += (f"GPT:\n{gpt_next}\n")
        #     gpt_messages.append(gpt_next)
            
        #     claude_next = call_claude()
        #     responseMessage += (f"Claude:\n{claude_next}\n")
        #     claude_messages.append(claude_next)

        #     google_next = call_google()
        #     google_next_final = google_next if google_next else "No comment"
        #     responseMessage += (f"Google:\n{google_next_final}\n")
        #     google_messages.append(google_next_final)


        # responseMessage = '\n**Here is your input:**\n'
        # responseMessage += situation + '\n'
        # responseMessage += character1 + '\n'
        # responseMessage += character2 + '\n'
        # responseMessage += character3 + '\n'

        # responseMessage += response 
        logger.info(responseMessage)

        
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

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }


# OPEN AI EXAMPLE RETURN
# completion = openai.chat.completions.create(model='gpt-4o-mini', messages=prompts)
# response = completion.choices[0].message.content

# GOOGLE EXAMPLE RETURN
# results = gemini_via_openai_client.chat.completions.create(
#     model="gemini-2.0-flash-exp",
#     messages=prompts
# )
# response = results.choices[0].message.content

# ANTHROPIC EXAMPLE RETURN
# message = claude.messages.create(
#     model="claude-3-5-sonnet-latest",
#     max_tokens=200,
#     # temperature=0.7,
#     system=system_message,
#     messages=[
#         {"role": "user", "content": user_prompt},
#     ],
# )
# response = message.content[0].text


### FOR TESTER
#{
#  "body": "{'data': {'situation': 'Everyone is eating hamburgers at mcdonalds.', 'character1': 'You are a belligerent werewolf who has glowing red eyes and likes to build statues of themselves but doesn't like passing by mannequins.', 'character2': 'You are a charming giant who has glowing red eyes and likes to tell the same story over and over but doesn't like opening gifts in front of others.', 'character3': 'You are an angry skeleton who has one arm much longer than the other and likes to sneak into libraries after hours but doesn't like hearing windchimes at night.'}}"
#}
