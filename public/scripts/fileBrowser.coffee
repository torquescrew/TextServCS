###
Created by tobysuggate on 19/11/13.
###


kId = "tree1"
kAxis = "horizontal"

currentEl = () ->
   document.getElementById(kId)


onStartDrag = (axis, id) ->
   kAxis = axis  if axis.length > 0
   kId = id  if id.length > 0

   if kAxis is "horizontal"
      document.body.onmousemove = (evt) ->
         w = evt.clientX
#         resizeTermWidth()
         resizeTerm()
         currentEl().setAttribute "style", "width:" + w + "px"
   else
      document.body.onmousemove = (evt) ->
         h = $(document).height() - (evt.clientY + 5)
#         resizeTermHeight(h)
         resizeTerm()
         currentEl().setAttribute "style", "height:" + h + "px"

   document.body.onmouseup = () ->
      onStopDrag()


onStopDrag = ->
   resizeEditor()
#   resizeTermWidth()
   document.body.onmousemove = null
   document.body.onmouseup = null


onDragging = ->
   if kAxis is "horizontal"
      currentEl().setAttribute "style", "width:" + (event.clientX) + "px"
   else
      currentEl().setAttribute "style", "height:" + ($(document).height() - (event.clientY + 5)) + "px"


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

