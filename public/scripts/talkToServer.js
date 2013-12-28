/**
 * Created by tobysuggate on 26/12/13.
 *
 * This file should contain requests to server, not responses.
 */


var App = App || {};
//App.socket = App.socket || io.connect('http://localhost');

//$( document ).ready(function() {
//  "use strict";
//
////  console.log(App.socket);
//
//  App.socket.on('news', function(data) {
//    console.log(data);
//    App.socket.emit('my other event', { my: 'data' });
//  });
//
//
//
////  App.socket.on('res_open_file', function(data) {
//////    console.log('res_open_file: ' + data);
////    console.log('fileName: ' + data.fileName);
//////    console.log('content: ' + data.content);
////
////    openFile(data.fileName, data.content);
////  });
////  App./
//
//});


App.setupServerSocket = function() {
  "use strict";

  console.log("setupServerSocket");

  App.socket = App.socket || io.connect('http://localhost');

  App.socket.on('news', function(data) {
//    console.log(data);
//    console.log('talkToServer on news:');
    console.log(data);
    App.socket.emit('my other event', { my: 'data' });
  });
};


/**
 * Ask server to read file and post it to editor
 * @param {string} file
 */
App.requestOpenFile = function(file) {
  "use strict";

  if (validStr(file)) {
    console.log("emit req_open_file: " + file);
    App.socket.emit('req_open_file', { fileName: file });
  }

};
