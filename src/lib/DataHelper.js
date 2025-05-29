export const getStoryMakerHowItWorks = () => {
    return (
        {
            "data": [
              {
                "text": "First, you create 3 characters, either from a variety of presets, or by adding in your own custom values.",
              },
              {
                "text": "Next, a random situation will be suggested. You are free to modify this or delete it altogether.",
              },
              {
                "text": "The characters and situation are then sent to a lambda function that will generate a story using LLMs from OpenAI, Google Gemini and Anthropic Claude, which each will be called to play each of the characters, carrying out a conversation and acting out a virtual 'skit'.",
              },
              {
                "text": "When this text begins to appear, you have the option to generate an audio file where a narrator will read the story. This is done through a series of calls to lambda, AWS S3, and OpenAI's audio model, as the story text will often exceed the 4096 character limit of Lambda, and the generation of the audio file will exceed the 30-second max response time of AWS API Gateway.",
              },
              {
                "text": "Audio file generation can take up to a couple of minutes. There is a polling functionality in place to check every 5 seconds to see if the file is ready. Once it's ready, you'll be able to play it through the audio player which appears.",
              },
            ]
        }
    );
}

export const getHomeSummaryHowItWorks = () => {
    return (
        {
            "data": [
                {
                    "text": "A valid url must be entered which is then submitted to a Lambda function via AWS API Gateway.",
                },
                {
                    "text": "The Lambda function then attempts to pull and parse all content from the site homepage.",
                    "children": ["Please note: this tool may not be able to retrieve site content if it is loaded via JavaScript such as is the case for a ReactJS app."]
                },
                {
                    "text": "The Lambda function then submits this content to OpenAI via API, requesting a summary.",
                },
                {
                    "text": "The response is then returned by Lambda to display here.",
                },
            ]
        }
    );
}