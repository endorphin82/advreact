import React, { Component } from "react";
import { connect } from "react-redux";

import { Table, Column } from "react-virtualized";
import { peopleListSelector, fetchAllPeople } from "../../ducks/people";

class VirtualizedPeopleTable extends Component {
  componentDidMount() {
    this.props.fetchAllPeople && this.props.fetchAllPeople();
  }

  rowGetter = ({ index }) => this.props.peoples[index];

  render() {
    const { peoples } = this.props;
    return (
      <div>
        <Table
          rowCount={peoples.length}
          rowGetter={this.rowGetter}
          height={300}
          width={700}
          rowHeight={40}
          headerHeight={50}
          overscanRowCount={5}
          rowClassName="test--people-list__row"
        >
          <Column
            label='firstName'
            dataKey='firstName'
            width={300}
          />
          <Column
            label='lastName'
            dataKey='lastName'
            width={300}
          />
          <Column
            label='email'
            dataKey='email'
            width={150}
          />
        </Table>
      </div>
    );
  }
}

export default connect(state => ({
  peoples: peopleListSelector(state)
}), { fetchAllPeople })(VirtualizedPeopleTable);