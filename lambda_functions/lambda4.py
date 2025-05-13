# IN THEORY THIS SHOULD BE A GOOD WORKING VERSION
import json
import os
import requests
import json
#import bs4
from bs4 import BeautifulSoup
#import dotenv
from dotenv import load_dotenv
#import typing
from typing import List
#import openai
from openai import OpenAI
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)


# Initialize OpenAI client
openai = OpenAI(api_key="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")

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

def get_links_user_prompt(website):
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
    # links = get_links(url)
    # for link in links.get("links", []):
    #     result += f"\n\n{link.get('type')}\n"
    #     result += Website(link.get("url")).get_contents()
    #     secondary_links = get_links(link.get("url"))
    #     for secondary_link in secondary_links.get("links", []):
    #         result += f"\n\n{secondary_link.get('type')}\n"
    #         result += Website(secondary_link.get("url")).get_contents()
    return result


# TODO: from here on out up till lambda handler, these functions must be changed to provide a summary of what the website is all about
def get_summary_user_prompt(url):
    user_prompt = f"You are looking at a the following website: {url}\n"
    user_prompt += f"Here are the contents of some of its pages; use this information to summarize the purpose of the website and its details in 500 words or less\n"
    user_prompt += get_all_details(url)
    user_prompt = user_prompt[:5_000] # Truncate if more than 5,000 characters
    return user_prompt


def get_summary(url):
    system_prompt = "You are an assistant that analyzes the contents of several relevant pages from a website \
    and creates a summary for prospective customers or other interested parties. Respond in markdown.\
    Include details of company culture, customers and careers/jobs if the website seems to be related to a company."
    try:
        response = openai.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": get_summary_user_prompt(url)}
            ]
        )
        # Extract the content from the OpenAI response
        if response and 'choices' in response and len(response['choices']) > 0:
            summary = response['choices'][0]['message']['content']
            return summary
        else:
            logger.error("No valid summary found in OpenAI response.")
            return "No summary found."
        
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        raise
    return ""


def get_test_summary_user_prompt(url):
    return """
    Personal & Professional Service
East Coast Bow Thrusters is committed to top-quality installations of bow thrusters and stern thrusters. We offer personal, prompt and professional service, bringing expertise based upon 50+ years of experience, while saving you, the boat owner, thousands of dollars on your thruster installation.
You can be assured that all decisions pertaining to work on your boat are backed in
OVER 50+ YEARS OF EXPERIENCE in FIBERGLASS REPAIR, BOAT BUILDING, CUSTOM FIBERGLASS MODIFICATION & FABRICATION.
Click on the following pictures and see more of our work at
What we do:
Mobile Installations - East Coast Bow Thrusters' expert crew will travel to install bow and stern thrusters at your marina or boat yard. Our service area and dealer network includes the entire East Coast from Maine to Virginia and West to the Great Lakes.
Joe Molinaro owner of East Coast Bow Thrusters, has been building, repairing and performing fiberglass fabrication on boats since 1970, and installing bow thrusters since 1990. His expertise, and commitment to quality workmanship and high customer satisfaction have made him well-known and highly respected throughout the East Coast.
What sets East Coast Bow Thrusters above the competition - Joe personally installs or provides guidance for each and every bow thruster along with his well-trained crew, insuring that his high standards are maintained. Prompt, professional and personal service insures your installation is completed in a timely fashion, the end result being a structurally sound and aesthetically pleasing, optimally functional installation each and every time.
Our Mission is to provide expert installations on top-of-the-line Vetus bow thrusters at a price that's affordable to many boat owners.
We at East Coast Bow Thrusters specialize in thruster installation. We buy in quantity and have developed a system of procedures and specialized equipment through which we work at optimal efficiency. This translates into time and money saved on your installation, which we then pass along to our customers. Our pricing beats the competition and our work is second to none! All quotes provided are for complete installations, including installation of thruster, tube, components, wiring, and batteries as required, all labor and cleanup.
Call Joe at 845-551-1975 for a quote today!
"""

def get_test_summary(url):
    try:
        response = openai.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": "give a summary of the content with markdown"},
                {"role": "user", "content": get_test_summary_user_prompt(url)}
            ]
        )
        # Extract the content from the OpenAI response
        if response and 'choices' in response and len(response['choices']) > 0:
            logger.error("about to try and extract api response.")
            summary = response['choices'][0]['message']['content']
            return summary
        else:
            logger.error("No valid summary found in OpenAI response.")
            return "No summary found."
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        raise
    return ""
    


def validate_and_format_url(url):
    # Step 1: Ensure URL starts with https://
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url
    
    try:
        # Step 2: Send a HEAD request first (faster than GET)
        response = requests.head(url, timeout=5)
        
        # Step 3: If HEAD doesn't return good result, try GET
        if response.status_code >= 400:
            response = requests.get(url, timeout=5)
        
        if response.status_code < 400:
            return url  # Valid URL
        else:
            return None  # Server responded but with an error (e.g., 404)
    except requests.RequestException:
        # Any error (connection, timeout, DNS failure, etc.)
        return None


def lambda_handler(event, context):
    print("Received event:", json.dumps(event))
    try: 
        body = json.loads(event.get('body', '{}'))
        url = body.get('url')
        url = validate_and_format_url(url)

        if not url:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'No URL or invalid URL provided.'})
            }

        responseMessage = 'Test response from POST Lambdas! Url entered is: ' + url + '\n'
        #responseMessage += get_all_details(url)
        #responseMessage += get_summary(url)
        responseMessage += get_test_summary(url)
        

        
        
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