import React, { useState, useEffect } from 'react';
import './correction.css'; 

const Correction = ({ verbType, inputVerbs, inputTenses, answersTemplate, pronouns, answers }) => {
  const [showAnswerKey, setShowAnswerKey] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState([]);

  useEffect(() => { 
    const generateCorrectAnswers = () => {
      const result = [];

      inputVerbs.forEach(verb => {
        inputTenses.forEach(tense => {
          const correct = Object.values(answersTemplate[verbType][verb][tense]);
          result.push(...correct);
        });
      });

      setCorrectAnswers(result);
    };

    generateCorrectAnswers();
  }, [verbType, inputVerbs, inputTenses, answersTemplate]);

  const handleAnswerKey = () => {
    setShowAnswerKey(true);
  };

  const handleRestart = () => {
    window.location.reload();
  }

  return (
    <div>

      <div className="buttons-correction">
        <button type="button" onClick={handleRestart}>Restart App</button>

        {!showAnswerKey && (
        <button type='button' onClick={handleAnswerKey}>Check Answer Key</button>
      )}
      </div>

      <div>
        {inputVerbs.map((verb, verbIndex) => (
          inputTenses.map((tense, tenseIndex) => {
            const startIndex = (verbIndex * inputTenses.length + tenseIndex) * pronouns.length;
            const endIndex = startIndex + pronouns.length;

            return (
              <div key={`${verb}-${tense}`}>
                <h3 className="format-verb-tense">{verb} - {tense}</h3>

                <div className="format-inputs-answer-keys">

                  <ul className="answers-correction">
                    {correctAnswers.slice(startIndex, endIndex).map((correctAnswer, index) => {
                      const userAnswer = answers[startIndex + index];
                      const isCorrect = correctAnswer === userAnswer;
                      return ( 
                        <li
                          key={index}
                          style={{
                            color: isCorrect ? 'green' : 'red'
                          }}
                        >
                          {pronouns[index]}{userAnswer}
                        </li>
                      );
                    })}
                  </ul>

                  {showAnswerKey && (
                    <ul className="answers-correction">
                      {correctAnswers.slice(startIndex, endIndex).map((correctAnswer, index) => (
                        <li key={index}>
                          {pronouns[index]}{correctAnswer}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              
              </div>
            );
          })
        ))}
      </div>
    </div>
  );
};

export default Correction;
