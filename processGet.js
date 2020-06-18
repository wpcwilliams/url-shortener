const MongoDetails = require("./dbAccess");
var OPTIONS = { useNewUrlParser: true, useUnifiedTopology: true };

var res;
function processGet(code, resp) {
  res = resp;
  try {
    getUrlFromCode(code);
  } catch (err) {
    console.log(err);
  }
}

function getUrlFromCode(code) {
  MongoDetails.mongo.connect(MongoDetails.mongoConnStr, OPTIONS, (err, db) => {
    if (err) throw err;
    var dbo = db.db(MongoDetails.dbName);
    dbo.collection(MongoDetails.collectionName).findOne(
      {
        code: code,
      },
      (err, result) => {
        if (err) throw err;
        if (result) {
          dbIncrementCount(result, db);
        } else {
          db.close();
        }
        console.log(result, err); //delete
        handleRedirect(result);
      }
    );
  });
}

function dbIncrementCount(item, db) {
  var update = {
    url: item.url,
    code: item.code,
    count: item.count + 1,
  };

  var dbo = db.db(MongoDetails.dbName);
  dbo
    .collection(MongoDetails.collectionName)
    .replaceOne(item, update, (err, res) => {
      if (err) throw err;
    });
  db.close();
}

function handleRedirect(item) {
  if (item === undefined || item === null) {
    res
      .status(404)
      .send("404 - Link not found. Please check your link and try again...");
  } else {
    validUrl = getValidUrl(item.url);
    res.redirect(validUrl);
  }
}

function getValidUrl(url) {
  if (isValidUrl(url)) {
    return url;
  } else if (isValidUrl("http://" + url)) {
    // necessary for redirect if url does not include protocol (eg www.example.com)
    return "http://" + url;
  }
}

function isValidUrl(userUrl) {
  let url = require("url");
  try {
    new url.URL(userUrl);
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = processGet;
