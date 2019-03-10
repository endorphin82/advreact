import React, { Component } from "react";
import { Route } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import AdminPage from "./routes/AdminPage";
import AuthPage from "./routes/AuthPage";
import ProtectedRoute from "./common/ProtectedRoute";
import PeoplePage from "./routes/PeoplePage";

class Root extends Component {
  render() {
    return (
      <div>
        <h1>Root</h1>
        <ProtectedRoute path="/admin" component={AdminPage} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/people" component={PeoplePage} />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ type: "TMP" }, dispatch);
};
export default connect(null, mapDispatchToProps, null, { pure: false })(Root);