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
            console.log(err);
            resolve(null);
          }
          resolve(tempKeys);
        }
      );
    });
