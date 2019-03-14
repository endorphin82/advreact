import conferences from "./conferences";
import firebase from "firebase";

export function saveEventsToFB() {
  console.log("saveEventsToFB");
  const eventsRef = firebase.database().ref("/events");
  conferences.forEach(conference => {
    console.log(conference);
    return eventsRef.push(conference);
  });
}

window.runMigration = function() {
  console.log("windowrunMigration");
  firebase.database().ref("/events").once("value", data => {
    console.log(data);
    if (!data.val()) saveEventsToFB();
  });
};

export function jsToJson() {
  saveEventsToFB();
  const confJson = JSON.stringify(conferences);
  console.log(confJson);
}
