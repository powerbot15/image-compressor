(function (window) {

    var compressor = new ImageCompressor,
        fileReader = new FileReader,
        widthEl = document.getElementById('width'),
        heightEl = document.getElementById('height'),
        compress = document.getElementById('compress'),
        width,
        height,
        file;

    fileReader.onloadend = function () {

        compressor.run(fileReader.result, {
            toWidth : width,
            toHeight : height,
            mimeType : 'image/png',
            quality : 1
        }, resultProcessor);
    };
    document.getElementById('image').addEventListener('change', function (e) {
        file = e.target.files.length ? e.target.files[0] : null;
    }, false);

    widthEl.addEventListener('input', function (e) {
        width = parseInt(e.target.value);
    }, false);

    heightEl.addEventListener('input', function (e) {
        height = parseInt(e.target.value);
    }, false);

    compress.addEventListener('click', function (e) {
        e.preventDefault();
        if(file && (/\.png|\.jpg|\.jpeg/).test(file.name)){
            fileReader.readAsDataURL(file);
            return;
        }
        alert('Choose image file');
    }, false);

    function resultProcessor (src) {
        document.getElementById('result').src = src;
    }
})(window);