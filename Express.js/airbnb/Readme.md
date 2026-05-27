id must be compared in string format, not number format and also in new object id format. So we need to convert the homeID to string and then to ObjectId before comparing it.

_id : new ObjectId(String(homeID))


mongodb - mongoose

mongoos expect object inside the constructor, so we need to pass an object with the properties name, location and price instead of passing them as separate arguments.

MONGOOSE
save() - insert
find() - search select all
findById() - search select by id
findByIdAndUpdate() - update by id
findByIdAndDelete() - delete by id


MONGODB
insertOne() - insert 
find() - search select all
findOne() - search select one
updateOne() - update one
deleteOne() - delete one
toArray() - convert cursor to array
findOneAndUpdate() - update one and return the updated document
findOneAndDelete() - delete one and return the deleted document

find().populate("houseId") 


pre hooks is like middleware that runs on certain events like save, update, delete etc. 




cookies are small pieces of data that are stored on the client side and sent to the server with every request. They are used for authentication, session management, and storing user preferences. In Express.js, we can use the cookie-parser middleware to parse cookies and access them in our routes. We can also set cookies using the res.cookie() method.

use default middlewear to attach coockie in every request like req.isLoggedIn = req.get("Cookie")?.split('=')[1] === "true" || false; so that we can use it in any route without checking for cookie every time.
 we can simply get req.isLoggedIn in any route to check if the user is logged in or not.

 