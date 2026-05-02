import DB from "./db/connection.js";
import http from "http";
import Busboy from "busboy";
import fs from "fs";
import path from "path";

const type = "Content-Type";
const json = "application/json";

async function testDB() {
  try {
    const [rows] = await DB.execute("SELECT 1 + 1 AS result");
    console.log("✅ DB Connected, Test Result:", rows[0].result);
  } catch (err) {
    console.error("❌ DB Connection Failed:", err);
  }
}

const server = http.createServer(async (req, res) => {
  //cors
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  //GET image
  if (req.url.startsWith("/uploads")) {
    // req.url = /uploads/a.png
    // becomes ./uploads/a.png
    // . means current project folder
    const filePath = `.${req.url}`;

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        return res.end("File not found");
      }

      res.writeHead(200);
      res.end(data);
    });

    return;
  }

  //GET: all USERS with search
  if (req.url.startsWith("/users?") && req.method === "GET") {
    try {
      const url = new URL(req.url, "http://localhost:3000");
      const search = url.searchParams.get("search");
      let query = "SELECT * FROM users";
      let values = [];

      if (search && search.trim() !== "") {
        query += " WHERE name LIKE ? OR email LIKE ? ";
        values.push(`%${search}%`, `%${search}%`);
      }

      const [rows] = await DB.execute(query, values);
      const users = rows.map((user) => ({
        ...user,
        image: `http://localhost:3000/${user.image}`,
      }));
      res.statusCode = 200;
      res.setHeader(type, json);
      return res.end(JSON.stringify(users));
    } catch (err) {
      res.writeHead(500, { [type]: json });
      return res.end(
        JSON.stringify({
          error: "Server Error for GET all",
          message: err.message,
        }),
      );
    }
  }

  //GET: single user
  if (req.url.startsWith("/users/") && req.method === "GET") {
    try {
      const id = Number(req.url.split("/")[2]);

      // 🛡️ Validate id
      if (!id || isNaN(id)) {
        res.writeHead(400, { [type]: json });
        return res.end(JSON.stringify({ error: "Invalid user ID" }));
      }

      const [rows] = await DB.execute("SELECT * FROM users WHERE id = ?", [id]);

      // 🛡️ Handle not found
      if (rows.length === 0) {
        res.writeHead(404, { [type]: json });
        return res.end(JSON.stringify({ error: "User not found" }));
      }
      rows[0].image = `http://localhost:3000/${rows[0].image}`;
      res.statusCode = 200;
      res.setHeader(type, json);
      return res.end(JSON.stringify(rows[0]));
    } catch (err) {
      res.writeHead(500, { [type]: json });
      return res.end(
        JSON.stringify({
          error: "Server Error on GET specific",
          message: err.message,
        }),
      );
    }
  }

  //POST: Add user / For JSON
  // if (req.url === "/users" && req.method === "POST") {
  //   let body = "";

  //   req.on("data", (chunk) => {
  //     body += chunk; // collect data
  //   });

  //   req.on("end", async () => {
  //     try {
  //       const data = JSON.parse(body);
  //       const { name, email, age } = data;

  //       // 🛡️ Validate required fields
  //       if (!name || !email || !age) {
  //         res.writeHead(400, { [type]: json });
  //         return res.end(
  //           JSON.stringify({ error: "name, email, and age are required" }),
  //         );
  //       }

  //       const query = "INSERT INTO users (name, email, age) VALUES (?, ?, ?)";
  //       const [result] = await DB.execute(query, [name, email, age]);

  //       res.statusCode = 201;
  //       res.setHeader(type, json);
  //       return res.end(
  //         JSON.stringify({
  //           message: "User added",
  //           newUser: {
  //             id: result.insertId,
  //             name,
  //             email,
  //             age,
  //           },
  //         }),
  //       );
  //     } catch (err) {
  //       res.writeHead(500, { [type]: json });
  //       return res.end(
  //         JSON.stringify({
  //           error: "Server Error on POST",
  //           message: err.message,
  //         }),
  //       );
  //     }
  //   });
  //   return; // ✅ prevent fall-through to 404
  // }

  if (req.url === "/users" && req.method === "POST") {
    const bb = Busboy({ headers: req.headers });

    let name = "";
    let age = "";
    let email = "";
    let imagePath = "";

    //  ensure uploads folder exists
    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads");
    }

    //  handle text fields
    bb.on("field", (fieldname, value) => {
      if (fieldname === "name") name = value;
      if (fieldname === "email") email = value;
      if (fieldname === "age") age = Number(value);
    });

    //  handle file
    bb.on("file", (fieldname, file, info) => {
      const { filename } = info;
      const safeName = filename.replace(/\s+/g, "-");
      imagePath = `uploads/${Date.now()}-${safeName}`;
      const writeStream = fs.createWriteStream(imagePath);

      file.pipe(writeStream);
    });

    //  when all parsing done
    bb.on("finish", async () => {
      try {
        //  validation
        if (!name || !email || !age) {
          res.writeHead(400, { [type]: json });
          return res.end(
            JSON.stringify({ error: "name, email, and age are required" }),
          );
        }

        const query =
          "INSERT INTO users (name, email, age, image) VALUES (?, ?, ?, ?)";

        const [result] = await DB.execute(query, [name, email, age, imagePath]);

        res.statusCode = 201;
        res.setHeader(type, json);

        return res.end(
          JSON.stringify({
            message: "User added",
            newUser: {
              id: result.insertId,
              name,
              email,
              age,
              image: imagePath,
            },
          }),
        );
      } catch (err) {
        res.writeHead(500, { [type]: json });
        return res.end(
          JSON.stringify({
            error: "Server Error on POST",
            message: err.message,
          }),
        );
      }
    });

    //  start stream AFTER listeners , calls .on
    req.pipe(bb);

    return;
  }

  //DELETE: delete a user
  if (req.url.startsWith("/users/") && req.method === "DELETE") {
    try {
      const id = Number(req.url.split("/")[2]);

      // 🛡️ Validate id
      if (!id || isNaN(id)) {
        res.writeHead(400, { [type]: json });
        return res.end(JSON.stringify({ error: "Invalid user ID" }));
      }

      const [result] = await DB.execute("DELETE FROM users WHERE id = ?", [id]);
      if (result.affectedRows === 0) {
        res.statusCode = 404;
        res.setHeader(type, json);
        return res.end(JSON.stringify({ error: "User not found" }));
      }
      res.statusCode = 200;
      res.setHeader(type, json);
      return res.end(JSON.stringify({ message: "User deleted" }));
    } catch (err) {
      res.writeHead(500, { [type]: json });
      return res.end(
        JSON.stringify({
          error: "Server Error on DELETE",
          message: err.message,
        }),
      );
    }
  }

  //PATCH User
  if (req.method === "PATCH" && req.url.startsWith("/users/")) {
    try {
      const id = Number(req.url.split("/")[2]);

      //  Validate ID
      if (isNaN(id)) {
        res.writeHead(400, { [type]: json });
        return res.end(JSON.stringify({ error: "Invalid user ID" }));
      }

      //  Get existing user data
      const [rows] = await DB.execute("SELECT * FROM users WHERE id = ?", [id]);
      if (rows.length === 0) {
        res.writeHead(404, { [type]: json });
        return res.end(JSON.stringify({ error: "User not found" }));
      }
      const existingUser = rows[0];

      const bb = Busboy({ headers: req.headers });
      let updatedFields = { ...existingUser };
      let newImagePath = null;
      let filePromises = [];

      // Handle fields
      bb.on("field", (name, value) => {
        if (value !== undefined && value !== null) {
          updatedFields[name] = name === "age" ? Number(value) : value;
        }
      });

      // 3 Handle file upload
      bb.on("file", (fieldname, file, info) => {
        const { filename } = info;
        if (!filename) {
          file.resume();
          return;
        }
        const safeName = filename.replace(/\s+/g, "-");
        const newFilename = `${Date.now()}-${safeName}`;
        const newFilepath = path.join("uploads", newFilename);
        newImagePath = newFilepath.replace(/\\/g, "/");

        const writeStream = fs.createWriteStream(newFilepath);
        file.pipe(writeStream);

        const p = new Promise((resolve, reject) => {
          writeStream.on("close", resolve);
          writeStream.on("error", reject);
        });
        filePromises.push(p);
      });

      // Execute update on finish
      bb.on("finish", async () => {
        try {
          await Promise.all(filePromises);

          // Delete old image only if a new one was uploaded
          if (newImagePath && existingUser.image) {
            fs.unlink(existingUser.image, (err) => {
              if (err) console.log("⚠️ Old image delete failed:", err.message);
            });
            updatedFields.image = newImagePath;
          }

          const query =
            "UPDATE users SET name=?, email=?, age=?, image=? WHERE id=?";
          await DB.execute(query, [
            updatedFields.name,
            updatedFields.email,
            updatedFields.age,
            updatedFields.image,
            id,
          ]);

          res.writeHead(200, { [type]: json });
          res.end(
            JSON.stringify({
              message: "User updated successfully",
              user: { ...updatedFields, id },
            }),
          );
        } catch (err) {
          res.writeHead(500, { [type]: json });
          res.end(
            JSON.stringify({
              error: "Database update failed",
              message: err.message,
            }),
          );
        }
      });

      req.pipe(bb);
    } catch (err) {
      res.writeHead(500, { [type]: json });
      res.end(JSON.stringify({ error: "Server error", message: err.message }));
    }
    return;
  }

  // 👉 Route not found
  res.writeHead(404, { [type]: json });
  res.end(JSON.stringify({ error: "Route Not Found" }));
});

server.listen(3000, () => {
  console.clear();
  console.log("🚀 Server running on http://localhost:3000");
});

testDB();
