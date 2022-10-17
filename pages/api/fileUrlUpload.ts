import { db } from "database";
import { jsonParse } from "interface/util";
import fetch from "node-fetch";
import { APIHandler } from "util/tool";
import { uploadFromStream } from "../../util/cos";

/**
 * 通过url上传到cos
 */
export const uploadFromUrl = (data: {
  url: string;
  key: string;
  onError: (err: string) => void;
  // percent: 0-1
  onProgress: (percent: number) => void;
  onSuccessful: () => void;
}) => {
  fetch(data.url, {
    method: "GET",
    headers: { "Content-Type": "application/octet-stream" },
  })
    .then((res) => {
      // 获取请求头中的文件大小数据
      let size = res.headers.get("content-length") || "";
      if (!size) {
        return;
      }
      if (!res.body) {
        return;
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
  isError: boolean;
  isSuccessful: boolean;
  percent: number;
  message: string;
}

export interface FileUrlUploadResponse extends CacheItem {}

const getKey = (key: string) => `fileUrlUpload:${key}`;

const setCache = async (option: CacheItem) => {
  await db.cache.set(getKey(option.key), {
    value: JSON.stringify(option),
  });
};

const getCache: (key: string) => Promise<CacheItem | null> = async (key) => {
  let cache = await db.cache.get(getKey(key));
  if (cache) {
    return jsonParse(cache);
  }
  return null;
};

export default APIHandler<FileUrlUploadRequest, FileUrlUploadResponse>({
  method: "POST",
  handler: async ({ data, setStatus }) => {
    const { url, key } = data;
    if (!url) {
      let res = await getCache(key);
      if (!res) {
        setStatus(500);
        return "未查询到相应任务";
      }
      return res;
    }
    let item: CacheItem = {
      key,
      isError: false,
      isSuccessful: false,
      percent: 0,
      message: "",
    };
    uploadFromUrl({
      url: url,
      key: key,
      onError: (err) => {
        item = { ...item, isError: true, isSuccessful: false, message: err };
        setCache(item);
      },
      onProgress: async (percent) => {
        item = { ...item, percent };
        setCache(item);
      },
      onSuccessful: () => {
        item = { ...item, isError: false, isSuccessful: true };
        setCache(item);
      },
    });
  },
});
