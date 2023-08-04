import Uppy, { BasePlugin } from "@uppy/core";
import { UppyFile } from "@uppy/core";

export class MyUploader extends BasePlugin {
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
