import { cacheDB } from "@/database/cache";
import { defineHandler, SE } from "@/util/util";
import { ProgressInfo, uploadFromUrl } from "@/util/cos";
import { readBody } from "h3";

export interface FileUrlUploadRequest {
  url?: string;
  key: string;
}

interface CacheItem {
  key: string;
  state: "prepare" | "uploading" | "success" | "error";
  progress: ProgressInfo;
  message: string;
}

const getKey = (key: string) => `fileUrlUpload:${key}`;

const setCache = async (option: CacheItem) => {
  await cacheDB.set(getKey(option.key), {
    value: option,
  });
};

const getCache: (key: string) => Promise<CacheItem | null> = async (key) => {
  let cache = await cacheDB.get(getKey(key));
  return cache || null;
};

export default defineHandler(async (e) => {
  const { url, key } = await readBody<FileUrlUploadRequest>(e);
  if (!url) {
    let res = await getCache(key);
    if (!res) {
      throw new SE(404, "未查询到相应任务");
    }
    return res;
  }
  let item: CacheItem = {
    key,
    state: "prepare",
    message: "",
    progress: {
      loaded: 0,
      percent: 0,
      speed: 0,
      total: 0,
    },
  };
  await setCache(item);
  uploadFromUrl({
    url: url,
    key: key,
    onError: (err) => {
      item = { ...item, state: "error", message: err };
      setCache(item);
    },
    onDownloadProgress: (p) => {
      item = { ...item, progress: p, state: "prepare" };
      setCache(item);
    },
    onProgress: (p) => {
      item = { ...item, progress: p, state: "uploading" };
      setCache(item);
    },
    onSuccessful: () => {
      item = { ...item, state: "success" };
      setCache(item);
    },
  });
});
