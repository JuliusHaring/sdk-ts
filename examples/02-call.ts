import { onOfficeSDK } from "../src/index.js";

async function run(): Promise<void> {
  const token = process.env.ONOFFICE_TOKEN ?? "put the token here";
  const secret = process.env.ONOFFICE_SECRET ?? "and secret here";

  const sdk = new onOfficeSDK();
  sdk.setApiVersion("stable");

  const parametersSearchEstate = {
    input: "Aachen",
  };

  const handleSearchEstate = sdk.call(
    onOfficeSDK.ACTION_ID_GET,
    "estate",
    "",
    "search",
    parametersSearchEstate,
  );

  await sdk.sendRequests(token, secret);

  console.log(sdk.getResponseArray(handleSearchEstate));
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
