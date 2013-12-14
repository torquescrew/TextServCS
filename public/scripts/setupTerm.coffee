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

#         resizeTerm()
         resizeEditor()
#         document.getElementById(termId).clientHeight = term.rows * rowHeight()
#         console.log(term.rows * rowHeight())
         socket.emit "data", 'pwd\r'

).call this


termWidth = ->
   document.getElementsByClassName('terminal')[0].clientWidth

termHeight = ->
   document.getElementsByClassName('terminal')[0].clientHeight


rowHeight = ->
#   h = document.getElementsByClassName('terminal')[0].clientHeight
   termHeight() / term.rows


colWidth = ->
#   w = document.getElementsByClassName('terminal')[0].clientWidth
   termWidth() / term.cols


#resizeTerm = ->
#   resizeTermWidth(termWidth())
#   resizeTermHeight(termHeight())


resizeTermWidth = (width) ->
   col = colWidth()
   cols = Math.floor(width / col) - 2

   if (width > col * (term.cols + 1) or width < col * (term.cols - 1))
      term.resize(cols, term.rows)



resizeTermHeight = (height) ->
   row = rowHeight()
   rows = Math.floor(height / rowHeight()) - 1

   if (height > row * (term.rows + 1) or height < row * (term.rows + 1))
      term.resize(term.cols, rows)

