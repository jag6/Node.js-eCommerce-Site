import { signin } from "../Api/apiUsers.js";
import { hideLoading, redirectUser, showLoading, showMessage } from "../utils.js";
import { getUserInfo, setUserInfo } from "../localStorage.js";

const SignInScreen = {
    after_render: () => {
        document.getElementById("signin-form").addEventListener("submit", async (e) => {
            e.preventDefault();
            showLoading();
            const data = await signin({
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            });
            hideLoading();
            if (data.error) {
                showMessage(data.error);
            }else {
                setUserInfo(data);
                redirectUser();
            }
        });
    },
    render: () => {
        if(getUserInfo().name) {
            redirectUser();
        }
        return `
        <div class="form-container">
            <form id="signin-form" class="form">
                <h1>Sign In</h1>
                <label for="email">Email</label>
                <input type="email" name="email" id="email">
                <label for="password">Password</label>
                <input type="password" name="password" id="password">   
                <button type="submit" class="primary">SUBMIT</button>    
                <div>
                    <p>New User?<p><a href="/#/register"><p>Create your account<p></a>
                </div>
            </form>
        </div>
        `;
    }
};

export default SignInScreen;