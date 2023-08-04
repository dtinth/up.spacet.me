import { atom } from "nanostores";
import { persistentAtom } from "@nanostores/persistent";

export const uploadUrlStore = persistentAtom("uploadUrl", "");
export const uploadedStuffStore = atom<UploadedStuffItem[]>([]);

export interface UploadedStuffItem {
  file: {
    id: string;
    name: string;
  };
  response: {
    uploadURL?: string;
  };
}

uploadedStuffStore.listen((stuff) => {
  console.log("uploaded stuff", stuff);
});

Object.assign(window, { uploadedStuffStore, uploadUrlStore });
