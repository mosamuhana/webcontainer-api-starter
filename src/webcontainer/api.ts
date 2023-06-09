import { WebContainer } from "@webcontainer/api";

export let webContainerInstance!: WebContainer;

export async function getWebContainerInstance() {
  if (!webContainerInstance) {
    webContainerInstance = await WebContainer.boot();
  }
  return webContainerInstance;
}
