import json
import os
import boto3
import logging
from datetime import datetime

# Initialize the Lambda client
lambda_client = boto3.client('lambda')

# Set up logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    logger.info(event)

    # Extract text from the event body
    body = json.loads(event.get('body', '{}'))
    text = body.get('text')

    if not text:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',  # Temporary for testing; tighten later
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, x-api-key'
            },
            'body': json.dumps({'error': 'Text is required'})
        }

    # Generate a unique filename using the current timestamp
    timestamp = datetime.utcnow().strftime('%Y%m%d%H%M%S')
    file_name = f"audio-{timestamp}.mp3"
    audio_url = f"https://sageinsightsai-audio.s3.amazonaws.com/{file_name}"

    # Prepare the payload to send to the audio generation Lambda
    payload = {
        'text': text,
        'file_name': file_name  # Include the file name for S3 upload
    }

    try:
        # Invoke the second Lambda function for audio generation asynchronously
        response = lambda_client.invoke(
            FunctionName='generate-audio-and-upload-to-s3',  # Name of the second Lambda function
            InvocationType='Event',  # Asynchronous invocation
            Payload=json.dumps(payload)  # Send the text as part of the event payload
        )

        # Return the audio URL immediately without waiting for the audio to be processed
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',  # Temporary for testing; tighten later
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, x-api-key'
            },
            'body': json.dumps({
                'message': audio_url
            })
        }

    except Exception as e:
        logger.error(f"Error invoking the audio generation Lambda: {e}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',  # Temporary for testing; tighten later
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, x-api-key'
            },
            'body': json.dumps({'error': str(e)})
        }
