/**
 * Created by tobysuggate on 30/11/13.
 */


var U = {
  validStr: validStr,
  tailAfter: tailAfter,
  removePath: removePath,
  fileExtension: fileExtension,
  modeForFile: modeForFile
};


function validStr(string) {
  "use strict";

  return (typeof string !== 'undefined' && string.length > 0);
}


function tailAfter(string, char) {
  "use strict";

  var i = string.lastIndexOf(char);
  if (i > 0) {
    return string.slice(i + 1);
  }
  return "";
}

function removePath(file) {
  "use strict";

  return tailAfter(file, '/');
}

function fileExtension(file) {
  "use strict";

  return tailAfter(file, '.');
}


function modeForFile(file) {
  "use strict";

  var ext = fileExtension(file);

  switch (ext) {
    case "clj": return "clojure";
    case "h": return "c_cpp";
    case "cpp": return "c_cpp";
    case "c": return "c_cpp";
    case "py": return "python";
    case "hs": return "haskell";
    case "js": return "javascript";
    case "scala": return "scala";
    case "iml": return "xml";
  }
  return ext;
}
