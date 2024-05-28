import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import {getUserId} from '../utils.mjs'
import {
    generateAttachmentUrl
} from '../../businessLogic/todos.mjs'

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

        const uploadUrl = await generateAttachmentUrl(userId, todoId)

        return {
            statusCode: 200,
            body: JSON.stringify({uploadUrl})
        }
    })
