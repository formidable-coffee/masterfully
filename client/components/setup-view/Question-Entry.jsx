import React from 'react'; 
import QuestionEntry from './Question-Entry.jsx';

export default (props) => (
  <div>
    <input className='question-input pure-input-1-2' type='text' onBlur={(e) => props.saveQuestions(e, props.key)}></input>
  </div>
)