import {useState, useEffect} from "react";

const useStateToLocalStorage = (key) => {
  const [value, setValue] = useState(localStorage.getItem(key) || "");

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

export default useStateToLocalStorage;