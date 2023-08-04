import {} from "react";

import { Dashboard } from "@uppy/react";
import { uppy } from "./uppy";

function App() {
  return (
    <>
      <Dashboard
        uppy={uppy}
        theme="dark"
        plugins={["Webcam", "ImageEditor", "ScreenCapture", "Audio"]}
      />
    </>
  );
}

export default App;
