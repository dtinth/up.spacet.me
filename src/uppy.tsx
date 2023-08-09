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

uppy.addPreProcessor(async (ids) => {
  for (const id of ids) {
    const file = uppy.getFile(id);
    if (file.name && file.meta.name !== file.name) {
      file.meta.name = file.name;
    }
  }
});

uppy.on("upload-success", (file, response) => {
  uploadedStuffStore.set([...uploadedStuffStore.get(), { file, response }]);
});

uploadUrlStore.subscribe((url) => {
  uppy.getPlugin("XHRUpload")?.setOptions({ endpoint: url });
});

window.addEventListener(
  "paste",
  (e) => {
    const { clipboardData } = e;
    if (!clipboardData) return;

    if (
      clipboardData.types.length === 1 &&
      clipboardData.types[0] === "text/plain"
    ) {
      const text = clipboardData.getData("text/plain");
      if (text.startsWith("<svg")) {
        e.preventDefault();
        const file = new File([text], "image.svg", { type: "image/svg+xml" });
        uppy.addFile({
          name: "image.svg",
          type: "image/svg+xml",
          data: file,
          source: "clipboard",
        });
      }
    }
  },
  true
);
