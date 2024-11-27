import { inject } from "@loopback/core";
import { MongoDbDataSource } from "../datasources";
import { User, UserRelations } from "../models";
import { DefaultCrudRepository } from "@loopback/repository";
export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  constructor(@inject("datasources.mongoDB") dataSource: MongoDbDataSource) {
    super(User, dataSource);
  }

  async signup(user: Partial<User>): Promise<User> {
    const collection = (this.dataSource.connector as any).collection("User");

    const result: any = await collection.insertOne(user);
    const userDoc = {
      ...result.ops[0],
      id: result.ops[0]._id,
    };
    delete userDoc._id;
    return userDoc as User;
  }
}
