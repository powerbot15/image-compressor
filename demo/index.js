(function (win, doc) {

    var compressor = new ImageCompressor.ImageCompressor,
        fileReader = new FileReader,
        widthEl = doc.getElementById('width'),
        heightEl = doc.getElementById('height'),
        compress = doc.getElementById('compress'),
        selectImgBtn = doc.querySelector('.image-selector'),
        fileInput = doc.getElementById('image'),
        originalImg = doc.getElementById('original'),
        speedEl = doc.getElementById('speed'),
        thresholdVal = doc.getElementById('threshold-val'),
        originalSize = {
            widthEl : doc.getElementById('origin-width'),
            heightEl : doc.getElementById('origin-height')
        },
        width,
        height,
        file,
        imageRead,
        filter,
        postEffect,
        filterElements;

    filterElements = doc.querySelectorAll('[name="filter"]');

    for(var i = 0; i < filterElements.length; i ++){

        filterElements[i].addEventListener('change', function () {
            if(this.id == 'threshold'){
                thresholdVal.style.display = 'initial';
            }
            else{
                thresholdVal.style.display = 'none';
            }
        });

    }

    fileReader.onloadend = function () {

        imageRead = fileReader.result;

        originalImg.src = imageRead;

    };
    originalImg.addEventListener('load', setOriginalSize);

    selectImgBtn.addEventListener('click', function (e) {

        fireClick(fileInput);

    }, false);

    fileInput.addEventListener('change', function (e) {

        file = e.target.files.length ? e.target.files[0] : null;
        if(file){
            fileReader.readAsDataURL(file);
        }
        else{
            originalImg.src = 'img/placeholder.png';
        }
    }, false);

    widthEl.addEventListener('input', function (e) {
        width = parseInt(e.target.value);
    }, false);

    heightEl.addEventListener('input', function (e) {
        height = parseInt(e.target.value);
    }, false);


    compress.addEventListener('click', function (e) {
        var settings;
        e.preventDefault();

        filter = getFilter();

        postEffect = getPostEffect();

        if(file && (/\.png|\.jpg|\.jpeg/).test(file.name)){

            settings = {
                toWidth : width,
                toHeight : height,
                mimeType : 'image/jpeg',
                quality : 1,
                speed : speedEl.value,
                grayScale : filter == 'grayscale',
                sepia: filter == 'sepia',
                vReverse : postEffect == 'vReverse' || postEffect == 'both',
                hReverse : postEffect == 'hReverse' || postEffect == 'both'
            };

            if(parseInt(filter)){
                settings.threshold = parseInt(filter)
            }

            compressor.run(imageRead, settings, resultProcessor);

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

    function fireClick(node){

        if (document.createEvent) {
            var evt = document.createEvent('MouseEvents');
            evt.initEvent('click', true, true);
            node.dispatchEvent(evt);
        } else if (document.createEventObject) {
            node.fireEvent('onclick') ;
        } else if (typeof node.onclick == 'function') {
            node.onclick();
        }

    }

    function getFilter() {

        var filterRadio = document.querySelector('input[name="filter"]:checked');

        if(filterRadio.id == 'threshold'){

            return thresholdVal.value;

        }
        return filterRadio.value;
    }

    function getPostEffect() {

        var postFilters = document.querySelectorAll('input[name="post-effect"]:checked');

        if(postFilters.length == 2){

            return 'both';

        }

        if(postFilters.length == 1){

            return postFilters[0].value;

        }

        return 'none';
    }




})(window, document);
