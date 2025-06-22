import json
import os
import openai
import requests
import boto3
from io import BytesIO
from pydub import AudioSegment
import logging

# Set up logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize OpenAI client
openai.api_key = os.environ.get("OPENAI_API_KEY")

# Initialize S3 client
s3_client = boto3.client('s3')

# Define the S3 bucket name
BUCKET_NAME = 'sageinsightsai-audio'

def split_text(text, max_length=4096):
    """ Split the text into chunks that are no longer than `max_length` characters. """
    chunks = [text[i:i+max_length] for i in range(0, len(text), max_length)]
    return chunks

def get_audio(message):
    """ Generate speech from text using OpenAI API. """
    response = openai.audio.speech.create(
        model="tts-1",
        voice="onyx",  # or "alloy"
        input=message
    )
    audio_stream = BytesIO(response.content)
    return audio_stream

def upload_to_s3(audio_stream, bucket_name, file_name):
    """ Upload audio stream to S3 and return the URL. """
    try:
        # Upload the audio stream to S3
        s3_client.put_object(
            Bucket=bucket_name,
            Key=file_name,
            Body=audio_stream,
            ContentType='audio/mpeg'
        )
        logger.info(f"Successfully uploaded {file_name} to S3.")
        # Return the URL of the uploaded file
        return f"https://{bucket_name}.s3.amazonaws.com/{file_name}"
    except Exception as e:
        logger.error(f"Error uploading to S3: {e}")
        raise

def lambda_handler(event, context):
    logger.info(event)

    # Get text and filename from the event (this will come from the first Lambda)
    textfile_url = event.get('textfile_url')
    file_name = event.get('file_name')
    logger.info(f"textfile_url: {textfile_url} - file_name: {file_name}")

    if not textfile_url:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'textfile_url is required'})
        }

    if not file_name:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Filename is required'})
        }

    # Fetch the content of the file from the public S3 URL
    try:
        response = requests.get(textfile_url)
        if response.status_code == 200:
            text = response.text  # The content of the file as a string
            logger.info("Text successfully retrieved from S3 URL.")
        else:
            raise Exception(f"Failed to retrieve file from S3: {response.status_code}")
    except Exception as e:
        logger.error(f"Error fetching file from S3: {e}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, x-api-key'
            },
            'body': json.dumps({'error': 'Failed to retrieve the file from S3'})
        }

    # Split the text into chunks of 4096 characters or less
    text_chunks = split_text(text)

    # Create an empty AudioSegment to hold the combined audio
    combined_audio = AudioSegment.empty()

    # Generate audio for each chunk and combine them
    for i, chunk in enumerate(text_chunks):
        try:
            audio_stream = get_audio(chunk)
            # Convert audio stream to AudioSegment (we assume the audio is in MP3 format)
            audio_segment = AudioSegment.from_mp3(audio_stream)
            combined_audio += audio_segment  # Append the new audio to the combined audio
        except Exception as e:
            logger.error(f"Error generating audio for chunk {i}: {e}")
            return {
                'statusCode': 500,
                'body': json.dumps({'error': f'Failed to generate audio for chunk {i}'})
            }

    # Save the combined audio to a temporary file (in-memory)
    output_file = '/tmp/combined_audio.mp3'
    combined_audio.export(output_file, format='mp3')

    # Upload the combined audio to S3
    try:
        with open(output_file, 'rb') as audio_file:
            s3_url = upload_to_s3(audio_file, BUCKET_NAME, file_name)
            return {
                'statusCode': 200,
                'body': json.dumps({'audio_url': s3_url})
            }
    except Exception as e:
        logger.error(f"Error uploading combined audio to S3: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Failed to upload combined audio to S3'})
        }
