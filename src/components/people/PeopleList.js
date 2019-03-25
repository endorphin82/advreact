import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchAllPeople, peopleListSelector } from "../../ducks/people";
import PersonCard from "./PersonCard";
import { List } from "react-virtualized";

class PeopleList extends Component {
  componentDidMount() {
    this.props.fetchAllPeople();
  }

  rowRenderer = ({ index, key, style }) => <PersonCard person={this.props.peoples[index]} key={key} style={style}/>;

  render() {
    return (
      <List
        rowCount={this.props.peoples.length}
        rowHeight={100}
        height={300}
        width={200}
        rowRenderer={this.rowRenderer}
      />
    );
  }
}

export default connect(state => ({
  peoples: peopleListSelector(state)
}), { fetchAllPeople })(PeopleList);