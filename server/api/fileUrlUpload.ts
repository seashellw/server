import { cacheDB } from "@/database/cache";
import { jsonParse } from "@/interface/util";
import { defineHandler, SE } from "@/util";
import { ProgressInfo, uploadFromUrl } from "@/util/cos";

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
    value: JSON.stringify(option),
  });
};

const getCache: (key: string) => Promise<CacheItem | null> = async (key) => {
  let cache = await cacheDB.get(getKey(key));
  if (cache) {
    return jsonParse(cache);
  }
  return null;
};

export default defineHandler(async (e) => {
  const { url, key } = await useBody<FileUrlUploadRequest>(e);
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
  setCache(item);
  uploadFromUrl({
    url: url,
    key: key,
    onError: (err) => {
      item = { ...item, state: "error", message: err };
      setTimeout(() => {
        setCache(item);
      }, 500);
    },
    onDownloadProgress: (p) => {
      item = { ...item, progress: p, state: "prepare" };
      setCache(item);
    },
    onProgress: (p) => {
      if (item.state === "success" || item.state === "error") {
        return;
      }
      item = { ...item, progress: p, state: "uploading" };
      setCache(item);
    },
    onSuccessful: () => {
      item = { ...item, state: "success" };
      setTimeout(() => {
        setCache(item);
      }, 500);
    },
  });
});
