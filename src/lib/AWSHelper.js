/**
 * ALL FUNCTIONS THAT HIT AWS SERVICES SHOULD LIVE HERE. EVENTUALLY MAY SPLIT BY SERVICE (S3/Lambda/DDB)
 */

import { APIBASE, BUCKETPATH } from "./Constants";
import { removeIntroMaterial } from "./MiscellaneousHelper";
import { removeSpecialChars } from "./ValidationHelper";
// TODO: move apikey to const

/******** DYNAMO DB ********/
export const insertUserName = async (uuid, trimmedName) => {
  const apiKey = process.env.REACT_APP_API_KEY;
  return (
    fetch( APIBASE + "/database", {
      method: "POST",
      headers: { "Content-Type": "application/json",'x-api-key': apiKey  },
      body: JSON.stringify({
        action: "create",
        uuid: uuid,
        name: trimmedName
      })
    })
  );
}

export const getUserData = async (uuid) => {
  const apiKey = process.env.REACT_APP_API_KEY;
  return (
    fetch(APIBASE + "/database", {
      method: "POST",
      headers: { "Content-Type": "application/json", 'x-api-key': apiKey },
      body: JSON.stringify({ action: "get", uuid: uuid })
    })
  );
}

/******* GET WEB INFO TOOL (future state will not be just summary) *******/
export const fetchWebSummary = async ( enteredUrl, setResponse, setIsLoading ) => {
    const apiKey = process.env.REACT_APP_API_KEY;
    const apiUrl = APIBASE + "/hello";
    console.log('enteredUrl')
    console.log(enteredUrl)
    try {
        const res = await fetch(apiUrl, {
          method: 'POST', 
          headers: {
            'x-api-key': apiKey, 
          },
          body: JSON.stringify({ url: enteredUrl })  // Add the request body here
        });
        const data = await res.json();
        setIsLoading(false);   // Parse JSON response
        setResponse(data.message);      // Update state with the response
        console.log("data message")
        console.log(data.message)
      } catch (error) {
        setIsLoading(false);  
        console.error('Error fetching data: ', error);
      }
}


/******* STORY MAKER *******/
export const fetchStoryFromLambda = async ( input, setResponse, setIsLoading ) => {
  const apiKey = process.env.REACT_APP_API_KEY;
  const apiUrl = APIBASE + "/story-maker";
  console.log('input')
  console.log(input)
  console.log('input.data')
  console.log(input.data)
  console.log('input.data.situation')
  console.log(input.data.situation)
  try {
      const res = await fetch(apiUrl, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify(input)  // Add the request body here
      });
      const data = await res.json();
      setIsLoading(false);   // Parse JSON response
      setResponse(data.message);      // Update state with the response
      console.log("data message")
      console.log(data.message)
    } catch (error) {
      setIsLoading(false);  
      console.error('Error fetching data: ', error);
    }
}


// send text to text file in S3 and url to file
export const fetchAudio = async ( postResponse, setIsLoading, setAudioUrl, scrollToCharacterDescription, setPolling ) => {  
  if(postResponse){
    try {
      let useablePostResponse = removeSpecialChars(postResponse);
      useablePostResponse = removeIntroMaterial(useablePostResponse);
      setIsLoading(true);

      // Create filename for the text file
      const timestamp = Math.floor(Date.now() / 1000);
      const s3FileName = `story-${timestamp}.txt`;

      try {
        const apiKey = process.env.REACT_APP_API_KEY;
        // Get pre-signed URL from Lambda (through API Gateway)
        const presignResponse = await fetch(APIBASE + "/generate-upload-url", {
          method: 'POST',
          headers: {
            'x-api-key': apiKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ fileName: s3FileName })
        });

        if (!presignResponse.ok) {
          throw new Error('Failed to get pre-signed URL');
        }

        const { uploadURL } = await presignResponse.json();

        // Upload the text using fetch
        const uploadResponse = await fetch(uploadURL, {
          method: 'PUT',
          headers: {
            'Content-Type': 'text/plain'
          },
          body: useablePostResponse
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload to S3');
        } else {
          console.log("file upload successful", s3FileName);
        }

        const audioUrl = await fetchAudioFromLambda(BUCKETPATH + "/" + s3FileName);
        setAudioUrl(audioUrl);
        scrollToCharacterDescription();
        setPolling(true);
        setIsLoading(false);

      } catch (error) {
        console.error('Error uploading to S3:', error.message);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error sending story text to S3:", error);
      setIsLoading(false);
    }
  }
};


export const fetchAudioFromLambda = async (fileUrl) => {
  const apiKey = process.env.REACT_APP_API_KEY;
  const apiUrl = APIBASE + "/transcribe-to-audio";
  try {
      const res = await fetch(apiUrl, {
        method: 'POST', 
        headers: {
          'x-api-key': apiKey, 
        },
        body: JSON.stringify({ url: fileUrl })  // Add the request body here
      });
      const data = await res.json();
      // Check if 'message' exists in the response
      if (data.message) {
        console.log("data.message:", data.message);
        return data.message;
      } else {
        console.error("Message not found in the response.");
        return null;
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
}