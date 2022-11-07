const config = {
  shimo: {
    clientId: "your client id",
    clientSecret: "your client secret",
    username: "your username",
    password: "your password",
    scope: "user",
  },
  database: {
    dbname: "your db name",
    address: "your db address",
    username: "your db username",
    password: "your db password",
  },
  upload: {
    bucket: "your bucket name",
    region: "your bucket region",
    accessKey: "your access key",
    secretKey: "your secret key",
  },
  telegram: {
    botToken: "your bot token",
    chatId: "your chat id",
  },
  aliyun: {
    endpoint: "your endpoint",
    accessKeyId: "your access key id",
    accessKeySecret: "your access key secret",
  }
}

export default {
  async fetch(request, env) {
    return await handleRequest(request)
  }
}

async function handleRequest(request) {
  return new Response("Hello world")
}