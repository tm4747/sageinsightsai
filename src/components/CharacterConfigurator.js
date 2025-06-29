import { useEffect, useState, useRef } from 'react';
import { getCharacterTypes, getCharacterHasItems, getCharacterTraits, getLikes, getDislikes } from '../lib/CharacterConfiguratorHelper';
import styles from "./styles/CharacterConfigurator.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt } from '@fortawesome/free-solid-svg-icons';
import { removeNonAlphanumericMultispace } from '../lib/ValidationHelper';
import ButtonControl from './simple/ButtonControl';
// todo: test 

const CharacterConfigurator = ({ characterId, submittedData, levelOfRealism, getEdgy, setGetEdgy, handleResetState }) => {
  
    const [characterName, setCharacterName] = useState('');
    const [characterType, setCharacterType] = useState('');
    const [characterTrait, setCharacterTrait] = useState('');
    const [characterHas, setCharacterHas] = useState('');
    const [characterLikes, setCharacterLikes] = useState('');
    const [characterDislikes, setCharacterDislikes] = useState('');
    const [characterDescription, setCharacterDescription] = useState('');
    // todo: change this to levelOfRealism - HEREHERE
    const [enterValues, setEnterValues] = useState(false);
  
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
      } else if(characterName){
        previewData = "named " + characterName + ".";
      }
      setCharacterDescription(previewData);
      adjustTextareaSize();
    }, [characterType, characterName, characterTrait, characterHas, characterLikes, characterDislikes]);

      const handleCharacterDescriptionUpdated = (e) => {
        const textarea = e.target;
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
        setCharacterDescription(e.target.value); // your state update
      };

      const handleInputSubmit = (input) => {
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
    let iconClasses = `flashing-icon rounded-icon ${styles.edgyIcon}`;
    iconClasses += getEdgy ? " red-border" : " black-border";

    const handleToggleEnterValues = () =>{
      setEnterValues(!enterValues);
    }

    const icon = <FontAwesomeIcon icon={faBolt} onClick={handleToggleGetEdgy} className={iconClasses} title="Close"/>

    return (
      <div className={`${styles.characterConfig} commonDiv`}>
        <h3 style={{marginTop:0}}>{nameDisplay}</h3>
        <table className={styles.inputContainer}>
          <tbody>
          <tr>
              <td className={styles.tdLeft}><label>Character Name:</label></td>
              <td className={styles.tdRight}>
                <input className={styles.textInput}value={characterName} type="text" onChange={(e) => setCharacterName(removeNonAlphanumericMultispace(e.target.value))}/>
              </td>
          </tr>
            <tr>
                <td className={styles.tdLeft}><label>Character Type:</label></td>
                <td className={styles.tdRight}>
                {enterValues ? 
                  <input className={styles.textInput} value={characterType} type="text" onChange={(e) => setCharacterType(removeNonAlphanumericMultispace(e.target.value))}/>
                  : <select className={styles.selectInput} value={characterType} onChange={(e) => setCharacterType(e.target.value)}>
                    <option value="">Select...</option>
                    {characterTypes.map((charType) =>
                        <option key={charType} value={charType}>{capitalizeFirstLetter(charType)}</option>
                    )}
                  </select>}
                </td>
            </tr>

            <tr>
                <td className={styles.tdLeft}><label>Who Is:</label></td>
                <td className={styles.tdRight}>  
                  {enterValues ? 
                  <input className={styles.textInput} value={characterTrait} type="text" onChange={(e) => setCharacterTrait(removeNonAlphanumericMultispace(e.target.value))}/>
                  : <select className={styles.selectInput} value={characterTrait} onChange={(e) => setCharacterTrait(e.target.value)}>
                  <option value="">Select...</option>
                  {characterTraits.map((charTrait) =>
                      <option key={charTrait} value={charTrait}>{capitalizeFirstLetter(charTrait)}</option>
                  )}
                  </select>}
                </td>
            </tr>
            <tr>
                <td className={styles.tdLeft}><label>Who Has:</label></td>
                <td className={styles.tdRight}>  
                  {enterValues ? 
                    <input className={styles.textInput} value={characterHas} type="text" onChange={(e) => setCharacterHas(removeNonAlphanumericMultispace(e.target.value))}/>
                    : <select className={styles.selectInput} value={characterHas} onChange={(e) => setCharacterHas(e.target.value)}>
                    <option value="">Select...</option>
                    {characterHasItems.map((characterHasItem) =>
                        <option key={addDashes(characterHasItem)} value={characterHasItem}>{capitalizeFirstLetter(characterHasItem)}</option>
                    )}
                  </select>}
                </td>
            </tr>
            <tr>
                <td className={styles.tdLeft}><label>Who Likes:</label></td>
                <td className={styles.tdRight}>                
                  {enterValues ? 
                    <input className={styles.textInput} value={characterLikes} type="text" onChange={(e) => setCharacterLikes(removeNonAlphanumericMultispace(e.target.value))}/>
                    : <select className={styles.selectInput} value={characterLikes} onChange={(e) => setCharacterLikes(e.target.value)}>
                    <option value="">Select...</option>
                    {likesChoices.map((likesChoice) =>
                        <option key={addDashes(likesChoice)} value={likesChoice}>{capitalizeFirstLetter(likesChoice)}</option>
                    )}
                  </select>}
                </td>
            </tr>
            <tr>
                <td className={styles.tdLeft}> <label>But Doesn't Like:</label></td>
                <td className={styles.tdRight}>  
                  {enterValues ? 
                    <input className={`${styles.textInput} full-width`} value={characterDislikes} type="text" onChange={(e) => setCharacterDislikes(removeNonAlphanumericMultispace(e.target.value))}/>
                    : <select className={styles.selectInput} value={characterDislikes} onChange={(e) => setCharacterDislikes(e.target.value)}>
                    <option value="">Select...</option>
                    {dislikesChoices.map((dislikesChoice) =>
                        <option key={addDashes(dislikesChoice)} value={dislikesChoice}>{capitalizeFirstLetter(dislikesChoice)}</option>
                    )}
                    </select>}
                </td>
            </tr>
            <tr className={"inputDiv paddingTop"} >
                <td colSpan={2} style={{paddingTop:"1rem"}} >
                <textarea ref={textareaRef} className={`${styles.textInput} textarea-input`} value={characterDescription ? "Character " + characterId + " is " + characterDescription : ""} 
                  onChange={handleCharacterDescriptionUpdated} rows={1} readOnly={true}/>
                </td>
            </tr>
          </tbody>
        </table>
        <div className="button-row commonDiv">
          {characterDescription ? 
            <ButtonControl variation={"submitRequest"} onPress={() => handleInputSubmit(characterDescription)} text={`Character ${characterId} Done!`}/> : ""}
          <ButtonControl variation={"progressionButton"} onPress={getRandomChoices} text={"Get Random Choices"}/> 
          <ButtonControl variation={"progressionButton"} onPress={handleToggleEnterValues} text={enterValues ? "Select From Presets" : "Enter Custom Values"}/> 
          {!characterDescription && handleResetState ? 
            <ButtonControl variation={"resetButton"} onPress={handleResetState} text={"Delete All Characters"}/> : ""}
          {characterDescription ? 
            <ButtonControl variation={"resetButton"} onPress={clearInputs} text={"Clear Character Choices"}/> : ""}
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