import fetch from 'node-fetch';

const APPSYNC_URL = "https://tuf4hknukzajjf44btmthfyyt4.appsync-api.ap-south-1.amazonaws.com/graphql";
const API_KEY = "da2-pmgo4aqaazabzjbbaujfk4shuu";

async function getPost(id: string) {
  const query = `
    query GetPost($id: String!) {
  getPostsTable(id: $id) {
    id
    title
    body
  }
}

  `;

  const response = await fetch(APPSYNC_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY
    },
    body: JSON.stringify({ query, variables: { id } })
  });

  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
}

getPost("e75e0441-a414-447d-8bda-ed0a0e13c043");
