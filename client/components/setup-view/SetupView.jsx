import React from 'react'; 
import { browserHistory } from 'react-router'; 
import $ from 'jquery'; 


import SetupForm from './record-instructions.jsx';
import QuestionForm from './QuestionForm.jsx'; 

class Setup extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      allSessions: []
    }
  }

  componentDidMount () {
    this.getAllSessions(); 
  }
  //post data from setup form to database
  //on success redirect to record page
  getAllSessions () {
    $.ajax({
      type: 'GET',
      url: 'api/practice',
      sucesss: function(data) {
        this.state.allSessions = data; 
      },
      error: function (error) {
        console.log('error in getting practices from DB', error); 
      }
    }); 
  }

  formSubmit () {
    var formData = {
     title: $('.record-title')[0].value,
     subject: $('.record-subject')[0].value,
     description: $('.record-description')[0].value,
    }

    $.ajax({
      type: 'POST',
      url: '/api/practice',
      data: formData,
      success: function(newPractice) {
        console.log('New Session: ' + newPractice.id);
        browserHistory.push('record'); 
      }.bind(this),
      error: function(error) {
        console.error('practice creation error', error)
      },
      dataType: 'json'
    });
  }

  selectPractice (e) {
    practice = e.target.value;
    //save current practice to main? 
  }

  render () {
    return (
      <div className='setup'>
        <h2> Use existing practice </h2>
        <select onChange={this.selectPractice.bind(this)}> 
          {this.state.allSessions.map(function (val) {
            return (<option value={val}>val</option>)
          })}
        </select>
        <h2> Create new practice </h2>
        <SetupForm formSubmit={this.formSubmit.bind(this)}/>
        <QuestionForm />
        <button onClick={this.formSubmit.bind(this)}>Start practicing!</button>
      </div>
    )
  }
}

export default Setup; 