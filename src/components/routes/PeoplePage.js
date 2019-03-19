import React, { Component } from "react";
import { connect } from "react-redux";

import NewPersonForm from "../people/NewPersonForm";
import { addPerson, moduleName} from "../../ducks/people";
import VirtualizedPeopleTable from "../people/VirtualizedPeopleTable";
import Loader from "../common/Loader";

class PeoplePage extends Component {

  render() {
    const { addPerson, loading } = this.props;

    return (
      <div>
        <h1>People page</h1>
        <VirtualizedPeopleTable/>
        {loading
          ? <Loader/>
          : <NewPersonForm onSubmit={addPerson}/>
        }
      </div>
    );
  }
}

export default connect(state => ({
  loading: state[moduleName].loading
}), { addPerson }, null, { pure: false })(PeoplePage);