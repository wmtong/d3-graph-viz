import React, { Component } from 'react';

class Panel extends Component {
  constructor(props) {
    super(props);
    this.state = { isModalOpen: false } // doesn't do anything for now
  }

  render() {
    let nodeList = [];
    // create list of properties and put them into table cells
    if(this.props.current_node){
      const node = this.props.current_node;
      for (let n in node) {
        if(n==='index') break; // don't want this extra coordinate info
        if(n==='slug') continue;
        nodeList = nodeList.concat((<tr className='node-detail' key={n}>
          <td className='panel-cell'> {n.replace(/_/g, ' ')} </td>
          <td className='panel-cell value'> {node[n]} </td>
        </tr>));
      }
    }

    return (
      <div>
        <h3 className='panel-title'> {this.props.current_node.slug || this.props.current_node.id} </h3>
        <table className='panel-table'>
          <tbody>
            {nodeList}
          </tbody>
        </table>
        <br />
        <br />
        <span><button className='button close' onClick={
          this.props.close_handler
        }>Close</button></span>
      </div>
    )
  }
};

export default Panel;
