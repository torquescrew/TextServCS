(->
   window.onload = ->
      socket = io.connect()
      socket.on "connect", ->
         term = new Terminal(
            cols: 80
            rows: 24
            useStyle: true
            screenKeys: true
         )
         term.on "data", (data) ->
            socket.emit "data", data

         term.on "title", (title) ->
            document.title = title

#         term.open document.body
         term.open document.getElementById('output')

         term.write "\u001b[31mWelcome to term.js!\u001b[m\r\n"
         socket.on "data", (data) ->
            term.write data

         socket.on "disconnect", ->
            term.destroy()


).call this