const shortlink = require("shortlink");
const MongoDetails = require("./dbAccess");
const MongoClient = require("mongodb").MongoClient;

var OPTIONS = { useNewUrlParser: true, useUnifiedTopology: true };

var res;
function processPost(url, resp) {
  res = resp;

  try {
    var code = getUrlCode(url);
  } catch (err) {
    console.log("\nPROCESS POST ERROR: ", err);
    res.sendStatus(500);
  }
}

function getUrlCode(urlPassed) {
  MongoDetails.mongo.connect(MongoDetails.mongoConnStr, OPTIONS, (err, db) => {
    if (err) throw err;
    var dbo = db.db(MongoDetails.dbName);
    dbo
      .collection(MongoDetails.collectionName)
      .findOne({ url: urlPassed }, { url: 1, code: 1 }, (err, result) => {
        if (err) throw err;
        console.log("not found");
        returnCode(urlPassed, result);
      });
  });
}

function returnCode(urlPassed, result) {
  if (result === undefined || result === null) {
    var item = {
      url: urlPassed,
      code: shortlink.generate(8),
      count: 0,
    };
    try {
      dbInsertNewRecord(item);
    } catch (err) {
      console.log(err);
    }
    res.end(item.code);
  } else {
    res.end(result.code);
  }
}

function dbInsertNewRecord(item) {
  MongoDetails.mongo.connect(MongoDetails.mongoConnStr, OPTIONS, (err, db) => {
    if (err) throw err;
    var dbo = db.db(MongoDetails.dbName);
    dbo
      .collection(MongoDetails.collectionName)
      .insertOne(item, (err, result) => {
        if (err) throw err;
        db.close();
      });
  });
}

function testCon() {
  const client = new MongoClient(MongoDetails.mongoConnStr, OPTIONS);
  client.connect((err) => {
    const collection = client
      .db(MongoDetails.dbName)
      .collection(MongoDetails.collectionName);
    // perform actions on the collection object
    console.log("success", err, collection);
    client.close();
  });
}

module.exports = processPost;
