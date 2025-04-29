export const testGet = async (setResponse) => {
    const apiKey = process.env.REACT_APP_API_KEY;
    const apiUrl = "https://z9k5p8h1lg.execute-api.us-east-1.amazonaws.com/Prod/hello";
    try {
        const res = await fetch(apiUrl, {
          method: 'GET', 
          headers: {
            'x-api-key': apiKey, 
          },
        });
        const data = await res.json();  // Parse JSON response
        setResponse(data.message);      // Update state with the response
        console.log("data message")
        console.log(data.message)
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
}

export const testPost = async (enteredUrl, setResponse, setIsLoading) => {
    const apiKey = process.env.REACT_APP_API_KEY;
    const apiUrl = "https://z9k5p8h1lg.execute-api.us-east-1.amazonaws.com/Prod/hello";
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