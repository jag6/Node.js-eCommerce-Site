import express from "express";
import expressAsyncHandler from "express-async-handler";
import Banner from "../models/bannerModel.js";
import { isAuth, isAdmin } from "../utils.js";

const bannerRouter = express.Router();

bannerRouter.get('/', expressAsyncHandler(async (req, res) => {
    const users = await Banner.find({});
    res.send(users);
    })
);

bannerRouter.get('/:id', expressAsyncHandler(async (req, res) => {
    const banner = await Banner.findById(req.params.id);
    res.send(banner);
    })
);

bannerRouter.post('/', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const banner = new Banner({
        title: 'sample title',
        bannerImage: 'Images/banner.jpg',
        text: 'sample text',
        name: 'sample name',
    });
    const createdBanner = await banner.save();
    if(createdBanner) {
        res.status(201).send({message: 'Banner Created', banner: createdBanner});
    }else {
        res.status(500).send({message: 'Error in creating banner'});
    }
    })
);

bannerRouter.put('/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const bannerId = req.params.id;
    const banner = await Banner.findById(bannerId);
    if(banner) {
        banner.title = req.body.title;
        banner.bannerImage = req.body.bannerImage;
        banner.text = req.body.text;
        banner.name = req.body.name;
        const updatedBanner = await banner.save();
        if(updatedBanner) {
            res.send({message: 'Banner Updated', banner: updatedBanner});
        }else {
            res.status(500).send({message: 'Error in updating banner'});
        }
    }else {
        res.status(404).send({message: 'Banner Not Found'});
    }
    })
);

bannerRouter.delete('/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const banner = await Banner.findById(req.params.id);
    if(banner) {
        const deletedBanner = await banner.remove();
        res.send({message: 'Banner Deleted', banner: deletedBanner});
    }else {
        res.status(404).send({message: 'Banner Not Found'});
    }
    })
);

export default bannerRouter;