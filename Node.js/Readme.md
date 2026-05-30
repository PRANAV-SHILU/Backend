# Node.js

## 1. Node.js Basics

Node.js allows you to run JavaScript outside the browser. It is commonly used for:

- File system operations.
- Creating web servers and APIs.
- Connecting to databases.

---

## 2. Node.js Architecture

Node.js uses a **single-threaded**, **event-driven**, and **non-blocking I/O** architecture.

### How it Works (The Event Loop)

1. **Client Request:** Added to the **Event Queue**.
2. **Event Loop:** Continuously checks the queue and picks up requests.
3. **Processing:**
   - **Non-blocking (Simple) tasks:** Handled immediately by the main thread.
   - **Blocking (Complex) tasks:** Offloaded to the **Thread Pool** (Libuv).
4. **Response:** Once tasks complete, callbacks are placed in the **Callback Queue**, processed by the Event Loop, and sent back to the client.

> [!NOTE]
> Node.js manages execution using **Microtasks** and **Macrotasks** queues to prioritize operations.

---

## 3. Module System

Node supports two module formats. Configure this in `package.json` using `"type": "commonjs"` or `"type": "module"`.

| Feature      | CommonJS (Default/Traditional) | ES Modules (Modern)   |
| :----------- | :----------------------------- | :-------------------- |
| **Syntax**   | `const fs = require("fs")`     | `import fs from "fs"` |
| **File Ext** | `.js`, `.cjs`                  | `.js`, `.mjs`         |

---

## 4. Core Built-in Modules

Node.js provides several built-in modules that are compiled into the binary. Here are some of the most commonly used ones:

- `fs` - File system operations
- `http` / `https` - HTTP server and client
- `path` - File path utilities
- `os` - Operating system utilities
- `events` - Event handling
- `util` - Utility functions
- `stream` - Stream handling
- `crypto` - Cryptographic functions
- `url` - URL parsing
- `querystring` - URL query string handling

---

### HTTP / HTTPS Module

**Key Features:**

- Create HTTP servers to handle requests and send responses.
- Make HTTP requests to other servers.
- Handle different HTTP methods (`GET`, `POST`, `PUT`, `DELETE`, etc.).
- Work with request and response headers.

#### Understanding the Code:

- `http.createServer()` - Creates a new HTTP server instance.
- The callback function is executed for each request with two parameters:
  - `req` - The request object (`http.IncomingMessage`).
  - `res` - The response object (`http.ServerResponse`).
- `res.writeHead()` - Sets the response status code and headers.
- `res.end()` - Sends the response and ends the connection.
- `server.listen()` - Starts the server on the specified port.

---

### Node.js Event System (EventEmitter)

- Node.js uses event-driven architecture (code reacts when events happen).
- `EventEmitter` is the core class used to create and manage events.

#### Setup:

1. **Import EventEmitter:**
   ```javascript
   import EventEmitter from "events";
   ```
2. **Create emitter:**
   ```javascript
   const emitter = new EventEmitter();
   ```

#### Main Methods:

1. **Listen to event:** - Runs the handler when the event occurs.

   ```javascript
   emitter.on("eventName", handlerFunction);
   ```

2. **Emit event:** - Triggers the event.
   ```javascript
   emitter.emit("eventName");
   ```
3. **Pass data with events:** - Listener receives it as parameter.
   ```javascript
   emitter.emit("login", "Pranav");
   ```
4. **Multiple listeners:** - One event can have multiple handlers, all will run when event is emitted.
   One event can have multiple handlers, all will run when event is emitted.

**Flow:** Register listener → Emit event → Listener executes

**Browser vs Node Comparison:**

- **Browser:** `addEventListener("click", handler)` ≈ **Node:** `emitter.on("eventName", handler)`
- **Browser:** `dispatchEvent` ≈ **Node:** `emitter.emit`

#### Mini Summary:

1. `EventEmitter` → class used to create events.
2. `on()` → register a listener.
3. `emit()` → trigger an event.
4. Events can send data.
5. One event can have multiple listeners.
6. Every `emit()` triggers the listeners again.
7. `off('event', listener)` → remove the listener when no longer needed.

---

## 5. Routing

Routing = sending different responses based on the request URL.

Since a Node server has one entry function `(req, res) => {}`, it must check `req.url` to decide which response to send.

**Example URL mapping:**

