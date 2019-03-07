import React, { Component } from "react";
import SignInForm from "../auth/SignInForm";

export default class AuthPage extends Component {
  static propTypes = {

  };

  render() {
    return (
      <div>
        <h1>Auth page</h1>
        <SignInForm />
      </div>
    );
  }
}
