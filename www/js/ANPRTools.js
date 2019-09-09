/*
* Author: Abdullah Hasan
* Description: Set of functions for ANPR
*
*/

/*var ANPRPlugin = {
    getPlate: function (imageb64, callback) {
        //crop image
        ImageTools.cropPicture(imageb64, function (croppedb64) {
            //Scan for plate
            cordova.plugins.OpenALPR.scan(imageb64, {
                country: "eu",
                amount: 3
            },
                (res) => {
                    console.log(res);
                    if (res.length > 0) {
                        var high = res[0].confidence;
                        var pos = 0;
                        for (var i = 0; i < res.length; i++) {
                            var cf = res[i].confidence;
                            if (cf > high) {
                                high = cf;
                                pos = i;
                            }
                        }
                        var plate = res[pos].number;
                        callback(plate);
                    }
                    else {
                        callback(res);
                    }
                });
        });
    }
};
*/
var ANPRCloud = {
    getPlate: function (imageb64, callback) {
        //crop image
        ImageTools.cropPicture(imageb64, function (croppedb64) {
            //base64 fix
            var x = croppedb64.slice(22);
            //image2blob
            console.log(croppedb64.slice(0,30));
            var blob = ImageTools.b64toBlob(x, "image/png", 512);

            //upload to server
            ANPRCloud.uploadBlob(blob, callback);
        });
    },
    uploadBlob: function (blobby, callback) {
        var x = new FormData();
        $.support.cors = true;
        $.mobile.allowCrossDomainPages = true;
        x.append("upload", blobby, "Test.jpeg");
        $.ajax({
            url: "https://api.platerecognizer.com/v1/plate-reader/",
            type: "POST",
            crossDomain: true,
            data: x,
            contentType: "multipart/form-data",
            headers: { "Authorization": "Token bed9b6559c9ba0cff9fdb4b85183fc79cf165a5c" },
            processData: false,
            contentType: false,
        })
            .done(function (response) {
                console.log(response);
                var res = response.results.length > 0 ? response.results[0].plate : "No Plate Detected";
                callback(res);
                //localStorage.plate = response.results.length > 0 ? response.results[0].plate : "No Plate Detected";
                //window.location = "index.html";

            })
            .fail(function (jqXHR, exception) {
                var msg_err = "";
                if (jqXHR.status === 0) {
                    msg_err = "Not connect. Verify Network.";
                } else if (jqXHR.status == 404) {
                    msg_err = "Requested page not found. [404]";
                } else if (jqXHR.status == 500) {
                    msg_err = "Internal Server Error [500].";
                } else if (exception === "parsererror") {
                    msg_err = "Requested JSON parse failed.";
                } else if (exception === "timeout") {
                    msg_err = "Time out error.";
                } else if (exception === "abort") {
                    msg_err = "Ajax request aborted.";
                } else {
                    msg_err = "Uncaught Error. " + jqXHR.responseText;
                }
                alert(msg_err);
            })
            .always(function () {
                console.log("finished");
            });
    },
};
/*
var OCRPlugin = {
    getPlate: function (imageb64, callback) {
        //crop image
        ImageTools.cropPicture(imageb64, function (croppedb64) {
            //recover text
            var x = croppedb64.slice(22);
            //console.log(croppedb64.slice(0,30));
            textocr.recText(4, x, function (txt) {

                //Since this is an image of an actual number plate, we need spaces
                var rx = "(^[A-Z]{2}[0-9]{2} [A-Z]{3}$)|(^[A-Z][0-9]{1,3} [A-Z]{3}$)|(^[A-Z]{3} [0-9]{1,3}[A-Z]$)|(^[0-9]{1,4} [A-Z]{1,2}$)|(^[0-9]{1,3} [A-Z]{1,3}$)|(^[A-Z]{1,2} [0-9]{1,4}$)|(^[A-Z]{1,3} [0-9]{1,3}$)";
                //var rx = "(^[A-Z]{2}[0-9]{2}[A-Z]{3}$)|(^[A-Z][0-9]{1,3}[A-Z]{3}$)|(^[A-Z]{3}[0-9]{1,3}[A-Z]$)|(^[0-9]{1,4}[A-Z]{1,2}$)|(^[0-9]{1,3}[A-Z]{1,3}$)|(^[A-Z]{1,2}[0-9]{1,4}$)|(^[A-Z]{1,3}[0-9]{1,3}$)";

                //Since number plates include spaces, we have to use blocks to ensure we get the whole numberplate in one string
                var blocks = txt.blocks.blocktext;
                console.log(blocks);
                var plate = [];
                for (var i = 0; i < blocks.length; i++) {
                    var found = blocks[i].replace(" ", "").match(rx); //use regex to match text
                    if (found) { //if found is not null
                        plate.push(found[0]); //add it to the array. match returns an array of values, take the first one.
                    }
                }
                console.log(plate);
                callback(plate.length > 0 ? plate[0] : "Not found"); //run the callback on the recovered plates
            }, (err) => { console.log(err); callback(err); });
        });
    }
};
*/
var ImageTools = {
    showCamera: () => {
        let options = {
            x: 0,
            y: 0,
            width: window.screen.width,
            height: window.screen.height,
            camera: CameraPreview.CAMERA_DIRECTION.BACK,
            toBack: true,
            tapPhoto: true,
            tapFocus: false,
            previewDrag: false,
            storeToFile: false,
            disableExifHeaderStripping: false
        };
        CameraPreview.startCamera(options);
    },
    getPicture: (callback) => {
        CameraPreview.takeSnapshot({ quality: 80 }, callback, (err) => {
            console.log(err);
        });
    },
    cropPicture: (imageb64, callback) => {
        var canvas = document.createElement("canvas");
        var context = canvas.getContext('2d');
        var imageobj = new Image();
        imageobj.onload = function () {
            var iheight = imageobj.height;
            var iwidth = imageobj.width;
            if (true) {
                //vertical
                var sx = iwidth * 0.2;
                var sy = iheight * 0.45;
                var width = iwidth * 0.6;
                var height = iheight * 0.2;
                canvas.width = width;
                canvas.height = height;
                context.drawImage(imageobj, sx, sy, width, height, 0, 0, width, height);
                console.log("Taking a " + width + " x " + height + " chunk out of a " + iwidth + " x " + iheight + " image.");
                //console.log(canvas.toDataURL().slice(0,23));
                callback(canvas.toDataURL());
            }
            else {
                //horizontal
                console.log("Can't deal with horizontal pictures");
            }
            var aratio = iheight / iwidth;

        }
        imageobj.setAttribute("src", "data:image/jpeg;base64," + imageb64);
    },
    b64toBlob: (b64Data, contentType = '', sliceSize = 512) => {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, { type: contentType });
        return blob;
    },

};