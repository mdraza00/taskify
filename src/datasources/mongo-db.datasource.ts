import * as dotenv from "dotenv";

import { inject, lifeCycleObserver, LifeCycleObserver } from "@loopback/core";
import { juggler } from "@loopback/repository";

dotenv.config();

const config = {
  name: "mongoDB",
  connector: "mongodb",
  url: process.env.MONGODB_URL as string,
  host: "",
  port: 0,
  user: "",
  password: "",
  database: "",
  useNewUrlParser: true,
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver("datasource")
export class MongoDbDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = "mongoDB";
  static readonly defaultConfig = config;

  constructor(
    @inject("datasources.config.mongoDB", { optional: true })
    dsConfig: object = config
  ) {
    super(dsConfig);
  }
}
