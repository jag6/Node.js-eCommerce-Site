import express from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import AWS from "aws-sdk";
import { isAuth, isAdmin } from "../utils.js";
import config from "../config.js";

const storage = multer.diskStorage({
    destination(req, file, cb){
        cb(null, 'uploads/');
    },
    filename(req, file, cb){
        cb(null, `${Date.now()}.jpg`);
    }
});

const upload = multer({storage});

const uploadRouter = express.Router();

uploadRouter.post('/', isAuth, isAdmin, upload.single('image'), (req, res) => {
    res.status(201).send({image: `${req.file.path}`});
});

AWS.config.update({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey
});

const s3 = new AWS.S3();
const storageS3 = multerS3({
    s3,
    bucket: 'mattistoreaws',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key(req, file, cb){
        cb(null, file.originalname);
    }
});
const uploadS3 = multer({storage: storageS3});
uploadRouter.post('/s3', isAuth, isAdmin, uploadS3.single('image'), (req, res) => {
    res.send(req.file.location);
})

export default uploadRouter;