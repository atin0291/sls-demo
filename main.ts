import fetch from 'node-fetch';

// ✅ Define API response interface
interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface CreatePostRequest {
  title: string;
  body: string;
  userId: number;
}

interface GetFileResponse {
  fileName: string;
  content: string;
}

// ✅ Define a generic type for API responses
type ApiResponse<T> = Promise<T>;

/**
 * Fetch a post by ID from JSONPlaceholder API
 * @param postId number
 * @returns Promise<Post>
 */
async function fetchPost(): ApiResponse<Post> {
  const url = `https://272dk4p09f.execute-api.us-east-1.amazonaws.com/test-sls`;

  try {
    const response = await fetch(url);
    console.log(response, 'test-url');

    if (!response.ok) {
      throw new Error(`Failed to fetch post. Status: ${response.status}`);
    }

    const data: Post = await response.json() as unknown as Post;
    return data;
  } catch (error) {
    throw new Error(`Error fetching post: ${(error as Error).message}`);
  }
}


async function getPost(postId: number): ApiResponse<Post> {
  const url = `https://mxybtys208.execute-api.ap-south-1.amazonaws.com/posts/${postId}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch post. Status: ${response.status}`);
    }

    const data: Post = await response.json() as unknown as Post;
    return data;
  } catch (error) {
    throw new Error(`Error fetching post: ${(error as Error).message}`);
  }
}


async function createPost(newPost: CreatePostRequest): ApiResponse<Post> {
  const url = `https://mxybtys208.execute-api.ap-south-1.amazonaws.com/posts`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newPost)
    });

    if (!response.ok) {
      throw new Error(`Failed to create post. Status: ${response.status}`);
    }

    const data: Post = await response.json() as unknown as Post;
    return data;
  } catch (error) {
    throw new Error(`Error creating post: ${(error as Error).message}`);
  }
}

async function uploadFile() {
  const payload = {
    fileName: "sample.txt",
    content: "Hello from Node.js!"
  };

  try {
    const response = await fetch('https://mxybtys208.execute-api.ap-south-1.amazonaws.com/upload', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Failed: ${JSON.stringify(response)}`);
    }

    const result = await response.json();
    console.log("Upload Response:", result);
  } catch (err) {
    console.error("Error uploading file:", err);
  }
}
async function getFile(fileName: string): Promise<GetFileResponse> {
    console.log(`https://mxybtys208.execute-api.ap-south-1.amazonaws.com/file/${fileName}`,'1212')
  const response = await fetch(`https://mxybtys208.execute-api.ap-south-1.amazonaws.com/file/${fileName}`);

  if (!response.ok) {
    throw new Error(`Get file failed: ${response.status} ${await response.text()}`);
  }

  return response.json() as Promise<GetFileResponse>;
}

// ✅ Main function to run the API call
(async () => {
  try {
    //  const newPost: CreatePostRequest = {
    //   title: 'My First API Gateway Post',
    //   body: 'This is a test post created via API Gateway Lambda',
    //   userId: 101
    // };
    // const createdPost = await createPost(newPost);
    // console.log('Created Post:', createdPost);

    // // ✅ Fetch the post (if your Lambda returns the created ID, use that)
    // const fetchedPost = await getPost(createdPost.id);
    // console.log('Fetched Post:', fetchedPost);
    // const result = uploadFile();
    // console.log(result,'data uploaded to s3 ')
    const result = await getFile('sample.txt');
    console.log(result,'121211221 ')
  } catch (error) {
    console.error('Error:', (error as Error).message);
  }
})();
