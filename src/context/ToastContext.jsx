import { createContext, useContext, useState } from "react";
import Toasts from "../components/Toasts.jsx";

const ToastContext = createContext(null);

let nextToastId = 1;

export function ToastProvider(props) {
  const [toasts, setToasts] = useState([]);

  function removeToast(id) {
    setToasts(function (current) {
      return current.filter(function (toast) {
        return toast.id !== id;
      });
    });
  }

  // type can be "success", "error" or "info"
  function showToast(message, type) {
    const id = nextToastId;
    nextToastId = nextToastId + 1;

    let toastType = "info";
    if (type === "success" || type === "error") {
      toastType = type;
    }

    setToasts(function (current) {
      return [...current, { id: id, message: message, type: toastType }];
    });

    setTimeout(function () {
      removeToast(id);
    }, 3800);
  }

  return (
    <ToastContext.Provider value={{ showToast: showToast }}>
      {props.children}
      <Toasts toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
