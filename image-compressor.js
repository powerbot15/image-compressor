/**
 * Author: Oleh Kastornov
 * ver 1.0.6
 * Ukraine
 */


(function(win, doc){

    function ImageCompressor () {

        this.settings = {
            toWidth : 100,
            toHeight : 100,
            mimeType : 'image/png',
            mode : 'strict',
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

        imageLoaded : function (e) {
            this.compressImage();
        },

        imageFault : function () {
            throw new Error('Source can not be loaded');
        },

        run : function (src, settings, callback) {
            this.settings.toWidth = settings.toWidth || this.settings.toWidth;
            this.settings.toHeight = settings.toHeight || this.settings.toHeight;
            this.settings.mimeType = settings.mimeType || this.settings.mimeType;
            this.settings.mode = (settings.mode == 'strict' || settings.mode == 'stretch') ?  settings.mode : this.settings.mode;
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

            this.imageReceiver(this.canvas.toDataURL(this.settings.mimeType, this.settings.quality));

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
            this.context.drawImage(this.image, 0, 0, this.settings.toWidth, this.settings.toHeight);
        },

        fitWidth : function () {
            var compressedHeight = this.settings.toWidth / this.naturalAR,
                offsetX = 0,
                offsetY = (this.settings.toHeight - compressedHeight) / 2;

            this.context.drawImage(this.image, offsetX, offsetY, this.settings.toWidth, compressedHeight);
        },

        fitHeight : function () {
            var compressedWidth = this.settings.toHeight * this.naturalAR,
                offsetY = 0,
                offsetX = (this.settings.toWidth - compressedWidth) / 2;

            this.context.drawImage(this.image, offsetX, offsetY, compressedWidth, this.settings.toHeight);
        }

    };

    win.ImageCompressor = ImageCompressor;

})(window, document);