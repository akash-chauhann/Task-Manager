//CRUD Operations : Create, Read, Update, Delete 

// const mongodb=require('mongodb') //Importing mongodb npm package
// const MongoClient = mongodb.MongoClient //thie client helps in establishing connection
// const ObjectID=mongodb.ObjectID;

const {MongoClient, ObjectId} = require('mongodb') //Destructuring object returned by mongodb package
const connectionUrl='mongodb://127.0.0.1:27017' //127.0.0.1 is the ip for localhost
const databaseName='task-manager'
const client = new MongoClient(connectionUrl); //create mongodb client

const mainFunc=async()=>{
    await client.connect(); // connect to the client
    console.log('Connection Successful')
    const db=client.db(databaseName) //get the db from the client 
    const collection=db.collection('users') //definng the collection to be used 

    const res=await collection.find(
        {age : {$gt : 20} }
    ).toArray();
    console.log(res);

    
}
mainFunc();
