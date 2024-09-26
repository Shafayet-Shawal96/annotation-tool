import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
// import Test from "./Test.tsx";
const preventZoom = (event: WheelEvent | KeyboardEvent) => {
  if (event.ctrlKey || (event as WheelEvent).deltaY) {
    if (event.ctrlKey) {
      event.preventDefault();
    }
  }
};

window.addEventListener("wheel", preventZoom, { passive: false });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
