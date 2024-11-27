import { repository } from "@loopback/repository";
import { UserRepository } from "../repositories";
import {
  getModelSchemaRef,
  post,
  Request,
  requestBody,
  Response,
  response,
  RestBindings,
} from "@loopback/rest";
import { User } from "../models";
import { jwtSign } from "../utils";
import { inject } from "@loopback/core";
import { ILoginCredentials } from "../interfaces";

export class UserController {
  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @inject(RestBindings.Http.RESPONSE) private res: Response
  ) {}

  @post("/user")
  @response(200, {
    description: "User model instance",
    content: { "application/json": { schema: getModelSchemaRef(User) } },
  })
  async create(
    @requestBody({
      content: {
        "application/json": {
          schema: getModelSchemaRef(User),
        },
      },
    })
    user: User
  ) {
    const userDoc = await this.userRepository.signup(user);
    return this.res.status(200).json({
      status: "user signup successfull",
      access_token: jwtSign({
        username: userDoc.username,
        email: userDoc.email,
      }),
      user: userDoc,
    });
  }

  @post("/user/login")
  async login(
    @requestBody({
      content: {
        "application/json": {
          examples: {
            "login-example": {
              value: { email: "test@gmail.com", password: "test1234" },
            },
          },
        },
      },
    })
    credentials: ILoginCredentials
  ) {
    if (!credentials.email) {
      return this.res.status(422).json({
        message: "email is required",
      });
    }
    if (!credentials.password) {
      return this.res.status(422).json({
        message: "password is required",
      });
    }

    const result = await this.userRepository.login(credentials);
    console.log(result);
    return this.res.status(200).json({
      message: "User Authenticated successfully",
    });
  }
}
