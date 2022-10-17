import { APIHandler } from "util/tool";
import { getCOSMasterCredential } from "util/cos";

export interface FileAuthorizationResponse {
  tempKeys?: any;
}

export default APIHandler<{}, FileAuthorizationResponse>({
  method: "GET",
  handler: async ({ setStatus }) => {
    let tempKeys = await getCOSMasterCredential();
    if (!tempKeys) {
      setStatus(500);
      return;
    }
    return {
      tempKeys,
    };
  },
});
