/**
 * Created by tobysuggate on 30/11/13.
 */
/*global $: false, console: false, U: false*/

function onEnterKey (event) {
  "use strict";

  if (event.keyCode === 13) {
    var input = document.getElementById('termInput').value;
//        console.log(input);
    console.log("sending: " + input);
//    $.post('/_term_input', {
//      text: input
//    }, function (data) {
//      document.getElementById('outputText').innerHTML += (data + "<br>");
//      console.log('onEnterKey: ' + data);
//    });
    runCommand(input);
  }
}


function runCommand (commandStr) {
  "use strict";

  if (U.validStr(commandStr)) {

    $.post('/_term_input', {
      text: commandStr
    }, function (data) {
      document.getElementById('outputText').innerHTML += (data + "<br>");
//      console.log('onEnterKey: ' + data);
    });
  }
}


function clearConsole() {
  "use strict";

  document.getElementById('outputText').innerHTML = "";
}