import Uppy from "@uppy/core";
import Webcam from "@uppy/webcam";
import ImageEditor from "@uppy/image-editor";
import ScreenCapture from "@uppy/screen-capture";
import Audio from "@uppy/audio";
import XHR from "@uppy/xhr-upload";
import Compressor, { CompressorOptions } from "@uppy/compressor";

import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import "@uppy/webcam/dist/style.min.css";
import "@uppy/image-editor/dist/style.min.css";
import "@uppy/screen-capture/dist/style.min.css";
import "@uppy/audio/dist/style.min.css";
import { uploadUrlStore, uploadedStuffStore } from "./state";

export const uppy = new Uppy()
  .use(Webcam)
  .use(ImageEditor, {})
  .use(ScreenCapture)
  .use(Compressor, {
    quality: 0.85,
    convertSize: 128 * 1024,
    mimeType: "image/webp",
  } as CompressorOptions)
  .use(XHR, { endpoint: "" })
  .use(Audio);

uppy.on("upload-success", (file, response) => {
  uploadedStuffStore.set([...uploadedStuffStore.get(), { file, response }]);
});

uploadUrlStore.subscribe((url) => {
  uppy.getPlugin("XHRUpload")?.setOptions({ endpoint: url });
});
