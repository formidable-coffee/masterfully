import React from 'react';
import ReactDom from 'react-dom';
import NavBar from './NavBar.jsx';
import Footer from './Footer.jsx';
import Setup from '../setup-view/SetupView.jsx';

export default class MainLayout extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="main-layout">
        <NavBar />
        {this.props.children}
        <Setup />
        <Footer />
      </div>
    )
  }
}