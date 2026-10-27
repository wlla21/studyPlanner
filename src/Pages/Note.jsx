import { useRef, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { FileManager } from "@cubone/react-file-manager";
import "@cubone/react-file-manager/dist/style.css";

const DRIVE_API = "https://www.googleapis.com/drive/v3/files";
const FOLDER_MIME = "application/vnd.google-apps.folder";

export default function Note() {
  const [token, setToken] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Connect Google Drive first.");
  const currentPath = useRef("");

  const login = useGoogleLogin({
    scope: "https://www.googleapis.com/auth/drive",
    onSuccess: async (response) => {
      setToken(response.access_token);
      await loadFiles(response.access_token);
    },
    onError: () => setMessage("Google sign-in failed."),
  });

  async function driveRequest(accessToken, url, options = {}) {
    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Google Drive error: ${response.status}`);
    }

    return response;
  }

  async function loadFiles(accessToken = token) {
    if (!accessToken) {
      setMessage("Connect Google Drive first.");
      return;
    }

    setLoading(true);

    try {
      const params = new URLSearchParams({
        q: "trashed = false",
        pageSize: "100",
        orderBy: "folder,name",
        fields: "files(id,name,mimeType,modifiedTime,size,parents)",
      });

      const response = await driveRequest(
        accessToken,
        `${DRIVE_API}?${params}`,
      );

      const data = await response.json();

      const mappedFiles = (data.files || []).map((file) => ({
        ...file,
        path: `/${file.name}`,
        isDirectory: file.mimeType === FOLDER_MIME,
        updatedAt: file.modifiedTime,
        size: Number(file.size) || 0,
      }));

      setFiles(mappedFiles);
      setMessage("Google Drive files loaded.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function createFolder(name) {
    if (!token) return;

    const folderName = typeof name === "string" ? name.trim() : "";

    if (!folderName) {
      setMessage("Enter a folder name.");
      return;
    }

    try {
      await driveRequest(token, DRIVE_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: folderName,
          mimeType: FOLDER_MIME,
        }),
      });

      setMessage(`Created folder: ${folderName}`);
      await loadFiles(token);
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <section className="space-y-4 p-6">
      <h2 className="text-xl font-bold">Google Drive Notes</h2>

      <p role="status" className="text-sm">
        {message}
      </p>

      {!token ? (
        <button
          type="button"
          onClick={() => login()}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white"
        >
          Connect Google Drive
        </button>
      ) : (
        <>
          <button
            type="button"
            onClick={() => loadFiles()}
            disabled={loading}
            className="rounded-lg border px-4 py-2"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>

          <div className="[&_*]:text-xs">
            <FileManager
              files={files}
              isLoading={loading}
              onCreateFolder={createFolder}
              onRefresh={() => loadFiles()}
              onFolderChange={(path) => {
                currentPath.current = path;
              }}
              permissions={{
                create: true,
                upload: true,
                delete: true,
                rename: true,
                download: true,
                copy: true,
                move: false,
              }}
            />
          </div>
        </>
      )}
    </section>
  );
}
