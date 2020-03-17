/**
 * Author: Oleh Kastornov
 * v 2.0.0
 * Ukraine
 */
const COMPRESSOR_DEFAULTS = {
  toWidth : null,
  toHeight : null,
  mimeType : 'image/png',
  speed : 'low',
  mode : 'strict',
  grayScale : false,
  sepia : false,
  threshold : false,
  vReverse : false,
  hReverse : false,
  quality : 1
};
export class ImageCompressor {
  constructor () {
    this.settings = JSON.parse(JSON.stringify(COMPRESSOR_DEFAULTS));
    this.canvas = document.createElement('canvas');
    this.image = document.createElement('img');
    this.context = this.canvas.getContext('2d');
    this.listenEvents();
  }

  listenEvents () {
    this.image.addEventListener('load', this.imageLoaded.bind(this), false);
    this.image.addEventListener('error', this.imageFault, false);
  }

  imageLoaded () {
    this.checkSizes();
    this.compress();
  }
  imageFault () {
    throw new Error('Source can not be loaded');
  }
  run (src, settings, callback) {
    this.settings = JSON.parse(JSON.stringify(COMPRESSOR_DEFAULTS));
    this.settings.toWidth = settings.toWidth; //|| this.settings.toWidth;
    this.settings.toHeight = settings.toHeight; //|| this.settings.toHeight;
    this.settings.mimeType = settings.mimeType || this.settings.mimeType;
    this.settings.mode = (settings.mode === 'strict' || settings.mode === 'stretch') ?  settings.mode : this.settings.mode;
    this.settings.speed = settings.speed || this.settings.speed;
    this.settings.grayScale = settings.hasOwnProperty('grayScale') ? settings.grayScale : this.settings.grayScale;
    this.settings.sepia = settings.hasOwnProperty('sepia') ? settings.sepia : this.settings.sepia;
    this.settings.threshold = settings.hasOwnProperty('threshold') ? settings.threshold : this.settings.threshold;
    this.settings.hReverse = settings.hasOwnProperty('hReverse') ? settings.hReverse : this.settings.hReverse;
    this.settings.vReverse = settings.hasOwnProperty('vReverse') ? settings.vReverse : this.settings.vReverse;
    this.imageReceiver = callback;
    this.image.src = src;
  }

  compress () {
    if(this.settings.speed !== 'high'){
      this.compressWithQuality();
    }
    this.compressAddOn();
  }

