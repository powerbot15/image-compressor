(function (win, doc) {

    var compressor = new ImageCompressor,
        fileReader = new FileReader,
        widthEl = doc.getElementById('width'),
        heightEl = doc.getElementById('height'),
        compress = doc.getElementById('compress'),
        originalImg = doc.getElementById('original'),
        speedEl = doc.getElementById('speed'),
        originalSize = {
            widthEl : doc.getElementById('origin-width'),
            heightEl : doc.getElementById('origin-height')
        },
        width,
        height,
        file,
        imageRead;

    fileReader.onloadend = function () {

        imageRead = fileReader.result;

        originalImg.src = imageRead;

    };
    originalImg.addEventListener('load', setOriginalSize);

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
                speed: speedEl.value
            }, resultProcessor);

            return;
        }
        alert('Choose image file');
    }, false);

    function resultProcessor (src) {
        doc.getElementById('result').src = src;
    }

    function setOriginalSize (e) {
        originalSize.widthEl.innerText = e.target.naturalWidth + 'px x ';
        originalSize.heightEl.innerText = e.target.naturalHeight + 'px';
    }

})(window, document);
