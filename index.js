(function (win, doc) {

    var compressor = new ImageCompressor,
        fileReader = new FileReader,
        widthEl = doc.getElementById('width'),
        heightEl = doc.getElementById('height'),
        compress = doc.getElementById('compress'),
        originalImg = doc.getElementById('original'),
        width,
        height,
        file,
        imageRead;

    fileReader.onloadend = function () {

        imageRead = fileReader.result;

        originalImg.src = imageRead;

    };
    doc.getElementById('image').addEventListener('change', function (e) {

        file = e.target.files.length ? e.target.files[0] : null;
        if(file){
            fileReader.readAsDataURL(file);
        }
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

            compressor.run(imageRead, {
                toWidth : width,
                toHeight : height,
                mimeType : 'image/jpeg',
                quality : 1,
                speed: 'high'
            }, resultProcessor);

            return;
        }
        alert('Choose image file');
    }, false);

    function resultProcessor (src) {
        doc.getElementById('result').src = src;
    }
})(window, document);
