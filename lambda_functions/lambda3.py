import os
import json
import requests
from typing import List
from dotenv import load_dotenv
from bs4 import BeautifulSoup
from openai import OpenAI

# Load environment variables
#load_dotenv(override=True)

# Initialize OpenAI client
api_key = "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"
#openai = OpenAI()

# Constants
MODEL = 'gpt-4o-mini'

# Request headers for web scraping
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36"
}

# Class to scrape website data
class Website:
    def __init__(self, url):
        self.url = url
        response = requests.get(url, headers=headers)
        self.body = response.content
        soup = BeautifulSoup(self.body, 'html.parser')
        self.title = soup.title.string if soup.title else "No title found"
        if soup.body:
            for irrelevant in soup.body(["script", "style", "img", "input"]):
                irrelevant.decompose()
            self.text = soup.body.get_text(separator="\n", strip=True)
        else:
            self.text = ""
        links = [link.get('href') for link in soup.find_all('a')]
        self.links = [link for link in links if link]

    def get_contents(self):
        return f"Webpage Title:\n{self.title}\nWebpage Contents:\n{self.text}\n\n"

# System prompt for OpenAI
link_system_prompt = (
    "You are provided with a list of links found on a webpage. "
    "You should respond in JSON as in this example:\n"
    "{\n"
    '  "links": [\n'
    '    {"type": "about page", "url": "https://full.url/goes/here/about"},\n'
    '    {"type": "careers page", "url": "https://another.full.url/careers"}\n'
    "  ]\n"
    "}"
)

# def get_links_user_prompt(website):
    user_prompt = (
        f"Here is the list of links on the website of {website.url} - "
        "please respond with the full https URL in JSON format. "
        "Do not include Terms of Service, Privacy, email links.\n"
        "Links (some might be relative links):\n"
    )
    user_prompt += "\n".join(website.links)
    return user_prompt

def get_links(url):
    website = Website(url)
    response = openai.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": link_system_prompt},
            {"role": "user", "content": get_links_user_prompt(website)}
        ],
        response_format={"type": "json_object"}
    )
    result = response.choices[0].message.content
    return json.loads(result)

def get_all_details(url):
    result = "Landing page:\n"
    result += Website(url).get_contents()
    links = get_links(url)
    for link in links.get("links", []):
        result += f"\n\n{link.get('type')}\n"
        result += Website(link.get("url")).get_contents()
        secondary_links = get_links(link.get("url"))
        for secondary_link in secondary_links.get("links", []):
            result += f"\n\n{secondary_link.get('type')}\n"
            result += Website(secondary_link.get("url")).get_contents()
    return result

# Lambda handler
def lambda_handler(event, context):
    try:
        body = json.loads(event.get('body', '{}'))
        url = body.get('url')

        if not url:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'No URL provided.'})
            }

        #details = get_all_details(url)
        details = "Hello, World!"

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',  # Temporary for testing; tighten later
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, x-api-key'
            },  
            'body': json.dumps({'details': details})
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
