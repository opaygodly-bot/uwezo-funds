import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerServiceWorker } from './serviceWorkerRegistration';

// Register service worker to meet PWA install criteria
registerServiceWorker();

createRoot(document.getElementById("root")!).render(<App />);
