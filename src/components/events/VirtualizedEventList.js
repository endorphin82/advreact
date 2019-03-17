import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchAll, eventListSelector, moduleName, selectEvent } from "../../ducks/events";
import Loader from "../common/Loader";
import { Table, Column } from "react-virtualized";
import "react-virtualized/styles.css";

export class VirtualizedEventList extends Component {
  componentDidMount() {
    this.props.fetchAll();
  }

  handleRowClick = (rowData) => {
    const { selectEvent } = this.props;
    selectEvent && selectEvent(rowData.rowData.uid);
  };

  rowGetter = ({ index }) => {
    return this.props.events[index];
  };

  render() {
    const { loading, events } = this.props;
    if (loading) return <Loader/>;

    return (
      <Table
        rowCount={events.length}
        rowGetter={this.rowGetter}
        height={300}
        width={700}
        rowHeight={40}
        headerHeight={50}
        overscanRowCount={5}
        onRowClick={this.handleRowClick}
      >
        <Column
          label='title'
          dataKey='title'
          width={300}
        />
        <Column
          label='where'
          dataKey='where'
          width={300}
        />
        <Column
          label='when'
          dataKey='month'
          width={150}
        />
      </Table>
    );
  }
}

export default connect(state => ({
  events: eventListSelector(state),
  loading: state[moduleName].loading
}), { fetchAll, selectEvent })(VirtualizedEventList);