import React, { Component } from "react";
import VirtualizedEventList from "../events/VirtualizedEventList";

class EventsPage extends Component {
  render() {
    return (
      <div>
        <h1>Events page</h1>
        <VirtualizedEventList/>
      </div>
    );
  }
}

export default EventsPage;