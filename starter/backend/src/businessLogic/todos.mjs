import {v4 as uuidv4} from 'uuid'
import {
    getTodos as getTodosLogic,
    createTodo as createTodoLogic,
    updateTodo as updateTodoLogic,
    deleteTodo as deleteTodoLogic,
    updateTodoImage,
} from '../dataLayer/todosAccess.mjs'
import {generateAttachUrl} from '../fileStorage/attachmentUtils.mjs'

export const getTodos = async (userId) => await getTodosLogic(userId)

export const createTodo = async (userId, item) =>
    await createTodoLogic({
        ...item,
        userId,
        todoId: uuidv4(),
        createdAt: new Date().toISOString()
    })

export const updateTodo = async (userId, todoId, item) =>
    await updateTodoLogic(userId, todoId, item)

export const deleteTodo = async (userId, todoId) =>
    await deleteTodoLogic(userId, todoId)

export const generateAttachmentUrl = async (userId, todoId) => {
    const imageId = uuidv4()
    const {presignedUrl, url} = await generateAttachUrl(imageId)
    await updateTodoImage(userId, todoId, url)
    return presignedUrl
}
