const Chatbox = {
    after_render: () => {
        document.getElementById("openBtn").addEventListener('click', () => {
            document.getElementById("myForm").style.display = "flex";
            document.getElementById("openBtn").style.display = "none";
        })
        document.getElementById("closeBtn").addEventListener('click', () => {
            document.getElementById("myForm").style.display = "none";
            document.getElementById("openBtn").style.display = "flex";
        })
    },
    render: () => {
        return`
        <button class="open-button" id="openBtn"><i class="fas fa-phone"></i></button>
        <div class="chat-popup" id="myForm">
            <div><h2>CONTACT</h2></div>
            <div class="contact-icons">
                <a href=""><i class="fas fa-phone"></i></a>
                <a href=""><i class="fas fa-envelope"></i></a>
                <a href=""><i class="fab fa-discord"></i></a>
            </div>
            <div class="contact-icons">
            <a href=""><i class="fab fa-instagram"></i></a>
            <a href=""><i class="fab fa-facebook"></i></a>
            <a href=""><i class="fab fa-twitter"></i></a>
        </div>
            <button type="button" class="chat-cancel" id="closeBtn">CLOSE</button>
            
        </div>
        `;
    }
};

export default Chatbox;