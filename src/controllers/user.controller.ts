import { repository } from "@loopback/repository";
import { UserRepository } from "../repositories";
import {
  get,
  getModelSchemaRef,
  post,
  Request,
  requestBody,
  Response,
  response,
  RestBindings,
} from "@loopback/rest";
import { User } from "../models";
import { jwtSign, jwtVerify } from "../utils";
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

    if (!result) {
      return this.res.status(401).json({
        message: "Incorrect email or password",
        data: null,
      });
    }

    return this.res.status(200).json({
      message: "User Authenticated successfully",
      data: {
        access_token: jwtSign({
          username: result.username,
          email: result.email,
        }),
        user: result,
      },
    });
  }

  @get("/user/get-user")
  async getUser() {
    const token = (this.req.headers.authorization as string).split(" ")[1];
    const payload = jwtVerify(token);
    if (!payload) {
      return this.res.status(401).json({
        message: "Unauthorized",
        data: null,
      });
    }

    const user = await this.userRepository.getUser(payload);

    if (!user) {
      return this.res.status(404).json({
        message: "User not found",
        data: null,
      });
    }

    return this.res.status(200).json({
      message: "user found successfully.",
      data: user,
    });
  }
}
