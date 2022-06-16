import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
    {
        title: {type: String, required: true},
        bannerImage: {type: String, required: true},
        text: {type: String, required: true},
        name: {type: String, required: true},
    }
);

const Banner = mongoose.model('Banner', bannerSchema);

export default Banner;