# Force Directed Graph Visual

The general purpose of this project was becoming familiar with a some web frameworks/libraries and to display some skills I learned from my summer job.

#### Overview

I made a very basic data visualization of a force directed graph and constructed a Rails API server that transformed datasets into usable data for the React/D3 UI.

[Link to Live Demo](https://d3-graph-viz.herokuapp.com/)

![D3 Graph Gif](d3_visual.gif)

#### Features:

Force-Directed Graph implements zoom, drag, resizing, highlighting, selection opacity, and labeling. It also uses a React component to display node info in a side panel.

#### Datasets:

I wanted to show the flexibility of this application and how it can transform virtually any relational dataset into a detailed graph visualization. In this demo I used 2 datasets, one is a simple json file (miserables.json) and the other is a public mysql database with fake university data.

### Local Setup:

If you have Docker installed, try:

`docker-compose up`

Otherwise:

1. `bin/setup`
1. `rake start`
1. `http://localhost:3000`


### Technologies Used:

- Ruby on Rails
- React.js
- Data-Driven Documents (D3.js)
- Docker
