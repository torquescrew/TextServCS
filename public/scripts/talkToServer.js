/**
 * Created by tobysuggate on 26/12/13.
 */

var socket = io.connect('http://localhost');

socket.on('news', function (data) {
  console.log(data);
  socket.emit('my other event', { my: 'data' });
});


/**
 * Ask server to read file and post it to editor
  @param {string} file
 */
function openFile2(file) {
  socket.emit('openFile', { fileName: file });
}
