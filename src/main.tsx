import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Remove any existing service workers and clear stale caches
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister();
    }
  });
}

if ("caches" in window) {
  caches.keys().then((names) => {
    for (const name of names) {
      caches.delete(name);
    }
  });
}

createRoot(document.getElementById("root")!).render(<App />);
