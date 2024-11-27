import { repository } from "@loopback/repository";
import { UserRepository } from "../repositories";
import { getModelSchemaRef, post, requestBody, response } from "@loopback/rest";
import { User } from "../models";

export class UserController {
  constructor(
    @repository(UserRepository) public userRepository: UserRepository
  ) {}

  @post("/User")
  @response(200, {
    description: "User model instance",
    content: { "application/json": { schema: getModelSchemaRef(User) } },
  })
  async create(
    @requestBody({
      content: {
        "application/json": {
          schema: getModelSchemaRef(User, { title: "NewUser" }),
        },
      },
    })
    user: User
  ): Promise<User> {
    return this.userRepository.signup(user);
  }
}
