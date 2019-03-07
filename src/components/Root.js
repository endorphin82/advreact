import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

class Root extends Component {
  render() {
    return (
      <div>
        <h1>Root</h1>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ type: "TMP" }, dispatch);
};
export default connect(null, mapDispatchToProps)(Root);