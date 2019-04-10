import React, { Component } from 'react'
import { QueryGraph } from './QueryGraph'
import './App.css'

class App extends Component {
  state = {
    input: ''
  }

  handleInputChange = event => {
    this.setState({ input: event.target.value })
  }

  render() {
    return (
      <>
        <textarea
          className='rblang-input'
          value={this.state.input}
          onChange={this.handleInputChange}
          placeholder={'Paste RBLang here...'}
        />
        <QueryGraph code={this.state.input} />
      </>
    )
  }
}

export default App
