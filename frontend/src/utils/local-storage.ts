import { sideBarModeKey } from "../config/envConfig";

export const setToLocalStorage = (key: string, token: string) => {
  if (!key || typeof window === "undefined") {
    return "";
  }
  return localStorage.setItem(key, token);
};

export const getFromLocalStorage = (key: string) => {
  if (!key || typeof window === "undefined") {
    return "";
  }
  return localStorage.getItem(key);
};

export const storeSideBarMode = ({ expanded }: { expanded: string }) => {
  return setToLocalStorage(sideBarModeKey(), expanded as string);
};
