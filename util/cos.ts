import COS from "cos-nodejs-sdk-v5";
import { CredentialData, getCredential } from "qcloud-cos-sts";

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

/**
 * 通过流上传
 */
export const uploadFromStream = (data: {
  key: string;
  stream: NodeJS.ReadableStream;
  total: number;
  onError: (err: string) => void;
  // percent: 0-1
  onProgress: (percent: number) => void;
  onSuccessful: () => void;
}) => {
  cos.putObject(
    {
      Bucket,
      Region,
      Key: data.key,
      StorageClass: "STANDARD",
      Body: data.stream,
      ContentLength: data.total,
      onProgress: function (progressData) {
        data.onProgress(progressData.percent);
      },
    },
    function (err) {
      if (err) {
        data.onError(err.message);
        return;
      }
      data.onSuccessful();
    }
  );
};
