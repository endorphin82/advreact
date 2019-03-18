import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink, Route } from "react-router-dom";

import { Table, Column } from "react-virtualized";
import NewPersonForm from "../person/NewPersonForm";
import { peopleListSelector, moduleName, fetchAll, writePerson } from "../../ducks/people";
import Loader from "../common/Loader";
import VirtualizedPeopleList from "../person/VirtualizedPeopleList";

class PeoplePage extends Component {

  render() {
    return (
      <div>
        <h1>People page</h1>
        <NavLink to="/people/add" activeStyle={{ color: "red" }}>
          Add Person
        </NavLink>
        <VirtualizedPeopleList/>
        <Route path="/people/add" render={() => <NewPersonForm onSubmit={this.handleAddPerson}/>}/>
      </div>
    );
  }

  handleAddPerson = person => this.props.writePerson(person);
}

export default connect(null, { writePerson }, null, { pure: false })(PeoplePage);