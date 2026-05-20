id must be compared in string format, not number format and also in new object id format. So we need to convert the homeID to string and then to ObjectId before comparing it.

_id : new ObjectId(String(homeID))