import Audio from "@uppy/audio";
import Compressor, { CompressorOptions } from "@uppy/compressor";
import Uppy from "@uppy/core";
import ImageEditor from "@uppy/image-editor";
import ScreenCapture from "@uppy/screen-capture";
import Webcam from "@uppy/webcam";
import XHR from "@uppy/xhr-upload";

import "@uppy/audio/dist/style.min.css";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import "@uppy/image-editor/dist/style.min.css";
import "@uppy/screen-capture/dist/style.min.css";
import "@uppy/webcam/dist/style.min.css";
import {
  compressImagesStore,
  uploadUrlStore,
  uploadedStuffStore,
  UploadedStuffItem,
} from "./state";
import { generateAltText } from "./altTextGenerator";

class ImageCompressor extends Compressor {
  async prepareUpload(fileIDs: string[]) {
    // Filter out files that don’t end with `.png`
    const effectiveIDs = compressImagesStore.get()
      ? fileIDs.filter((fileID) => {
          const file = this.uppy.getFile(fileID);
          return file.name.endsWith(".png");
        })
      : [];
    // @ts-expect-error - The `prepareUpload` method was not included in the type definition
    return super.prepareUpload(effectiveIDs);
  }
}

export const uppy = new Uppy()
  .use(Webcam)
  .use(ImageEditor, {})
  .use(ScreenCapture)
  .use(ImageCompressor, {
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
  if (file) {
    const newItem: UploadedStuffItem = { file, response };
    
    // Check if file is an image
    const isImage = file.type?.startsWith('image/');
    
    if (isImage) {
      // Set initial status to generating
      newItem.altTextStatus = 'generating';
      uploadedStuffStore.set([...uploadedStuffStore.get(), newItem]);
      
      // Generate alt text asynchronously
      generateAltText(file.data as Blob)
        .then((altText) => {
          // Update the item with the generated alt text
          const items = uploadedStuffStore.get();
          const itemIndex = items.findIndex(item => item.file.id === file.id);
          if (itemIndex !== -1) {
            items[itemIndex] = {
              ...items[itemIndex],
              altText,
              altTextStatus: 'success',
            };
            uploadedStuffStore.set([...items]);
          }
        })
        .catch((error) => {
          // Update the item with the error
          const items = uploadedStuffStore.get();
          const itemIndex = items.findIndex(item => item.file.id === file.id);
          if (itemIndex !== -1) {
            items[itemIndex] = {
              ...items[itemIndex],
              altTextStatus: 'error',
              altTextError: error.message,
            };
            uploadedStuffStore.set([...items]);
          }
        });
    } else {
      uploadedStuffStore.set([...uploadedStuffStore.get(), newItem]);
    }
  }
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
