// create basic node server
import http from "http";
import fs, { readFile } from "fs";
// import fs from "fs/promises"; // for more control in try catch write
import path from "path";
import os from "os";
import EventEmitter from "events";
import url from "url";

//http module
console.log("\n----------------\nHTTP MODULE\n-----------------\n");
const server = http.createServer((req, res) => {
  const { url, method } = req; // method means GET/POST/etc

  // res.setHeader("Content-Type", "text/html");
  // res.write(`
  //   <html>
  //     <head>
  //       <title>My Node Server</title>
  //     </head>
  //     <body style="background-color: black; font-family: sans-serif; padding: 40px; color: green;">
  //       <h1>This is h1 of res.write</h1>
  //       <p>You made a <strong>${method}</strong> request to <strong>${url}</strong></p>
  //       <p>Hello from node.js server!</p>
  //     </body>
  //   </html>
  // `);
  // res.end();

  // if (url === "/") {
  //   res.end("Home Page");
  // } else if (url === "/about") {
  //   res.end("About Page");
  // } else {
  //   res.statusCode = 404;
  //   res.end("Page not found");
  // }

  const data = {
    name: "Pranav",
    role: "Developer",
  };

  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
});

server.listen(3000, () => {
  console.log("\nserver is running on port 3000");
});

// fs module
console.log("\n----------------\nFS MODULE\n-----------------\n");
// to write file syncronously
fs.writeFileSync("./myfile.txt", "Hello from WriteFileSync of node.js");

// to append syncronously
fs.appendFileSync("./myfile.txt", "\nHello from appendFileSync of node.js");

//to read data synchronously
const data = fs.readFileSync("./myfile.txt", "utf-8");
console.log("File data from readFileSync: ", data);

// to write file assyncronously
fs.writeFile("./myfile.txt", "Hello from WriteFile of node.js", (err) => {
  if (err) {
    console.log("\nfile error: ", err);
  } else {
    console.log("\nFile written  asynchrounously successfully");
  }
});

// to append assyncronously
fs.appendFile("./myfile.txt", "\nHello from appendFile of node.js", (err) => {
  if (err) {
    console.log("\nfile error: ", err);
  } else {
    console.log("\nFile appended  asynchrounously successfully");
  }
});

//to read a file assyncronously
fs.readFile("./myfile.txt", "utf8", (err, data) => {
  if (err) {
    console.log("\nfile error: ", err);
  } else {
    console.log("\nFile data from readFile Asynchrounous: ", data);
  }
});

// For more control over file operations, you can use file handles:
// uncommenet import fs/promises
// async function writeWithFileHandle() {
//   let fileHandle;

//   try {
//     // Open a file for writing (creates if doesn't exist)
//     fileHandle = await fs.open('output.txt', 'w');

//     // Write content to the file
//     await fileHandle.write('First line\n');
//     await fileHandle.write('Second line\n');
//     await fileHandle.write('Third line\n');

//     console.log('Content written successfully');
//   } catch (err) {
//     console.error('Error writing to file:', err);
//   } finally {
//     // Always close the file handle
//     if (fileHandle) {
//       await fileHandle.close();
//     }
//   }
// }

// writeWithFileHandle();

const readStream = fs.createReadStream("myfile.txt", "utf-8");
readStream.on("data", (chunk) => {
  console.log("New chunk received:");
  console.log(chunk);
});
readStream.on("end", () => {
  console.log("File reading completed");
});
readStream.on("error", (err) => {
  console.error("Error reading from stream:", err);
});

// Create readable and writable streams
const readableStream = fs.createReadStream("myfile.txt");
const writableStream = fs.createWriteStream("destination.txt");

// Pipe the readable stream to the writable stream
readableStream.pipe(writableStream);

//import
console.log("\n----------------\nIMPORT\n-----------------\n");
import { add, subtract } from "./math.js";
console.log("add ", add(1, 2));
console.log("subtract", subtract(1, 2));

import multiply from "./math.js";
console.log("multiply", multiply(1, 2));

// Path module
console.log("\n----------------\nPATH MODULE\n-----------------\n");
console.log("extension name: ", path.extname("path_folder/path_ex.txt"));
console.log("file name: ", path.basename("path_folder/path_ex.txt"));
console.log("directory name: ", path.dirname("path_folder/path_ex.txt"));
console.log("join: ", path.join("path_folder", "path_ex.txt"));
console.log("resolve: ", path.resolve("path_folder", "path_ex.txt"));
console.log("absolute path: ", path.isAbsolute("path_folder/path_ex.txt"));
console.log("parsed path: ", path.parse("path_folder/path_ex.txt"));

//  OS module
console.log("\n----------------\nOS MODULE\n-----------------\n");
console.log("OS Arch: ", os.arch());
console.log("OS cpus: ", os.cpus().length);
// console.log("OS cpus: ",os.cpus());
console.log("OS freemem: ", os.freemem());
console.log("OS homedir: ", os.homedir());
console.log("OS hostname: ", os.hostname());
console.log("OS loadavg: ", os.loadavg());
console.log("OS platform: ", os.platform());
console.log("OS release: ", os.release());
console.log("OS tmpdir: ", os.tmpdir());
console.log("OS totalmem: ", os.totalmem());
console.log("OS type: ", os.type());
// console.log("OS userinfo: ",os.userInfo());
console.log("OS uptime: ", os.uptime());
console.log("OS version: ", os.version());
console.log("OS machine: ", os.machine());

// Event Emitter
// Later, remove the listener when no longer needed
// myEmitter.off('event', listener);

console.log("\n----------------\nEVENT EMITTER\n-----------------\n");
const emitter = new EventEmitter();

emitter.on("greet", () => {
  console.log("Greet Event triggred");
});
emitter.emit("greet");

// Passing Data Through Events
emitter.on("login", (name) => {
  console.log(`${name} logged in`);
});
emitter.emit("login", "Pranav");

// Multiple Listeners for One Event
emitter.on("userRegistered", (user) => {
  console.log("Send welcome email to " + user);
});

emitter.on("userRegistered", (user) => {
  console.log("Create profile for " + user);
});

emitter.emit("userRegistered", "Pranav");

//URL
console.log("\n----------------\nURL\n-----------------\n");
let adr = "http://localhost:3000/default.html?year=2017&month=february";
let q = url.parse(adr, true);
console.log("q", q);
console.log("host:", q.host);
console.log("pathname:", q.pathname);
console.log("search:", q.search);

console.log("\n----------------\nEXTRA\n-----------------");
