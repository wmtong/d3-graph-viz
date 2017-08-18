import React, { Component } from 'react';
import Panel from './Panel';
import * as d3 from 'd3';

class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      current_node: null
    };
    this.close_handler = this.close_handler.bind(this);    // handler for closing panel
    this.createD3Logic = this.createD3Logic.bind(this);    // handler for instantiation of d3 elements
    this.setState = this.setState.bind(this)
  }

  componentDidMount() {
    this.createD3Logic(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.createD3Logic(nextProps);
  }

  render() {
    // if this.state.current_node hasn't been set (no nodes selected)
    // then the sidePanel shouldn't show up yet
    let panel = null;
    if (this.state.current_node && this.state.isModalOpen) {
      panel = <div className='panel'>
              <Panel view_handler = {this.view_handler} close_handler = {this.close_handler} current_node={this.state.current_node}/>
            </div>;
    }
    return (
      <div className='d3-wrapper'>
        <div className='graph' ref='mountPoint' />
        {panel}
      </div>
    )
  }

  // handler for closing panel
  close_handler(e) {
    e.preventDefault();
    this.setState({
      isModalOpen: false
    });
  }

  createD3Logic(props) {
    // props that are fed into Graph in App.js
    let { nodes, links, width, height} = props;

    const headerHeight = 140;
    height -= headerHeight;

    // if no links, doesn't crash
    if(!links) links = [];
    if(!nodes) nodes = [];

    /*
    initialize all constants
    */
    var color = d3.scaleOrdinal(d3.schemeCategory10);

    const normalState = 'normal'
        , selectedState = 'selected'
        , normal_opacity = 1
        , min_zoom = 0.5
        , max_zoom = 7;

    /*
    initialize simulation, zoom, and drag logic
    */
    const simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id( d => d.id ))
      .force('charge', d3.forceManyBody().strength(-210))
      .force('center', d3.forceCenter(width / 2, height/2))
      .force('x', d3.forceX(0))
      .force('y', d3.forceY(0));

      simulation
      .nodes(nodes)
      .force('link')
      .links(links);

     simulation.on('tick', () => {

      node.attr('transform', (d) => 'translate(' + d.x + ',' + d.y + ')');
      text.attr('transform', (d) => 'translate(' + d.x + ',' + d.y + ')');

      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);

      node
        .attr('cx', (d) => d.x)
        .attr('cy', (d) => d.y);

    });


    /*
    creates all d3 dom elements
    */
    d3.select(this.refs.mountPoint).selectAll('*').remove();
    const svg = d3.select(this.refs.mountPoint)
      .append('svg')
      .attr('id', 'd3-svg')
      .attr('width', width)
      .attr('height', height)

    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .style('fill', 'none')
      .style('pointer-events', 'all');

    // container to hold links, nodes, labels
    const container = svg.append('g');

    const link = container.append('g')
      .attr('class', 'links')
      .selectAll('.link')
      .data(links)
      .enter()
      .append('line')
      .attr('class', 'link')
      .style('stroke-width', (d) => Math.sqrt(d.value));

    const node = container.append('g')
      .attr('class', 'nodes')
      .selectAll('.node')
      .data(nodes)
      .enter().append('g')
      .attr('class', 'node')

      node
      .append('circle')
      .attr('r', (d) => nodeSizes(d, normalState))
      .style('fill', (d) => color(d.group));

    const text = container.append('g').attr('class', 'labels').selectAll('g')
      .data(nodes)
      .enter().append('g')
      .append('text')
      .attr('x', 12)
      .attr('y', '.31em')
      .style('font-family', 'sans-serif')
      .style('font-size', '0.5em')
      .text(d => d.slug || d.id);

    // const legend_container = svg.append('g')
    //   .attr('transform', 'translate(-20,30)')
    //   .attr('fill', 'white')
    //   .append('rect')
    //     .attr('height', 118)
    //     .attr('width', 115)
    //     .attr('x', 40)
    //     .attr('y', -10)
    //     .attr('fill', 'white')
    //     .style('stroke-width', 4)
    //     .attr('stroke', '#7bc143')
    //     .style("stroke-linejoin", "round");

    // const legend = svg.append('g')
  	//   .attr('class', 'legend')
  	//   .attr('height', 80)
  	//   .attr('width', 80)
    //   .attr('transform', 'translate(-20,30)');
    //
    // legend.selectAll('rect')
    //   .data(legendData)
    //   .enter()
    //   .append('rect')
	  // .attr('x', 50)
    //   .attr('y', (d, i) => i *  18)
	  // .attr('width', 10)
	  // .attr('height', 10)
	  // .style('fill', (d) => d[1]);
    //
    // legend.selectAll('text')
    //   .data(legendData)
    //   .enter()
    //   .append('text')
	  // .attr('x', 75)
    //   .attr('y', (d, i) => i *  18 + 9)
	  // .text((d) => d[0]);

    // used to determine neighboring nodes for highlighting
    const linkedByIndex = {};
      links.forEach(function(d) {
          linkedByIndex[d.source.id + ',' + d.target.id] = 1;
      });

    const self = this;
    // actions to control highlighting
    node
    .on('mouseover', function(d) {
      mouseOver(d, node, text, link, linkedByIndex, selectedState, this);
    })
    .on('mousedown', function(d)  {  // fades 'other' nodes into background
      mouseDown(d, node, text, link, linkedByIndex, selectedState, this, self.setState);
    })
    .on('mouseout', function(d){    // back to normal
      mouseOut(d, node, text, link, normalState, this);
    });

    const zoom = d3.zoom()
      .scaleExtent([min_zoom,max_zoom])
      .on('zoom',() => container.attr('transform', d3.event.transform));

    const drag = d3.drag()
      .subject((d) => d )
      .on('start', (d) =>
        dragstarted(d, this.state.simulation, this.setState)
      )
      .on('drag', function(d) {
        dragged(d, node, text, link, linkedByIndex, this)
      })
      .on('end', function(d) {
        dragended(d, node, text, link, simulation, normal_opacity, normalState, this)
      });

    // placed after mouse actions so that d3 doesn't override them
    node.call(drag);
    svg.call(zoom);

    // controls resizing actions for svg and centers the graph
    window.addEventListener('resize', () => {
        svg
          .attr('width', window.innerWidth)
          .attr('height', window.innerHeight - headerHeight);
        simulation
          .force('center')
            .x(window.innerWidth / 2)
            .y((window.innerHeight - headerHeight) / 2)
        simulation.alphaTarget(0);
      }
    );

    this.setState( {simulation, current_node: null});
  }
};

