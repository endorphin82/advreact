import React from "react";
import { mount } from "enzyme";
import VirtualizedPeopleList from "./VirtualizedPeopleTable";
// TODO     Error: Uncaught [Invariant Violation: Could not find "store" in either the context or props of "Connect(VirtualizedPeopleList)". Either wrap the root component in a <Provider>, or explicitly pass "store" as a prop to "Connect(VirtualizedPeopleList)".]
function generateList(length) {
  let arr = [];
  for (let i;  i < length; i++) {
    arr.push({
      firstName: Math.random().toString(),
      lastName: Math.random().toString(),
      email: Math.random().toString()
    });
  }
}

// const testPeoples = peoples.map(people => new PersonRecord({ ...people, uid: Math.random().toString() }));

it("should render all items from short list", () => {
  const shortList = generateList(5);

  const container = mount(<VirtualizedPeopleList peoples={shortList}/>);
  const rows = container.find(".test--people-list__row");

  expect(rows.length).toEqual(shortList.length + 1);
});

it("should render all items from long list", () => {
  const shortList = generateList(200);

  const container = mount(<VirtualizedPeopleList peoples={shortList}/>);
  const rows = container.find(".test--people-list__row");

  expect(rows.length).toEqual(10);

});

it("should request fetching", (done) => {
  mount(<VirtualizedPeopleList peoples={[]} fetchAllPeople={done}/>);
});

it("should render event list", () => {
  const peoples = generateList(10);
  const container = mount(<VirtualizedPeopleList peoples={peoples} fetchAllPeople={() => {
  }}/>);

  // const container = shallow(<EventList events={testEvents}/>);

  const rows = container.find(".test--people-list__row");

  expect(rows.length).toEqual(peoples.length);
});
