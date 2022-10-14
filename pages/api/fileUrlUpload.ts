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
      //获取请求头中的文件大小数据
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
  url: string;
  key: string;
}

export default APIHandler<FileUrlUploadRequest, {}>(
  async ({ data }) => {
    const { url, key } = data;
    uploadFromUrl({
      url: url,
      key: key,
      onError: (err) => {
        console.log(err);
      },
      onProgress: (percent) => {
        console.log(percent);
      },
      onSuccessful: () => {},
    });
  },
  {
    method: "POST",
  }
);
