# Airbnb — Express.js + MongoDB + MONGOOSE Notes

---

## 📌 ObjectId Comparison

ID must be compared in **string format**, not number format, and also in `new ObjectId` format.  
Convert the `homeID` to string and then to `ObjectId` before comparing:

```js
_id: new ObjectId(String(homeID))
```

---

## 📌 Mongoose Constructor Note

Mongoose expects an **object** inside the constructor. Pass an object with the properties instead of separate arguments:

```js
new Home({ name: "Beach House", location: "Goa", price: 5000 })
```

---

## 📊 MongoDB vs Mongoose — Query Comparison

| Operation | 🟢 Mongoose (ODM) | 🔵 MongoDB (Native Driver) | Notes |
|---|---|---|---|
| **Insert** | `new Model({...}).save()` | `db.collection().insertOne({...})` | Mongoose validates schema; MongoDB returns `insertedId` |
| **Select All** | `Model.find()` | `db.collection().find().toArray()` | MongoDB returns a cursor; must call `.toArray()` |
| **Select One by ID** | `Model.findById(id)` | `db.collection().findOne({ _id: new ObjectId(id) })` | Mongoose auto-wraps `id`; MongoDB requires `new ObjectId()` |
| **Select One by Field** | `Model.findOne({ field: value })` | `db.collection().findOne({ field: value })` | Both return `null` if not found |
| **Update by ID** | `Model.findByIdAndUpdate(id, update, { new: true })` | `db.collection().findOneAndUpdate({ _id: new ObjectId(id) }, { $set: update }, { returnDocument: "after" })` | Use `{ new: true }` in Mongoose / `{ returnDocument: "after" }` in MongoDB to get updated doc |
| **Update One** | `Model.updateOne({ filter }, update)` | `db.collection().updateOne({ filter }, { $set: update })` | Returns `modifiedCount`; doesn't return the document |
| **Delete by ID** | `Model.findByIdAndDelete(id)` | `db.collection().findOneAndDelete({ _id: new ObjectId(id) })` | Both return the deleted document |
| **Delete One** | `Model.deleteOne({ filter })` | `db.collection().deleteOne({ filter })` | Returns `deletedCount`; doesn't return the document |
| **Convert to Array** | *(not needed — returns array directly)* | `cursor.toArray()` | MongoDB `find()` returns a lazy cursor |

---

## 📌 Populate (Mongoose)

`populate()` is used to replace a referenced `ObjectId` field with the actual document data — similar to a SQL JOIN:

```js
find().populate("houseId")
// Replaces houseId ObjectId with the full house document
```

---

## 📌 Pre Hooks (Mongoose Middleware)

Pre hooks run **before** certain lifecycle events like `save`, `update`, `delete`, etc.:

```js
HomeSchema.pre("save", function (next) {
  // runs before every save()
  next();
});
```

---

## 🍪 Cookies

Cookies are small pieces of data stored on the **client side** and sent to the server with every request.  
They are used for authentication, session management, and storing user preferences.

In Express.js, use the `cookie-parser` middleware to parse cookies and access them in routes.  
Set cookies using `res.cookie()`.

### Attaching Cookie State via Default Middleware

Use a global middleware to attach cookie data to every request, so you don't have to check it in every route:

```js
app.use((req, res, next) => {
  req.isLoggedIn = req.get("Cookie")?.split("=")[1] === "true" || false;
  next();
});

// Then in any route:
req.isLoggedIn  // true or false
```

---

## 📦 Libraries

### `express-session`

Middleware to manage **user sessions** in Express.js.

- Stores session data on the **server side**
- Uses cookies to identify the session on the client side
- Options: `secret`, `resave`, `saveUninitialized`, `store`
- Use `connect-mongodb-session` as the store to persist sessions in MongoDB

```js
app.use(session({
  secret: "mySecret",
  resave: false,
  saveUninitialized: false,
  store: store,  // connect-mongodb-session instance
}));
```

---

### `connect-mongodb-session`

A **MongoDB-based session store** for Express.js.

- Stores session data in a MongoDB collection
- Useful for scalability and persistence across server restarts
- Options: `uri` (MongoDB connection string), `collection` (collection name)

```js
const store = new MongoDBStore({
  uri: "mongodb://localhost:27017/airbnb",
  collection: "sessions",
});
```

---

### `express-validator`

Middleware to **validate and sanitize** user input in Express.js routes.

- Configure with various validation and sanitization rules
- Chain validators like `body("email").isEmail()`, `body("password").isLength({ min: 6 })`
- Access errors via `validationResult(req)`

```js
const { body, validationResult } = require("express-validator");

router.post("/signup",
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    // proceed
  }
);
```

---

### `bcrypt`

A library to **hash and verify passwords** securely using the bcrypt algorithm.

- Never store plain-text passwords — always hash them before saving to the DB
- `bcrypt.hash(password, saltRounds)` — hashes a password asynchronously
- `bcrypt.compare(plain, hash)` — verifies a plain password against a stored hash
- `saltRounds` (cost factor) controls how computationally expensive the hash is (higher = slower = safer); `12` is a good default

```js
import bcrypt from "bcrypt";

// Hashing a password before saving
const hashedPassword = await bcrypt.hash(req.body.password, 12);

// Verifying a password on login
const isMatch = await bcrypt.compare(req.body.password, user.password);
if (!isMatch) {
  return res.redirect("/auth/login");
}
```

---

### `multer`

Middleware for handling **multipart/form-data** — used to upload files (images, documents, etc.) from the client to the server.

- Must set `enctype="multipart/form-data"` on the HTML `<form>`
- Uploaded file is available on `req.file` (single) or `req.files` (multiple)
- Use `diskStorage` to control the upload destination and filename
- Use `fileFilter` to restrict accepted MIME types

```js
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename:    (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ["image/png", "image/jpeg", "image/jpg"];
    cb(null, allowed.includes(file.mimetype));
  },
});

// Single file upload — field name must match the form input's `name`
app.use(upload.single("image"));

// Access the uploaded file
req.file.path;          // e.g. "uploads/1748590372-house.jpg"
req.file.originalname;  // original filename from the client
```