  compressAddOn () {
    this.naturalAR = this.image.naturalWidth / this.image.naturalHeight;
    this.compressedAR = this.settings.toWidth / this.settings.toHeight;
    this.canvas.width = this.settings.toWidth;
    this.canvas.height = this.settings.toHeight;
    this.context.fillStyle = this.settings.mimeType === 'image/png' ? 'rgba(255, 255, 255, 0)' : '#FFFFFF';
    this.context.fillRect(0, 0, this.settings.toWidth, this.settings.toHeight);
    if(this.settings.mode === 'strict'){
      this.strictResize();
    }
    if(this.settings.mode === 'stretch'){
      this.stretchResize();
    }
    this.imageFilters();
    this.imageReverse();
    this.imageReceiver(this.canvas.toDataURL(this.settings.mimeType, this.settings.quality));
    this.compressedCanv = null;

  }
  compressWithQuality () {
    if(this.image.naturalWidth <= this.settings.toWidth && this.image.naturalHeight <= this.settings.toHeight){
      this.compressAddOn();
      return;
    }
    this.firstCompress();
  }
  firstCompress () {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    let w = this.image.naturalWidth / 2;
    let h = this.image.naturalHeight / 2;
    let toW = this.settings.toWidth;
    let toH = this.settings.toHeight;
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
  }
  strictResize () {
    if ( this.naturalAR >= this.compressedAR ) {
      this.fitWidth();
    }
    else{
      this.fitHeight();
    }
  }
  stretchResize () {
    if(this.compressedCanv){
      this.context.drawImage(this.compressedCanv, 0, 0, this.compressedW, this.compressedH, 0, 0, this.settings.toWidth, this.settings.toHeight);
    }
    else{
      this.context.drawImage(this.image, 0, 0, this.settings.toWidth, this.settings.toHeight);
    }
  }
  fitWidth () {
    const compressedHeight = this.settings.toWidth / this.naturalAR,
      offsetX = 0,
      offsetY = (this.settings.toHeight - compressedHeight) / 2;
    if(this.compressedCanv){
      this.context.drawImage(this.compressedCanv, 0, 0, this.compressedW,  this.compressedH, offsetX, offsetY, this.settings.toWidth, compressedHeight);
    }
    else{
      this.context.drawImage(this.image, offsetX, offsetY, this.settings.toWidth, compressedHeight);
    }
  }
  fitHeight () {
    const compressedWidth = this.settings.toHeight * this.naturalAR,
      offsetY = 0,
      offsetX = (this.settings.toWidth - compressedWidth) / 2;
    if(this.compressedCanv){
      this.context.drawImage(this.compressedCanv, 0, 0, this.compressedW, this.compressedH, offsetX, offsetY, compressedWidth, this.settings.toHeight);
    }
    else{
      this.context.drawImage(this.image, offsetX, offsetY, compressedWidth, this.settings.toHeight);
    }
  }
  checkSizes () {
    const aspectRatio = this.image.naturalWidth / this.image.naturalHeight;
    if(!this.settings.toWidth && !this.settings.toHeight){
      this.settings.toWidth = this.image.naturalWidth;
      this.settings.toHeight = this.image.naturalHeight;
      return;
    }
    if(!this.settings.toWidth){
      this.settings.toWidth = this.settings.toHeight * aspectRatio;
      return;
    }
    if(!this.settings.toHeight){
      this.settings.toHeight = this.settings.toWidth / aspectRatio;
    }
  }
  grayScale () {
    const imgData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    let grayValue;
    for (let i = 0, n = imgData.data.length; i < n; i += 4) {
      if(imgData.data[i + 3] === 0){
        continue;
      }
      grayValue = (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3;
      imgData.data[i] = grayValue;
      imgData.data[i + 1] = grayValue;
      imgData.data[i + 2] = grayValue;
    }
    this.context.putImageData(imgData, 0, 0);
  }
  sepia () {
    const imgData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    for (let i = 0, n = imgData.data.length; i < n; i += 4) {
      if(imgData.data[i + 3] === 0){
        continue;
      }
      imgData.data[i] = (imgData.data[i] * .393) + (imgData.data[i + 1] *.769) + (imgData.data[i + 2] * .189);
      imgData.data[i + 1] = (imgData.data[i] * .349) + (imgData.data[i + 1] *.686) + (imgData.data[i + 2] * .168);
      imgData.data[i + 2] = (imgData.data[i] * .272) + (imgData.data[i + 1] *.534) + (imgData.data[i + 2] * .131);
    }
    this.context.putImageData(imgData, 0, 0);
  }
  threshold () {
    const imgData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    let averageIntensity;
    let thresholdVal;
    for (let i = 0, n = imgData.data.length; i < n; i += 4) {
      if(imgData.data[i + 3] === 0){
        continue;
      }
      averageIntensity = (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3;
      thresholdVal = averageIntensity > this.settings.threshold ? 255 : 0;
      imgData.data[i] = thresholdVal;
      imgData.data[i + 1] = thresholdVal;
      imgData.data[i + 2] = thresholdVal;
    }
    this.context.putImageData(imgData, 0, 0);
  }
  imageFilters () {
    if(this.settings.grayScale){
      this.grayScale();
      return;
    }
    if(this.settings.sepia){
      this.sepia();
      return;
    }
    if(this.settings.threshold){
      this.threshold();
      return;
    }
  }

  imageReverse () {
    if(this.settings.vReverse){
      this.vReverse();
    }
    if(this.settings.hReverse){
      this.hReverse();
    }
  }

  vReverse () {
    const imgData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const pixels = imgData.data;
    const reversedData = this.context.createImageData(this.canvas.width, this.canvas.height);
    const vIndex = this.canvas.height;
    let fullIndex = 0;
    let reversedIndex = 0;
    const hCount = this.canvas.width * 4;
    for(var i = vIndex - 1; i >= 0; i--){
      fullIndex = i * hCount;
      for(var j = 0; j < hCount; j += 4){
        reversedData.data[reversedIndex] = pixels[fullIndex + j];
        reversedData.data[reversedIndex + 1] = pixels[fullIndex + j + 1];
        reversedData.data[reversedIndex + 2] = pixels[fullIndex + j + 2];
        reversedData.data[reversedIndex + 3] = pixels[fullIndex + j + 3];
        reversedIndex += 4;
      }
    }
    this.context.putImageData(reversedData, 0, 0, 0, 0, this.canvas.width, this.canvas.height);
  }

  hReverse () {
    const imgData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const pixels = imgData.data;
    const reversedData = this.context.createImageData(this.canvas.width, this.canvas.height);
    const vIndex = this.canvas.height;
    let fullIndex = 0;
    let loopWidth = 0;
    let reversedIndex = 0;
    let hCount = this.canvas.width * 4;
    for(let i = hCount - 4; i > 0; i-=4){
      for(let j = 0; j < vIndex; j++){
        loopWidth = j * hCount;
        fullIndex = loopWidth + i;
        reversedIndex = loopWidth + hCount - i;
        reversedData.data[reversedIndex] = pixels[fullIndex];
        reversedData.data[reversedIndex + 1] = pixels[fullIndex + 1];
        reversedData.data[reversedIndex + 2] = pixels[fullIndex + 2];
        reversedData.data[reversedIndex + 3] = pixels[fullIndex + 3];

      }
    }
    this.context.putImageData(reversedData, 0, 0, 0, 0, this.canvas.width, this.canvas.height);
  }
}

window.ImageCompressor = ImageCompressor;
