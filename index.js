const express = require('express')
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();

// middleware
app.use(cors());
app.use(express.json());


// database connection


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://user1:TyK9aLM6CeNukVAs@cluster0.vducstc.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// db colleciton list
const productsCollection = client.db("zays-inv").collection("zays-inv-products");
const userCollection = client.db("zays-inv").collection("users");



// database queries
async function run() {
    try{

        app.get('/products',async (req,res)=>{
            const query = {};
            const result = await productsCollection.find(query).toArray();
            res.send(result);
            
         })


         app.post('/updatemany', async (req,res)=>{
            const productIds = req.body.body;
             const query = { Id : {$in: productIds}  }
            const result = await productsCollection.updateMany(query, {$set: {isSoldOut: true}}, {multi: true},{upsert: true})
            res.send(result);
         })
         app.post('/login' , async(req, res)=>{
            const userData = req.body.body.username;
            const result = await userCollection.findOne({username: userData});
            if(result.pass.toString() === req.body.body.pass.toString()){
                res.send({user: 'admin', isSuperAdmin: true})
            } else {
                res.status(406).send('wrong')

            }
            
            
         })


    }
    finally{

    }
}
run().catch(err=>console.error(err))



app.get('/', async (req,res)=>{
    res.send('Server Running');
 })

 

app.listen(port, ()=>{
    console.log('server running on port: ', port);
})