- `/` → Home page
- `/about` → About page
- `/contact` → Contact page

---

## 6. POST Requests

Used to **receive data** sent by the client.

- `req.on("data", callback)` — receives data in chunks.
- `req.on("end", callback)` — processes data after all chunks are received.

---

## 7. JSON

**JSON (JavaScript Object Notation)** — lightweight data-interchange format used to send/receive structured data between client and server.

---

## 8. Streams

Streams process data **in chunks** as it arrives, instead of loading everything into memory at once.

**Common use cases:**

- File system read/write
- HTTP requests and responses
- Data compression/decompression
- Real-time data processing

**Why use streams?**

- **Memory Efficient** — no need to load full data into memory.
- **Time Efficient** — start processing immediately.
- **Composable** — chain streams into data pipelines.

### Stream Types

| Type        | Description                             | Examples                                |
| :---------- | :-------------------------------------- | :-------------------------------------- |
| `Readable`  | Source — data can be read from it       | `fs.createReadStream()`, HTTP responses |
| `Writable`  | Destination — data can be written to it | `fs.createWriteStream()`, HTTP requests |
| `Duplex`    | Both Readable and Writable              | TCP sockets                             |
| `Transform` | Duplex that modifies data in transit    | Zlib (compression), crypto streams      |

### Stream Events

**Readable:**

- `data` — chunk of data available.
- `end` — no more data.
- `error` — read error.
- `close` — underlying resource closed.
- `readable` — data ready to read.

**Writable:**

- `drain` — ready to accept more data after backpressure.
- `finish` — all data flushed.
- `error` — write error.
- `close` — underlying resource closed.
- `pipe` / `unpipe` — piping started/stopped.

---

## 9. Libraries

### 9.1 bcrypt

**bcrypt** is a library used to **hash and verify passwords** securely. It uses a one-way hashing algorithm with a built-in **salt** to protect against brute-force and rainbow table attacks.

#### Why bcrypt?

- Passwords should **never be stored as plain text**.
- bcrypt makes hashes **slow by design** (via cost factor), making attacks expensive.
- Each hash is **unique** even for the same password (due to salting).

#### Key Concepts

| Term | Description |
| :--- | :---------- |
| **Hashing** | One-way transformation of a password into a fixed string |
| **Salt** | Random data added before hashing to ensure uniqueness |
| **Salt Rounds** | Cost factor — higher = slower & more secure (e.g., `10`) |

#### Core Methods

1. **Hash a password:**
   ```javascript
   import bcrypt from "bcrypt";

   const saltRounds = 10;
   const hash = await bcrypt.hash("myPassword", saltRounds);
   ```

2. **Verify a password:**
   ```javascript
   const isMatch = await bcrypt.compare("myPassword", hash);
   // returns true or false
   ```

> [!NOTE]
> Always use `await` with bcrypt methods since they are asynchronous. Higher salt rounds = stronger security but slower performance. A value of `10–12` is recommended for most apps.

---

### 9.2 busboy

**busboy** is a Node.js library for **parsing incoming HTML form data**, especially `multipart/form-data` (used for file uploads).

#### Why busboy?

- Node.js does **not** natively parse `multipart/form-data`.
- busboy streams file uploads directly to disk or memory **without buffering the entire file**, making it memory-efficient.

#### How It Works

1. Create a `busboy` instance with the request headers.
2. Listen to `file` events for uploaded files.
3. Listen to `field` events for regular form fields.
4. Pipe the request into busboy.

#### Core Events

| Event | Description |
| :---- | :---------- |
| `file` | Fired for each uploaded file — provides filename, stream, and mimetype |
| `field` | Fired for each non-file form field |
| `finish` | Fired when all parts have been processed |
| `error` | Fired on a parsing error |

#### Basic Usage

```javascript
import busboy from "busboy";
import fs from "fs";
import path from "path";

const bb = busboy({ headers: req.headers });

bb.on("file", (fieldname, file, info) => {
  const { filename, mimeType } = info;
  const savePath = path.join("uploads", filename);
  file.pipe(fs.createWriteStream(savePath));
});

bb.on("field", (name, value) => {
  console.log(`Field: ${name} = ${value}`);
});

bb.on("finish", () => {
  res.send("Upload complete!");
});

req.pipe(bb);
```

> [!NOTE]
> busboy works by **streaming** — it never loads the full file into memory, making it ideal for handling large file uploads efficiently.
