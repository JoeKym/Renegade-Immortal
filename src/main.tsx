import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Register service worker with update handling
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js", { scope: "/" })
      .then((registration) => {
        console.log("[SW] Registered:", registration);

        // Listen for new service worker installation
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener("statechange", () => {
            // When the new worker is installed, skip waiting and reload
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              console.log("[SW] New version available, activating...");
              newWorker.postMessage({ type: "SKIP_WAITING" });
            }
          });
        });
      })
      .catch((error) => {
        console.log("[SW] Registration failed:", error);
      });
  });

  // Reload when the new service worker takes control
  let refreshing = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (refreshing) return;
    refreshing = true;
    console.log("[SW] New version activated, reloading...");
    window.location.reload();
  });
}

createRoot(document.getElementById("root")!).render(<App />);
