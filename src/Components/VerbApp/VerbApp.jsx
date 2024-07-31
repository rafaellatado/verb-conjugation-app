import React, { useState, useEffect } from 'react';
import Conjugation from '../Conjugation/Conjugation';
import './verbApp.css';

const VerbApp = () => {
  
  // Initial states
  const [allVerbs, setAllVerbs] = useState([]);
  const [regularVerbs1, setRegularVerbs1] = useState([]);
  const [regularVerbs2, setRegularVerbs2] = useState([]);
  const [irregularVerbs, setIrregularVerbs] = useState([]);
  const [answersTemplate, setAnswersTemplate] = useState({});

  // Other states
  const [renderState, setRenderState] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const [verbType, setVerbType] = useState('');
  const [verbList, setVerbList] = useState('');
  const [howMany, setHowMany] = useState(0);
  const [iterator, setIterator] = useState(0);
  const [inputVerbs, setInputVerbs] = useState([]);
  const [inputTenses, setInputTenses] = useState([]);

  const verbTenses = ['PRÉSENT', 'PASSÉ COMPOSÉ', 'IMPARFAIT', 'PLUS-QUE-PARFAIT', 'FUTUR SIMPLE'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        /* const response = await fetch('../../answers/answers.txt'); */
        /* const response = await fetch('/answers/answers.txt'); */
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
      setRenderState(2);
      setVerbType('');
      setErrorMessage('');

    } else if (reg_or_irreg === 2) {
      setRenderState(3);
      setVerbType('IRREGULIERS');
      setVerbList(irregularVerbs);
      setErrorMessage('');
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
      setRenderState(5);

    } else {
      setErrorMessage('Invalid entry. Try again.')
    }
  }

  const handleSecondButtons = (reg1_or_reg2) => {

    /* define verbType for further correction when accessing answersTemplate. 
    This object will be different for each further language added */
    let verb_type = reg1_or_reg2 === 1 ?
      'REGULIERS_1' : 'REGULIERS_2';  
    setVerbType(verb_type);

    /* I do this to use the lists of verbs. This is done for scalibility. 
    When I add more languages to the app, my objects will have different verb type names, 
    but my lists of verbs will be in english. Ex: regularVerbs1, regularVerbs2 and irregularVerbs. */
    if (reg1_or_reg2 === 1) {
      setVerbList(regularVerbs1);
    } else {
      setVerbList(regularVerbs2);
    };

    setRenderState(3);
  }

  const handleNumberOfVerbs = (e) => {
    e.preventDefault();
    const input = e.target.elements.number_of_verbs.value;
    setHowMany(input);

    setRenderState(4);
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
          setRenderState(5);
        }
        return newIterator;
      })
    
    e.target.reset();

    } else {
      setErrorMessage('Invalid entry. Try again.')
    }
  };  

  const handleNumberOfTenses = (e) => {
    e.preventDefault();
    let input = e.target.elements.number_of_tenses.value;
    setHowMany(input);

    setRenderState(6);
  }

  const handleWhichTenses = (e) => {
    e.preventDefault();
    const input = e.target.elements.which_tenses.value.toUpperCase();

    if (verbTenses.includes(input)) {
      setInputTenses([...inputTenses, input]);
      setErrorMessage('');

      setIterator((currentIterator) => {
        const newIterator = currentIterator + 1;
        if (newIterator === parseInt(howMany)) {
          setHowMany(0);
          setIterator(0);
          setRenderState(7);
        }

        return newIterator;
      })

    e.target.reset();

    } else {
      setErrorMessage('Invalid entry. Try again.')
    }
  }

  return (
    <div>

      {renderState === 1  && (
        <div>

          <div className="buttons">
            <button type="button" onClick={() => handleFirstButtons(1)}>
              Regular Verbs
            </button>
            <button type="button" onClick={() => handleFirstButtons(2)}>
              Irregular Verbs
            </button>
          </div>
        
          <form onSubmit={(e) => handleFormVerbInput1(e, 'GENERAL_VERB')}>
              <label>Or type a verb you want to conjugate: </label>
              <input type='text' name='verb_input_1' required></input>
          </form>

          <div className="error-message">
            {errorMessage}
          </div>

        </div>
      )}

      {renderState === 2 && (
        <div className="buttons">
          <button type='button' onClick={() => handleSecondButtons(1)}>
            Regular Verbs 1 (-ER)
          </button>
          <button type='button' onClick={() => handleSecondButtons(2)}>
            Regular Verbs 2 (-IR)
          </button>
        </div>
      )}

      {renderState === 3 && (
        <div>
          <form onSubmit={handleNumberOfVerbs}>
            <label>How many verbs: </label>
            <input type='number' min='1' max='5' name='number_of_verbs' required></input>
          </form>
        </div>
      )}

      {iterator < howMany && renderState === 4 && (
        <div>

          <h3 className="available-verbs">Available verbs: </h3>

          {/* List of available verbs */}
          <ul className="lists">
            {verbList.map((list_of_verbs, index) => <li key={index}>{list_of_verbs}</li>)}
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

      {renderState === 5 && (
        <div>

          {/* Verbs chosen */}
          <ul className="verbs-tenses-names">
            {inputVerbs.map((inputVerb, index) => <li key={index}>{'Verb ' + (index + 1) + ':'} {inputVerb}</li>)}
          </ul>

          <h1 className="available-tenses">Available Verb Tenses: </h1>

          {/* List of verb tenses */}
          <ul className="lists">
            {verbTenses.map((verbTense, index) => <li key={index}>{verbTense}</li>)}
          </ul>

          <form onSubmit={handleNumberOfTenses}>
            <label>How many verb tenses: </label>
            <input type='number' min='1' max='5' name='number_of_tenses' required></input>
          </form>

        </div>
      )}

      {renderState === 6 && (
        <div>

          {/* Verbs chosen */}
          <ul className="verbs-tenses-names">
            {inputVerbs.map((inputVerb, index) => <li key={index}>{'Verb ' + (index + 1) + ':'} {inputVerb}</li>)}
          </ul>

          <h1 className="available-tenses">Available Verb Tenses: </h1>

          {/* List of verb tenses */}
          <ul className="lists">
            {verbTenses.map((verbTense, index) => <li key={index}>{verbTense}</li>)}
          </ul>

          <form onSubmit={handleWhichTenses}>
            <label>Type your tenses: </label>
            <input type='text' name='which_tenses' required></input>
          </form>

          <div className="error-message">
            {errorMessage}
          </div>

          {/* Verb Tenses chosen */}
          <ul className="verbs-tenses-names">
            {inputTenses.map((inputTense, index) => <li key={index}>{'Verb tense ' + (index + 1) + ':'} {inputTense}</li>)}
          </ul>

        </div>
      )}  

      {renderState === 7 && (
        <Conjugation inputVerbs={inputVerbs} inputTenses={inputTenses} verbType={verbType} 
        answersTemplate={answersTemplate} />
      )}
      
    </div>
  );
}
 
export default VerbApp;
