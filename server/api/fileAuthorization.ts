import { defineHandler, SE } from "@/util";
import { getCOSMasterCredential } from "@/util/cos";

export default defineHandler(async () => {
  let tempKeys = await getCOSMasterCredential();
  if (!tempKeys) {
    throw new SE(500, "获取临时密钥失败");
  }
  return {
    tempKeys,
    secretId: process.env.SECRET_ID ?? "",
    secretKey: process.env.SECRET_KEY ?? "",
  };
});
