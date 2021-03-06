import React, { Component, MouseEvent } from "react";
import * as d3 from "d3";

import { Stage } from "./Stage"
import { ZoomContainer } from "./ZoomContainer"

import { DisplayNode } from "../interfaces";

interface State {
  paths: [],
  nodes: [],
  data: object,
  toggleChild: boolean,
}

interface Props {
  data: object,
  clickedNode: any | DisplayNode,
  selectNode: Function
}

interface Node {
  children: [],
  data: {
    _children?: DisplayNode[] | null,
    children: DisplayNode[] | null,
    pathWeight: number,
    displayWeight?: number,
    state?: object,
    name?: string
  },
  depth: number,
  height: number,
  parent: DisplayNode | null,
  x: number,
  y: number
}

interface Path {
  target: {
    data: DisplayNode
  },
  source: {
    data: DisplayNode
  }
}

class LeftPanel extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      paths: [],
      nodes: [],
      data: {},
      toggleChild: true,
    }

    this.toggleChildren = this.toggleChildren.bind(this);
  }

  toggleChildren(d: Node) {

    if (d.data.children) {
      d.data._children = d.data.children;
      d.data.children = null;
    } else {
      d.data.children = d.data._children;
      d.data._children = null;
    }

    this.setState({
      toggleChild: !this.state.toggleChild
    })
  }
  render() {
    // Legend
    const svgLegend = d3.select('#legend');
    // Legend Shapes
    svgLegend.append("circle").attr("cx", 1500).attr("cy", 1000).attr("r", 300).style("stroke", 'white').style("fill", "none").style("stroke-width", '50px')
    svgLegend.append("rect").attr("x", 1250).attr("y", 1700).attr("width", 525).attr("height", 525).style("stroke", 'white').style("fill", "none").style("stroke-width", '50px')
    svgLegend.append("circle").attr("cx", 1500).attr("cy", 3000).attr("r", 300).style("fill", "#1E3677")
    svgLegend.append("circle").attr("cx", 1500).attr("cy", 4000).attr("r", 300).style("fill", "#55BEC7")
    svgLegend.append("circle").attr("cx", 1500).attr("cy", 5000).attr("r", 300).style("fill", "#F6780D")
    // Legend Descriptions
    svgLegend.append("text").attr("x", 2000).attr("y", 1000).text("Non-Stateful").style("font-size", "600px").attr("alignment-baseline", "middle").style("fill", "white").style("stroke-width", '3px')
    svgLegend.append("text").attr("x", 2000).attr("y", 2000).text("Stateful").style("font-size", "600px").attr("alignment-baseline", "middle").style("fill", "white").style("stroke-width", '3px')
    svgLegend.append("text").attr("x", 2000).attr("y", 3000).text("No Relation").style("font-size", "600px").attr("alignment-baseline", "middle").style("fill", "white").style("stroke-width", '3px')
    svgLegend.append("text").attr("x", 2000).attr("y", 4000).text("Medium Relation").style("font-size", "600px").attr("alignment-baseline", "middle").style("fill", "white").style("stroke-width", '3px')
    svgLegend.append("text").attr("x", 2000).attr("y", 5000).text("High Relation").style("font-size", "600px").attr("alignment-baseline", "middle").style("fill", "white").style("stroke-width", '3px')
    // Legend Placement
    svgLegend.attr("x", -500)
    svgLegend.attr("y", -500)

    // data from the backend from hooking into react devtools
    const stateData = this.props.data;

    // sets the heights and width of the tree to be passed into treemap

    const width = 500;
    const height = 1550;


    // creating the tree map 
    // setting the size based on width and heights declared above 
    const treeMap = d3.tree().nodeSize([width, height]);
    // creating the nodes of the tree 
    const hierarchyNodes = d3.hierarchy(stateData);
    // calling tree function with nodes created from data
    const finalMap = treeMap(hierarchyNodes)
    // returns a flat array of objects containing all the parent-child links
    // this will render the paths onto the component
    let paths = finalMap.links();
    // returns a flat array of objects
    // this will render the nodes onto the component
    let nodes = hierarchyNodes.descendants();


    // put paths (the lines on the graph) before & because render goes before component did mount 
    paths = paths && paths.map((el: Path, i: number) => {

      let d = d3
        // link vertical makes our entire tree go top to bottom as opposed to left to right 
        .linkVertical()
        .x((d) => {
          return d.x + 8000;
        })
        .y((d) => {
          return d.y - 900;
        });

      return <path key={i}
        className='link'
        fill="none"
        stroke={
          el.target.data.pathWeight === 0 ? '#BDBDBD' :
            el.target.data.pathWeight === 0.5 ? '#55BEC7' : '#F6780D'
        }
        strokeWidth={
          el.target.data.pathWeight === 0 ? '35px' :
            el.target.data.pathWeight === 0.5 ? '70px' : '70px'
        }
        d={d(el)} />
    })

    // renders the nodes (the circles) to the screen
    nodes = nodes && nodes.map((node: Node, i: number) => {
      return <g
        key={i} transform={`translate(${node.x + 8000}, ${node.y - 900})`}
        onClick={() => this.props.selectNode(node.data)}
        onDoubleClick={() => this.toggleChildren(node)}
      >

        {/* Change shape of node depending on if it is stateful or not*/}
        {/* Also changes the color of the node depending on displayWeight */}

        {node.data.state !== null ?
          <rect x="-150" y="0" width="300" height="300"
            style={{
              'stroke':
                node.data === this.props.clickedNode ? '#BDBDBD' :
                  node.data.pathWeight === 0 && node.data.displayWeight === 0 ? '#FFFAFA' :
                    node.data.pathWeight === 1 || node.data.displayWeight === 1 ? '#F6780D' : '#55BEC7',
              'strokeWidth': '25px',
              'fill':
                node.data.displayWeight === 0 ? '#1E3677' :
                  (node.data.displayWeight === 0.5 ? '#55BEC7' : '#F6780D'),
              'opacity': '1',
              'cursor': 'pointer',
            }}

            onMouseOver={
              (e: any) => {
                e.target.setAttribute('height', '600');
                e.target.setAttribute('width', '600')
              }}
            onMouseOut={
              (e: any) => {
                e.target.setAttribute('height', '300');
                e.target.setAttribute('width', '300')
              }}
          />
          :
          <circle r="150"
            style={{
              'stroke':
                node.data === this.props.clickedNode ? '#BDBDBD' :
                  node.data.pathWeight === 0 ? '#FFFAFA' :
                    node.data.pathWeight === 0.5 ? '#55BEC7' : '#F6780D',
              'strokeWidth': '25px',
              'fill':
                node.data.displayWeight === 0 ? '#1E3677' :
                  (node.data.displayWeight === 0.5 ? '#55BEC7' : 'F6780D'),
              'cursor': 'pointer',
              'opacity': '1'
            }}

            onMouseOver={(e: any) => { e.target.setAttribute('r', '300') }}
            onMouseOut={(e: any) => { e.target.setAttribute('r', '150') }}
          />
        }

        {node.data.state !== null ?
          <text className="text"
            x="220"
            y="400"
            style={{
              'fill': "#FFFAFA",
              'fontSize': '300px',
            }}
            textAnchor="start">
            {node.data.name}
          </text> :
          <text className="text"
            x="200"
            y="250"
            style={{
              'fill': "#FFFAFA",
              'fontSize': '300px',
            }}
            textAnchor="start">
            {node.data.name}
          </text>
        }
      </g>
    })


    return (
      <div className="leftPanel">
        <h1 className="title">Component Tree</h1>
        <Stage width="100vw" height="100vh">
          <svg id='legend' transform={`translate(0,0), scale(1)`} width="10000" ></svg>
          <ZoomContainer>
            {paths}
            {nodes}
          </ZoomContainer>
        </Stage>
      </div>
    )
  }
}

export default LeftPanel;