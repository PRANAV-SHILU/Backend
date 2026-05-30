# Express.js Notes

`app.use` is the default method — it matches all HTTP methods. If you want to use a specific method like POST, PUT, or DELETE, you need to specify it using `app.post`, `app.put`, `app.delete`, etc.

```javascript
app.use('/api', (req, res, next) => {
    if (req.method === 'POST') {
        // handle POST request
    } else if (req.method === 'PUT') {
        // handle PUT request
    } else if (req.method === 'DELETE') {
        // handle DELETE request
    } else {
        next(); // pass to next middleware if method is not handled
    }
});
```

---

## Middleware

1. Order / sequence matters.
2. Do not call `next()` after `res.send()`.
3. Calling `res.send()` implicitly calls `res.end()`.
4. `app.use('/')` matches everything after it.
   - `app.use('/api')` matches everything after `/api`.
5. `app.get('/api')`, `app.post('/api')`, etc. match **only** `/api` and not `/api/hello`.

---

## Routing

Routing = sending different responses based on the request URL.

Since a Node server has one entry function `(req, res) => {}`, it must check `req.url` to decide which response to send.

Routes are part of controllers.

### Methods

- `app.get('/api')` → matches only GET requests to `/api`
- `app.post('/api')` → matches only POST requests to `/api`
- `app.put('/api')` → matches only PUT requests to `/api`
- `app.delete('/api')` → matches only DELETE requests to `/api`
- `app.patch('/api')` → matches only PATCH requests to `/api`
- `app.use('/api')` → matches all requests to `/api` and its subpaths (e.g., `/api/hello`)

---

## Body Parsing Middleware

```javascript
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
```

---

## EJS (Embedded JavaScript)

EJS = Embedded JavaScript — HTML with JavaScript.

- `<% %>` — execute JavaScript (no output)
- `<%= %>` — output the value of the expression
- `<%- include('partial.ejs') %>` — EJS partials (reusable EJS templates)

---

## Response Methods

- `res.send()` — sends a response
- `res.sendFile()` — sends a file as the response
- `res.render()` — renders a view template

---

## MVC

MVC = Model — View — Controller — separates logics.
