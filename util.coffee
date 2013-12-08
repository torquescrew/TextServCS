
okString = (str) ->
   str? and str.length > 0


badString = (str) ->
   not (okString(str))


tailAfterLast = (str, char) ->
   i = str.lastIndexOf(char)
   if i > 0
      str.slice(i + 1)
   else
      ""


tailAfterFirst = (str, char) ->
   i = str.indexOf(char)
   if i > 0
      str.slice(i + 1)
   else
      ""


endsWith = (str, suffix) ->
   str.indexOf(suffix, str.length - suffix.length) isnt -1


stripFolder = (path) ->
   tailAfterLast(path, '/')


removeTopFolder = (fileName) ->
   tailAfterFirst(fileName, '/')


if exports?
   exports.okString = okString
   exports.badString = badString
   exports.tailAfterLast = tailAfterLast
   exports.tailAfterFirst = tailAfterFirst
   exports.removeTopFolder = removeTopFolder
   exports.stripFolder = stripFolder
   exports.endsWith = endsWith

