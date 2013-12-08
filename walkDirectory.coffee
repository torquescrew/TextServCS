fs = require('fs')
u = require('./util')
underscore = require('underscore')


ignore = [".hi", ".o", ".hs~"]


isDir = (path) ->
   u.okString(path) &&
   u.stripFolder(path)[0] != '.' &&
   fs.statSync(path).isDirectory()


isFile = (path) ->
   u.okString(path) &&
   fs.statSync(path).isFile() &&
   !shouldIgnore(path)


shouldIgnore = (path) ->
   underscore.some(ignore, (ext) ->
      u.endsWith(path, ext)
   )


getDirectoryList = (folder, response) ->
   html = ''

   walk = (folder) ->
      for item in fs.readdirSync(folder)
         path = folder + '/' + item

         if isDir(path)
            html += "<li class=\"folder\">" + u.stripFolder(path) + "/<ul>"
            walk(path)
            html += "</ul></li>"
         else if isFile(path)
            html += "<li class=\"file\" id=" + path + ">" + u.stripFolder(path) + "</li>"
         html

   walk(folder)
   response.json({ folderName: folder, content: html })


if exports?
   exports.getDirectoryList = getDirectoryList

