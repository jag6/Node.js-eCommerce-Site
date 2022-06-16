import { getBanner, updateBanner, uploadBannerImage } from "../Api/apiBanners.js";
import { hideLoading, parseRequestUrl, showLoading, showMessage } from "../utils.js";

const BannerEditScreen = {
    after_render:() => {
        const request = parseRequestUrl();
        document.getElementById("edit-banner-form").addEventListener('submit', async (e) => {
            e.preventDefault();
            showLoading();
            const data = await updateBanner({
                _id: request.id,
                title: document.getElementById("title").value,
                bannerImage: document.getElementById("image").value,
                text: document.getElementById("text").value,
                name: document.getElementById("name").value,
            });
            hideLoading();
            if(data.error) {
                showMessage(data.error);
            }else {
                document.location.hash = '/bannerlist';
            }
        });
        document.getElementById("banner-img-file").addEventListener('change', async (e) => {
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append('image', file);
            showLoading();
            const data = await uploadBannerImage(formData);
            hideLoading();
            if(data.error) {
                showMessage(data.error);
            }else {
                showMessage('Image Upload Successful');
                document.getElementById("image").value = data.image;
            }
        });
    },
    render: async () => {
        const request = parseRequestUrl();
        const banner = await getBanner(request.id);
        return `
        <div class="edit-screen content">
            <div class="back-to-result">
                <a href="/#/bannerlist"><i class="arrow-left"></i>Back to Banner List</a>
            </div>
            <div class="form-container">
                    <form id="edit-banner-form" class="form">
                        <h1>Edit Banner ${banner._id.substring(0, 8)}...</h1>
                        <label for="title">Banner Title</label>
                        <input type="text" name="title" id="title" value="${banner.title}"> 
                        <label for="banner-img-file">Banner Image (Full x 480)</label>
                        <input type="text" name="image" id="image" value="${banner.bannerImage}">
                        <input type="file" name="banner-img-file" id="banner-img-file">
                        <label for="text">Text</label>
                        <input type="text" name="text" id="text" value="${banner.text}"> 
                        <label for="name">Name</label>
                        <input type="text" name="name" id="name" value="${banner.name}">
                        <button type="submit" class="primary bold" id="ces-btn">UPDATE</button>
                    </form>   
                </div>
            </div>
        `;
    }
};

export default BannerEditScreen;