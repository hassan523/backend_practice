import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

export function NotificationAlert(message, theme) {
  Toastify({
    text: message || "There was a problem with your request.",
    duration: 2000,
    gravity: "top",
    position: "center",

    style: {
      background: theme === "success" ? "green" : "red",
      color: "white",
    },
  }).showToast();
}
