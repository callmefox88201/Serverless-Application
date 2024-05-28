import jsonwebtoken from 'jsonwebtoken'
import {createLogger} from '../../utils/logger.mjs'
import jwksClient from 'jwks-rsa'

const logger = createLogger('auth')

const jwksUrl = 'https://dev-rwvze8krpe57qodj.us.auth0.com/.well-known/jwks.json'

const client = jwksClient({
    jwksUri: jwksUrl
})

export async function handler(event) {
    try {
        const jwtToken = await verifyToken(event.authorizationToken)

        return {
            principalId: jwtToken.sub,
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Allow',
                        Resource: '*'
                    }
                ]
            }
        }
    } catch (e) {
        logger.error('User not authorized', {error: e.message})

        return {
            principalId: 'user',
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Deny',
                        Resource: '*'
                    }
                ]
            }
        }
    }
}

const getKey = (header, func) => {
    client.getSigningKey(header.kid, (_, key) => {
        func(null, key.publicKey || key.rsaPublicKey)
    })
}

async function verifyToken(authHeader) {
    const token = getToken(authHeader)

    return await new Promise((resolve, reject) => {
        jsonwebtoken.verify(token, getKey, {algorithms: ['RS256']}, (err, decoded) => {
            if (err) {
                reject(err)
            } else {
                resolve(decoded)
            }
        })
    })
}

function getToken(authHeader) {
    if (!authHeader) throw new Error('No authentication header')

    if (!authHeader.toLowerCase().startsWith('bearer '))
        throw new Error('Invalid authentication header')

    const split = authHeader.split(' ')
    const token = split[1]

    return token
}
