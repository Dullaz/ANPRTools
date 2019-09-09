/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    self: this,
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },


    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        document.addEventListener("backbutton", this.BackKeyDown, true);
        document.getElementById("pic").addEventListener("click", this.takePicture);
        this.receivedEvent('deviceready');
        this.getPicture();
    },
    takePicture: function () {
        //CameraPreview.takePicture({},this.processPicture,(err) => { console.log(err)});
        CameraPreview.takeSnapshot({ quality: 80 }, app.processPicture, (err) => {
            console.log(err);
        });
    },
    processPicture: function (b64) {
        //console.log("picB: " + pic);
        //console.log(b64)
        var imageb64 = b64[0];
        var imageblob = b64toBlob(imageb64, "image/jpeg", 512);
        app.uploadBlob(imageblob);

        /*var options = { data: b64[0] };
        window.imageSaver.saveBase64Image(options, (fpath) => {
            console.log("Saved to: " + fpath);
            app.sendPicture(fpath);
        }, (err) => {
            console.log(err);
        });*/
    },
    uploadBlob: function (blobby) {
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
                localStorage.plate = response.results.length > 0 ? response.results[0].plate : "No Plate Detected";
                window.location = "index.html";
                
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
    /*sendPicture: function (image) {
        if (image.includes("file:///")) {
            image = image.replace("file:///", "");
        }
        console.log("a");
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
            console.log("b");
            console.log(fs.root)
            fs.root.getFile(image, { create: false }, function (FileEntry) {
                console.log("c");
                FileEntry.file(function (file) {
                    console.log("d");
                    var reader = new FileReader();

                    reader.onloadend = function () {
                        console.log("e");
                        var x = new FormData();
                        x.append("upload", this.result);
                        $.ajax({
                            url: "https://api.platerecognizer.com/v1/plate-reader/",
                            type: "POST",
                            crossDomain: true,
                            data: x,
                            contentType: "multipart/form-data",
                            headers: { "Authorization": "bed9b6559c9ba0cff9fdb4b85183fc79cf165a5c" },
                        })
                            .done(function (response) {
                                console.log(response);
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
                    }
                    reader.readAsBinaryString();
                })
            }, function (err) { console.log(err) })
        }, function (err) { console.log(err) })

    },*/
    showSupportedPictureSizes: function () {
        CameraPreview.getSupportedPictureSizes(function (dimensions) {
            dimensions.forEach(function (dimension) {
                console.log(dimension.width + 'x' + dimension.height);
            });
        });
    },
    BackKeyDown: function () {
        window.history.back();
    },
    getPicture: function () {
        var overlay = document.getElementById("overlay");
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
        this.showSupportedPictureSizes();
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        console.log('Received Event @Camera: ' + id);
    }
};
const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
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
}
app.initialize();