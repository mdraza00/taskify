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
}
