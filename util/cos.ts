import COS from "cos-nodejs-sdk-v5";
import { createWriteStream, existsSync, mkdirSync, rmSync } from "fs";
import { join, throttle } from "lodash-es";
import nodeFetch from "node-fetch";
import { resolve } from "path";
import STS, { CredentialData } from "qcloud-cos-sts";

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
 * 通过流上传
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
  data.onProgress = throttle(data.onProgress, 500);
  data.onDownloadProgress = throttle(data.onDownloadProgress, 500);
  nodeFetch(data.url, {
    method: "GET",
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("远程下载文件失败，" + res.statusText);
      }
      const dir = join(resolve(), "tmp");
      let total = parseInt(res.headers.get("content-length") || "0");
      if (!total) {
        throw new Error("远程下载文件失败，无法获取文件大小");
      }
      if (!existsSync(dir)) {
        mkdirSync(dir);
      }
      const path = join(dir, encodeURIComponent(data.key));
      const fileStream = res.body.pipe(createWriteStream(path));
      let loaded = 0;
      res.body.on("data", (chunk) => {
        loaded += chunk.length;
        data.onDownloadProgress({
          loaded,
          total,
          percent: loaded / total,
        });
      });
      fileStream
        .on("finish", () => {
          uploadFromPath({
            ...data,
            path,
            onFinished: () => {
              rmSync(path);
            },
          });
        })
        .on("error", () => {
          data.onError("远程下载文件失败，文件流异常");
        });
    })
    .catch((e) => {
      data.onError(e.message);
    });
};
