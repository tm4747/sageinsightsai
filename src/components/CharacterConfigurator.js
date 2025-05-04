import React, { useEffect, useState } from 'react';
import { getCharacterTypes, getHasAThings, getCharacterTraits, getLikesOrDislikes } from '../lib/StoryMakerHelper';
import "./styles/CharacterConfigurator.css";

const CharacterConfigurator = ({ characterId, handleInputSubmit }) => {
    const [characterType, setCharacterType] = useState('');
    const [whoIs, setWhoIs] = useState('');
    const [whoHas, setWhoHas] = useState('');
    const [whoLikesType, setWhoLikesType] = useState('');
    const [whoLikesThing, setWhoLikesThing] = useState('');
    const [characterDescription, setCharacterDescription] = useState('');
  
    const characterTypes = getCharacterTypes();
    const characterTraits = getCharacterTraits();
    const hasAThings = getHasAThings();
    const likesAndDislikes = getLikesOrDislikes();
  
    
     useEffect(() => {
      let previewData = "";
      if(characterType){
        if(whoIs){
          previewData = "I am " + getAAn(whoIs) + " " + whoIs + " " + characterType;
        } else {
          previewData = "I am " + getAAn(characterType) + " " + characterType ;
        }
        if(whoHas){
          if(whoLikesType && whoLikesThing){
            previewData += " who has " + whoHas;
            previewData += " and " + whoLikesType + " " + whoLikesThing + ".";
          } else {
            previewData += " who has " + whoHas;
          }
        } else if(whoLikesType && whoLikesThing){
          previewData += " who " + whoLikesType + " " + whoLikesThing + ".";
        }
      } 
      setCharacterDescription(previewData);
      }, [characterType, whoIs, whoHas, whoLikesType, whoLikesThing]);

    const handleCharacterDescriptionUpdated = (e) => {
      setCharacterDescription(e.target.value);
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
                <option value="likes">Likes</option>
                <option value="doesn't like">Doesn't like</option>
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
        <p><input className={"text-input"} type="text" value={characterDescription} onChange={handleCharacterDescriptionUpdated} /></p>
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
  
  export default CharacterConfigurator;