import {PutObjectCommand, S3Client} from '@aws-sdk/client-s3'
import {getSignedUrl} from '@aws-sdk/s3-request-presigner'

const s3Client = new S3Client()

const bucketName = process.env.TODOS_BUCKET

export const generateAttachUrl = async (itemId) => {
    const url = `https://${bucketName}.s3.amazonaws.com/${itemId}`
    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: itemId
    })
    const presignedUrl = await getSignedUrl(s3Client, command)
    return {presignedUrl, url}
}
