let cart=[]

function scrollShop(){
    document.getElementById("shop").scrollIntoView({behavior:"smooth"})
}

function quickView(name,price){
    document.getElementById("quickview").style.display="flex"
    document.getElementById("product-title").innerText=name
    document.getElementById("product-price").innerText="$"+price
}

function closeQuickView(){
    document.getElementById("quickview").style.display="none"
}

function addToCart(name,price){
    // Default quantity 1 if not defined
    let quantity = 1
    cart.push({name, price, quantity})
    updateCart()
}

function updateCart(){
    document.getElementById("cart-count").innerText=cart.length

    let html=""
    cart.forEach(item=>{
        html+=`<p>${item.name} - $${item.price}</p>`
    })
    document.getElementById("cart-items").innerHTML=html
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

    // Start message
    let message = "Hello! I want to order:%0A";

    // Loop through cart items
    cart.forEach(item => {
        message += `${item.name} - Qty: ${item.quantity} - $${item.price * item.quantity}%0A`;
    });

    // Optionally add total
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    message += `%0ATotal: $${total}`;

    // Open WhatsApp chat with pre-filled message
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
}

// --- QR Modal functionality for payments (UPDATED) ---
const qrFiles = {
    jazzcash: "jazzcash.jpeg",
    easypaisa: "easypaisa.png",
    sadapay: "sadapay.png"
};

// Function to try multiple paths/extensions
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
    console.log("Trying QR image paths:", candidates);

    imgEl.onerror = function () {
        i++;
        if (i < candidates.length) {
            console.log("Failed, trying next:", candidates[i]);
            imgEl.src = candidates[i];
        } else {
            console.error("All QR image paths failed:", candidates);
            imgEl.style.display = "none";
            document.getElementById("qr-title").innerText = "QR not found — please check assets folder / file name";
        }
    };

    imgEl.onload = function () {
        console.log("QR image loaded from:", imgEl.src);
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
        console.error("No filename for payment method:", method);
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