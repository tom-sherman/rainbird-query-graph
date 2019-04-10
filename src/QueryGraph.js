import React, { Component } from 'react'
import { Sigma, RelativeSize, NOverlap } from 'react-sigma'
import Dagre from 'react-sigma/lib/Dagre'
import debounce from 'debounce'
import { getGraph } from './get-graph'

const sigmaSettings = {
  drawEdges: true,
  clone: false,
  defaultEdgeColor: '#727272',
  edgeColor: 'default',
  labelThreshold: 8,
  minNodeSize: 2,
  sideMargin: 50
}

export class QueryGraph extends Component {
  state = {
    height: window.innerHeight
  }

  componentDidMount() {
    this.updateDimensions()
    window.addEventListener('resize', this.updateDimensions)
  }

  updateDimensions = debounce(() =>
    this.setState({
      height: window.innerHeight
    })
  )

  render() {
    if (!this.props.code) {
      return null
    }

    const { nodes, edges } = getGraph(this.props.code)
    console.log(nodes, edges)

    return (
      <div className={'query-graph'}>
        <Sigma
          graph={{ nodes, edges }}
          settings={sigmaSettings}
          style={{ height: `${this.state.height}px` }}
        >
          <RelativeSize initialSize={15} />
          <Dagre edgesep={30} ranksep={nodes.length * 2}>
            <NOverlap gridSize={50} maxIterations={100} />
          </Dagre>
        </Sigma>
      </div>
    )
  }
}
