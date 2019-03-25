import React, { Component } from "react";
import { connect } from "react-redux";

import { Table, Column } from "react-virtualized";
import { peopleListSelector, fetchAllPeople } from "../../ducks/people";
import { TransitionMotion, spring, presets } from "react-motion";

class VirtualizedPeopleTable extends Component {
  constructor(props) {
    super(props);
    this.getStyles = this.getStyles.bind(this);
  }

  componentDidMount() {
    this.props.fetchAllPeople && this.props.fetchAllPeople();
  }

  componentDidUpdate({ peoples }) {
    if (peoples.length && this.props.peoples.length > peoples.length) {
      setTimeout(() => {
        this.table.scrollToRow(this.props.peoples.length);
      }, 0);
    }
  }

  rowGetter = ({ index }) => this.props.peoples[index];

  willLeave = () => ({
    opacity: spring(0)
  });

  willEnter = () => ({
    opacity: 0
  });

  getStyles() {
    return this.props.peoples.map(person => ({
      style: {
        opacity: spring(1, {
          damping: presets.noWobble.damping,
          stiffness: presets.noWobble.stiffness / 10
        })
      },
      key: person.uid,
      data: person
    }));
  }

  setListRef = ref => this.table = ref;

  render() {
    if (!this.props.peoples.length) return null;
    return (
      <TransitionMotion
        willEnter={this.willEnter}
        styles={this.getStyles}
        willLeave={this.willLeave}
      >
        {interpolatedStyles =>
          <Table
            ref={this.setListRef}
            rowStyle={({ index }) => index < 0 ? {} : interpolatedStyles[index].style}
            rowCount={interpolatedStyles.length}
            rowGetter={this.rowGetter}
            height={300}
            width={700}
            rowHeight={40}
            headerHeight={50}
            overscanRowCount={2}
            rowClassName="test--people-list__row"
          >
            <Column
              label='firstName'
              dataKey='firstName'
              width={300}
            />
            <Column
              label='lastName'
              dataKey='lastName'
              width={300}
            />
            <Column
              label='email'
              dataKey='email'
              width={150}
            />
          </Table>
        }
      </TransitionMotion>
    );
  }
}

export default connect(state => ({
  peoples: peopleListSelector(state)
}), { fetchAllPeople })(VirtualizedPeopleTable);