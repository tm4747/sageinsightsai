import React, { useEffect, useState, useRef } from 'react';
import { getCharacterTypes, getHasAThings, getCharacterTraits, getLikesOrDislikes } from '../lib/StoryMakerHelper';
import "./styles/CharacterConfigurator.css";

const CharacterConfigurator = ({ characterId, submittedData }) => {
    const [characterType, setCharacterType] = useState('');
    const [whoIs, setWhoIs] = useState('');
    const [whoHas, setWhoHas] = useState('');
    const [whoLikesType, setWhoLikesType] = useState('');
    const [whoLikesThing, setWhoLikesThing] = useState('');
    const [characterDescription, setCharacterDescription] = useState('');
  
    const characterTypes = getCharacterTypes();
    const characterTraits = getCharacterTraits();
    const hasAThings = getHasAThings();
    const likesOrDislikeChoices = ["likes", "doesn't like"];
    const likesAndDislikes = getLikesOrDislikes();
    const textareaRef = useRef(null);

  
    
     useEffect(() => {
      let previewData = "";
      if(characterType){
        if(whoIs){
          previewData = "I am " + getAAn(whoIs) + " " + whoIs + " " + characterType;
        } else {
          previewData = "I am " + getAAn(characterType) + " " + characterType ;
        }
        if(whoHas){
          previewData += " who has " + whoHas;
          if(whoLikesType && whoLikesThing){
            previewData += " and " + whoLikesType + " " + whoLikesThing + ".";
          } else if(whoLikesType ){
            previewData += " and " + whoLikesType;
          }
        } else {
          if(whoLikesType && whoLikesThing){
            previewData += " who " + whoLikesType + " " + whoLikesThing + ".";
          } else if(whoLikesType ){
            previewData += " who " + whoLikesType;
          }
        }
      } 
      setCharacterDescription(previewData);
      }, [characterType, whoIs, whoHas, whoLikesType, whoLikesThing]);

      const handleCharacterDescriptionUpdated = (e) => {
        const textarea = e.target;
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
        setCharacterDescription(e.target.value); // your state update
      };

      const handleInputSubmit = (input) => {
        console.log('input');
        console.log(input);
        submittedData(input)
      }

      const clearInputs = () => {
        setCharacterType('');
        setWhoIs('');
        setWhoHas('');
        setWhoLikesType('');
        setWhoLikesThing('');
        setCharacterDescription('');
        adjustTextareaSize();
      };
      
      const getRandomChoices = () => {
        clearInputs();
        setCharacterType(getRandomValueFromArray(characterTypes));
        setWhoIs(getRandomValueFromArray(characterTraits));
        setWhoHas(getRandomValueFromArray(hasAThings));
        setWhoLikesType(getRandomValueFromArray(likesOrDislikeChoices));
        setWhoLikesThing(getRandomValueFromArray(likesAndDislikes));
        adjustTextareaSize();
      };

      const adjustTextareaSize = () => {
        const timer = setTimeout(() => {
          const textarea = textareaRef.current;
          if(textarea){
            textarea.style.height = "auto";
            textarea.style.height = textarea.scrollHeight + "px";
          }
        }, 125);
        return () => clearTimeout(timer);
      }
      
  
    return (
      <div className={"character-config"}>
        <h3>Character {characterId}</h3>
        <table className={"inputContainer"}>
            <tr className={"inputDiv"}>
                <td className={"tdLeft"}><label>Character Type:</label></td>
                <td className={"tdRight"}>
                <select className={"select-input"} value={characterType} onChange={(e) => setCharacterType(e.target.value)}>
                <option value="">Select...</option>
                {characterTypes.map((charType) =>
                    <option key={charType} value={charType}>{capitalizeFirstLetter(charType)}</option>
                )}
                </select>
                </td>
            </tr>

            <tr className={"inputDiv"}>
                <td className={"tdLeft"}><label>Who Is:</label></td>
                <td className={"tdRight"}>                <select value={whoIs} onChange={(e) => setWhoIs(e.target.value)}>
                <option value="">Select...</option>
                {characterTraits.map((charTrait) =>
                    <option key={charTrait} value={charTrait}>{capitalizeFirstLetter(charTrait)}</option>
                )}
                </select>
                </td>
            </tr>
            <tr className={"inputDiv"}>
                <td className={"tdLeft"}><label>Who Has A:</label></td>
                <td className={"tdRight"}>                <select value={whoHas} onChange={(e) => setWhoHas(e.target.value)}>
                <option value="">Select...</option>
                {hasAThings.map((hasAThing) =>
                    <option key={addDashes(hasAThing)} value={hasAThing}>{capitalizeFirstLetter(hasAThing)}</option>
                )}
                </select>
                </td>
            </tr>
            <tr className={"inputDiv"}>
                <td className={"tdLeft"}><label>Who:</label></td>
                <td className={"tdRight"}>                <select value={whoLikesType} onChange={(e) => setWhoLikesType(e.target.value)}>
                <option value="">Select...</option>
                {likesOrDislikeChoices.map((likesOrDislikeChoice) =>
                    <option key={addDashes(likesOrDislikeChoice)} value={likesOrDislikeChoice}>{capitalizeFirstLetter(likesOrDislikeChoice)}</option>
                )}
                </select>
                </td>
            </tr>
            <tr className={"inputDiv"}>
                <td className={"tdLeft"}> <label>...To:</label></td>
                <td className={"tdRight"}>                <select value={whoLikesThing} onChange={(e) => setWhoLikesThing(e.target.value)}>
                <option value="">Select...</option>
                {likesAndDislikes.map((likeOrDislike) =>
                    <option key={addDashes(likeOrDislike)} value={likeOrDislike}>{capitalizeFirstLetter(likeOrDislike)}</option>
                )}
                </select>
                </td>
            </tr>
        </table>
        <textarea ref={textareaRef} className="text-input" value={characterDescription} 
          onChange={handleCharacterDescriptionUpdated} rows={1}/>
        <div className="button-row">
          <button className={"button"} onClick={getRandomChoices}>Get Random Choices</button>
          {characterDescription ? <button className={"button"} onClick={clearInputs}>Clear Inputs</button> : ""}
          {characterDescription ? <button className={"button"} onClick={() => handleInputSubmit(characterDescription)}>Submit</button> : ""}
        </div>
      </div>
    );
  }
  
  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  function addDashes(str) {
    return str.replace(/\s+/g, '-');
  }
  
  function getAAn(str){
    const vowels = "AEIOUaeiou";
    const firstLetterToLower = str.charAt(0);
    console.log('firstLetterToLower');
    console.log(firstLetterToLower);
    return vowels.includes(firstLetterToLower)?  "an" : "a";
  }

  function getRandomValueFromArray(array) {
    if (array.length === 0) {
      return undefined; // Return undefined for empty arrays
    }
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }
  
  export default CharacterConfigurator;