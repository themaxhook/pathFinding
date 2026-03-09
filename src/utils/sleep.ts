// Small helper to pause for a given time.
// Used to slow down animations so we can see them.
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

