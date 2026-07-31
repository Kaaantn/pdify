// Passes the picked File object from the home page to /editor without ever
// touching a server or persisting it to disk — plain in-memory handoff that
// survives a client-side App Router navigation.
let pendingFile: File | null = null;

export function setPendingFile(file: File) {
  pendingFile = file;
}

export function takePendingFile(): File | null {
  const f = pendingFile;
  pendingFile = null;
  return f;
}
