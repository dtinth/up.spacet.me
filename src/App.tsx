import {} from "react";

import { Dashboard } from "@uppy/react";
import { uppy } from "./uppy";
import { useStore } from "@nanostores/react";
import { uploadedStuffStore } from "./state";
import { Icon } from "@iconify-icon/react";

function App() {
  return (
    <div className="d-flex flex-column align-items-center p-4 gap-3">
      <Dashboard
        uppy={uppy}
        theme="dark"
        plugins={["Webcam", "ImageEditor", "ScreenCapture", "Audio"]}
      />
      <UploadedList />
    </div>
  );
}

function UploadedList() {
  const stuff = useStore(uploadedStuffStore);
  return (
    <div className="d-flex flex-column align-items-center gap-3">
      {stuff.map((item) => (
        <div key={item.file.id}>
          <strong>{item.file.name}</strong>
          <br />
          <a
            href={item.response.uploadURL}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => {
              e.preventDefault();
              navigator.clipboard.writeText(
                (e.currentTarget as HTMLAnchorElement).href
              );
            }}
          >
            <Icon icon="octicon:copy-16" />
          </a>{" "}
          {item.response.uploadURL}
        </div>
      ))}
    </div>
  );
}

export default App;
