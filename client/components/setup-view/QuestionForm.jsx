import React from 'react'; 
import QuestionEntry from './Question-Entry.jsx';

class QuestionForm extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      inputNum = 3, 
      inputs = []
    }
  }

  render () {
  return (
      <div>
        {this.state.inputs.map(function(num) {
          <QuestionEntry key={num}/>
        })}
        <button onClick={() => {this.inputs.push(inputNum++)}}> + </button>
      </div>
    ); 
  }
}

export default QuestionForm; 