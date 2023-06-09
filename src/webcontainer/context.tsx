import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { WebContainer } from "@webcontainer/api";

import { getWebContainerInstance } from "./api";

const Context = createContext<WebContainer>(null as unknown as WebContainer);

export const WebContainerProvider = ({ children }: { children: ReactNode }) => {
  const [api, setApi] = useState<WebContainer>(null as unknown as WebContainer);
  const [loading, setLoading] = useState(false);
  const loadedRef = useRef(false);

  const load = async () => {
    if (loadedRef.current) return;
    setLoading(true);
    setApi(await getWebContainerInstance());
    setLoading(false);
    loadedRef.current = true;
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Context.Provider value={api}>
      {!loading
        ? children
        : <div>Loading...</div>
      }
    </Context.Provider>
  );
};

export const useWebContainer = () => useContext(Context);
