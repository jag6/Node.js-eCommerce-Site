import express from "express";
import expressAsyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

const searchRouter = express.Router();

searchRouter.get('/', expressAsyncHandler(async (req, res) => {
    const searchKeyword = req.query.searchKeyword
    ? {
        name: {
            $regex: req.query.searchKeyword,
            $options: 'i'
            }
        }
    : {};
    const products = await Product.find({...searchKeyword});
    res.send(products);
    })
);

export default searchRouter;