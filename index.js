require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const ImageModel = require("./models");
const fs = require("fs");
const app = express();

require("./startup/prod")(app);

app.use(cors());
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true, useUnifiedTopology: true
})
    .then(() => console.log("db is connected"))
    .catch((err) => console.log(err, "it has an error"));


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads")
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({
    storage: storage
})

// app.get("/",async(req,res)=>{
//     const allData =await ImageModel.find();
//     res.json(allData);
// })

app.get("/", async (req, res) => {
    const { page } = req.query;
    console.log("page",page);


    const limit = 4;
    const startIndex = (Number(page) - 1) * limit;
    const total = await ImageModel.countDocuments({});
    // const tours = await TourModel.find().limit(limit).skip(startIndex);
    // res.json({
    //     data: tours,
    //     currentPage: Number(page),
    //     totalTours: total,
    //     numberOfPages: Math.ceil(total / limit)
    // })

    const allData = await ImageModel.find().limit(limit).skip(startIndex);;
    res.json({
        data: allData,
        currentPage: Number(page),
        totalTours: total,
        numberOfPages: Math.ceil(total / limit)
    })
})


app.post("/", upload.single("testImage"), (req, res) => {
    const saveImage = new ImageModel({
        description: req.body.description,
        author: req.body.author,
        location: req.body.location,
        img: {
            data: fs.readFileSync("uploads/" + req.file.filename),
            contentType: "image/jpeg"
        },
    })
    console.log(saveImage);
    saveImage.save()
        .then((res) => { console.log("image is saved") })
        .catch((err) => { console.log(err, "error has occured") });
    res.send("Image is saved");
})


const port = process.env.PORT || 5000;
app.listen(port, () => console.log("successfully running at port 5000"));
