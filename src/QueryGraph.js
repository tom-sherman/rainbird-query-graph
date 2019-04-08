import React, { Component } from "react";
import {
  Sigma,
  RandomizeNodePositions,
  RelativeSize,
  ForceAtlas2,
  NOverlap,
  ReactSigmaLayoutPlugin
} from "react-sigma";
import ForceLink from 'react-sigma/lib/ForceLink'
import debounce from "debounce";
import { getGraph } from "./parse";

export class QueryGraph extends Component {
  state = {
    height: window.innerHeight
  };

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions);
  }

  updateDimensions = debounce(() =>
    this.setState({
      height: window.innerHeight
    })
  );

  render() {
    if (!this.props.code) {
      return null;
    }

    const { nodes, edges } = getGraph(this.props.code);
    console.log(nodes, edges);

    return (
      <div className={'query-graph'}>
        <Sigma
          graph={{ nodes, edges }}
          settings={{ drawEdges: true, clone: false }}
          style={{ height: `${this.state.height}px` }}
        >
          <RelativeSize initialSize={15} />
          <RandomizeNodePositions />
          <ForceLink nodeSiblingsAngleMin={1} alignNodeSiblings={true}>
            <NOverlap gridSize={50} maxIterations={100} />
          </ForceLink>
        </Sigma>
      </div>
    );
  }
}
