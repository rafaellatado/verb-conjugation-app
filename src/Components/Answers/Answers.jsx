import React from 'react';
import './answers.css';

const Answers = ({ verbType, inputVerbs, answersTemplate }) => {

  const verbTenses = ['PRÉSENT', 'PASSÉ COMPOSÉ', 'IMPARFAIT', 'PLUS-QUE-PARFAIT', 'FUTUR SIMPLE'];
 
  return (
    <div> 

      <h1 className="answer-key-title">Answer Key: </h1>

      {inputVerbs.map((verb) => (
        verbTenses.map((tense) => {
          const conjugations = answersTemplate[verbType][verb][tense];
          return (
            <div key={`${verb}-${tense}`}>
              <h2 className="ak-verb-tense">{`${verb} - ${tense}`}</h2>
              <ul className="answer-key">
                {Object.entries(conjugations).map(([pronoun, conjugation]) => (
                  <li key={pronoun}>
                    {pronoun}: {conjugation}
                  </li>
                ))}
              </ul>
            </div>
          );
        })
      ))}
    </div>
  );
};

export default Answers;
