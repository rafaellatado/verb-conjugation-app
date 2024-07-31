import React, { useState, useEffect } from 'react';
import Answers from '../Answers/Answers';

const AnswerKey = () => {

  // Initial states 
  const [allVerbs, setAllVerbs] = useState([]);
  const [regularVerbs1, setRegularVerbs1] = useState([]);
  const [regularVerbs2, setRegularVerbs2] = useState([]);
  const [irregularVerbs, setIrregularVerbs] = useState([]);
  const [answersTemplate, setAnswersTemplate] = useState({});

  // Other states
  const [renderState, setRenderState] = useState(101);
  const [errorMessage, setErrorMessage] = useState('');
  const [verbType, setVerbType] = useState('');
  const [howMany, setHowMany] = useState(0);
  const [iterator, setIterator] = useState(0);
  const [inputVerbs, setInputVerbs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/answers/answers.txt'); 
  
        // Log the response for debugging purposes
        console.log('Response:', response);
  
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
  
        const textData = await response.text();
  
        // Log the raw text to see what is being fetched
        console.log('Raw fetched data:', textData);
  
        let jsonData;
        try {
          jsonData = JSON.parse(textData);
        } catch (error) {
          throw new Error('Failed to parse JSON.');
        }
  
        setAnswersTemplate(jsonData);
  
        const regular_verbs1 = Object.keys(jsonData.REGULIERS_1);
        const regular_verbs2 = Object.keys(jsonData.REGULIERS_2);
        const irregular_verbs = Object.keys(jsonData.IRREGULIERS);
        const all_verbs = [...regular_verbs1, ...regular_verbs2, ...irregular_verbs];
  
        setRegularVerbs1(regular_verbs1);
        setRegularVerbs2(regular_verbs2);
        setIrregularVerbs(irregular_verbs);
        setAllVerbs(all_verbs);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
  
    fetchData();
  }, []);


  const handleFirstButtons = (reg_or_irreg) => {

    if (reg_or_irreg === 1) {
      setRenderState(102);
      setVerbType('');

    } else if (reg_or_irreg === 2) {
      setRenderState(103);
      setVerbType('IRREGULIERS');
    }
  };
  
  const handleFormVerbInput1 = (e) => {
    e.preventDefault();
    const input = e.target.elements.verb_input_1.value.toUpperCase();

    if (allVerbs.includes(input)) {
      setInputVerbs((currentInputVerbs) => [...currentInputVerbs, input]);

      if (regularVerbs1.includes(input)) {
        setVerbType('REGULIERS_1');

      } else if (regularVerbs2.includes(input)) {
        setVerbType('REGULIERS_2');

      } else if (irregularVerbs.includes(input)) {
        setVerbType('IRREGULIERS');
      }

      setErrorMessage('');
      setRenderState(105);

    } else {
      setErrorMessage('Invalid entry. Try again.')
    }
  }

  const handleSecondButtons = (reg1_or_reg2) => {

    let verb_type = reg1_or_reg2 === 1 ?
      'REGULIERS_1' : 'REGULIERS_2';
    
    setVerbType(verb_type);
    setRenderState(103);
  }

  const handleNumberOfVerbs = (e) => {
    e.preventDefault();
    const input = e.target.elements.number_of_verbs.value;
    setHowMany(input);

    setRenderState(104);
  }

  const handleWhichVerbs = (e) => {
    e.preventDefault();
    let verb_input = e.target.elements.which_verbs.value.toUpperCase();
  
    if ((Object.keys(answersTemplate[verbType])).includes(verb_input)) {

      setInputVerbs([...inputVerbs, verb_input]);
      setErrorMessage('');

      setIterator((currentIterator) => {
        const newIterator = currentIterator + 1;
        if (newIterator === parseInt(howMany)) {
          setHowMany(0);
          setIterator(0);
          setRenderState(105);
        }
        return newIterator;
      })
    
    e.target.reset();

    } else {
      setErrorMessage('Invalid entry. Try again.')
    }
  };  

  const handleRestart = () => {
    window.location.reload();
  }

  return (
    <div>

      {renderState === 101  && (
        <div>

          <div className="buttons">
            <button type='button' onClick={() => handleFirstButtons(1)}>
              Regular Verbs
            </button>
            <button type='button' onClick={() => handleFirstButtons(2)}>
              IrregularVerbs
            </button>
          </div>
        
          <form onSubmit={(e) => handleFormVerbInput1(e, 'GENERAL_VERB')}>
            <label>Or enter the verb to check the Answer Key: </label>
            <input type='text' name='verb_input_1' required></input>
          </form>

          <div className="error-message">
            {errorMessage}
          </div>

        </div>
      )}

      {renderState === 102 && (
        <div className="buttons">
          <button type='button' onClick={() => handleSecondButtons(1)}>
            Regular Verbs 1 (-ER)
          </button>
          <button type='button' onClick={() => handleSecondButtons(2)}>
            Regular Verbs 2 (-IR)
          </button>
        </div>
      )}

      {renderState === 103 && (
        <div>
          <form onSubmit={handleNumberOfVerbs}>
            <label>How many verbs: </label>
            <input type='number' min='1' max='5' name='number_of_verbs' required></input>
          </form>
        </div>
      )}

      {iterator < howMany && renderState === 104 && (
        <div>

          <h1 className="available-verbs">Available verbs: </h1>

          {/* List of available verbs */}
          <ul className="lists">
            {(Object.keys(answersTemplate[verbType])).map((list_of_verbs, index) => <li key={index}>{list_of_verbs}</li>)}
          </ul>

          <form onSubmit={handleWhichVerbs}>
            <label>Type your verbs: </label>
            <input type='text' name='which_verbs' required></input>
          </form>

          <div className="error-message">
            {errorMessage}
          </div>

          {/* List of verbs chosen */}
          <ul className="verbs-tenses-names">
            {inputVerbs.map((inputVerb, index) => <li key={index}>{'Verb ' + (index + 1) + ':'} {inputVerb}</li>)}
          </ul>
          
        </div>
      )}

      {renderState === 105 && (
        <div>
          <div className="buttons-correction">
            <button onClick={handleRestart}>Restart App</button>
          </div>

          <Answers inputVerbs={inputVerbs} verbType={verbType} 
          answersTemplate={answersTemplate} />
        </div>
      )}
      
    </div>
  );
}

export default AnswerKey;
