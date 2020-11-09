
if ( "serviceWorker" in navigator ) {
	window.addEventListener ("load", () => {
		navigator.serviceWorker
			.register("sw.js")
			.then( reg => console.log( `Service worker: Registered` ) )
			.catch( err => console.log( `Service worker: Error ${err}` ) )
	})
}

const cacheName = "v1";

const cacheAssets = [
	"index.html",
	"./assets/styles/main.css",
	"./assets/scripts/app.js",
]

// Call Install Event
self.addEventListener("install", e => {
	console.log("Service worker: Installed");

	e.waitUntil(
		caches
			.open(cacheName)
			.then(cache => {
				console.log( "Service worker: Caching Files" );
				cache.addAll(cacheAssets);
			})
			.then( () => self.skipWaiting() )
	)
})

// Call Activate Event
self.addEventListener("activate", e => {
	console.log("Service worker: Activated");

	// Remove unwanted caches
	e.waitUntil(
		caches
			.keys().then( cacheNames => {
				return Promise.all(
					cacheNames.map( cache => {
						if ( cache !== cacheName ) {
							console.log( "Service worker: Clearing old cache" );
							return caches.delete( cache );
						}
					})
				)
			})
	)
})

// Call Fetch Event
self.addEventListener("fetch", e => {
	console.log("Service worker: Fetching");
	e.respondWith(
		fetch( e.request )
			.catch( () => caches.match( e.request ) )
	)

})
