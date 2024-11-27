import { inject } from "@loopback/core";
import { MongoDbDataSource } from "../datasources";
import { User, UserRelations } from "../models";
import { DefaultCrudRepository } from "@loopback/repository";
import { generateHashPassword } from "../utils";

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

    return userDoc as User;
  }
}
