import { cacheDB } from "@/database/cache";
import { jsonParse } from "@/interface/util";
import { defineHandler, SE } from "@/util";
import { ProgressInfo, uploadFromStream } from "@/util/cos";
import fetch from "node-fetch";

/**
 * 通过url上传到cos
 */
export const uploadFromUrl = (data: {
  url: string;
  key: string;
  onError: (err: string) => void;
  onProgress: (progressData: ProgressInfo) => void;
  onSuccessful: () => void;
}) => {
  fetch(data.url, {
    method: "GET",
  })
    .then((res) => {
      // 获取请求头中的文件大小数据
      let size = res.headers.get("content-length") || "";
      if (!size) {
        throw new Error("获取文件大小失败");
      }
      if (!res.body) {
        throw new Error("获取文件流失败");
      }
      let total = parseInt(size);
      let stream = res.body;

      uploadFromStream({
        ...data,
        stream,
        total,
      });
    })
    .catch((e) => {
      data.onError(e.message);
    });
};

export interface FileUrlUploadRequest {
  url?: string;
  key: string;
}

interface CacheItem {
  key: string;
  state: "uploading" | "success" | "error";
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
    state: "uploading",
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
      setCache(item);
    },
    onProgress: (p) => {
      item = { ...item, progress: p };
      setCache(item);
    },
    onSuccessful: () => {
      item = { ...item, state: "success" };
      setCache(item);
    },
  });
});
