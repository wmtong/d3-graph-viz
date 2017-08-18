import React, { Component } from 'react';
import Graph from './Graph';
import './App.css';

class App extends Component {

  constructor() {
    super();
    this.state = {
      data: 'Miserables',
      nodes: null,
      links: null,
      width: '0',
      height: '0',
      badRequest:false
    };
    this.changeToMiserables = this.changeToMiserables.bind(this);             // handler for checkbox toggle
    this.changeToUniversity = this.changeToUniversity.bind(this);             // handler for checkbox toggle
    this.apiRequest = this.apiRequest.bind(this);                           // handler for request to rails api
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);   // handler for window resizing
  }

  componentDidMount() {
    this.updateWindowDimensions();
    this.apiRequest(this.state.data);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  render() {
    let contentContainer = null;
    if(this.state.nodes && this.state.links) {
      contentContainer =  (
        <div>
          <Graph
            nodes={this.state.nodes}
            links={this.state.links}
            width={this.state.width}
            height={this.state.height} />
        </div>
      );
    } else {
      contentContainer = <div>Loading...</div>;
    }

    return (
      <div className='App'>
        <div className='App-header'>
          <h1> Visualization: {this.state.data}  </h1>
          <button className='button miserables' onClick={() => this.changeToMiserables()}>
            Miserables
          </button>
          &nbsp;
          <button className='button university' onClick={() => this.changeToUniversity()}>
            University
          </button>
        </div>
        <div className='App-body'>
          {contentContainer}
        </div>
      </div>
    );
  }

  changeToUniversity() {
    this.apiRequest('University');
  }

  changeToMiserables() {
    this.apiRequest('Miserables');
  }

  apiRequest(data) {
    // fetching all the json data from api
    let nodeUrl = data === 'Miserables' ?  'miserables.json' : 'api/university_data';
    fetch(nodeUrl)
      .then((response) => {
        if (response.status >= 400) {
          console.log(response);
          this.setState({ badRequest: response })
          throw new Error('Bad response from server');
        }
        return response.json();
      })
      .then((nodeLinkData) => {
        this.setState({ nodes: nodeLinkData.data.nodes, links: nodeLinkData.data.links, data: data});
      })
      .catch((e) => {
        console.log(e.toString());
      });
      window.addEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

}

export default App;
