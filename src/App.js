import React, { Component } from "react";
import { QueryGraph } from "./QueryGraph";
// import "./App.css";

class App extends Component {
  state = {
    input: ""
  };

  handleInputChange = event => {
    this.setState({ input: event.target.value });
  };

  render() {
    return (
      <>
        <textarea
          value={this.state.input}
          onChange={this.handleInputChange}
          placeholder={"Paste RBLang here..."}
          style={{position: 'absolute'}}
        />
        <QueryGraph code={this.state.input} />
      </>
    );
  }
}

export default App;
