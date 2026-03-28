import process from "node:process";

export default class Envs {
  public static readonly NODE_ENV: string = process.env.NODE_ENV!!;
  public static readonly IS_OFFLINE: Boolean = JSON.parse(
    process.env.IS_OFFLINE || "false",
  );

  public static readonly TRANSACTIONS_TABLE: string =
    process.env.TRANSACTIONS_TABLE || "transactions-table";

  public static readonly DYNAMODB_LOCAL_REGION: string =
    process.env.DYNAMODB_LOCAL_REGION || process.env.AWS_DEFAULT_REGION || "";
  public static readonly DYNAMODB_LOCAL_ENDPOINT: string =
    process.env.DYNAMODB_LOCAL_ENDPOINT || "";
  public static readonly AWS_ACCESS_KEY_ID: string =
    process.env.AWS_ACCESS_KEY_ID || "";
  public static readonly AWS_SECRET_ACCESS_KEY: string =
    process.env.AWS_SECRET_ACCESS_KEY || "";
}