export default Graph;

/*
*   Helper functions that isolate d3 logic
*/

// drag events
function dragstarted(d, simulation, setState) {
  d3.event.sourceEvent.stopPropagation(); // silence other listeners
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
  // set current node to whichever is clicked
  setState({ current_node: d });
}

function dragged(d, node, text, link, linkedByIndex, that){
  d.fx = d3.event.x;
  d.fy = d3.event.y;

  node.classed('node-active', (o) => setOpacity(d, o, linkedByIndex, that));
  text.classed('text-active', (o) => setOpacity(d, o, linkedByIndex, that));
  link.classed('link-active', (o) => o.source.id === d.id || o.target.id === d.id ? true : false);
}

function dragended(d, node, text, link, simulation, normal_opacity, state, that) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
  node.style('opacity', normal_opacity)
      .classed('node-active', false);
  text.style('opacity', normal_opacity)
      .classed('text-active', false);
  link.style('opacity', normal_opacity)
      .classed('link-active', false);
  d3.select(that).select('circle').transition()
      .duration(500)
      .attr('r', (d) => nodeSizes(d, state));
}

// mouse events
function mouseOver(d, node, text, link, linkedByIndex, state, that){   // highlights node and its neighbors
  node.classed('node-active', (o) => setOpacity(d, o, linkedByIndex, that));
  text.classed('text-active', (o) => setOpacity(d, o, linkedByIndex, that));
  link.classed('link-active', (o) => o.source.id === d.id || o.target.id === d.id ? true : false);

  d3.select(that).classed('node-active', true);
  d3.select(that).classed('text-active', true);
  d3.select(that).select('circle').transition()
      .duration(500)
      .attr('r', (d) => nodeSizes(d, state));
}

function mouseDown(d, node, text, link, linkedByIndex, state, that, setState) {
  const normal_opacity = 1
        , trans_opacity = 0.1
  d3.event.stopPropagation();
  d3.event.preventDefault();

  function setOpacity(o) {
      const thisOpacity = linkedByIndex[d.id + ',' + o.id] || linkedByIndex[o.id + ',' + d.id] || d.index === o.index ? normal_opacity : trans_opacity;
      return thisOpacity;
  };

  node.style('opacity', (o) => setOpacity(o));
  text.style('opacity', (o) => setOpacity(o));
  link.style('opacity', (o) =>  o.source.id === d.id || o.target.id === d.id ? normal_opacity : trans_opacity);

  d3.select(that).classed('node-active', true);
  d3.select(that).classed('text-active', true);
  d3.select(that).select('circle').transition()
      .duration(500)
      .attr('r', (d) => nodeSizes(d, state));

  setState({isModalOpen: true});
}

function mouseOut(d, node, text, link, state, that) {
  node.classed('node-active', false);
  text.classed('text-active', false);
  link.classed('link-active', false);

  d3.select(that).classed('node-active', false);
  d3.select(that).classed('text-active', false);
  d3.select(that).select('circle').transition()
      .duration(500)
      .attr('r', (d) => nodeSizes(d, state));
}

function setOpacity(d, o, linkedByIndex, that) {
    const thisOpacity = linkedByIndex[d.id + ',' + o.id] || linkedByIndex[o.id + ',' + d.id] || d.index === o.index ? true : false;
    that.setAttribute('fill-opacity', thisOpacity);
    return thisOpacity;
}

// controls resizing of nodes upon highlight/selection
function nodeSizes(d, type) {
  const normal_node_size = 8
      , selected_node_size = 11;


  const nodeSize = type === 'normal' ? normal_node_size : selected_node_size;
  return nodeSize;
}
