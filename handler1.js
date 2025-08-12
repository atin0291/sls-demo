exports.hello = async (event) => {
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
