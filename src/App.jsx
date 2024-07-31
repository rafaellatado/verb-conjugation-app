import React, { useState } from 'react';
import VerbApp from './Components/VerbApp/VerbApp';
import AnswerKey from './Components/AnswerKey/AnswerKey';
/* import { useSelector, useDispatch } from 'react-redux';
import { setRenderState } from './features/renderState/renderStateSlice'; */
import './app.css'
 
function App() {

  /* const renderState = useSelector((state) => state.renderState.value);
  const dispatch = useDispatch(); */

  const [renderState, setRenderState] = useState(0);

  const handleButton = (app_or_keys) => {
    const newState = app_or_keys === 1 ? 1 : 101;
    /* dispatch(setRenderState(newState)); */
    setRenderState(newState);
  }
 
  return (
    <div className="App">

      <h1 className="app-title">Verb Conjugation App</h1>

      {renderState === 0 && (
        <div className="buttons">

          <button type='button' onClick={() => handleButton(1)}>
            Verb Conjugation
          </button>

          <button type='button' onClick={() => handleButton(101)}>
            Answer Keys
          </button>

        </div>
      )}

      {renderState === 1 && (
        <VerbApp />
      )}

      {renderState === 101 && (
        <AnswerKey />
      )}

    </div>  
  );
}

export default App;

/* 
- Aprender a usar React Modules (.module.css). Esse css geral fica confuso muito rápido.

- Na hora da conjugação de verbos, preciso ter um container centralizado, tanto
na doing it quanto no printing.

- Na hora da correção preciso que isso também esteja centralizado.

- Instead of "Type your verbs", let's try making the user click the verbs he wants.
Something like "Choose up until 5 verbs: ". Com a scrollbar sempre à mostra.
Botão de "Next" visível.

- "Choose up until 5 verb tenses: " com uma barra de rolagem que vai do 1 ao 5.

- About the verb tenses "Pick your x verb tenses: ". Clickable verb tenses here.

- Restart using Redux instead of page refresh.

- BackButton.
 */
