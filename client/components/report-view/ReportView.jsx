import $ from 'jquery';
import React from 'react';
import ReactDom from 'react-dom';
import {Line as LineChart} from 'react-chartjs';
import {Radar as RadarChart} from 'react-chartjs';
import speechInterpretations from '../../../data/speech-interpretations.json';

const options = {
  scaleShowGridLines: true,
  scaleGridLineColor: 'rgba(0,0,0,.05)',
  scaleGridLineWidth: 1,
  scaleShowHorizontalLines: true,
  scaleShowVerticalLines: true,
  bezierCurve: true,
  bezierCurveTension: 0.4,
  pointDot: true,
  pointDotRadius: 4,
  pointDotStrokeWidth: 1,
  pointHitDetectionRadius: 20,
  datasetStroke: true,
  datasetStrokeWidth: 2,
  datasetFill: true,
  legendTemplate: '<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'
}

const styles = {
  graphContainer: {
    margin: 'auto',
    'letter-spacing': 'normal',
    // border: '1px solid black',
    // padding: '15px'
    'padding-bottom': '50px' 
  },
  textContainer: {
    width: '800px',
    margin: 'auto'
  },
  text: {
    color: '#34495e'
  }
}

export default class ChartComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      text: '',
      expressions: {
        labels: ['Sadness', 'Disgust', 'Anger', 'Surprise', 'Fear', 'Happiness'],
        datasets: [
          {
            label: 'Expressions',
            backgroundColor: 'rgba(179,181,198,0.2)',
            borderColor: 'rgba(179,181,198,1)',
            pointBackgroundColor: 'rgba(179,181,198,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(179,181,198,1)',
            data: []
          }
        ]
      },
      mood: {
        labels: [],
        datasets: [
          {
            label: 'Mood TimeLine',
            fillColor: 'rgba(220,220,220,0.2)',
            strokeColor: 'rgba(220,220,220,1)',
            pointColor: 'rgba(220,220,220,1)',
            pointStrokeColor: '#fff',
            pointHighlightFill: '#fff',
            pointHighlightStroke: 'rgba(220,220,220,1)',
            data: []
          }
        ]
      },

      speech: {
        labels: [],
        datasets: [
          {
            label: 'Speech',
            backgroundColor: 'rgba(179,181,198,0.2)',
            borderColor: 'rgba(179,181,198,1)',
            pointBackgroundColor: 'rgba(179,181,198,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(179,181,198,1)',
            data: []
          }
        ]
      }
    }
  }

  componentDidMount () {
    this._getSnapshot.bind(this)();
    this._getSpeech.bind(this)();
  }

  _getSnapshot () {
    $.ajax({
      type: 'GET',
      url: '/api/snapshot',
      data: { sessionId: this.props.params.sessionId },
      error: function(request, status, error) {
        console.error('error while fetching SNAPSHOT report data', error);
      },
      success: function(sessionData) {
        console.log(sessionData);

        var sadness    = 0;
        var disgust    = 0;
        var anger      = 0;
        var surprise   = 0;
        var fear       = 0;
        var happiness  = 0;
        var dataLength = sessionData.length;
        var moodLabel  = [];

        for (var i=1; i <= dataLength; i++) {
          moodLabel.push(i);
        }
        var moodData = Object.assign({}, this.state.mood);
        var expressionsData = Object.assign({}, this.state.expressions);

        sessionData.forEach(ss => {
          moodData.datasets[0].data.push(ss.mood);

          sadness   += ss.sadness;
          disgust   += ss.disgust;
          anger     += ss.anger;
          surprise  += ss.surprise;
          fear      += ss.fear;
          happiness += ss.happiness;
        });

        if (dataLength === 0) {
          dataLength = 1;
        }
        moodData.labels = moodLabel;
        expressionsData.datasets[0].data = [
          Math.floor(sadness   /dataLength), 
          Math.floor(disgust   /dataLength), 
          Math.floor(anger     /dataLength),
          Math.floor(surprise  /dataLength), 
          Math.floor(fear      /dataLength), 
          Math.floor(happiness /dataLength)
        ];
        
        this.setState({expressions: expressionsData, mood: moodData});
      }.bind(this)
    });
  }

  _getSpeech () {
    $.ajax({
      type: 'GET',
      url: '/api/speech',
      data: { sessionId: this.props.params.sessionId},
      error: function(request, status, error) {
        console.error('Error while fetching SPEECH report data', error);
      },
      success: function(sessionData) {
        // console.log('SPEECH DATA ====>', sessionData);
        // get greatest 5 data points
          // put into array
          var tmpArr = [];
          for (var mood in sessionData.speechData) {
            tmpArr.push([mood, sessionData.speechData[mood]]);
          }
          // sort array
          tmpArr.sort(function(a, b) {
            return b[1] - a[1];
          });
          // get first 5 elements
          tmpArr = tmpArr.slice(0,5);

        // populate state with data
        var speechData = Object.assign({}, this.state.speech);
        var speechScores = [];
        var speechLabels = [];

        for (var i = 0; i < tmpArr.length; i++) {
          speechLabels.push(tmpArr[i][0]);
          speechScores.push(tmpArr[i][1]);
        }
        speechData.datasets[0].data = speechScores;
        speechData.labels = speechLabels;

        // text = 
        // add to state
        this.setState({ speech: speechData });
        var text = speechInterpretations[this.state.speech.labels[0]].high || speechInterpretations[this.state.speech.labels[0]].description;
        this.setState({ text: text });
        console.log(this.state);
      }.bind(this)
    })
  }

  render() {
    return (
      <div>
        <div style={styles.textContainer}>
          <h2>{ this.state.text }</h2>
        </div>
        <div style={styles.graphContainer}>
          <h3 style={styles.text}>Mood Chart</h3>
          <LineChart data={this.state.mood}
            redraw options={options}
            width="600" height="250"/>
        </div>
        <div className="pure-g">
          <div className="pure-u-2-1" style={styles.graphContainer}>
            <h3 style={styles.text}>Expressions Chart</h3>
            <RadarChart data={this.state.expressions}
              redraw options={options}
              width="600" height="250"/>
          </div>
          <div className="pure-u-2-1" style={styles.graphContainer}>
            <h3 style={styles.text}>Speech Chart</h3>
            <RadarChart data={this.state.speech}
              redraw options={options}
              width="600" height="250"/>
          </div>
        </div>
      </div>
    )
  }
}

