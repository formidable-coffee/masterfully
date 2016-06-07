import React from 'react';
import ReactDom from 'react-dom';


export default (props) => (
  <div className="record-instructions pure-u-1-1">
  <h2> What would you like to practice? </h2>
  	<form action='' className="pure-form">
	    <fieldset id="pure-form-group" className="pure-group">
	        <input type="text"  name='title' className="record-title record-form-input pure-input-1-2" placeholder="Title"></input>
	        <input type="text"  name='subject' className="record-subject record-form-input pure-input-1-2" placeholder="Subject"></input>
	        <textarea name='description' className="record-description record-form-input pure-input-1-2" placeholder="Description"></textarea>
	    </fieldset>
		</form>
  </div>
);