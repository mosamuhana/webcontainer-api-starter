import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { getWebContainerInstance } from "./webcontainer/api";
import App from "./App.tsx";
import "./index.css";

async function main() {
  await getWebContainerInstance();

  const root = createRoot(document.getElementById("root") as HTMLElement);

  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

main();
