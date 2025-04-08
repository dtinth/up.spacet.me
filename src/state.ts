import { persistentAtom } from "@nanostores/persistent";
import { atom } from "nanostores";

export const uploadUrlStore = persistentAtom<string>("uploadUrl", "");
export const compressImagesStore = persistentAtom<string>(
  "compressImages",
  "true"
);
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

Object.assign(window, {
  uploadedStuffStore,
  uploadUrlStore,
  compressImagesStore,
});
