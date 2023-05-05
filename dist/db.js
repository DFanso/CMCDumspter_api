"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb_1 = require("mongodb");
var uri = process.env.MONGODB_URI;
var dbName = process.env.MONGODB_DB;
// create cache variables so we can cache our connection
var cachedClient = null;
var cachedDb = null;
var collections = null;
// database connection function
(function () {
    // check for database connection string and db name
    if (!uri || !dbName) {
        throw new Error("No URI available for MongoDB connection");
    }
    // if have cached use it
    if (cachedClient && cachedDb && collections) {
        return { client: cachedClient, db: cachedDb, collections: collections };
    }
    try {
        var client = yield mongodb_1.MongoClient.connect(uri);
        // connect to specific database
        var db = yield client.db(dbName);
        // set cache
        cachedClient = client;
        cachedDb = db;
        collections = { posts: db.collection("posts") };
        return { client: client, db: db, collections: collections };
    }
    catch (e) {
        throw new Error();
    }
});
