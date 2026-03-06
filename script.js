let cart=[]

function scrollShop(){
    document.getElementById("shop").scrollIntoView({behavior:"smooth"})
}

function quickView(name,price,image){
    document.getElementById("quickview").style.display="flex"
    document.getElementById("product-title").innerText=name
    document.getElementById("product-image").src=image
}

function closeQuickView(){
    document.getElementById("quickview").style.display="none"
}

/* ADD TO CART */

function addToCart(name,price){

    let existing = cart.find(item => item.name === name)

    if(existing){
        existing.quantity += 1
    }else{
        cart.push({name, price, quantity:1})
    }

    updateCart()
}

/* UPDATE CART */

function updateCart(){

    let count = 0
    let total = 0
    let html=""

    cart.forEach((item,index)=>{

        count += item.quantity
        total += item.price * item.quantity

        html += `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px">

        <div>
        <b>${index+1}. ${item.name}</b><br>
        $${item.price}
        </div>

        <div>
        <button onclick="changeQty(${index},-1)">-</button>
        ${item.quantity}
        <button onclick="changeQty(${index},1)">+</button>
        </div>

        </div>
        `
    })

    html += `<hr><h3>Total: $${total}</h3>`

    document.getElementById("cart-count").innerText=count
    document.getElementById("cart-items").innerHTML=html
}

/* CHANGE QUANTITY */

function changeQty(index,change){

    cart[index].quantity += change

    if(cart[index].quantity <= 0){
        cart.splice(index,1)
    }

    updateCart()
}

function toggleCart(){
    document.getElementById("cart-panel").classList.toggle("open")
}

// Replace this number with your WhatsApp number (country code + number, no +)
const WHATSAPP_NUMBER = "923096502422";

function checkoutWhatsApp() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    let message = "Hello! I want to order:%0A";

    cart.forEach(item => {
        message += `${item.name} - Qty: ${item.quantity} - $${item.price * item.quantity}%0A`;
    });

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    message += `%0ATotal: $${total}`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
}

// --- QR Modal functionality for payments ---
const qrFiles = {
    jazzcash: "jazzcash.jpeg",
    easypaisa: "easypaisa.png",
    sadapay: "sadapay.png"
};

function setImageWithFallback(imgEl, filename) {
    const bases = ["assets/payments/", "Assets/payments/"];
    const commonExts = [".jpeg", ".jpg", ".png"];

    const dot = filename.lastIndexOf(".");
    const baseName = dot > -1 ? filename.slice(0, dot) : filename;
    const originalExt = dot > -1 ? filename.slice(dot) : "";
    const exts = [originalExt].concat(commonExts.filter(e => e !== originalExt));

    const candidates = [];
    bases.forEach(base => {
        exts.forEach(ext => candidates.push(base + baseName + ext));
    });

    let i = 0;
    imgEl.style.display = "";
    imgEl.src = candidates[0];

    imgEl.onerror = function () {
        i++;
        if (i < candidates.length) {
            imgEl.src = candidates[i];
        } else {
            imgEl.style.display = "none";
            document.getElementById("qr-title").innerText = "QR not found — please check assets folder / file name";
        }
    };
}

function showQRCode(method){
    const qrModal = document.getElementById("qr-modal");
    const qrTitle = document.getElementById("qr-title");
    const qrImage = document.getElementById("qr-image");

    qrTitle.innerText = `Scan QR for ${method.charAt(0).toUpperCase() + method.slice(1)}`;
    qrModal.style.display = "flex";

    const filename = qrFiles[method];
    if (!filename) {
        qrTitle.innerText = "QR file not configured for this method";
        qrImage.style.display = "none";
        return;
    }

    qrImage.style.display = "";
    setImageWithFallback(qrImage, filename);
}

function closeQRCode(){
    document.getElementById("qr-modal").style.display = "none";
}

// --- Review slider ---
let index=0
setInterval(()=>{
    let reviews=document.querySelectorAll(".review")
    reviews[index].classList.remove("active")
    index=(index+1)%reviews.length
    reviews[index].classList.add("active")
},4000)

/* CART BUTTON CLICK */

document.getElementById("cart-btn").addEventListener("click",toggleCart)
