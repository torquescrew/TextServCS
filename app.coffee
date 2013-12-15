express = require("express")
routes = require("./routes")
user = require("./routes/user")
http = require("http")
path = require("path")
wd = require("./walkDirectory")
fs = require("fs")
u = require("./util")
pty = require('pty.js')
io = require('socket.io')
terminal = require('term.js')


# Dump
if process.argv[2] == '--dump'
   stream = fs.createWriteStream(__dirname + '/dump.log')

###
Open Terminal
###
buff = []
socket = undefined
term = undefined

term = pty.fork(process.env.SHELL or "sh", [],
   name: (if fs.existsSync("/usr/share/terminfo/x/xterm-256color") then "xterm-256color" else "xterm")
   cols: 80
   rows: 24
   cwd: process.env.HOME
)

term.on "data", (data) ->
   stream.write "OUT: " + data + "\n-\n"  if stream
   (if not socket then buff.push(data) else socket.emit("data", data))

console.log "" + "Created shell with pty master/slave" + " pair (master: %d, pid: %d)", term.fd, term.pid



app = express()

# all environments
app.set "port", process.env.PORT or 3000
#app.set "views", path.join(__dirname, "views")
app.use express.favicon()
app.use express.logger("dev")
app.use express.json()
app.use express.urlencoded()
app.use express.methodOverride()
app.use app.router
app.use express.static(path.join(__dirname, "public"))

app.use (req, res, next) ->
   setHeader = res.setHeader
   res.setHeader = (name) ->
      switch name
         when "Cache-Control", "Last-Modified"
         , "ETag"
            return
      setHeader.apply res, arguments

   next()

app.use(terminal.middleware())


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


app.post "/_save_file", (req, res) ->
   file = req.body.filename
   content = req.body.content

   if u.okString(file) and u.okString(content)
      saveFile(file, content)
   else
      console.log("/_save_file received invalid strings")


server = http.createServer(app)
server.listen app.get("port"), ->
  console.log "Express server listening on port " + app.get("port")


server.on "connection", (socket) ->
   address = socket.remoteAddress
   if address isnt "127.0.0.1" and address isnt "::1"
      try
         socket.destroy()
      console.log "Attempted connection from #{address}. Refused."


###
Sockets
###
io = io.listen(server,
   log: false
)
io.sockets.on "connection", (sock) ->
   socket = sock
   socket.on "data", (data) ->
      stream.write "IN: " + data + "\n-\n"  if stream
      term.write data

   socket.on "disconnect", ->
      socket = null

   socket.emit "data", buff.shift()  while buff.length


saveFile = (file, content) ->
   fs.writeFileSync(file, content);
   console.log "wrote file: #{file}"


openFile = (file, response) ->
  fs.readFile(file, (err, data) ->
    if err
      throw err
    response.json({filename: file, content: data.toString()})
  )


openFolder = (folder, response) ->
  if (u.okString(folder))
    wd.getDirectoryList(folder, response)



