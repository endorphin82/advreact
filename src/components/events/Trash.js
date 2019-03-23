import React, { Component } from "react";
import { connect } from "react-redux";
import { DropTarget } from "react-dnd";
import { deleteEvent, stateSelector } from "../../ducks/events";
import Loader from "../common/Loader";

class Trash extends Component {
  render() {
    const { connectDropTarget, isOver, loading } = this.props;
    const style = {
      border: `3px solid ${isOver ? "tomato" : "gray"}`,
      width: 100, height: 100,
      position: "fixed",
      top: 0, right: 0
    };
    return connectDropTarget(
      <div style={style}>
        Trash
        {loading && <Loader/>}
      </div>
    );
  }
}

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver()
});

const spec = {
  drop(props, monitor) {
    const item = monitor.getItem();
    props.deleteEvent(item.uid);
  }
};

export default connect(state => ({
  loading: stateSelector(state).loading
}), { deleteEvent })(DropTarget("event", spec, collect)(Trash));