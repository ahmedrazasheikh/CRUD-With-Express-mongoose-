import express from 'express';
import path from 'path';
import cors from 'cors';
const app = express()
const port = process.env.PORT || 5001;
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { setEngine } from 'crypto';
const mongodbURI = process.env.mongodbURI || "mongodb+srv://ahmed33:ahmed@cluster0.nttnezx.mongodb.net/?retryWrites=true&w=majority"
app.use(bodyParser.json())
app.use(cors());

let todoSchema = new mongoose.Schema({
    name: { type: String, required: true },
    createdOn: { type: Date, default: Date.now }
});
const todoModel = mongoose.model('products', todoSchema);
app.put('/edit/:id', (req, res) => {
    const body = req.body;
    console.log(body)
    const id = req.params.id;
    console.log(id)
    if (
        !body.name
    ) {
        res.status(400).send(` required parameter missing. example request body:
        {
            "name": "value",
        }`)
        return;
    }
    try {
        let data = todoModel.findByIdAndUpdate(id,
            {
                name: body.name,
            },
            { new: true }
        ).exec();

        console.log('updated: ', data);

        res.send({
            message: "Todo  Modified successfully"
        });

    } catch (error) {
        res.status(500).send({
            message: "server error"
        })
    }



})



app.put('/product/:id', async (req, res) => {

    const body = req.body;
    const id = req.params.id;

    if (
        !body.name
    ) {
        res.status(400).send(` required parameter missing. example request body:
        {
            "name": "value",
            "price": "value",
            "description": "value"
        }`)
        return;
    }

    try {
        let data = await productModel.findByIdAndUpdate(id,
            {
                name: body.name,
            },
            { new: true }
        ).exec();

        console.log('updated: ', data);

        res.send({
            message: "product modified successfully"
        });

    } catch (error) {
        res.status(500).send({
            message: "server error"
        })
    }
})



app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    todoModel.deleteOne({ _id: id }, (err, deletedData) => {
        console.log("deleted: ", deletedData);
        if (!err) {

            if (deletedData.deletedCount !== 0) {
                res.send({
                    message: "Product has been deleted successfully",
                })
            } else {
                res.status(404);
                res.send({
                    message: "No Product found with this id: " + id,
                });
            }
        } else {
            res.status(500).send({
                message: "server error"
            })
        }
    });
})


// Get All Products 
app.get('/getData', (req, res) => {

    todoModel.find({}, (err, data) => {
        if (!err) {
            res.send({
                data: data
            })
        } else {
            res.status(500).send({
                message: "server error"
            })
        }
    });
})

// Add todo 
app.post('/addData', (req, res) => {
    try {
        const body = req.body
        console.log(body)
        let data = body.input
        todoModel.create({
            name: data,
        },
            (err, saved) => {
                if (!err) {
                    // console.log(saved);

                    res.send({
                        message: "To do  added successfully"
                    });
                } else {
                    res.status(500).send({
                        message: "server error"
                    })
                }
            })

    } catch (error) {
        console.log(error)
    }

})

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})
/////////////////////////////////////////////////////////////////////////////////////////////////
mongoose.connect(mongodbURI);
////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {//connected
    console.log("Mongoose is connected");
});

mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});
////////////////mongodb connected disconnected events///////////////////////////////////////////////