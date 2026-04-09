import { onOfficeSDK } from "../src/index.js";

async function run(): Promise<void> {
  const token = process.env.ONOFFICE_TOKEN ?? "put the token here";
  const secret = process.env.ONOFFICE_SECRET ?? "and secret here";

  const sdk = new onOfficeSDK();
  sdk.setApiVersion("stable");

  const parametersReadEstate = {
    data: ["Id", "kaufpreis", "lage"],
    listlimit: 10,
    sortby: {
      kaufpreis: "ASC",
      warmmiete: "ASC",
    },
    filter: {
      kaufpreis: [{ op: ">", val: 300000 }],
      status: [{ op: "=", val: 1 }],
    },
  };

  const handleReadEstate = sdk.callGeneric(
    onOfficeSDK.ACTION_ID_READ,
    "estate",
    parametersReadEstate,
  );

  await sdk.sendRequests(token, secret);

  console.log(sdk.getResponseArray(handleReadEstate));
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
