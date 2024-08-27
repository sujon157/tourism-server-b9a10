const express = require('express');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

//middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}
@cluster0.4kfsgrz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

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
        // await client.connect();

        const spotsCollection = client.db('spotsDB').collection('spots');
        const countryCollection=client.db('spotsDB').collection('country');

          // get operation
        app.get('/spot', async (req, res) => {
            const cursor = spotsCollection.find();
            const result = await cursor.toArray();
            console.log(result);
            res.send(result);
    
        })

        app.get('/singleTourist/:id', async (req, res) => {
            console.log(req.params.id);
            const result=await spotsCollection.findOne({_id:new ObjectId(req.params.id)});
            res.send(result);
        })

        app.get('/singleSpot/:id',async(req,res)=>{
            console.log(req.params.id);
            const result=await spotsCollection.findOne({_id:new ObjectId(req.params.id)});
            res.send(result);
        })

        // post operation
        app.post('/spot', async (req, res) => {
            const newSpots = req.body;
            console.log(newSpots);
            const result = await spotsCollection.insertOne(newSpots);
            console.log(result);
            res.send(result);
        })
        
        // update operation
        app.put('/updateSpot/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedSpot = req.body;
            const spot = {
                $set: {
                    country_Name: updatedSpot.country_Name,
                    tourists_spot_name: updatedSpot.tourists_spot_name,
                    location: updatedSpot.location,
                    total_Visitors_PerYear: updatedSpot.total_Visitors_PerYear,
                    seasonality: updatedSpot.seasonality,
                    travel_time: updatedSpot.travel_time,
                    average_cost: updatedSpot.average_cost,
                    image: updatedSpot.image,
                    short_description: updatedSpot.short_description
                },
            };
            const result = await spotsCollection.updateOne(filter, spot, options);
            res.send(result);
        })
       
        // delete opereration
        app.delete('/spot/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await spotsCollection.deleteOne(query);
            res.send(result);
        })


        // country server

    //    get operation
        app.get('/country',async(req,res) => {
            const cursor = countryCollection.find();
            const result = await cursor.toArray();
            console.log(result);
            res.send(result);
        })

    //    post operation
        app.post('/country',async(req,res) => {
            const newCountry = req.body;
            
            const result = await countryCollection.insertOne(newCountry);
            res.send(result);
        })




        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("Tourism server is running ");
})
app.listen(port, () => {
    console.log(`Tourism name server is running on port:${port}`)
})
