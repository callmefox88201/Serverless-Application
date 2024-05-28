import {DynamoDB} from '@aws-sdk/client-dynamodb'
import {DynamoDBDocument} from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'

const dynamoDB = new DynamoDB()
const dynamoDbXRay = AWSXRay.captureAWSv3Client(dynamoDB)
const dynamodbClient = DynamoDBDocument.from(dynamoDbXRay)

const todosTable = process.env.TODOS_TABLE
const todosByUserIndexTable = process.env.TODOS_BY_USER_INDEX

export const getTodos = async (userId) => {
    console.log(`getTodos ${userId}`)

    return (await dynamodbClient.query({
        TableName: todosTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        },
        ScanIndexForward: false
    })).Items
}

export const createTodo = async (todo) => {
    console.log(`createTodo ${todo}`)

    await dynamodbClient.put({
        TableName: todosTable,
        IndexName: todosByUserIndexTable,
        Item: todo
    })
    return todo
}

export const updateTodo = async (userId, todoId, todo) => {
    console.log(`updateTodo ${todoId}`)

    await dynamodbClient.update({
        TableName: todosTable,
        Key: {
            userId,
            todoId
        },
        UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
        ExpressionAttributeNames: {
            '#name': 'name'
        },
        ExpressionAttributeValues: {
            ':name': todo.name,
            ':dueDate': todo.dueDate,
            ':done': todo.done
        }
    })
}

export const deleteTodo = async (userId, todoId) => {
    console.log(`deleteTodo ${todoId}`)

    await dynamodbClient.delete({
        TableName: todosTable,
        Key: {
            userId,
            todoId
        }
    })
}

export const updateTodoImage = async (userId, todoId, uploadUrl) => {
    await dynamodbClient.update({
        TableName: todosTable,
        Key: {
            userId,
            todoId
        },
        UpdateExpression: 'set #attachmentUrl = :attachmentUrl',
        ExpressionAttributeNames: {
            '#attachmentUrl': 'attachmentUrl'
        },
        ExpressionAttributeValues: {
            ':attachmentUrl': uploadUrl
        }
    })
}