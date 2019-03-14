import React, { Component } from "react";
import { connect } from "react-redux";
import { moduleName, fetchAll } from "../../ducks/events";

class EventList extends Component {

  componentDidMount() {
    this.props.fetchAll()
  }

  render() {
    const { events } = this.props;
    console.log('sadasdasdadasda',events);
    return (
      <div>
        Event List
      </div>
    );
  }
}


export default connect(state => ({
  events: state[moduleName].entities
}), { fetchAll }, null, { pure: false })(EventList);