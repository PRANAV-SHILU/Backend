id must be compared in string format, not number format and also in new object id format. So we need to convert the homeID to string and then to ObjectId before comparing it.

_id : new ObjectId(String(homeID))


sql

mongodb - mongoose

mongoos expect object inside the constructor, so we need to pass an object with the properties name, location and price instead of passing them as separate arguments.