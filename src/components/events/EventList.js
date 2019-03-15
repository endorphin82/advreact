import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchAll, eventListSelector, moduleName } from "../../ducks/events";
import Loader from "../common/Loader";

class EventList extends Component {
  componentDidMount() {
    this.props.fetchAll();
  }

  getRows() {
    return this.props.events.map(this.getRow);
  }

  getRow(event) {
    return <tr key={event.uid}>
      <td>{event.title}</td>
      <td>{event.where}</td>
      <td>{event.month}</td>
    </tr>;
  }

  render() {
    if (this.props.loading) return <Loader/>;

    return (
      <div>
        <table>
          <tbody>
          {this.getRows()}
          </tbody>
        </table>
      </div>
    );
  }
}


export default connect(state => ({
  events: eventListSelector(state),
  loading: state[moduleName].loading
}), { fetchAll }, null, { pure: false })(EventList);