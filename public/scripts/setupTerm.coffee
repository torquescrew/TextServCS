term = undefined
termId = 'output2'

(->
   window.onload = ->
      socket = io.connect()
      socket.on "connect", ->
         term = new Terminal(
            cols: 80
            rows: 10
            useStyle: true
            screenKeys: true
         )

         term.on "data", (data) ->
            socket.emit "data", data

         term.on "title", (title) ->
            document.title = title

         term.open document.getElementById(termId)

#         term.write('\x1b[31mWelcome to term.js!\x1b[m\r\n');

         socket.on "data", (data) ->
            term.write data

         socket.on "disconnect", ->
            term.destroy()

         resizeTerm()
         resizeEditor()
         socket.emit "data", 'pwd\r'

).call this


rowHeight = ->
   h = document.getElementsByClassName('terminal')[0].clientHeight
   h / term.rows


colWidth = ->
   w = document.getElementsByClassName('terminal')[0].clientWidth
   w / term.cols


resizeTerm = ->
#   console.log('resizeTerm')
   resizeTermWidth()
   resizeTermHeight()


resizeTermWidth =  ->
   parent = document.getElementById(termId).clientWidth

   cols = Math.floor(parent / colWidth()) - 4

   if (cols != term.cols)
      term.resize(cols, term.rows)


resizeTermHeight = ->
   console.log("resizeHeight")
   parent = document.getElementById(termId).offsetHeight

   rows = Math.floor(parent / rowHeight()) - 1

   if (rows != term.rows)
      term.resize(term.cols, rows)

