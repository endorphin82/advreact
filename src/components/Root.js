import React, { Component } from "react";
import { Link, Route } from "react-router-dom";
import { connect } from "react-redux";

import AdminPage from "./routes/AdminPage";
import AuthPage from "./routes/AuthPage";
import PeoplePage from "./routes/PeoplePage";
import ProtectedRoute from "./common/ProtectedRoute";
import { moduleName, signIn, signOut } from "../ducks/auth";
import EventsPage from "./routes/EventsPage";
import CustomDragLayer from "./CustomDragLayer";

class Root extends Component {
  render() {
    const { signOut, signedIn } = this.props;
    const btn = signedIn
      ? <button onClick={signOut}>Sign out</button>
      : <Link to='/auth/signin'>Sign In</Link>;
    return (
      <div>
        <h1>Root</h1>
        {btn}
        <ProtectedRoute path="/admin" component={AdminPage}/>
        <Route path="/auth" component={AuthPage}/>
        <Route path="/people" component={PeoplePage}/>
        <Route path="/events" component={EventsPage}/>
        <CustomDragLayer/>
      </div>
    );
  }
}

const mapDispatchToProps = {
  signOut, signIn
};

export default connect(state => ({
  signedIn: !!state[moduleName].user
}), mapDispatchToProps, null, { pure: false })(Root);