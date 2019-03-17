import React from "react";
import { mount, shallow } from "enzyme";
import events from "../../mocks/conferences";
import { TableEventList } from "./TableEventList";
import Loader from "../common/Loader";
import { EventRecord } from "../../ducks/events";


const testEvents = events.map(event => new EventRecord({ ...event, uid: Math.random().toString() }));

it("should render loader", () => {
  const container = mount(<TableEventList loading fetchAll={() => { }}/>);
  // const wcontainer =  shallow(<EventList loading/>);

  expect(container.contains(<Loader/>));
  // expect(wcontainer.contains(<Loader/>));
});

it("should render event list", () => {
  const container = mount(<TableEventList events={testEvents} fetchAll={() => { }}/>);

  // const container = shallow(<EventList events={testEvents}/>);

  const rows = container.find(".test--event-list__row");

  expect(rows.length).toEqual(testEvents.length);
});

it("should request fetch data", (done) => {
  mount(<TableEventList events={[]} fetchAll={done}/>);
});

it("should select event", () => {
  let selected = null;
  const selectEvent = (uid) => selected = uid;

  const container = mount(<TableEventList
    events={testEvents}
    fetchAll={() => { }}
    selectEvent={selectEvent}
  />);

  container.find(".test--event-list__row").first().simulate('click');

  expect(selected).toEqual(testEvents[0].uid);
});