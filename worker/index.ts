const backgroundSyncTag = "content-sync";

async function updateHomepage() {
  const homeCache = await caches.open("home");
  await homeCache.add("/");
}

self.addEventListener("periodicsync", (event) => {
  //@ts-ignore
  if (event.tag === backgroundSyncTag) {
    // See the "Think before you sync" section for
    // checks you could perform before syncing.
    //@ts-ignore
    event.waitUntil(updateHomepage());
  }
});

async function initPeriodicSync() {
  // check if background sync is supported
  if ("periodicSync" in self.registration) {
    const status = await navigator.permissions.query({
      //@ts-ignore
      name: "periodic-background-sync",
    });

    if (status.state === "granted") {
      try {
        //@ts-ignore
        // Periodic background sync can be used.
        await self.registration.periodicSync.register(backgroundSyncTag, {
          // An interval of one day.
          minInterval: 1 * 60 * 60 * 1000, // 1 hour
        });
      } catch (error) {
        console.error(
          "Periodic background sync could not be registered.",
          error,
        );
      }
    }
  }
}

self.addEventListener("activate", () => {
  initPeriodicSync();
});

export {};
