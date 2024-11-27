import { inject } from "@loopback/core";
import { MongoDbDataSource } from "../datasources";
import { User, UserRelations } from "../models";
import { DefaultCrudRepository } from "@loopback/repository";
import { generateHashPassword } from "../utils";
import { ILoginCredentials } from "../interfaces";
import { Collection, Db } from "mongodb";

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  private db: Db;

  constructor(@inject("datasources.mongoDB") dataSource: MongoDbDataSource) {
    super(User, dataSource);

    const connector = this.dataSource.connector;

    if (!connector || !connector.db) {
      throw new Error("MongoDB connector is not initialized");
    }

    this.db = connector.db as Db;
  }

  async signup(user: Partial<User>): Promise<User> {
    const collection = (this.dataSource.connector as any).collection("User");

    user.profilePhoto = user.profilePhoto
      ? user.profilePhoto
      : "https://i.pinimg.com/1200x/79/03/fa/7903fa4e4dd43aceb6694a87a8c7bed9.jpg";

    const hashPassword = await generateHashPassword(user.password as string);
    user.password = hashPassword;

    const result: any = await collection.insertOne(user);

    const userDoc = {
      ...result.ops[0],
      id: result.ops[0]._id,
    };
    delete userDoc._id;

    return { ...userDoc, access_token: "" };
  }

  async login(cretentials: ILoginCredentials) {
    const collection: Collection = this.db.collection("User");
    return await collection.findOne(cretentials);
  }
}
