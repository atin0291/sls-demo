const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  DeleteCommand
} = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const s3 = new S3Client({ region: process.env.AWS_REGION });

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.TABLE_NAME;
const BUCKET_NAME = process.env.BUCKET_NAME;

// ✅ Helper functions
const response = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body)
});

// ✅ Hello Function
module.exports.hello = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      userId: 1,
      id: 101,
      title: "Hello from Serverless!",
      body: "Your Lambda function executed successfully.",
    }),
  };
};

// ✅ Create Post
module.exports.createPost = async (event) => {
  try {
    const data = JSON.parse(event.body);
    const post = {
      id: uuidv4(),
      title: data.title,
      content: data.content
    };

    await docClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: post
    }));

    return response(201, post);
  } catch (err) {
    return response(500, { error: err.message });
  }
};

// ✅ Get Post
module.exports.getPost = async (event) => {
  try {
    const id = event.pathParameters.id;

    const result = await docClient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { id }
    }));

    if (!result.Item) {
      return response(404, { error: "Post not found" });
    }

    return response(200, result.Item);
  } catch (err) {
    return response(500, { error: err.message });
  }
};

// ✅ Delete Post
module.exports.deletePost = async (event) => {
  try {
    const id = event.pathParameters.id;

    await docClient.send(new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { id }
    }));

    return response(200, { message: "Post deleted successfully" });
  } catch (err) {
    return response(500, { error: err.message });
  }
};

module.exports.uploadFile = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');

    if (!body.fileName || !body.content) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "fileName and content are required" })
      };
    }

    const params = {
      Bucket: BUCKET_NAME,
      Key: body.fileName,
      Body: body.content,
      ContentType: "text/plain"
    };
    const fileUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${body.fileName}`;

    await s3.send(new PutObjectCommand(params));

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "File uploaded successfully",
        fileUrl
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
async function streamToString(stream){
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
  });
}
module.exports.getFile = async (event) => {
  try {
    const fileName = event.pathParameters?.fileName;
    if (!fileName) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "fileName is required in path" }),
      };
    }

    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: fileName?.trim(),
    };
    console.log(params,'wqwqwqqwqw')

    const response = await s3.send(new GetObjectCommand(params));
    const fileContent = await streamToString(response.Body);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName, content: fileContent }),
    };
  } catch (error) {
    console.error("Get Error:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
