import React, { Component } from "react";
import Root from "./components/Root";
import store from "./redux";
import { Provider } from "react-redux";
import { ConnectedRouter } from "react-router-redux";
import history from "./history";
import "./config";

import HTML5Backend from "react-dnd-html5-backend";
import { DragDropContextProvider } from "react-dnd";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <DragDropContextProvider backend={HTML5Backend}>
          <ConnectedRouter history={history}>
            <Root/>
          </ConnectedRouter>
        </DragDropContextProvider>
      </Provider>
    );
  }
}

export default App;
