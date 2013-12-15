term = undefined
termId = 'output2'

(->
   window.onload = ->
      socket = io.connect()
      socket.on "connect", ->
         c =  Terminal.colors
         c[256] = '#333333' # background
         c[257] = '#bbbbbb' # foreground

         term = new Terminal(
            cols: 80
            rows: 10
            colors: c
            useStyle: true
            screenKeys: true
         )

         term.on "data", (data) ->
            console.log("data: #{data}")
            socket.emit "data", data

         term.on "title", (title) ->
            document.title = title

         term.open document.getElementById(termId)

#         term.write('\x1b[31mWelcome to term.js!\x1b[m\r\n');

         socket.on "data", (data) ->
            term.write data

         socket.on "disconnect", ->
            term.destroy()

         resizeEditor()
         socket.emit "data", 'pwd\r'

).call this


termWidth = ->
   document.getElementsByClassName('terminal')[0].clientWidth

termHeight = ->
   document.getElementsByClassName('terminal')[0].clientHeight


rowHeight = ->
   termHeight() / term.rows


colWidth = ->
   termWidth() / term.cols


resizeTermWidth = (width) ->
   col = colWidth()
   cols = Math.floor(width / col) - 2

   if (width > col * (term.cols + 1) or width < col * (term.cols - 1))
      term.resize(cols, term.rows)


resizeTermHeight = (height) ->
   row = rowHeight()
   rows = Math.floor(height / rowHeight())

   if (height > row * (term.rows + 1) or height < row * (term.rows + 1))
      term.resize(term.cols, rows)

