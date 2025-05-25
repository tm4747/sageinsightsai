import json
import os
import openai
import boto3
from io import BytesIO
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
    text = event.get('text')
    file_name = event.get('file_name')
    logger.info(f"text: {text} - file_name: {file_name}")

    if not text:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Text is required'})
        }

    if not file_name:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Filename is required'})
        }

    # Generate audio stream from text
    audio_stream = get_audio(text)

    # Upload the audio to S3 using the provided filename and get the URL
    audio_url = upload_to_s3(audio_stream, BUCKET_NAME, file_name)

    # Return the audio URL as the response
    return {
        'statusCode': 200,
        'body': json.dumps({'audio_url': audio_url})
    }
