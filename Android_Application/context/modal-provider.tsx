import { createContext, useContext } from "react";

export const ModalContext = createContext({
  open: () => {},
  close: () => {},
});

export function useGlobalModal() {
  return useContext(ModalContext);
}
