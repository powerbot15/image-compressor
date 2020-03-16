# Image-Compressor

## Frontend javascript module for resizing and compressing images. No backend libraries required.
### Version 2.0 released! 
### Now available as simple `import { ImageCompressor }  from 'image-compressor';`
**===============================IMPORTANT==============================**

**If you want to use it within ES5 JS project under the `window` object, you should access it by `window.ImageCompressor.ImageCompressor`. Now ImageCompressor is module, so that strange access sequence appeared.**

**However within ES6 JS project after first `import` of the module, `ImageCompressor` will be available at `window.ImageCompressor`**
**=====================================================================**

**Image compressor** uses canvas in the background for resizing operations. Result image has no dimensional distortions, original image is being compressed with the original aspect ratio. 
Original image is centered in the result image. Free space can appear aside of result image due to possible different aspect ratios of original and compressed images. 
Such free space is filled with the `#FFFFFF` color for `image/jpeg` mime type. For `image/png` free space aside result image filled transparently.
[Demo](https://powerbot15.github.io/image-compressor/)

**Image compressor** uses step-down algorithm for scaling down images. That means an image gets compressed for some discrete steps. Within each step image gets compressed by a half(original size : `width`, `height`, size after first step is `width / 2`, `height / 2` ). Such stepping allows limited interpolation on compressed image and gives more similar to original image result

## INSTALLATION

    npm install image-compressor

## USAGE

    
### Javascript

```javascript
    import { ImageCompressor } from 'image-compressor';
    
    const imageCompressor = new ImageCompressor;
    
    const compressorSettings = {
            toWidth : 100,
            toHeight : 100,
            mimeType : 'image/png',
            mode : 'strict',
            quality : 0.6,
            grayScale : true,
            sepia : true,
            threshold : 127,
            vReverse : true,
            hReverse : true,
            speed : 'low'
        };
    
    ...
    
    imageCompressor.run(imageSrc, compressorSettings, proceedCompressedImage);
    
    
    function proceedCompressedImage (compressedSrc) {
        // ...
    }

```


## INTERFACE

  Image compressor has one useful method: `run(imageSrc, compressorSettings, proceedCompressedImage)`
  
  **`imageSrc`** : Source of the image to compress/resize. Enabled dataURL or image src url. ***Be careful with CORS restrictions!*** 
  
  
  **`compressorSettings`** : Object with the compression settings. Enabled fields : 
  
  
  **`compressorSettings.mode`** : Values `strict`, `stretch`. **_Strict mode_** disables dimensional distortions, **_stretch mode_** stretches or squeezes original image to fit result sizes
  
  
  **`compressorSettings.toWidth`** : Width in pixels of the result (compressed/stretched) image, **default : `100`**
  
  
  **`compressorSettings.toHeight`** : Height in pixels of the result (compressed/stretched) image, **default : `100`**
  
  
  **`compressorSettings.mimeType`** : Mime type of the result (compressed/stretched) image, allowed values `image/png`, `image/jpeg`, **default : `"image/png"`**  
  
  
  **`compressorSettings.quality`** : Quality of the result (compressed/stretched) image, allowed values `0-1` with step `0.1`. So `0.5` or `0.8` - correct values , `0.35` or `2` - incorrect values, **default : `1`**
  
  **`compressorSettings.grayScale`** : If you need to apply grayscale filter to pixels of the compressed image, just set this parameter to true. **Default : false**
  
  **`compressorSettings.sepia`** : If you need to apply sepia filter to pixels of the compressed image, just set this parameter to true. **Default : false**
  
  **`compressorSettings.threshold`** : Pixel intensity edge to set black and white. Pixels that has intensity larger then number specified in this setting will be converted to white color, if smaller - pixel become black **Default : false**
  
  **`compressorSettings.vReverse`** : Applies vertical reverse to the result image **Default : false**
  
  **`compressorSettings.hReverse`** : Applies horizontal reverse to the result image **Default : false**
  
  **`compressorSettings.speed`** : Compression speed. Allowed values **`"low"`**, **`"high"`**. In the case of the `"low"` value quality lossless algorithm is being applied(slower, many steps of compression), `"high"` value compresses an image just in one step(faster but with the large delta between original and compressed sizes result image has poor quality). **Default : `"low"`**     

### Width and Height NOTE

If `toWidth` or `toHeight` did not specified, compressor will use original aspect ratio of an image and will combine it with available `toWidth` or `toHeight`

So for example if an original image size will be 2000x1000 and specified `toWidth : 500` result `toHeight` will be calculated as `500 * 1000 / 2000`
  
At least one of two above settings must be set to make compressor working correctly
  
### Filters NOTE
  
You can apply only one filter from available(grayscale, sepia, threshold) to the compressed image. If selected both of them at a time, compressor will use only `grayscale` filter
   
### Reversing NOTE

Vertical and horizontal reverses can be applied together. If selected both of them, result image will be reversed diagonally.   

