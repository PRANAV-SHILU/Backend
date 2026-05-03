# EXPRESS.JS

app.use is default GET METHOD, if you want to use other method like POST, PUT, DELETE, you need to specify it like app.post, app.put, app.delete OR app.use('/api', (req, res, next) => {
    if(req.method === 'POST') {
        // handle POST request
    } else if(req.method === 'PUT') {
        // handle PUT request
    } else if(req.method === 'DELETE') {
        // handle DELETE request
    } else {
        next(); // pass to next middleware if method is not handled
    }
});

## Middleware

1 order/sequence matters
2 do not call next() after send
3 calling res.send() implicitly calls res.end()
4 app.use('/') matches everything after it
 -  app.use('/api') matches everything after /api
5 app.get/post/...('/api') matches only /api and not /api/hello


## Routing
Routing = sending different responses based on the request URL.
Since a Node server has one entry function (req, res) => {}, it must check req.url to decide which response to send.

Routes are part of controllers.

Methods:
- app.get('/api') → matches only GET requests to /api
- app.post('/api') → matches only POST requests to /api
- app.put('/api') → matches only PUT requests to /api
- app.delete('/api') → matches only DELETE requests to /api
- app.patch('/api') → matches only PATCH requests to /api
- app.use('/api') → matches all requests to /api and its subpaths (e.g., /api/hello)




app.use(express.urlencoded());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



EJS - Embedded javascript  - html with js - <%   %>
<%= %> - output the value of the expression
ejs partials - reusable ejs templates - <%- include('partial.ejs') %>
<%- include() %>

res.send() -  
res.sendFile() - 
res.render() - 

MVC - Model View Controller - seprate logics 

