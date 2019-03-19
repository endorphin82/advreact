import React, { Component } from "react";
import { Route, NavLink } from "react-router-dom";

import SignInForm from "../auth/SignInForm";
import SignUpForm from "../auth/SignUpForm";
import { connect } from "react-redux";
import { signUp, moduleName, signIn } from "../../ducks/auth";
import Loader from "../common/Loader";

class AuthPage extends Component {
  static propTypes = {};

  render() {
    const { loading } = this.props;

    return (
      <div>
        <h1>Auth page</h1>
        <NavLink to="/auth/signin" activeStyle={{ color: "red" }}>
          Sign In
        </NavLink>
        <NavLink to="/auth/signup" activeStyle={{ color: "red" }}>
          Sign Up
        </NavLink>
        <NavLink to="/admin" activeStyle={{ color: "red" }}>
          Admin
        </NavLink>
        <Route path="/auth/signin" render={() => <SignInForm onSubmit={this.handleSignIn}/>}/>
        <Route path="/auth/signup" render={() => <SignUpForm onSubmit={this.handleSignUp}/>}/>
        {loading && <Loader/>}
      </div>
    );
  }

  handleSignIn = ({email, password}) => this.props.signIn(email, password);
  // handleSignIn = (value) => {console.log("handleSignIn", value)}
  handleSignUp = ({ email, password }) => this.props.signUp(email, password);
}

export default connect(state => ({
  loading: state[moduleName].loading
}), { signUp, signIn }, null, { pure: false })(AuthPage);
