import Uppy, { BasePlugin } from "@uppy/core";
import Webcam from "@uppy/webcam";
import ImageEditor from "@uppy/image-editor";
import ScreenCapture from "@uppy/screen-capture";
import Audio from "@uppy/audio";
import XHR from "@uppy/xhr-upload";

import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import "@uppy/webcam/dist/style.min.css";
import "@uppy/image-editor/dist/style.min.css";
import "@uppy/screen-capture/dist/style.min.css";
import "@uppy/audio/dist/style.min.css";
import { UppyFile } from "@uppy/core";
import { uploadUrlStore, uploadedStuffStore } from "./state";

class MyUploader extends BasePlugin {
  constructor(uppy: Uppy) {
    super(uppy, {});
    this.id = "MyUploader";
    this.type = "uploader";
  }

  upload = async (fileIDs: string[]) => {
    console.log("upload", fileIDs);
    const files = fileIDs.map((fileID) => this.uppy.getFile(fileID));
    console.log(files);
    this.uppy.emit("upload-start", files);
    const uploadSingle = async (file: UppyFile) => {
      this.uppy.emit("upload-success", file, {
        status: 200,
        body: "OK",
        uploadURL: URL.createObjectURL(file.data),
      });
    };
    await Promise.all(files.map((file) => uploadSingle(file)));
  };

  install() {
    this.uppy.addUploader(this.upload);
  }

  uninstall() {
    this.uppy.removeUploader(this.upload);
  }
}

export const uppy = new Uppy()
  .use(Webcam)
  .use(ImageEditor, {})
  .use(ScreenCapture)
  // .use(MyUploader)
  .use(XHR, {})
  .use(Audio);

uppy.on("upload-success", (file, response) => {
  uploadedStuffStore.set([...uploadedStuffStore.get(), { file, response }]);
});

uploadUrlStore.subscribe((url) => {
  uppy.getPlugin("XHRUpload")?.setOptions({ endpoint: url });
});
