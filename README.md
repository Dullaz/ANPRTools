# ANPRTools

Description: Set of functions to extract number plates from images


## Files

 - /www/js/ANPRTools -> Main file
 - /www/js/cam.js -> Camera Overlay and Script Example
 - /www/camera.html -> Camera Overlay markup
 - /www/js/index.js  -> Test Script
 - /www/index.html -> Test Markup
 - /www/js/jquery*.js -> Jquery files

## Set up
To integrate with an existing project:

 - Install required plugins
	 - `cordova add plugin cordova-plugin-camera-preview --save`
	 - `cordova add plugin cordova-plugin-file --save`
	 - `cordova add plugin cordova-plugin-whitelist --save`
 - Copy these files to your project
	 - `/www/js/ANPRTools.js`
	 - `/www/js/jquery...*.js`
 - To use the camera preview example provided, copy these files
	 - `/www/js/cam.js`
	 - `/www/camera.html`
 - Add a script reference to any html pages where you will use ANPRTools.js
	 - `<script  type="text/javascript"  src="js/ANPRTools.js"></script>`
	 - `<script  type="text/javascript"  src="js/jquery-1.11.1.min.js"  id="cordova-jquery"></script>`
	 - `<script  type="text/javascript"  src="js/jquery-1.5.0.mobile.min.js"></script>`

 - If you want to create your own `cam.js` file or a new `camera.html` file
	 - Add references to ANPRTools.js and JQuery files (See above)
	 - Fix the HTML content policy meta header so it doesn't block AJAX calls (Example below)
		 - `<meta  http-equiv="Content-Security-Policy"  content="default-src 'self' data: gap: https://ssl.gstatic.com 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; media-src *; img-src 'self' data: content:;connect-src 'self' https://api.platerecognizer.com/v1/plate-reader/">`
	 - Ensure that in your cordova `config.xml` file, the following line reads
		 - `<access  origin="*"  />`
 - Refer to usage section to use the script


## Usage

Example (see cam.js for more detail):

Start the camera preview

    onDeviceReady:  function () {
		...
	    ImageTools.showCamera();
    }
A function can then be used to take a picture and pass it to the ANPR function. It will then be cropped and uploaded for scanning.   

     takePicture: function() {
    		    //Get a picture from the Camera Preview
                ImageTools.getPicture(function(b64){
                    //base64 image is here
                    var x = b64[0];
                    //pass base64 image to ANPR function
                    ANPRCloud.getPlate(x, function(res){
                        localStorage.ANPRCloud = res; //store plate in local storage
                    });
                });

## Credits

 - API for ANPR: [https://platerecognizer.com/](https://platerecognizer.com/)
 - Camera overlay: [https://github.com/cordova-plugin-camera-preview/cordova-plugin-camera-preview](https://github.com/cordova-plugin-camera-preview/cordova-plugin-camera-preview)
