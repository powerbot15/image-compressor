# Image-Compressor

## Frontend javascript module for resizing and compressing images. No backend libraries required.

**Image compressor** uses canvas in the background for resizing operations. Result image has no dimensional distortions, original image is being compressed with the original aspect ratio. 
Original image is centered in the result image. Free space can appear aside of result image due to possible different aspect ratios of original and compressed images. 
Such free space is filled with the `#FFFFFF` color for `image/jpeg` mime type. For `image/png` free space aside result image filled transparently.
[Example](https://github.com/powerbot15/image-compressor/tree/master/demo)

## INSTALLATION

    npm install image-compressor

## USAGE

### HTML

    <script src="node_modules/image-compressor/image-compressor.js"></script>
    
### Javascript

```javascript
    
    var imageCompressor = new ImageCompressor;
    
    var compressorSettings = {
            toWidth : 100,
            toHeight : 100,
            mimeType : 'image/png',
            quality : 0.6
        };
    
    ...
    
    imageCompressor.run(imageSrc, compressorSettings, proceedCompressedImage);
    
    
    function proceedCompressedImage (compressedSrc) {
        ...
    }

```


## INTERFACE

  Image compressor has one useful method: `run(imageSrc, compressorSettings, proceedCompressedImage)`
  
  `imageSrc` : Source of the image to compress/resize. Enabled dataURL or image src url. ***Be careful with CORS restrictions!*** 
  
  `compressorSettings` : Object with the compression settings. Enabled fields : 
  
  `compressorSettings.toWidth` : Width in pixels of the result (compressed/stretched) image,
  
  `compressorSettings.toHeight` : Height in pixels of the result (compressed/stretched) image,
  
  `compressorSettings.mimeType` : Mime type of the result (compressed/stretched) image, allowed values `image/png`, `image/jpeg`,
  
  `compressorSettings.quality` : Quality of the result (compressed/stretched) image, allowed values `0-1` with step `0.1`. So `0.5` or `0.8` - correct values , `0.35` or `2` - incorrect values