import { FileAuthorizationResponse } from "interface";
import { APIHandler } from "util/tool";
import { getCOSMasterCredential } from "util/cos";

export default APIHandler<{}, FileAuthorizationResponse>(
  async () => {
    let tempKeys = await getCOSMasterCredential();
    if (!tempKeys) {
      return { ok: false };
    }
    return {
      ok: true,
      tempKeys,
    };
  },
  {
    method: "GET",
  }
);
