import React, { useState } from 'react';
import Correction from '../Correction/Correction';
import './conjugation.css';

const Conjugation = ({ inputVerbs, inputTenses, verbType, answersTemplate }) => {

  const [answers, setAnswers] = useState([]);
  const [pronounIndex, setPronounIndex] = useState(0);
  const [tenseIndex, setTenseIndex] = useState(0);
  const [verbIndex, setVerbIndex] = useState(0);
  const [currentBlock, setCurrentBlock] = useState(0);

  const pronouns = ['Je: ', 'Tu: ', 'Il/Elle/On: ', 'Nous: ', 'Vous: ', 'Ils/Elles: '];

  const handleConjugate = (e) => {
    e.preventDefault();
    const input_answer = e.target.elements.inputAnswersForm.value.toLowerCase();
    setAnswers((currentAnswer) => [...currentAnswer, input_answer]);
    
    if (pronounIndex < pronouns.length -1) {
      setPronounIndex(pronounIndex + 1);

    } else {
      setPronounIndex(0);
      // The line below is interesting, when used together with the final three lines of code before the return statement
      setCurrentBlock(currentBlock + 1);

      if (tenseIndex < inputTenses.length -1) {
        setTenseIndex(tenseIndex + 1)

      } else {
        setTenseIndex(0);

        if (verbIndex < inputVerbs.length - 1) {
          setVerbIndex(verbIndex + 1);

        } else {

          // Stopping iteration
          setVerbIndex(100);
        }
      }
    }
    
    e.target.reset();
  }

  // The three lines below are interesting. We make a new array every 6 elements of the answers array. 
  // 0 to 5 in the first set of pronouns, then 6 to 11 in the second set, then 12 to 17, etc...
  const startIndex = currentBlock * 6; 
  const endIndex = startIndex + 6; 
  const currentAnswers = answers.slice(startIndex, endIndex);


  return (
    <div>
 
      {verbIndex < inputVerbs.length && tenseIndex < inputTenses.length && pronounIndex < pronouns.length && (

        <form className="form-conjugation" onSubmit={handleConjugate}>
          <label>Verb: {inputVerbs[verbIndex]}</label>
          <label>Tense: {inputTenses[tenseIndex]}</label>

          {currentAnswers.map((currentAnswer, index) => {
            // The line below is interesting. Using the remainder of the division of index by pronouns.length
            const pronoun_index = index % pronouns.length;

            return <p key={index} className="users_inputs">
              <span>{pronouns[pronoun_index]}</span> 
              <span>{currentAnswer}</span>
            </p>;
          })}

          <div className="form-pronoun-group">
            <label>{pronouns[pronounIndex]}</label>
            <input class="pronouns" type='text' name='inputAnswersForm' required></input>
          </div>
        </form>

      )}
 
      {verbIndex === 100 && (
        <Correction inputVerbs={inputVerbs} inputTenses={inputTenses} verbType={verbType} 
        answersTemplate={answersTemplate} pronouns={pronouns} answers={answers} />
      )} 


    </div>
  )
}

export default Conjugation;
