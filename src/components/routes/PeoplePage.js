import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink, Route } from "react-router-dom";

import NewPersonForm from "../person/NewPersonForm";
import { addPerson } from "../../ducks/people";

class PeoplePage extends Component {
  render() {

    return (
      <div>
        <h1>Auth page</h1>
        <NavLink to="/people/add" activeStyle={{ color: "red" }}>
          Add Person
        </NavLink>

        <Route path="/people/add" render={() => <NewPersonForm onSubmit={this.handleAddPerson}/>}/>
      </div>
    );
  }

  handleAddPerson = person => this.props.addPerson(person);
}

export default connect(null, { addPerson }, null, { pure: false })(PeoplePage);