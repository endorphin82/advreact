import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink, Route } from "react-router-dom";

import { Table, Column } from "react-virtualized";
import NewPersonForm from "../person/NewPersonForm";
import { peopleListSelector, moduleName, fetchAll, writePerson } from "../../ducks/people";
import Loader from "../common/Loader";

class VirtualizedPeopleList extends Component {
  componentDidMount() {
    this.props.fetchAll();
  }

  rowGetter = ({ index }) => {
    return this.props.peoples[index];
  };

  render() {
    const { loading, peoples } = this.props;
    if (loading) return <Loader/>;
    console.log(peoples);
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
  peoples: peopleListSelector(state),
  loading: state[moduleName].loading
}), { fetchAll }, null, { pure: false })(VirtualizedPeopleList);