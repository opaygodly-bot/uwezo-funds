// Service worker registration helper
export function registerServiceWorker() {
	if ('serviceWorker' in navigator) {
		const swUrl = '/service-worker.js';
		window.addEventListener('load', () => {
			navigator.serviceWorker.register(swUrl)
				.then((registration) => {
					console.log('[sw] Registered with scope:', registration.scope);
				})
				.catch((err) => {
					console.warn('[sw] Registration failed:', err);
				});
		});
	} else {
		console.log('[sw] Service workers are not supported in this browser');
	}
}

export function unregisterServiceWorker() {
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.getRegistrations().then((regs) => {
			for (const r of regs) r.unregister();
		});
	}
}
