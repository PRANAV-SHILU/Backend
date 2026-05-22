id must be compared in string format, not number format and also in new object id format. So we need to convert the homeID to string and then to ObjectId before comparing it.

_id : new ObjectId(String(homeID))


sql

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


pre hooks is like middleware that runs on certain events like save, update, delete etc. 