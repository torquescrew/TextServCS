function onLoad() {
  "use strict";

  openFolder("");
}
onLoad();


function openFolder(folder) {
  "use strict";

  if (!U.validStr(folder)) {
    folder = "";
  }

  $.getJSON('/_open_folder', {
      folderName: folder
    },
    function (data) {
      if (data.content) {
        $("#fileTree").html(data.content);
        setUpFileTree();
      }
    });
}


setUpFileTree = function () {
  "use strict";

  var folder = $(".folder");
  folder.mouseover(function () {
    $(this).css("color", "#ffffff");
  });
  folder.mouseout(function () {
    $(this).css("color", "#BBBBBB");
  });

  var file = $(".file");
  file.mouseover(function () {
    $(this).css("color", "#ffffff");
  });
  file.mouseout(function () {
    $(this).css("color", "#999999");
  });
  $(".folder ul").hide();

  folder.click(function (evt) {
    evt.stopPropagation();
    $(this).children("ul").slideToggle(100);
  });
  file.click(function (evt) {
    evt.stopPropagation();
    openFile($(this).attr("id"));
  });

  $(".myButton").hover((function () {
    $(this).css("color", "#ffffff");
    $(this).css("background-color", "#111111");
  }), function () {
    $(this).css("color", "#bbbbbb");
    $(this).css("background", "none");
  });
};
