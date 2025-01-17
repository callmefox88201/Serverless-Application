import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../utils.mjs'
import { updateTodo } from '../../businessLogic/todos.mjs'

export const handler = middy()
    .use(httpErrorHandler())
    .use(
        cors({
          credentials: true
        })
    )
    .handler(async (event) => {
      const userId = getUserId(event)
      const todoId = event.pathParameters.todoId

      const todoUpdateRequest = JSON.parse(event.body)

      await updateTodo(userId, todoId, todoUpdateRequest)
    })
