import * as fs from 'fs';
import { promisify } from 'util';

const filePath = './test.txt';
const dataToWrite = 'Hello from Node.js and TypeScript!\n';
const dataToAppend = 'Appended text!\n';

// Promisify fs functions for async/await style
const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);
const appendFileAsync = promisify(fs.appendFile);
const unlinkAsync = promisify(fs.unlink);

// 1. SYNCHRONOUS

function syncFileOps() {
  // Create or overwrite
  fs.writeFileSync(filePath, dataToWrite);

  // Read
  const content = fs.readFileSync(filePath, 'utf8');
  console.log('Sync Read:', content);

  // Update (append)
  fs.appendFileSync(filePath, dataToAppend);

  // Read again
  const updatedContent = fs.readFileSync(filePath, 'utf8');
  console.log('Sync Read after append:', updatedContent);

  // Delete
  fs.unlinkSync(filePath);
  console.log('Sync file deleted');
}

// 2. ASYNCHRONOUS (Promise style with async/await)

async function asyncFileOps() {
  // Create or overwrite
  await writeFileAsync(filePath, dataToWrite);

  // Read
  let content = await readFileAsync(filePath, 'utf8');
  console.log('Async Read:', content);

  // Update (append)
  await appendFileAsync(filePath, dataToAppend);

  // Read again
  content = await readFileAsync(filePath, 'utf8');
  console.log('Async Read after append:', content);

  // Delete
  await unlinkAsync(filePath);
  console.log('Async file deleted');
}

// 3. STREAMS

function streamFileOps() {
  // Create a write stream and write data
  const writeStream = fs.createWriteStream(filePath);
  writeStream.write(dataToWrite);
  writeStream.end();

  writeStream.on('finish', () => {
    // Read with read stream
    const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });
    let data = '';

    readStream.on('data', chunk => {
      data += chunk;
    });

    readStream.on('end', () => {
      console.log('Stream Read:', data);

      // Append using a write stream in append mode
      const appendStream = fs.createWriteStream(filePath, { flags: 'a' });
      appendStream.write(dataToAppend);
      appendStream.end();

      appendStream.on('finish', () => {
        // Read again after append
        const readStream2 = fs.createReadStream(filePath, { encoding: 'utf8' });
        let data2 = '';

        readStream2.on('data', chunk => {
          data2 += chunk;
        });

        readStream2.on('end', () => {
          console.log('Stream Read after append:', data2);

          // Delete file
          fs.unlink(filePath, err => {
            if (err) throw err;
            console.log('Stream file deleted');
          });
        });
      });
    });
  });
}

// Run examples
syncFileOps();

asyncFileOps().then(() => {
  streamFileOps();
});
