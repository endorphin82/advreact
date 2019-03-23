import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchLazy, eventListSelector, moduleName, selectEvent } from "../../ducks/events";
import { Table, Column, InfiniteLoader } from "react-virtualized";
import Trash from "./Trash";
import "react-virtualized/styles.css";
import TableRow from "./TableRow";

export class VirtualizedEventList extends Component {
  componentDidMount() {
    this.props.fetchLazy();
  }

  handleRowClick = ({ rowData }) => {
    const { selectEvent } = this.props;
    selectEvent && selectEvent(rowData.uid);
  };

  getRowRenderer = ( rowCtx ) => <TableRow {...rowCtx}/>;

  rowGetter = ({ index }) => {
    return this.props.events[index];
  };

  isRowLoaded = ({ index }) => index < this.props.events.length;

  loadMoreRows = () => {
    console.log("load more");
    this.props.fetchLazy();
  };

  render() {
    const { loaded, events } = this.props;

    return (
      <div>
        <Trash/>
        <InfiniteLoader
          isRowLoaded={this.isRowLoaded}
          rowCount={loaded ? events.length : events.length + 1}
          loadMoreRows={this.loadMoreRows}
        >
          {({ onRowsRendered, registerChild }) =>
            <Table
              ref={registerChild}
              rowCount={events.length}
              rowGetter={this.rowGetter}
              height={300}
              width={700}
              rowHeight={40}
              headerHeight={50}
              overscanRowCount={5}
              onRowClick={this.handleRowClick}
              onRowsRendered={onRowsRendered}
              rowRenderer={this.getRowRenderer}
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
          }
        </InfiniteLoader>
      </div>
    );
  }
}

export default connect(state => ({
  events: eventListSelector(state),
  loaded: state[moduleName].loaded
}), { fetchLazy, selectEvent })(VirtualizedEventList);