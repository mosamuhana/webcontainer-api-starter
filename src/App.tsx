import { useRef, useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { ServerReadyListener } from "@webcontainer/api";

import { webContainerInstance } from "./webcontainer/api";
import { files } from "./webcontainer/files";
import { loadProject } from "./webcontainer/project";

async function load(onReady: ServerReadyListener) {
  await loadProject({
    files,
    onReady,
    onStartServer: (data) => {
      console.log("[START] " + data);
    },
    onInstall: (data) => {
      console.log("[INSTALL] " + data);
    },
  });
}

async function updateFile(filecontent: string) {
  await webContainerInstance.fs.writeFile("/index.js", filecontent, "utf-8");
}

export default function App() {
  const initContent = files["index.js"].file.contents;
  const loadedRef = useRef(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [remoteUrl, setRemoteUrl] = useState<string | null>(null);
  const [content, setContent] = useState(initContent);
  const [value] = useDebounce(content, 1000);

  useEffect(() => {
    if (!loadedRef.current && iframeRef.current) {
      console.log("LOAD");
      loadedRef.current = true;
      load((_, url) => {
        iframeRef.current!.src = url;
        setRemoteUrl(url);
      });
    }
  }, []);

  useEffect(() => {
    updateFile(value);
  }, [value]);

  return (
    <>
      <p>
        <span>Remote Url:</span>{ ' ' }
        {!!remoteUrl && <a href={remoteUrl} target="_blank">{ remoteUrl }</a>}
      </p>
      <div className="container">
        <div className="editor">
          <textarea defaultValue={initContent} onChange={(e) => setContent(e.target.value)} />
        </div>
        <div className="preview">
          <iframe ref={iframeRef} src="loading.html" />
        </div>
      </div>
    </>
  );
}
