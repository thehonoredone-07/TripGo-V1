import seedDb from "../db.json";

const STORAGE_KEY = "tripgoDatabaseV1";
const remoteBase = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const useBrowserStore = !import.meta.env.DEV && !remoteBase;

function readStore() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
  const initial = JSON.parse(JSON.stringify(seedDb));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

function writeStore(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function localRequest(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const url = new URL(path, location.origin);
  const resource = url.pathname.replace(/^\//, "");
  const parts = resource.split("/").filter(Boolean);
  const collectionName = parts[0];
  const requestedId = parts[1] ? decodeURIComponent(parts[1]) : null;
  const database = readStore();
  const collection = database[collectionName];
  if (!Array.isArray(collection))
    throw new Error(`Không tìm thấy dữ liệu ${collectionName}`);

  if (method === "GET") {
    let result = requestedId
      ? collection.find((item) => String(item.id) === requestedId)
      : [...collection];
    if (!requestedId) {
      for (const [key, value] of url.searchParams) {
        result = result.filter((item) => String(item[key] ?? "") === value);
      }
    }
    return Promise.resolve(result);
  }

  const payload = options.body ? JSON.parse(options.body) : {};
  if (method === "POST") {
    const item = {
      ...payload,
      id: payload.id || `${collectionName}-${Date.now()}`,
    };
    collection.push(item);
    writeStore(database);
    return Promise.resolve(item);
  }

  const index = collection.findIndex((item) => String(item.id) === requestedId);
  if (index < 0) throw new Error("Không tìm thấy bản ghi cần cập nhật");
  if (method === "PUT" || method === "PATCH") {
    collection[index] =
      method === "PATCH"
        ? { ...collection[index], ...payload }
        : { ...payload, id: collection[index].id };
    writeStore(database);
    return Promise.resolve(collection[index]);
  }
  if (method === "DELETE") {
    collection.splice(index, 1);
    writeStore(database);
    return Promise.resolve(null);
  }
  throw new Error(`Phương thức ${method} chưa được hỗ trợ`);
}

export async function api(path, options = {}) {
  if (useBrowserStore) return localRequest(path, options);
  const base = remoteBase || "/api";
  const response = await fetch(`${base}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!response.ok) throw new Error(`API ${response.status}`);
  return response.status === 204 ? null : response.json();
}

export const storageMode = useBrowserStore ? "browser" : "api";
