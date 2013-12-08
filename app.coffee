express = require("express")
routes = require("./routes")
user = require("./routes/user")
http = require("http")
path = require("path")
wd = require("./walkDirectory")
fs = require("fs")
u = require("./util")

app = express()

# all environments
app.set "port", process.env.PORT or 3000
app.set "views", path.join(__dirname, "views")
app.set "view engine", "jade"
app.use express.favicon()
app.use express.logger("dev")
app.use express.json()
app.use express.urlencoded()
app.use express.methodOverride()
app.use app.router
app.use express.static(path.join(__dirname, "public"))

# development only
app.use express.errorHandler()  if "development" is app.get("env")

app.get "/", (req, res) ->
  res.sendfile(__dirname + '/public/aceEditor.html')


app.get "/_open_file", (req, res) ->
  openFile(req.query.filename, res)


app.get "/_open_folder", (req, res) ->
  folder = req.query.folderName
  if (u.badString(folder))
#    folder = process.env.HOME
    folder = '/Users/tobysuggate/Documents/Repos/CppDependencies/workspace/Dependancies'

  openFolder(folder, res)


app.get "/users", user.list

http.createServer(app).listen app.get("port"), ->
  console.log "Express server listening on port " + app.get("port")


openFile = (file, response) ->
  fs.readFile(file, (err, data) ->
    if err
      throw err
    response.json({filename: file, content: data.toString()})
  )


openFolder = (folder, response) ->
  if (u.okString(folder))
    wd.getDirectoryList(folder, response)


