import { inject } from "@loopback/core";
import { MongoDbDataSource } from "../datasources";
import { User, UserRelations } from "../models";
import { DefaultCrudRepository } from "@loopback/repository";
import { comparePassword, generateHashPassword, jwtVerify } from "../utils";
import { ILoginCredentials } from "../interfaces";
import { Collection, Db, ObjectId } from "mongodb";
import { IJWTPayload } from "../interfaces/jwtPayload";

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  private collection: Collection;

  constructor(@inject("datasources.mongoDB") dataSource: MongoDbDataSource) {
    super(User, dataSource);

    const connector = this.dataSource.connector;

    if (!connector || !connector.db) {
      throw new Error("MongoDB connector is not initialized");
    }
    console.log("MongoDB Connector is successfully initialized");
    this.collection = (connector.db as Db).collection("User") as Collection;
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

    return userDoc;
  }

  async login(cretentials: ILoginCredentials) {
    const user = await this.collection.findOne({
      email: cretentials.email,
    });

    if (!user) {
      return null;
    }

    if (await comparePassword(user.password, cretentials.password)) {
      return user;
    }
    return null;
  }

  async getUser(payload: IJWTPayload) {
    return await this.collection.findOne(
      {
        email: payload.email,
        username: payload.username,
      },
      {
        projection: {
          password: 0,
        },
      }
    );
  }

  async getUsers(pageNum: number, limit: number) {
    try {
      const result = await this.collection
        .find({}, { projection: { password: 0 } })
        .limit(limit)
        .skip((pageNum - 1) * limit)
        .toArray();
      console.log("result => ", result);
      return result;
    } catch (err) {
      console.error("Error => ", err);
      return null;
    }
  }

  async getUserById(id: string) {
    try {
      const result = await this.collection.findOne({ _id: new ObjectId(id) });
      console.log(result);
      return result;
    } catch (err) {
      console.log("error => ", err);
      return null;
    }
  }
}
