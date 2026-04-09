import { onOfficeSDK } from "../src/index.js";

async function run(): Promise<void> {
  const parameterCacheId = " ";
  const extendedClaim = " ";
  const apiUserToken = process.env.ONOFFICE_TOKEN ?? " ";
  const apiUserSecret = process.env.ONOFFICE_SECRET ?? " ";

  const sdk = new onOfficeSDK();
  sdk.setApiVersion("stable");

  const parameterUnlockProvider = {
    parameterCacheId,
    extendedclaim: extendedClaim,
  };

  const handleUnlockProvider = sdk.callGeneric(
    onOfficeSDK.ACTION_ID_DO,
    "unlockProvider",
    parameterUnlockProvider,
  );

  await sdk.sendRequests(apiUserToken, apiUserSecret);

  console.log(sdk.getResponseArray(handleUnlockProvider));
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
