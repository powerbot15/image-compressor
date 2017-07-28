/**
 * Author: Oleh Kastornov
 * ver 1.1.5
 * Ukraine
 */


(function(win, doc){

    function ImageCompressor () {

        this.settings = {
            toWidth : null,
            toHeight : null,
            mimeType : 'image/png',
            speed : 'low',
            mode : 'strict',
            grayScale : false,
            quality : 1
        };

        this.canvas = doc.createElement('canvas');
        this.image = doc.createElement('img');
        this.context = this.canvas.getContext('2d');

        this.listenEvents();
    }

    ImageCompressor.prototype = {

        listenEvents : function () {
            this.image.addEventListener('load', this.imageLoaded.bind(this), false);
            this.image.addEventListener('error', this.imageFault, false);
        },

        imageLoaded : function () {

            this.checkSizes();

            if(this.settings.speed == 'low'){

                this.compressWithQuality();
            }

            if(this.settings.speed == 'high'){

                this.compressImage();

            }

        },

        imageFault : function () {
            throw new Error('Source can not be loaded');
        },

        run : function (src, settings, callback) {
            this.settings.toWidth = settings.toWidth; //|| this.settings.toWidth;
            this.settings.toHeight = settings.toHeight; //|| this.settings.toHeight;
            this.settings.mimeType = settings.mimeType || this.settings.mimeType;
            this.settings.mode = (settings.mode == 'strict' || settings.mode == 'stretch') ?  settings.mode : this.settings.mode;
            this.settings.speed = settings.speed || this.settings.speed;
            this.settings.grayScale = settings.hasOwnProperty('grayScale') ? settings.grayScale : this.settings.grayScale;
            this.imageReceiver = callback;

            this.image.src = src;
        },

        compressImage : function () {

            this.naturalAR = this.image.naturalWidth / this.image.naturalHeight;
            this.compressedAR = this.settings.toWidth / this.settings.toHeight;
            this.canvas.width = this.settings.toWidth;
            this.canvas.height = this.settings.toHeight;
            this.context.fillStyle = this.settings.mimeType == 'image/png' ? 'rgba(255, 255, 255, 0)' : '#FFFFFF';
            this.context.fillRect(0, 0, this.settings.toWidth, this.settings.toHeight);

            if(this.settings.mode == 'strict'){
                this.strictResize();
            }
            if(this.settings.mode == 'stretch'){
                this.stretchResize();
            }

            if(this.settings.grayScale){
                this.grayScale();
            }

            this.imageReceiver(this.canvas.toDataURL(this.settings.mimeType, this.settings.quality));

            this.compressedCanv = null;

        },

        compressWithQuality : function () {

            if(this.image.naturalWidth < this.settings.toWidth && this.image.naturalHeight < this.settings.toHeight){

                this.compressImage();

                return;

            }

            this.firstCompress();

            this.naturalAR = this.image.naturalWidth / this.image.naturalHeight;
            this.compressedAR = this.settings.toWidth / this.settings.toHeight;
            this.canvas.width = this.settings.toWidth;
            this.canvas.height = this.settings.toHeight;
            this.context.fillStyle = this.settings.mimeType == 'image/png' ? 'rgba(255, 255, 255, 0)' : '#FFFFFF';
            this.context.fillRect(0, 0, this.settings.toWidth, this.settings.toHeight);

            if(this.settings.mode == 'strict'){
                this.strictResize();
            }
            if(this.settings.mode == 'stretch'){
                this.stretchResize();
            }

            if(this.settings.grayScale){
                this.grayScale();
            }

            this.imageReceiver(this.canvas.toDataURL(this.settings.mimeType, this.settings.quality));

            this.compressedCanv = null;

        },

        firstCompress : function () {
            var canvas = doc.createElement('canvas');

            var context = canvas.getContext('2d');

            var w = this.image.naturalWidth / 2;

            var h = this.image.naturalHeight / 2;

            var toW = this.settings.toWidth, toH = this.settings.toHeight;

            if(w < toW || h < toH){

                return;

            }

            canvas.width = w;

            canvas.height = h;

            context.drawImage(this.image, 0, 0, w, h);

            w = w / 2;

            h = h / 2;

            while(w > toW && h > toH){

                context.drawImage(canvas, 0, 0, w * 2, h * 2, 0, 0, w, h);

                w = w / 2;

                h = h / 2;

            }

            this.compressedCanv = canvas;

            this.compressedW = w * 2;

            this.compressedH = h * 2;

        },

        strictResize : function () {
            if ( this.naturalAR >= this.compressedAR ) {
                this.fitWidth();
            }
            else{
                this.fitHeight();
            }
        },

        stretchResize : function () {
            if(this.compressedCanv){

                this.context.drawImage(this.compressedCanv, 0, 0, this.compressedW, this.compressedH, 0, 0, this.settings.toWidth, this.settings.toHeight);

            }
            else{
                this.context.drawImage(this.image, 0, 0, this.settings.toWidth, this.settings.toHeight);
            }

        },

        fitWidth : function () {
            var compressedHeight = this.settings.toWidth / this.naturalAR,
                offsetX = 0,
                offsetY = (this.settings.toHeight - compressedHeight) / 2;

            if(this.compressedCanv){

                this.context.drawImage(this.compressedCanv, 0, 0, this.compressedW,  this.compressedH, offsetX, offsetY, this.settings.toWidth, compressedHeight);

            }
            else{

                this.context.drawImage(this.image, offsetX, offsetY, this.settings.toWidth, compressedHeight);

            }

        },

        fitHeight : function () {
            var compressedWidth = this.settings.toHeight * this.naturalAR,
                offsetY = 0,
                offsetX = (this.settings.toWidth - compressedWidth) / 2;

            if(this.compressedCanv){

                this.context.drawImage(this.compressedCanv, 0, 0, this.compressedW, this.compressedH, offsetX, offsetY, compressedWidth, this.settings.toHeight);

            }
            else{

                this.context.drawImage(this.image, offsetX, offsetY, compressedWidth, this.settings.toHeight);

            }

        },

        checkSizes : function () {
            var aspectRatio = this.image.naturalWidth / this.image.naturalHeight;
            if(!this.settings.toWidth && !this.settings.toHeight){
                this.settings.toWidth = 100;
                this.settings.toHeight = 100;
                return;
            }
            if(!this.settings.toWidth){
                this.settings.toWidth = this.settings.toHeight * aspectRatio;
                return;
            }

            if(!this.settings.toHeight){
                this.settings.toHeight = this.settings.toWidth / aspectRatio;
            }

        },

        grayScale : function () {
            var imgData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            var pixels = imgData.data;
            var grayValue;

            for (var i = 0, n = imgData.data.length; i < n; i += 4) {
                if(imgData.data[i + 3] == 0){
                    continue;
                }
                grayValue = (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3;

                imgData.data[i] = grayValue;
                imgData.data[i + 1] = grayValue;
                imgData.data[i + 2] = grayValue;
            }

            this.context.putImageData(imgData, 0, 0);

        }

    };

    win.ImageCompressor = ImageCompressor;

})(window, document);