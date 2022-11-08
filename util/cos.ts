import COS from "cos-nodejs-sdk-v5";
import { createWriteStream, existsSync, mkdirSync, rmSync } from "fs";
import { throttle } from "lodash-es";
import { join, resolve } from "path";
import STS, { CredentialData } from "qcloud-cos-sts";
import { request } from "undici";
import { parseISO } from "date-fns";

const { getCredential } = STS;

/**
 * 获取cos的sts管理员凭证
 */
export const getCOSMasterCredential =
  async (): Promise<CredentialData | null> =>
    new Promise((resolve) => {
      // 配置参数
      let config = {
        secretId: process.env.SECRET_ID ?? "",
        secretKey: process.env.SECRET_KEY ?? "",
      };
      let policy = {
        version: "2.0",
        statement: [
          {
            action: ["*"],
            effect: "allow",
            resource: ["*"],
          },
        ],
      };
      let startTime = Math.round(Date.now() / 1000);
      getCredential(
        {
          secretId: config.secretId,
          secretKey: config.secretKey,
          policy: policy,
        },
        function (err, tempKeys) {
          if (tempKeys) {
            tempKeys.startTime = startTime;
          }
          if (err) {
            console.log("getCredential", err);
            resolve(null);
          }
          resolve(tempKeys);
        }
      );
    });

const cos = new COS({
  getAuthorization: function (_, callback) {
    getCOSMasterCredential().then((res) => {
      let tempKeys = res;
      if (!tempKeys) return;
      callback({
        TmpSecretId: tempKeys.credentials.tmpSecretId,
        TmpSecretKey: tempKeys.credentials.tmpSecretKey,
        SecurityToken: tempKeys.credentials.sessionToken,
        StartTime: tempKeys.startTime,
        ExpiredTime: tempKeys.expiredTime,
      });
    });
  },
});

const Bucket = "cache-1259243245";
const Region = "ap-beijing";

export const getCOSFileUrl = (key: string) =>
  new Promise<string>((resolve) => {
    cos.getObjectUrl(
      {
        Bucket,
        Region,
        Key: key,
      },
      function (_, data) {
        resolve(data.Url || "");
      }
    );
  });

export interface ProgressInfo {
  loaded: number;
  percent: number;
  speed?: number;
  total: number;
}

/**
 * 通过路径上传
 */
export const uploadFromPath = (data: {
  key: string;
  path: string;
  onError: (err: string) => void;
  onProgress: (progressData: ProgressInfo) => void;
  onSuccessful: () => void;
  onFinished: () => void;
}) => {
  cos.uploadFile(
    {
      Bucket: Bucket,
      Region: Region,
      Key: data.key,
      FilePath: data.path,
      onProgress: data.onProgress,
    },
    function (err) {
      data.onFinished();
      if (err) {
        data.onError(err.message);
        return;
      }
      data.onSuccessful();
    }
  );
};

/**
 * 通过url上传到cos
 */
export const uploadFromUrl = (data: {
  url: string;
  key: string;
  onError: (err: string) => void;
  onDownloadProgress: (progress: ProgressInfo) => void;
  onProgress: (progressData: ProgressInfo) => void;
  onSuccessful: () => void;
}) => {
  let { onError, onDownloadProgress, onProgress, onSuccessful } = data;
  onProgress = throttle(data.onProgress, 500);
  onDownloadProgress = throttle(data.onDownloadProgress, 500);
  onError = (e) => setTimeout(() => data.onError(e), 1000);
  onSuccessful = () => setTimeout(() => data.onSuccessful(), 1000);

  const dir = join(resolve(), "tmp");
  if (!existsSync(dir)) {
    mkdirSync(dir);
  }
  const path = join(dir, encodeURIComponent(data.key));
  const file = createWriteStream(path);
  request(data.url, {
    maxRedirections: 10,
  })
    .then((res) => {
      const total = parseInt(res.headers["content-length"] || "0");
      let loaded = 0;
      res.body.pipe(file);
      res.body
        .on("data", (chunk) => {
          loaded += chunk.length;
          onDownloadProgress({ loaded, total, percent: loaded / total });
        })
        .on("end", () => {
          uploadFromPath({
            key: data.key,
            path: path,
            onError,
            onProgress,
            onSuccessful,
            onFinished: () => {
              rmSync(path);
            },
          });
        })
        .on("error", (err) => {
          onError(err.message);
        });
    })
    .catch((err) => {
      onError(err.message);
    });
};

export interface FileItem {
  key: string;
  // 上传时间
  time: string;
  // 文件大小：以字节为单位
  size: string;
}

export const fetchFileList = (prefix: string) =>
  new Promise<FileItem[] | undefined>((resolve) => {
    cos.getBucket(
      {
        Bucket,
        Region,
        Prefix: prefix,
      },
      function (err: any, data: any) {
        if (err) {
          console.error(err);
          resolve(undefined);
          return;
        }
        let resList: FileItem[] = [];
        for (const item of data.Contents) {
          resList.push({
            time: `${parseISO(item.LastModified).getTime()}`,
            size: `${item.Size}`,
            key: item.Key,
          });
        }
        resolve(resList);
      }
    );
  });
