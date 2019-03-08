import React, { Component } from "react";
import { Route, NavLink, Switch } from "react-router-dom";

import SignInForm from "../auth/SignInForm";
import SignUpForm from "../auth/SignUpForm";

export default class AuthPage extends Component {
  static propTypes = {};

  render() {
    return (
      <div>
        <h1>Auth page</h1>
        <NavLink to="/auth/signin" activeStyle={{ color: "red" }}>
          Sign In
        </NavLink>
        <NavLink to="/auth/signup" activeStyle={{ color: "red" }}>
          Sign Up
        </NavLink>
        <Route path="/auth/signin" render={() => <SignInForm onSubmit={this.handleSignIn}/>}/>
        <Route path="/auth/signup" render={() => <SignUpForm onSubmit={this.handleSignUp}/>}/>
      </div>
    );
  }

  handleSignIn = (value) => console.log("----", value);
  handleSignUp = (value) => console.log("----", value);

}
