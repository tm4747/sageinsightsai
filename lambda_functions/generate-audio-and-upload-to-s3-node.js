// dependencies - needs ffmpeg from S3 - layer including openai, axios, aws-sdk, fluent-ffmpeg
const AWS = require('aws-sdk');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const fluent_ffmpeg = require('fluent-ffmpeg');
const { PassThrough } = require('stream');
const s3 = new AWS.S3();
const openai = require('openai'); // Assuming you have setup OpenAI client
const logger = console; // Basic logger for now

// Set up OpenAI API Key
const openaiClient = new openai.OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the S3 bucket name
const BUCKET_NAME = 'sageinsightsai-audio';
const FMPEG_BUCKET_NAME = 'lambda-dependencies-sageinsightsai';  // Replace with your actual S3 bucket name
const FFMPEG_KEY = 'ffmpeg';

async function downloadFFmpeg() {
  const localPath = '/tmp/ffmpeg';
  
  try {
    // Download FFmpeg binary from S3 to /tmp directory
    const params = {
      Bucket: FMPEG_BUCKET_NAME,
      Key: FFMPEG_KEY
    };
    
    const data = await s3.getObject(params).promise();
    fs.writeFileSync(localPath, data.Body);
    fs.chmodSync(localPath, 0o755); // Make it executable
    logger.log("FFmpeg downloaded and made executable.");
    return localPath;
  } catch (error) {
    logger.error(`Error downloading FFmpeg from S3: ${error}`);
    throw error;
  }
}

async function getAudio(message) {
  try {
    // Call OpenAI API to generate speech from text
    const response = await openaiClient.audio.speech.create({
      model: "tts-1",
      voice: "onyx",  // Or "alloy"
      input: message
    });

    console.log('OpenAI API response:', response);  // Log full response to inspect

    // Check if the response contains audio
    if (!response.body) {
      throw new Error('No audio content returned from OpenAI API');
    }

    // Consume the stream to get the audio content as a buffer
    const audioBuffer = await new Promise((resolve, reject) => {
      const chunks = [];
      response.body.on('data', chunk => chunks.push(chunk));
      response.body.on('end', () => resolve(Buffer.concat(chunks)));
      response.body.on('error', reject);
    });

    console.log('Audio data received and converted to buffer.');

    // Optionally, save or process the audioBuffer further
    return audioBuffer;

  } catch (error) {
    console.error(`Error generating audio for message: ${error.message}`);
    throw error;  // Rethrow the error to handle it upstream
  }
}


async function uploadToS3(audioBuffer, fileName) {
  try {
    // Upload audio buffer to S3
    const params = {
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: audioBuffer,
      ContentType: 'audio/mpeg'
    };

    const uploadResult = await s3.putObject(params).promise();
    logger.log(`Successfully uploaded ${fileName} to S3.`);
    return `https://${BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
  } catch (error) {
    logger.error(`Error uploading to S3: ${error}`);
    throw error;
  }
}

async function lambdaHandler(event) {
  try {
    const textfileUrl = event.textfile_url;
    const fileName = event.file_name;

    if (!textfileUrl || !fileName) {
      throw new Error('textfile_url and file_name are required');
    }

    // Fetch the content of the file from the S3 URL
    const response = await axios.get(textfileUrl);
    const text = response.data;
    logger.log("Text successfully retrieved from S3 URL. text length: " + text.length);

    // Split the text into chunks of 4096 characters or less
    const maxLength = 4096;
    const textChunks = text.match(new RegExp(`.{1,${maxLength}}`, 'g'));  // Split by max length
    logger.log("Text successfully split into chunks. chunk count: " + textChunks.length);
    logger.log("First chunk: " + textChunks[0]);
    logger.log("Second chunk: " + textChunks[1]);

    let combinedAudio = Buffer.alloc(0);

    // Download FFmpeg binary
    const ffmpegPath = await downloadFFmpeg();

    // Generate audio for each chunk and combine them
    for (let i = 0; i < textChunks.length; i++) {
      const chunk = textChunks[i];
      if(typeof chunk !== 'string') {
        logger.log("Chunk is not a string. Skipping.");
        continue;
      } else {
        logger.log("Chunk is a string. Continuing.");
      }
      const audioBuffer = await getAudio(chunk);
      combinedAudio = Buffer.concat([combinedAudio, audioBuffer]);
    }

    // Upload the combined audio to S3
    const audioUrl = await uploadToS3(combinedAudio, fileName);

    return {
      statusCode: 200,
      body: JSON.stringify({ audio_url: audioUrl })
    };

  } catch (error) {
    logger.error(`Error processing request: ${error}`);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}

exports.handler = lambdaHandler;

