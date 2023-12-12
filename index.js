// reqirements

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
require('dotenv').config()
const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');

const port = process.env.PORT || 5000;




// middleware

app.use(cors());
app.use(express.json());
   


// mongodb database connection


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fffaqtl.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
   

    //  database collection
    const tourCollection = client.db("TourHeartDB").collection("tourpackages");
    const userCollection = client.db("TourHeartDB").collection("users");
    const guideCollection = client.db("TourHeartDB").collection("guides");
    const wishCollection = client.db("TourHeartDB").collection("wishlist");
    const bookCollection = client.db("TourHeartDB").collection("booked");

    // jwt
    app.post('/jwt',async(req,res)=>{
      const user = req.body;
      const token = jwt.sign()
    })
    
  // wishlist deleted
  app.delete('/wishlist/:id',async(req,res)=>{
    const id =req.params.id;
    const query = {_id:new ObjectId(id)}
    const result = await wishCollection.deleteOne(query);
    res.send(result);
  })




     //  wishlist api
     app.get('/wishlist',async (req,res)=>{
      const curser =  wishCollection.find()
      const result = await curser.toArray();
       res.send(result);
    })
    
    
    // wish post
    app.post('/wishlist',async(req,res)=>{
      const newWish = req.body;
     
      const result = await wishCollection.insertOne(newWish);
      res.send(result);
    });
    
    
    // book service deleted
    app.delete('/booked/:id',async(req,res)=>{
      const id =req.params.id;
      const query = {_id:new ObjectId(id)}
      const result = await bookCollection.deleteOne(query);
      res.send(result);
    })
    
    
    
    
    //  book api
    app.get('/booked',async (req,res)=>{
      const curser =  bookCollection.find()
      const result = await curser.toArray();
       res.send(result);
    })
    
    
    // book services post
    app.post('/booked',async(req,res)=>{
      const newBooked = req.body;
     
      const result = await bookCollection.insertOne(newBooked);
      res.send(result);
    });

// single guide
app.get('/guides/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await guideCollection.findOne(query);

    if (result) {
      res.send(result);
    } else {
      res.status(404).send('Tour not found');
    }
  } catch (error) {
    console.error('Error fetching tour by ID:', error);
    res.status(500).send('Internal Server Error');
  }
});




// guide page
app.get('/guides',async(req,res)=>{
  const result = await guideCollection.find().toArray();
  res.send(result);
})

// tourdata single
app.get('/tour/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await tourCollection.findOne(query);

    if (result) {
      res.send(result);
    } else {
      res.status(404).send('Tour not found');
    }
  } catch (error) {
    console.error('Error fetching tour by ID:', error);
    res.status(500).send('Internal Server Error');
  }
});
// tour post
app.post('/tour',async(req,res)=>{
  const newTour = req.body;
 
  const result = await tourCollection.insertOne(newTour);
  res.send(result);
});

    // tourdata page
    app.get('/tour',async(req,res) => {
      const result = await tourCollection.find().toArray();
      res.send(result);
    })
  //  admin make
  app.patch('/users/admin/:id',async(req,res)=>{
    const id = req.params.id;
    const filter = {_id: new ObjectId(id)};
    const updateDoc= {
      $set:{
        role:'admin'
      }
    }
     const result = await userCollection.updateOne(filter,updateDoc)
     res.send(result)
  })

    // user deleted
    app.delete('/users/:id',async(req,res)=>{
      const id =req.params.id;
      const query = {_id:new ObjectId(id)}
      const result = await userCollection.deleteOne(query);
      res.send(result);
    })

    // user page
    app.get('/users',async(req,res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    })
    // user and admin pages
    app.post('/users',async(req,res)=>{
      const user =req.body;
      const query ={email:user.email}
      const exitUser = await userCollection.findOne(query);
      if(exitUser){
        return res.send({message:'user already is datadabe',insertedId:null})
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    })
     
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);









// homepage
app.get('/',(req, res)=>{
res.send('tour to heart server is running');
})


app.listen(port,()=>{
    console.log(`tour to heart server is on port ${port}`)
})