$(document).ready(function () {

    var saveLocal = $('#saveLocal');
    var loadLocal = $('#loadLocal');
    var loadInput = $('#loadDrawingsInput');


    saveLocal.click(function(){
        var saveData = (function () {
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        return function (data, fileName) {
            var json = JSON.stringify(data),
                blob = new Blob([json], {type: "application/octet-stream"}),
                url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
        };
        }());

        var data = { mapid: currentBackgroundID, map:currentBackground,  lines: JSON.stringify(lines), icons:JSON.stringify(fabricCanvas)};
        var date = new Date();
        var fileName = currentBackground.slice(12,currentBackground.length-4) + "-" + date + ".tac";

        saveData(data, fileName);

    });

    loadLocal.click(function(){
        if (peers[TogetherJS.require('peers').Self.identityId].draw) {
            loadInput.click();
        }
        else {
            $.bootstrapGrowl('You need drawing rights from the session host to load tactics.', {
                type: 'warning',
                width: 'auto'
            });            
        }
    });

    loadInput.change(function (e) {

        var file = e.target.files[0];

        if (file) {
            var reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload = function (evt) {

                var dataObject = JSON.parse(evt.target.result);

                var file_mapid = dataObject.mapid;
                var file_map = dataObject.map;
                var file_lines = dataObject.lines;
                var file_icons = dataObject.icons;

                if (file_mapid && file_map && file_lines && file_icons) {

                    lines = JSON.parse(file_lines);
                    initJSON = JSON.parse(file_icons);
                    setBackground(file_map, file_mapid, false, true, true);

                }
                else {
                    $.bootstrapGrowl('Could not load file. The file is corrupt.', {
                        type: 'warning',
                        width: 'auto'
                    });
                }

            }
            reader.onerror = function (evt) {
                $.bootstrapGrowl('Could not load file. The file is corrupt.', {
                type: 'warning',
                width: 'auto'
                });
            }
        }


    });

});