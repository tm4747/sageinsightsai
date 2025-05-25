import React, { useEffect, useState, useRef } from 'react';
import { getCharacterTypes, getCharacterHasItems, getCharacterTraits, getLikes, getDislikes } from '../lib/CharacterConfiguratorHelper';
import "./styles/CharacterConfigurator.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt } from '@fortawesome/free-solid-svg-icons';
import Slider from './simple/Slider';

const CharacterConfigurator = ({ characterId, submittedData }) => {
  
    const [characterName, setCharacterName] = useState('');
    const [characterType, setCharacterType] = useState('');
    const [characterTrait, setCharacterTrait] = useState('');
    const [characterHas, setCharacterHas] = useState('');
    const [characterLikes, setCharacterLikes] = useState('');
    const [characterDislikes, setCharacterDislikes] = useState('');
    const [characterDescription, setCharacterDescription] = useState('');
    // todo: change this to levelOfRealism - HEREHERE
    const [getEdgy, setGetEdgy] = useState(false);
    const [enterValues, setEnterValues] = useState(false);
    const [levelOfRealism, setLevelOfRealism] = useState(1);
  
    const characterTypes = getCharacterTypes(levelOfRealism, getEdgy);
    const characterTraits = getCharacterTraits(levelOfRealism, getEdgy);
    const characterHasItems = getCharacterHasItems(levelOfRealism, getEdgy);
    const likesChoices = getLikes(levelOfRealism, getEdgy); 
    const dislikesChoices = getDislikes(levelOfRealism, getEdgy);
    const textareaRef = useRef(null);
  
    
     useEffect(() => {
      let previewData = "";
      if(characterType){
        if(characterTrait){
          previewData = getAOrAn(characterTrait) + " " + characterTrait + " " + characterType;
        } else {
          previewData = getAOrAn(characterType) + " " + characterType ;
        }
        previewData += characterName ? " named " + characterName : "";
        if(characterHas){
          previewData += " who has " + characterHas;
          if(characterLikes && characterDislikes){
            previewData += " and likes " + characterLikes + " but doesn't like " + characterDislikes;
          } else if(characterLikes ){
            previewData += " and likes " + characterLikes;
          } else if(characterDislikes){
            previewData += " and doesn't like " + characterDislikes;
          }
        } else {
          if(characterLikes && characterDislikes){
            previewData += " who likes " + characterLikes + " but doesn't like " + characterDislikes;
          } else if(characterLikes ){
            previewData += " who likes " + characterLikes;
          } else if(characterDislikes){
            previewData += " who doesn't like " + characterDislikes;
          }
        }
        previewData += ".";
        adjustTextareaSize();
      } 
      setCharacterDescription(previewData);
      }, [characterType, characterName, characterTrait, characterHas, characterLikes, characterDislikes]);

      const handleCharacterDescriptionUpdated = (e) => {
        const textarea = e.target;
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
        setCharacterDescription(e.target.value); // your state update
      };

      const handleInputSubmit = (input) => {
        console.log('input');
        console.log(input);
        submittedData(input);
        clearInputs();
        setEnterValues(false);
      }

      const clearInputs = (b_clearNames = true) => {
        if(b_clearNames){
          setCharacterName('');
        } 
        setCharacterType('');
        setCharacterTrait('');
        setCharacterHas('');
        setCharacterLikes('');
        setCharacterDislikes('');
        setCharacterDescription('');
        adjustTextareaSize();
      };
      
      const getRandomChoices = () => {
        clearInputs(false);
        setCharacterType(getRandomValueFromArray(characterTypes));
        setCharacterTrait(getRandomValueFromArray(characterTraits));
        if(Math.random() < 0.65) setCharacterHas(getRandomValueFromArray(characterHasItems));
        // only set a dislike or a like
        Math.random() < 0.5 ? setCharacterLikes(getRandomValueFromArray(likesChoices)) : setCharacterDislikes(getRandomValueFromArray(dislikesChoices));
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

    var nameDisplay = characterName ? characterName : "Character " + characterId;
    nameDisplay += characterType ? " the " + characterType : ""; 


    const handleToggleGetEdgy = () => {
      if(getEdgy){
        setGetEdgy(false);
      } else {
        setGetEdgy(true);
      }
      
    }
    let iconClasses = "flashing-icon edgy-icon";
    iconClasses += getEdgy ? " red-border" : " black-border";
    console.log('getEdgy');
    console.log(getEdgy);

    const handleToggleEnterValues = () =>{
      setEnterValues(!enterValues);
    }

    const icon = <FontAwesomeIcon icon={faBolt} onClick={handleToggleGetEdgy} className={iconClasses} title="Close"/>

    return (
      <div className={"character-config"}>
        <h3>{nameDisplay}</h3>
        <Slider setValue={setLevelOfRealism} initialValue={levelOfRealism} showEdgy={getEdgy} />
        <table className={"inputContainer"}>
          <tbody>
          <tr className={"inputDiv"}>
              <td className={"tdLeft"}><label>Character Name:</label></td>
              <td className={"tdRight"}>
                <input className={"text-input"}value={characterName} type="text" onChange={(e) => setCharacterName(e.target.value)}/>
              </td>
          </tr>
            <tr className={"inputDiv"}>
                <td className={"tdLeft"}><label>Character Type:</label></td>
                <td className={"tdRight"}>
                {enterValues ? 
                  <input className={"text-input"} value={characterType} type="text" onChange={(e) => setCharacterType(e.target.value)}/>
                  : <select className={"select-input"} value={characterType} onChange={(e) => setCharacterType(e.target.value)}>
                    <option value="">Select...</option>
                    {characterTypes.map((charType) =>
                        <option key={charType} value={charType}>{capitalizeFirstLetter(charType)}</option>
                    )}
                  </select>}
                </td>
            </tr>

            <tr className={"inputDiv"}>
                <td className={"tdLeft"}><label>Who Is:</label></td>
                <td className={"tdRight"}>  
                  {enterValues ? 
                  <input className={"text-input"} value={characterTrait} type="text" onChange={(e) => setCharacterTrait(e.target.value)}/>
                  : <select value={characterTrait} onChange={(e) => setCharacterTrait(e.target.value)}>
                  <option value="">Select...</option>
                  {characterTraits.map((charTrait) =>
                      <option key={charTrait} value={charTrait}>{capitalizeFirstLetter(charTrait)}</option>
                  )}
                  </select>}
                </td>
            </tr>
            <tr className={"inputDiv"}>
                <td className={"tdLeft"}><label>Who Has:</label></td>
                <td className={"tdRight"}>  
                  {enterValues ? 
                    <input className={"text-input"} value={characterHas} type="text" onChange={(e) => setCharacterHas(e.target.value)}/>
                    : <select value={characterHas} onChange={(e) => setCharacterHas(e.target.value)}>
                    <option value="">Select...</option>
                    {characterHasItems.map((characterHasItem) =>
                        <option key={addDashes(characterHasItem)} value={characterHasItem}>{capitalizeFirstLetter(characterHasItem)}</option>
                    )}
                  </select>}
                </td>
            </tr>
            <tr className={"inputDiv"}>
                <td className={"tdLeft"}><label>Who likes:</label></td>
                <td className={"tdRight"}>                
                  {enterValues ? 
                    <input className={"text-input"} value={characterLikes} type="text" onChange={(e) => setCharacterLikes(e.target.value)}/>
                    : <select value={characterLikes} onChange={(e) => setCharacterLikes(e.target.value)}>
                    <option value="">Select...</option>
                    {likesChoices.map((likesChoice) =>
                        <option key={addDashes(likesChoice)} value={likesChoice}>{capitalizeFirstLetter(likesChoice)}</option>
                    )}
                  </select>}
                </td>
            </tr>
            <tr className={"inputDiv"}>
                <td className={"tdLeft"}> <label>But doesn't like:</label></td>
                <td className={"tdRight"}>  
                  {enterValues ? 
                    <input className={"text-input full-width"} value={characterDislikes} type="text" onChange={(e) => setCharacterDislikes(e.target.value)}/>
                    : <select value={characterDislikes} onChange={(e) => setCharacterDislikes(e.target.value)}>
                    <option value="">Select...</option>
                    {dislikesChoices.map((dislikesChoice) =>
                        <option key={addDashes(dislikesChoice)} value={dislikesChoice}>{capitalizeFirstLetter(dislikesChoice)}</option>
                    )}
                    </select>}
                </td>
            </tr>
            <tr className={"inputDiv"}>
                <td colSpan={2} >
                <textarea ref={textareaRef} className="text-input textarea-input" value={characterDescription ? "Character " + characterId + " is " + characterDescription : ""} 
                  onChange={handleCharacterDescriptionUpdated} rows={1} readOnly={true}/>
                </td>
            </tr>
          </tbody>
        </table>
        <div className="button-row">
          {characterDescription ? <button className={"button green-button"} onClick={() => handleInputSubmit(characterDescription)}>Character {characterId} Done!</button> : ""}
          <button className={"button yellow-button"} onClick={getRandomChoices}>Get Random Choices</button>
          <button className={"button yellow-button"} onClick={handleToggleEnterValues}>{enterValues ? "Select From Presets" : "Enter Custom Values"}</button>
          {characterDescription ? <button className={"button red-button"} onClick={clearInputs}>Clear Character Choices</button> : ""}
          {icon}
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
  
  function getAOrAn(str){
    const vowels = "AEIOUaeiou";
    const firstLetterToLower = str.charAt(0);
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