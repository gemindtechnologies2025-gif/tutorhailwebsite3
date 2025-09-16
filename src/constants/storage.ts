import secureLocalStorage from "react-secure-storage";

export const setToStorage = (key: string, data: any) => {
  secureLocalStorage.setItem(key, data);
};

export const getFromStorage = (key: string) => {
  return secureLocalStorage.getItem(key);
};

export const removeFromStorage = (key: string) => {
  secureLocalStorage.removeItem(key);
};

