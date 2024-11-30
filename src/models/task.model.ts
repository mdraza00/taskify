import {
  belongsTo,
  Entity,
  hasOne,
  model,
  property,
} from "@loopback/repository";
import { User } from "./user.model";

@model()
export class Task extends Entity {
  @property({
    type: "string",
    id: true,
    generated: true,
  })
  id: string;

  @property({ type: "string", required: true })
  title: string;

  @property({ type: "string", required: true })
  description: string;

  @property({ type: "string", required: true })
  status: boolean;

  @property({ type: "string", required: true })
  dueDate: string;

  @belongsTo(() => User)
  ownerId: string;

  constructor(data?: Partial<Task>) {
    super(data);
  }
}
export interface TaskRelations {
  user: User;
}
export type TaskWithRelations = Task & TaskRelations;
