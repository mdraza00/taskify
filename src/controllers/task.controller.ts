import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from "@loopback/repository";
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
  RestBindings,
  Request,
  Response,
} from "@loopback/rest";
import { Task } from "../models";
import { TaskRepository } from "../repositories";
import { inject } from "@loopback/core";

export class TaskController {
  constructor(
    @repository(TaskRepository)
    public taskRepository: TaskRepository,
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @inject(RestBindings.Http.RESPONSE) private res: Response
  ) {}

  @post("/Task")
  @response(200, {
    description: "Task model instance",
    content: { "application/json": { schema: getModelSchemaRef(Task) } },
  })
  async create(
    @requestBody({
      content: {
        "application/json": {
          schema: getModelSchemaRef(Task, {
            title: "NewTask",
          }),
        },
      },
    })
    task: Task
  ): Promise<Task> {
    return this.taskRepository.create(task);
  }

  @get("/Task/count")
  @response(200, {
    description: "Task model count",
    content: { "application/json": { schema: CountSchema } },
  })
  async count(@param.where(Task) where?: Where<Task>): Promise<Count> {
    return this.taskRepository.count(where);
  }

  @get("/Task")
  @response(200, {
    description: "Array of Task model instances",
    content: {
      "application/json": {
        schema: {
          type: "array",
          items: getModelSchemaRef(Task, { includeRelations: true }),
        },
      },
    },
  })
  async find(@param.filter(Task) filter?: Filter<Task>): Promise<Task[]> {
    return this.taskRepository.find(filter);
  }

  @patch("/Task")
  @response(200, {
    description: "Task PATCH success count",
    content: { "application/json": { schema: CountSchema } },
  })
  async updateAll(
    @requestBody({
      content: {
        "application/json": {
          schema: getModelSchemaRef(Task, { partial: true }),
        },
      },
    })
    task: Task,
    @param.where(Task) where?: Where<Task>
  ): Promise<Count> {
    return this.taskRepository.updateAll(task, where);
  }

  @get("/Task/{id}")
  @response(200, {
    description: "Task model instance",
    content: {
      "application/json": {
        schema: getModelSchemaRef(Task, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.string("id") id: string,
    @param.filter(Task, { exclude: "where" })
    filter?: FilterExcludingWhere<Task>
  ): Promise<Task> {
    return this.taskRepository.findById(id, filter);
  }

  @patch("/Task/{id}")
  @response(204, {
    description: "Task PATCH success",
  })
  async updateById(
    @param.path.string("id") id: string,
    @requestBody({
      content: {
        "application/json": {
          schema: getModelSchemaRef(Task, { partial: true }),
        },
      },
    })
    task: Task
  ): Promise<void> {
    await this.taskRepository.updateById(id, task);
  }

  @put("/Task/{id}")
  @response(204, {
    description: "Task PUT success",
  })
  async replaceById(
    @param.path.string("id") id: string,
    @requestBody() task: Task
  ): Promise<void> {
    await this.taskRepository.replaceById(id, task);
  }

  @del("/Task/{id}")
  @response(204, {
    description: "Task DELETE success",
  })
  async deleteById(@param.path.string("id") id: string): Promise<void> {
    await this.taskRepository.deleteById(id);
  }

  @get("/Tast/get-by-id/{id}")
  async getTaskByID(@param.path.string("id") id: string) {
    const result = await this.taskRepository.getTaskById(id);
    if (!result) {
      return this.res.status(404).json({
        message: "Task not found",
        data: null,
      });
    }
    return this.res.status(200).json({
      message: "task found successfully.",
      data: result,
    });
  }
}
