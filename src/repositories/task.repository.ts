import { inject } from "@loopback/core";
import { DefaultCrudRepository } from "@loopback/repository";
import { MongoDbDataSource } from "../datasources";
import { Task, TaskRelations } from "../models";
import { Collection, Db, ObjectId } from "mongodb";

export class TaskRepository extends DefaultCrudRepository<
  Task,
  typeof Task.prototype.id,
  TaskRelations
> {
  private collection: Collection;

  constructor(@inject("datasources.mongoDB") dataSource: MongoDbDataSource) {
    super(Task, dataSource);

    const connector = this.dataSource.connector;

    if (!connector || !connector.db) {
      throw new Error("MongoDB connector is not initialized");
    }

    this.collection = (connector.db as Db).collection("Task") as Collection;
  }

  async getTaskById(id: string) {
    try {
      const objectid = new ObjectId(id);

      const result = await this.collection
        .aggregate([
          {
            $match: { _id: objectid },
          },
          {
            $lookup: {
              from: "User",
              localField: "ownerId",
              foreignField: "_id",
              as: "ownerId",
            },
          },
          {
            $project: {
              "ownerId.password": 0,
              "ownerId._id": 0,
              _id: 0,
            },
          },
        ])
        .toArray();
      return result;
    } catch (err) {
      console.error("fail to find task. Error => ", err);
      return null;
    }
  }
}
