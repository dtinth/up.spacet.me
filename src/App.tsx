import { useState } from "react";

import { Icon } from "@iconify-icon/react";
import { useStore } from "@nanostores/react";
import { Dashboard } from "@uppy/react";
import {
  compressImagesStore,
  uploadedStuffStore,
  uploadUrlStore,
} from "./state";
import { uppy } from "./uppy";

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const uploadUrl = useStore(uploadUrlStore);
  const compressImages = useStore(compressImagesStore);

  return (
    <div
      className="d-flex flex-column align-items-center p-4 gap-3 mx-auto"
      style={{ maxWidth: "750px", boxSizing: "content-box" }}
    >
      <div className="d-flex flex-column align-items-start w-100 mb-2">
        <button
          className="btn btn-sm btn-outline-secondary mb-2"
          onClick={() => setShowSettings(!showSettings)}
        >
          {showSettings ? "Hide Settings" : "Show Settings"}
        </button>

        {showSettings && (
          <div className="card p-3 w-100 mb-2">
            <div className="mb-3">
              <label htmlFor="uploadUrl" className="form-label">
                Upload URL
              </label>
              <input
                type="text"
                className="form-control"
                id="uploadUrl"
                value={uploadUrl}
                onChange={(e) => uploadUrlStore.set(e.target.value)}
                placeholder="Enter upload URL"
              />
            </div>
          </div>
        )}

        <div className="form-check mb-2">
          <input
            className="form-check-input"
            type="checkbox"
            id="compressImages"
            checked={!!compressImages}
            onChange={(e) =>
              compressImagesStore.set(e.target.checked ? "true" : "")
            }
          />
          <label className="form-check-label" htmlFor="compressImages">
            Compress images
          </label>
        </div>
      </div>

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
    <div className="d-flex flex-column align-items-center gap-3 w-100">
      {stuff.map((item) => (
        <div key={item.file.id} className="card w-100 p-3">
          <div className="d-flex justify-content-between align-items-center">
            <strong>{item.file.name}</strong>
            <div>
              {item.file.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) && (
                <button
                  className="btn btn-sm btn-outline-secondary me-2"
                  onClick={() => {
                    const altText = item.altText || "";
                    const markdown = `![${altText}](${item.response.uploadURL || ""})`;
                    navigator.clipboard.writeText(markdown);
                  }}
                >
                  <Icon icon="octicon:copy-16" /> Copy Markdown
                </button>
              )}
              <button
                className="btn btn-sm btn-outline-secondary me-2"
                onClick={() => {
                  navigator.clipboard.writeText(item.response.uploadURL || "");
                }}
              >
                <Icon icon="octicon:copy-16" /> Copy URL
              </button>
              <a
                href={item.response.uploadURL}
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-outline-primary"
              >
                <Icon icon="octicon:link-external-16" /> Open
              </a>
            </div>
          </div>
          <div className="text-muted text-truncate mt-2">
            {item.response.uploadURL}
          </div>
          {item.altTextStatus === 'generating' && (
            <div className="text-muted mt-2">
              Generating alt text…
            </div>
          )}
          {item.altTextStatus === 'success' && item.altText && (
            <div className="mt-2">
              <strong>Alt text:</strong> {item.altText}
            </div>
          )}
          {item.altTextStatus === 'error' && (
            <div className="text-danger mt-2">
              {item.altTextError || 'Failed to generate alt text'}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default App;
