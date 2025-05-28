import styles from "./styles/HowItWorks.module.css"

var howAppWorksHtml = <>
    <FontAwesomeIcon icon={faXmark} onClick={() => {setShowHowItWorks(false)}} className={"flashing-icon close-icon"} 
      title="Close"/>
    <h4>How it works:</h4> 
    <ol>
      <li>First, you create 3 characters, either from a variety of presets, or by adding in your own custom values.</li>
      <li>Next, a random situation will be suggested.  You are free to modify this or delete it altogether.</li>
      <li>The characters and situation are then sent to a lambda function that will generate a story using LLMs from OpenAI, Google Gemini and Anthropic Claude, which each will be called to play each of the characters, carrying out a converstaion and acting out a virtual 'skit'.</li>
      <li>When this text begins to appear, you have the option to generate an audio file where a narrator will read the story.  This is done through a series of calls to lambda, AWS S3 and openAI's audio model, as the story text will often exceed the 4096 character limit of Lambda, and the generation of the audio file will exceed the 30 second max response time of AWS API Gateway.</li>
      <li>Audio file generation can take up to a couple minutes.  There is a polling funcitionality in place to check every 5 seconds to see if the file is ready.  Once it's ready, you'll be able to play it through the audio player which appears.</li>
    </ol>
  </>

let howItWorksStyles = styles.howItWorksContainer + " ";
howItWorksStyles += showHowItWorks ? styles.expanded : styles.collapsed;
export const howAppWorks = (
    <div className={howItWorksStyles}>
      {howAppWorksHtml}
    </div>
  );