import { Entity, model, property } from "@loopback/repository";

@model()
export class User extends Entity {
  @property({
    type: "string",
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: "string",
    required: true,
  })
  username: string;

  @property({
    type: "string",
    required: true,
  })
  email: string;

  @property({
    type: "string",
    required: true,
  })
  password: string;

  @property({
    type: "string",
    default:
      "https://i.pinimg.com/1200x/79/03/fa/7903fa4e4dd43aceb6694a87a8c7bed9.jpg",
  })
  profilePhoto?: string;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
