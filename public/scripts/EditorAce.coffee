getFileName = ->
  $.cookie("fileName")

setFileName = (file) ->
  $.cookie("fileName", file)


validStr = (string) ->
  (string?)
#  typeof string isnt "undefined" and string.length > 0


tailAfter = (string, char) ->
  i = string.lastIndexOf(char)
  return string.slice(i + 1)  if i > 0
  ""

removePath = (file) ->
  tailAfter file, "/"

fileExtention = (file) ->
  tailAfter file, "."


onNewText = (instance, change) ->
  text = instance.getValue()
  $.post "/_save_file",
    filename: fileName
    content: text
  , (data) ->
#    console.log(data)



setMode = ->
  if fileExtention(fileName) is "clj"
    editor.getSession().setMode "ace/mode/clojure"
  else if ["h", "cpp", "c"].indexOf(fileExtention(fileName)) > 0
    editor.getSession().setMode "ace/mode/c_cpp"
  else if fileExtention(fileName) is "py"
    editor.getSession().setMode "ace/mode/python"
  else if fileExtention(fileName) is "hs"
    editor.getSession().setMode "ace/mode/haskell"
  else editor.getSession().setMode "ace/mode/javascript"  if fileExtention(fileName) is "js"
  console.log "extension: " + fileExtention(fileName)

#    console.log(editor.getSession().getMode());
#    editor.getSession().setMode("ace/mode/python");
openFile = (file) ->
  newFile = undefined
  if (file?)
    newFile = file
  else
    $.cookie "fileName", (getUserDir() + "/src/main/resources/public/Editor.html")  unless validStr($.cookie("fileName"))
    alert "cookie fileName still not set"
    newFile = $.cookie("fileName")
  $.getJSON "/_open_file",
    filename: newFile
  , (data) ->
    setMode()
    editor.setValue data.content
    editor.clearSelection()
    editor.scrollToLine 0
    document.title = removePath(fileName)


openFolder = (folder) ->
  newFolder = undefined
  if typeof folder isnt "undefined" and folder.length > 0
    newFolder = folder
  else
    $.cookie "folderName", getUserDir()  if typeof $.cookie("folderName") is "undefined" or $.cookie("folderName").length <= 0
    newFolder = $.cookie("folderName")

  #        alert("getUserDir(): " + getUserDir());
  newFolder = getUserDir()  if typeof newFolder is "undefined" or newFolder.length <= 0
  $.getJSON "/_open_folder",
    folderName: newFolder
  , (data) ->
    if data.content
      $("#fileTree").html data.content
      setUpFileTree()


getUserDir = ->
  dir = ""
  $.getJSON "/_user_dir",
    folderName: ""
  , (data) ->
    dir = data.content  if data.content.length > 0

  console.log dir
  dir


setUpFileTree = ->
  folders = $(".folder")
  folders.mouseover ->
    $(this).css "color", "#ffffff"

  folders.mouseout ->
    $(this).css "color", "#BBBBBB"

  files = $(".file")
  files.mouseover ->
    $(this).css "color", "#ffffff"

  files.mouseout ->
    $(this).css "color", "#999999"

  $(".folder ul").hide()
  $(".folder").click ->
    event.stopPropagation()
    $(this).children("ul").slideToggle 100

  $(".file").click ->
    event.stopPropagation()
    openFile $(this).attr("id")

  $(".myButton").hover (->
    $(this).css "color", "#ffffff"
    $(this).css "background-color", "#111111"
  ), ->
    $(this).css "color", "#bbbbbb"
    $(this).css "background", "none"



myFunction = ->
  folder = prompt("Enter folder location:")
  openFolder folder  if folder isnt null


fileName = ""
fileName = location.hash.slice(1)  if location.hash.length > 0 and fileName.length is 0
editor = ace.edit("editor")
editor.setTheme "ace/theme/kr_theme"
openFile()
openFolder()