import React, { Component } from "react";
import { connect } from "react-redux";
import { selectedEventsSelector } from "../../ducks/events";
import SelectedEventCard from "./SelectedEventCard";
import { TransitionMotion, spring, presets } from "react-motion";

class SelectedEvents extends Component {
  getStyles() {
    return this.props.events.map(event => ({
      style: {
        opacity: spring(1, {
          damping: presets.noWobble.damping,
          stiffness: presets.noWobble.stiffness / 10
        })
      },
      key: event.uid,
      data: event
    }));
  }

  willLeave = () => ({
    opacity: spring(0)
  });

  willEnter = () => ({
    opacity: 0
  });

  render() {
    return <TransitionMotion
      styles={this.getStyles()}
      willLeave={this.willLeave}
      willEnter={this.willEnter}
    >
      {(interpolated) => <div>
        {
          interpolated.map(config => <div style={config.style} key={config.key}>
            <SelectedEventCard event={config.data}/>
          </div>)
        }
      </div>
      }
    </TransitionMotion>;
  }
}

export default connect(state => ({
  events: selectedEventsSelector(state)
}), null, null, { pure: false })(SelectedEvents);