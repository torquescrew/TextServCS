term = undefined

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

         term.open document.getElementById('output')

         term.write "\u001b[31mWelcome to term.js!\u001b[m\r\n"

         socket.on "data", (data) ->
            term.write data

         socket.on "disconnect", ->
            term.destroy()

).call this


rowHeight = ->
   termCH = document.getElementsByClassName('terminal')[0].clientHeight
   termCH / term.rows


resizeTerm = (height) ->
   termOH = document.getElementsByClassName('terminal')[0].offsetHeight

   if (height > (termOH + rowHeight()))
      term.resize(term.cols, term.rows + 1)
   if (height < (termOH - rowHeight()))
      term.resize(term.cols, term.rows - 1)
