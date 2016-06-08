import React from 'react'; 
import { browserHistory } from 'react-router'; 
import $ from 'jquery'; 


import SetupForm from './record-instructions.jsx';
import QuestionForm from './QuestionForm.jsx'; 

class Setup extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      allPractices: [' '], 
      allQuestions: [],
      practiceId: null
    }
  }

  componentWillMount () {
    this.getAllPractices(); 
  }

  getAllPractices () {
    $.ajax({
      type: 'GET',
      url: 'api/practice',
      sucesss: function(data) {
        if (data) {
          this.setState({allPractices : data}); 
        }
      },
      error: function (error) {
        console.log('error in getting practices from DB', error); 
      }
    }); 
  }

  selectPractice (val) {
    console.log(val); 
    $.ajax({
      type: 'GET',
      url: '/practice',
      data: val,
      success: (data) => {
        this.setState({practiceId: data.id}); 
      }
    })
  }

  saveQuestions (e, index) {
    console.log(e.target.value); 
    //editing questions and keys
    this.state.allQuestions[index] = e.target.value;
    console.log('allQs', this.state.allQuestions); 
  }

  formSubmit () {
    var formData = {
      // add logic for setting this data by dropdown or by form fields
     title: $('.record-title')[0].value,
     subject: $('.record-subject')[0].value,
     description: $('.record-description')[0].value,
     questions: this.state.allQuestions,
     practiceId: this.state.practiceId
    }

    $.ajax({
      type: 'POST',
      url: '/api/practice',
      data: formData,
      success: function(newPractice) {
        console.log('New Session: ' + newPractice.id);
        browserHistory.push('/record/' + this.state.practiceId.toString()); 
      }.bind(this),
      error: function(error) {
        console.error('practice creation error', error)
      },
      dataType: 'json'
    });
  }

  

  render () {
    return (
      <div className='setup'>
        <h2> Use existing practice </h2>
        <select onChange={this.selectPractice.bind(this)}> 
          {this.state.allPractices.map(function (val) {
            return (<option value={val}>{val}</option>)
          })}
        </select>
        <h2> Create new practice </h2>
        <SetupForm formSubmit={this.formSubmit.bind(this)}/>
        <QuestionForm saveQuestions={this.saveQuestions.bind(this)}/>
        <button onClick={this.formSubmit.bind(this)}>Start practicing!</button>
      </div>
    )
  }
}

export default Setup; 