import { useRef, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { FileManager } from "@cubone/react-file-manager";
import { FilePlus2, FolderPlus, RefreshCw, Upload } from "lucide-react";
import "@cubone/react-file-manager/dist/style.css";

const DRIVE_API = "https://www.googleapis.com/drive/v3/files";
const DRIVE_UPLOAD_API = "https://www.googleapis.com/upload/drive/v3/files";
const FOLDER_MIME = "application/vnd.google-apps.folder";
const GOOGLE_DOC_MIME = "application/vnd.google-apps.document";
const FILE_FIELDS = "id,name,mimeType,modifiedTime,size,parents,webViewLink";

async function driveRequest(accessToken, url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    let detail = body;

    try {
      detail = JSON.parse(body).error?.message || body;
    } catch {
      // Keep the response body when Google does not return JSON.
    }

    throw new Error(
      detail || `Google Drive request failed (${response.status}).`,
    );
  }

  return response;
}

function isEditableTextFile(file) {
  return (
    file.mimeType?.startsWith("text/") ||
    /\.(txt|md|csv|json|html|css|js|jsx|ts|tsx|xml|yaml|yml)$/i.test(file.name)
  );
}

export default function Note() {
  const [token, setToken] = useState("");
  const [rootId, setRootId] = useState("");
  const [files, setFiles] = useState([]);
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(
    "Connect Google Drive to manage your notes and files.",
  );
  const currentPath = useRef("");
  const currentFolderId = useRef("");
  const fileInput = useRef(null);
  const filesByPath = useRef(new Map());

  async function loadFiles(accessToken = token) {
    if (!accessToken) {
      setMessage("Connect Google Drive first.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const rootResponse = await driveRequest(
        accessToken,
        `${DRIVE_API}/root?fields=id`,
      );
      const root = await rootResponse.json();
      const allFiles = [];
      let nextPageToken;

      do {
        const params = new URLSearchParams({
          q: "trashed = false",
          pageSize: "1000",
          orderBy: "folder,name",
          fields: `nextPageToken,files(${FILE_FIELDS})`,
        });

        if (nextPageToken) params.set("pageToken", nextPageToken);

        const response = await driveRequest(
          accessToken,
          `${DRIVE_API}?${params}`,
        );
        const data = await response.json();
        allFiles.push(...(data.files || []));
        nextPageToken = data.nextPageToken;
      } while (nextPageToken);

      const filesById = new Map(allFiles.map((file) => [file.id, file]));
      const folderPaths = new Map([[root.id, ""]]);

      function getFolderPath(folder, visited = new Set()) {
        if (folderPaths.has(folder.id)) return folderPaths.get(folder.id);
        if (visited.has(folder.id)) return "";

        visited.add(folder.id);
        const parent = filesById.get(folder.parents?.[0]);
        const parentPath =
          parent?.mimeType === FOLDER_MIME
            ? getFolderPath(parent, visited)
            : "";
        const path = `${parentPath}/${folder.name}`;
        folderPaths.set(folder.id, path);
        return path;
      }

      const mappedFiles = allFiles.map((file) => {
        const parent = filesById.get(file.parents?.[0]);
        const parentPath =
          parent?.mimeType === FOLDER_MIME ? getFolderPath(parent) : "";

        return {
          ...file,
          isDirectory: file.mimeType === FOLDER_MIME,
          path: `${parentPath}/${file.name}`,
          updatedAt: file.modifiedTime,
          size: Number(file.size) || 0,
        };
      });

      filesByPath.current = new Map(
        mappedFiles.map((file) => [file.path, file]),
      );
      setRootId(root.id);
      if (!currentPath.current) {
        currentFolderId.current = root.id;
      } else if (
        !allFiles.some(
          (file) =>
            file.id === currentFolderId.current &&
            file.mimeType === FOLDER_MIME,
        )
      ) {
        currentFolderId.current =
          filesByPath.current.get(currentPath.current)?.id || root.id;
      }
      setFiles(mappedFiles);
      setMessage(
        "Google Drive is connected. Open a folder to browse its contents.",
      );
    } catch (error) {
      setMessage(`Could not load Google Drive files: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  const login = useGoogleLogin({
    scope: "https://www.googleapis.com/auth/drive",
    onSuccess: async (response) => {
      setToken(response.access_token);
      await loadFiles(response.access_token);
    },
    onError: () => {
      setMessage(
        "Google sign-in failed. Check your OAuth consent and client settings.",
      );
    },
  });

  function getCurrentFolderId(parentFolder) {
    if (parentFolder?.id) return parentFolder.id;
    if (currentFolderId.current) return currentFolderId.current;
    if (!currentPath.current) return rootId;
    return filesByPath.current.get(currentPath.current)?.id || rootId;
  }

  async function createFolder(name, parentFolder) {
    const folderName = name?.trim();
    if (!folderName) return;

    try {
      await driveRequest(token, DRIVE_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: folderName,
          mimeType: FOLDER_MIME,
          parents: [getCurrentFolderId(parentFolder)],
        }),
      });
      await loadFiles();
      setMessage(`Created folder "${folderName}".`);
    } catch (error) {
      setMessage(`Could not create folder: ${error.message}`);
    }
  }

  async function createNote() {
    const enteredName = window.prompt("What would you like to name your note?");
    if (!enteredName?.trim()) return;

    const name = enteredName.trim().endsWith(".txt")
      ? enteredName.trim()
      : `${enteredName.trim()}.txt`;

    try {
      const response = await driveRequest(token, DRIVE_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          mimeType: "text/plain",
          parents: [getCurrentFolderId()],
        }),
      });
      const created = await response.json();
      setNote({ id: created.id, name: created.name, content: "" });
      await loadFiles();
      setMessage(
        `Created "${created.name}". Write your note below and save it.`,
      );
    } catch (error) {
      setMessage(`Could not create note: ${error.message}`);
    }
  }

  async function uploadFiles(event) {
    const selectedFiles = Array.from(event.target.files || []);
    event.target.value = "";
    if (!selectedFiles.length) return;

    setUploading(true);
    setMessage("");
    const parentId = getCurrentFolderId();

    try {
      for (const file of selectedFiles) {
        const boundary = `study-bloom-${crypto.randomUUID()}`;
        const metadata = JSON.stringify({
          name: file.name,
          parents: [parentId],
        });
        const body = new Blob(
          [
            `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n`,
            `--${boundary}\r\nContent-Type: ${file.type || "application/octet-stream"}\r\n\r\n`,
            file,
            `\r\n--${boundary}--`,
          ],
          { type: `multipart/related; boundary=${boundary}` },
        );
        const params = new URLSearchParams({
          uploadType: "multipart",
          fields: FILE_FIELDS,
        });

        await driveRequest(token, `${DRIVE_UPLOAD_API}?${params}`, {
          method: "POST",
          headers: { "Content-Type": body.type },
          body,
        });
      }

      await loadFiles();
      setMessage(
        selectedFiles.length === 1
          ? `Uploaded "${selectedFiles[0].name}".`
          : `Uploaded ${selectedFiles.length} files.`,
      );
    } catch (error) {
      setMessage(`Could not upload file: ${error.message}`);
      await loadFiles();
    } finally {
      setUploading(false);
    }
  }

  async function openFile(file) {
    if (file.isDirectory) {
      currentFolderId.current = file.id;
      return;
    }

    const driveFile = file;
    if (
      driveFile.mimeType === GOOGLE_DOC_MIME ||
      !isEditableTextFile(driveFile)
    ) {
      if (driveFile.webViewLink) {
        window.open(driveFile.webViewLink, "_blank", "noopener,noreferrer");
      } else {
        setMessage(
          "This file opens in Google Drive and cannot be edited in the text editor.",
        );
      }
      return;
    }

    try {
      const response = await driveRequest(
        token,
        `${DRIVE_API}/${encodeURIComponent(driveFile.id)}?alt=media`,
      );
      setNote({
        id: driveFile.id,
        name: driveFile.name,
        content: await response.text(),
      });
      setMessage(`Opened "${driveFile.name}".`);
    } catch (error) {
      setMessage(`Could not open file: ${error.message}`);
    }
  }

  async function saveNote() {
    if (!note) return;
    const name = note.name.trim();

    if (!name) {
      setMessage("A note needs a file name.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const originalFile = files.find((file) => file.id === note.id);
      if (originalFile && originalFile.name !== name) {
        await driveRequest(
          token,
          `${DRIVE_API}/${encodeURIComponent(note.id)}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
          },
        );
      }

      await driveRequest(
        token,
        `${DRIVE_UPLOAD_API}/${encodeURIComponent(note.id)}?uploadType=media`,
        {
          method: "PATCH",
          headers: { "Content-Type": "text/plain; charset=UTF-8" },
          body: note.content,
        },
      );

      setNote({ ...note, name });
      await loadFiles();
      setMessage(`Saved "${name}".`);
    } catch (error) {
      setMessage(`Could not save note: ${error.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function renameFile(file, newName) {
    const driveFile = file;
    const name = newName.trim();
    if (!name) {
      setMessage("A file needs a name.");
      return;
    }

    try {
      await driveRequest(
        token,
        `${DRIVE_API}/${encodeURIComponent(driveFile.id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        },
      );
      if (note?.id === driveFile.id) setNote({ ...note, name });
      await loadFiles();
      setMessage(`Renamed to "${name}".`);
    } catch (error) {
      setMessage(`Could not rename file: ${error.message}`);
    }
  }

  async function deleteFiles(selectedFiles) {
    try {
      for (const file of selectedFiles) {
        const driveFile = file;
        await driveRequest(
          token,
          `${DRIVE_API}/${encodeURIComponent(driveFile.id)}`,
          { method: "DELETE" },
        );
        if (note?.id === driveFile.id) setNote(null);
      }
      await loadFiles();
      setMessage(
        selectedFiles.length === 1
          ? "Deleted 1 item."
          : `Deleted ${selectedFiles.length} items.`,
      );
    } catch (error) {
      setMessage(`Could not delete item: ${error.message}`);
      await loadFiles();
    }
  }

  function disconnect() {
    setToken("");
    setRootId("");
    setFiles([]);
    setNote(null);
    currentPath.current = "";
    currentFolderId.current = "";
    filesByPath.current.clear();
    setMessage("Google Drive disconnected.");
  }

  return (
    <section className="mx-auto max-w-6xl space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="dashboard-eyebrow">Your ideas, neatly tucked away</p>
          <h1 className="text-3xl font-semibold">Notes & files</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-500">
            Connect Drive to create folders, keep notes together, and open your
            files from one calm workspace.
          </p>
        </div>

        {token && (
          <button
            type="button"
            onClick={disconnect}
            className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Disconnect Drive
          </button>
        )}
      </header>

      <p role="status" aria-live="polite" className="text-sm text-gray-600">
        {message}
      </p>

      {!token ? (
        <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-12">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-green-50 text-green-700">
            <FolderPlus size={25} aria-hidden="true" />
          </div>
          <h2 className="mt-4 text-xl font-semibold">Your Drive, right here</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            Connect your Google account to browse folders, create notes, and
            manage files stored in Google Drive.
          </p>
          <button
            type="button"
            onClick={() => login()}
            className="mt-6 rounded-full bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Connect to Google Drive
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={createNote}
              disabled={loading || uploading}
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <FilePlus2 size={17} aria-hidden="true" />
              New note here
            </button>
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              disabled={loading || uploading}
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <Upload size={17} aria-hidden="true" />
              {uploading ? "Uploading..." : "Upload files here"}
            </button>
            <input
              ref={fileInput}
              type="file"
              multiple
              className="hidden"
              onChange={uploadFiles}
              aria-label="Choose files to upload"
            />
            <button
              type="button"
              onClick={() => loadFiles()}
              disabled={loading || uploading}
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw size={16} aria-hidden="true" />
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <FileManager
              files={files}
              isLoading={loading}
              onCreateFolder={createFolder}
              onDelete={deleteFiles}
              onFileOpen={openFile}
              onFolderChange={(path) => {
                currentPath.current = path;
                currentFolderId.current = path
                  ? filesByPath.current.get(path)?.id || rootId
                  : rootId;
              }}
              onRefresh={() => loadFiles()}
              onRename={renameFile}
              permissions={{
                create: true,
                upload: false,
                delete: true,
                rename: true,
                download: false,
                copy: false,
                move: false,
              }}
              className="[&_*]:text-xs"
            />
          </div>

          {note && (
            <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="dashboard-eyebrow">Note editor</p>
                  <h2 className="text-xl font-semibold">Write and save</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setNote(null)}
                  className="rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  Close editor
                </button>
              </div>

              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-gray-700">
                  File name
                </span>
                <input
                  value={note.name}
                  onChange={(event) =>
                    setNote({ ...note, name: event.target.value })
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5"
                />
              </label>

              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-gray-700">
                  Note content
                </span>
                <textarea
                  value={note.content}
                  onChange={(event) =>
                    setNote({ ...note, content: event.target.value })
                  }
                  rows={12}
                  className="w-full resize-y rounded-xl border border-gray-300 bg-white px-3 py-3 leading-6"
                  placeholder="Start writing here..."
                />
              </label>

              <button
                type="button"
                onClick={saveNote}
                disabled={saving}
                className="rounded-full bg-green-700 px-5 py-2.5 font-semibold text-white hover:bg-green-800 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save to Google Drive"}
              </button>
            </section>
          )}
        </>
      )}
    </section>
  );
}
