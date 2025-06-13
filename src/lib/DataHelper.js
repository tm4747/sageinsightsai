export const getStoryMakerHowItWorks = () => {
    return (
        {
            "data": [
              {
                "text": "First, you create and name 3 characters either from a variety of presets or by adding your own custom values.",
              },
              {
                "text": "Next, a random situation will be suggested. You are free to modify this, get a different random situation or delete it altogether.",
              },
              {
                "text": "The characters and situation are then sent to an AWS Lambda function which will generate a story using LLMs from OpenAI, Google and Anthropic, with each playing one of the characters in a virtual 'skit' and dialogue.",
              },
              {
                "text": "After a moment, the story text will begins to print out in the results box, and a button will appear allowing you to generate an audio file where a narrator will read the story to you. This is accomplished through a series of calls to AWS Lambda, AWS S3, and OpenAI's audio model.  The story text will often exceed Lambda's 4096 character input limit, as fetching the audio file will often exceed the 30-second max response time of AWS API Gateway. Therefore, we must make use of S3 as an intermediary data store from which Lambda can pull data outside of these platform limits.",
              },
              {
                "text": "Audio file generation can take up to a couple of minutes. The front end app has a polling functionality to check every 5 seconds for whether or not a valid file is ready. As soon as it becomes available, an audio player will appear through which you'll be able to play or download the audio file.",
              },
            ]
        }
    );
}

export const getWebSummaryHowItWorks = () => {
    return (
        {
            "data": [
                {
                    "text": "A valid url must be entered which is then submitted to an AWS Lambda function via AWS API Gateway.",
                },
                {
                    "text": "The Lambda function then attempts to pull and parse all content from the site homepage.",
                    "children": [
                        {
                            "heading": "Please note: ",
                            "text": "this tool may not be able to retrieve site content if it is loaded via JavaScript such as is the case for a ReactJS app.",
                        },
                    ],
                },
                {
                    "text": "The Lambda function then submits the content to OpenAI's API, requesting a summary.",
                },
                {
                    "text": "The response is finally returned by Lambda to display here.",
                },
            ]
        }
    );
}



export const getDifficultChoiceMakerHowItWorks = () => {
    return (
        {
            "data": [
              {
                "text": "First enter a decision you need help with.  This could be something like 'Where do I want to move'.",
              },
              {
                "text": "Next enter criteria and relative importance of each from 1-10.  Criteria are the meaningful aspects of your choices through which metrics and analysis will be derived.  Some examples could be 'beautiful scenery', 'access to a nice downtown', 'clean air', 'good schools'.  Don't worry about being exact with the entered importance value, as you can adjust that later.",
              },
              {
                "text": "Then enter your choices.  These are essentially all the possible options you are considering.",
              },
              {
                "text": "Fine tune the importance of your criteria.  The number of total points are set by your initial choices, but you can reallocate points from one criteria to another. You must allocate all criteria points to get your final analysis.",
              },
              {
                "text": "Finally, submit your adjusted criteria and choices.  The tool will return the best and worst choice, as well as an AI-enabled analysis.",
              },
            ]
        }
    );
}