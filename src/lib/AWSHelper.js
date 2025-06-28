/*** ALL FUNCTIONS THAT HIT AWS SERVICES SHOULD LIVE HERE. EVENTUALLY MAY SPLIT BY SERVICE (S3/Lambda/DDB) ***/
import { APIBASE, BUCKETPATH, APIKEY } from "./Constants";
import { removeIntroMaterial } from "./MiscellaneousHelper";
import { removeSpecialChars } from "./ValidationHelper";


/******** DYNAMO DB ********/
export const insertUserName = async (uuid, trimmedName) => {
  try {
    const response = await fetch(APIBASE + "/database", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": APIKEY
      },
      body: JSON.stringify({
        action: "create",
        uuid: uuid,
        name: trimmedName
      })
    });

    if (!response.ok) {
      const errorText = await response.text(); // try to extract message
      throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json(); // validate it's JSON
    return data;

  } catch (error) {
    console.error("Error in insertUserName:", error.message || error);
    throw error; // rethrow for caller to handle if needed
  }
};


export const getUserData = async (uuid) => {
  try {
    const response = await fetch(APIBASE + "/database", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": APIKEY
      },
      body: JSON.stringify({
        action: "get",
        uuid: uuid
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Error in getUserData:", error.message || error);
    throw error; // Re-throw to allow caller to handle if needed
  }
};


export const deleteUserData = async (uuid) => {
  console.log('attempt delete user data: ' + uuid);
  try {
    const response = await fetch(APIBASE + "/database", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": APIKEY
      },
      body: JSON.stringify({
        action: "delete",
        uuid: uuid
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Error in deleteUserData:", error.message || error);
    throw error; // Re-throw to allow caller to handle if needed
  }
};


/******* GET WEB INFO TOOL (future state will not be just summary) *******/
export const fetchWebSummary = async (enteredUrl, setResponse, setIsLoading) => {
  const apiUrl = APIBASE + "/hello";
  console.log('enteredUrl', enteredUrl);

  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'x-api-key': APIKEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: enteredUrl })
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`HTTP ${res.status}: ${res.statusText} - ${errorText}`);
    }

    const data = await res.json();

    setResponse(data.message);
    console.log("data message", data.message);
  } catch (error) {
    console.error('Error fetching data:', error.message || error);
    setResponse("⚠️ An error occurred while fetching the summary.");
  } finally {
    setIsLoading(false);
  }
};


/******* STORY MAKER *******/
export const fetchStoryFromLambda = async (input, setResponse, setIsLoading) => {
  const apiUrl = APIBASE + "/story-maker";
  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': APIKEY
      },
      body: JSON.stringify(input)
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`HTTP ${res.status}: ${res.statusText} - ${errorText}`);
    }

    const data = await res.json();
    setResponse(data.message);
    console.log("data message", data.message);
  } catch (error) {
    console.error('Error fetching story:', error.message || error);
    setResponse("⚠️ An error occurred while fetching your story.");
  } finally {
    setIsLoading(false);
  }
};



// send text to text file in S3 and url to file
export const fetchAudio = async (
  postResponse,
  setIsLoading,
  setAudioUrl,
  scrollToCharacterDescription,
  setPolling
) => {
  if (!postResponse) return;

  setIsLoading(true);
  try {
    let useablePostResponse = removeSpecialChars(postResponse);
    useablePostResponse = removeIntroMaterial(useablePostResponse);

    const timestamp = Math.floor(Date.now() / 1000);
    const s3FileName = `story-${timestamp}.txt`;

    // 1. Get pre-signed URL
    const presignResponse = await fetch(APIBASE + "/generate-upload-url", {
      method: 'POST',
      headers: {
        'x-api-key': APIKEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fileName: s3FileName })
    });

    if (!presignResponse.ok) {
      const errorText = await presignResponse.text();
      throw new Error(`Presign URL failed: ${presignResponse.status} - ${errorText}`);
    }

    const { uploadURL } = await presignResponse.json();

    // 2. Upload story to S3
    const uploadResponse = await fetch(uploadURL, {
      method: 'PUT',
      headers: { 'Content-Type': 'text/plain' },
      body: useablePostResponse
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      throw new Error(`S3 upload failed: ${uploadResponse.status} - ${errorText}`);
    }

    console.log("✅ File upload successful:", s3FileName);

    // 3. Trigger audio generation
    const audioUrl = await fetchAudioFromLambda(`${BUCKETPATH}/${s3FileName}`);
    setAudioUrl(audioUrl);
    scrollToCharacterDescription();
    setPolling(true);
  } catch (error) {
    console.error("❌ fetchAudio error:", error.message || error);
  } finally {
    setIsLoading(false);
  }
};


export const fetchAudioFromLambda = async (fileUrl) => {
  const apiUrl = APIBASE + "/transcribe-to-audio";

  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'x-api-key': APIKEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: fileUrl })
    });

    // Handle non-2xx responses
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Lambda response error: ${res.status} - ${errorText}`);
    }

    const data = await res.json();

    if (data && data.message) {
      console.log("✅ Audio URL returned:", data.message);
      return data.message;
    } else {
      console.error("⚠️ 'message' field missing in Lambda response.");
      return null;
    }
  } catch (error) {
    console.error("❌ fetchAudioFromLambda error:", error.message || error);
    return null;
  }
};
