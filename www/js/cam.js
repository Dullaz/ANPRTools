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
        ImageTools.showCamera();
        this.receivedEvent('deviceready');
        localStorage.done = 0;
    },
    takePicture: function() {
        ImageTools.getPicture(function(b64){
            //base64 image is here
            var x = b64[0];
            /*ANPRPlugin.getPlate(x, function(res){
                localStorage.ANPRPlugin = res;
                app.finished();
            });*/
            ANPRCloud.getPlate(x, function(res){
                localStorage.ANPRCloud = res;
                app.finished();
            });
            /*OCRPlugin.getPlate(x, function(res){
                localStorage.OCRPlugin = res;
                app.finished();
            });*/
        });
    },
    finished: function() {
        /*localStorage.done = parseInt(localStorage.done) + 1 ;
        if(localStorage.done == 3)
        {
            window.location = "index.html";
        }
        console.log(localStorage.done);*/
        window.location = "index.html";
    },
    BackKeyDown: function () {
        window.history.back();
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        console.log('Received Event @Camera: ' + id);
    }
};
app.initialize();