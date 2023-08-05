# up.spacet.me

A little web application that lets you upload files to an HTTP endpoint of your choosing with [Uppy](https://uppy.io/).

## File sources

Thanks to Uppy and its plugins, you can:

- [Drag files into the drop zone.](https://uppy.io/docs/dashboard/)
- Paste images from clipboard.
- [Capture an image from a camera.](https://uppy.io/docs/webcam/)
- [Capture the screen.](https://uppy.io/docs/screen-capture/)https://uppy.io/docs/screen-capture/
- [Record audio.](https://uppy.io/docs/audio/)https://uppy.io/docs/audio/

## Image editing and optimization

- [Images are automatically compressed into `webp` file.](https://uppy.io/docs/compressor/)
- [You can edit the image thanks to its built-in image editor.](https://uppy.io/docs/image-editor/)https://uppy.io/docs/image-editor/

## Upload target

Files are uploaded as `multipart/form-data`. That is currently no GUI for setting up the endpoint. To configure the upload endpoint, run the following code in the JavaScript console:

```js
uploadUrlStore.set(prompt('...'))
```
