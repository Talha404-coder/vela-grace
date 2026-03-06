/* ---- your original JS (kept & reused) ---- */
let cart=[]

function scrollShop(){
    document.getElementById("shop").scrollIntoView({behavior:"smooth"})
}

/* QUICK VIEW: updated to accept image (keep this change) */
function quickView(name,price,image){
    document.getElementById("quickview").style.display="flex"
    document.getElementById("product-title").innerText=name
    document.getElementById("product-image").src=image
}

function closeQuickView(){
    document.getElementById("quickview").style.display="none"
}

/* CART: improved but kept same API so nothing else breaks */
function addToCart(name,price){

    let existing = cart.find(item => item.name === name)

    if(existing){
        existing.quantity += 1
    }else{
        cart.push({name, price, quantity:1})
    }

    updateCart()
}

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

/* Replace this number with your WhatsApp number (country code + number, no +) */
const WHATSAPP_NUMBER = "923096502422";

/* selected payment method global, used for WhatsApp message and for ui state */
let selectedPaymentMethod = null;
let bankInfo = {
    name: "ABC Company",
    number: "123456789",
    iban: "PK00ABCD123456789"
};

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

    if (selectedPaymentMethod) {
        // add payment method context
        if (selectedPaymentMethod === 'bank') {
            message += `%0A%0APayment method: Bank Transfer%0AAccount Name: ${bankInfo.name}%0AAccount Number: ${bankInfo.number}%0AIBAN: ${bankInfo.iban}`;
        } else {
            const pretty = selectedPaymentMethod.charAt(0).toUpperCase() + selectedPaymentMethod.slice(1);
            message += `%0A%0APayment method: ${pretty}`;
        }
    }

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
}

/* --- QR Modal functionality for payments --- */
const qrFiles = {
    jazzcash: "jazzcash.jpeg",
    easypaisa: "easypaisa.png",
    sadapay: "sadapay.png"
};

/* try multiple paths/extensions for QR (keep same approach) */
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

/* New: unified function to select payment method from the payment modal.
   It closes the payment modal and either shows a QR (for wallet methods)
   or shows bank details (for 'bank'). */
function selectPayment(method) {
    selectedPaymentMethod = method;

    // close the select-payment modal if open
    const pm = document.getElementById("payment-modal");
    if (pm) pm.style.display = "none";

    if (method === 'bank') {
        showBankDetails();
    } else {
        showQRCode(method);
    }
}

/* show QR - closes payment modal first so selection modal doesn't remain on top */
function showQRCode(method){
    const qrModal = document.getElementById("qr-modal");
    const qrTitle = document.getElementById("qr-title");
    const qrImage = document.getElementById("qr-image");
    const bankDetailsDiv = document.getElementById("bank-details");

    // hide bank details if previously shown
    if (bankDetailsDiv) bankDetailsDiv.style.display = "none";
    if (qrImage) qrImage.style.display = "block";

    qrTitle.innerText = `Scan QR for ${method.charAt(0).toUpperCase() + method.slice(1)}`;

    // close the payment options popup (if any)
    const pm = document.getElementById("payment-modal");
    if (pm) pm.style.display = "none";

    qrModal.style.display = "flex";

    const filename = qrFiles[method];
    if (!filename) {
        qrTitle.innerText = "QR file not configured for this method";
        qrImage.style.display = "none";
        return;
    }

    setImageWithFallback(qrImage, filename);
}

/* show bank details inside the same modal (no QR image) */
function showBankDetails() {
    const qrModal = document.getElementById("qr-modal");
    const qrTitle = document.getElementById("qr-title");
    const qrImage = document.getElementById("qr-image");
    const bankDetailsDiv = document.getElementById("bank-details");

    // hide qr image
    if (qrImage) qrImage.style.display = "none";

    // fill bank details values
    document.getElementById("bank-name").innerText = bankInfo.name;
    document.getElementById("bank-number").innerText = bankInfo.number;
    document.getElementById("bank-iban").innerText = bankInfo.iban;

    // set title and show bank block
    qrTitle.innerText = "Bank Transfer Details";
    if (bankDetailsDiv) bankDetailsDiv.style.display = "block";

    // ensure payment modal closed (if any)
    const pm = document.getElementById("payment-modal");
    if (pm) pm.style.display = "none";

    // show the modal
    qrModal.style.display = "flex";
}

/* close QR / bank modal */
function closeQRCode(){
    document.getElementById("qr-modal").style.display = "none";
}

/* small helpers to open/close the selection modal (Pay Now) */
function openPaymentOptions(){
    document.getElementById("payment-modal").style.display="flex"
}

function closePaymentOptions(){
    document.getElementById("payment-modal").style.display="none"
}

/* --- Review slider --- */
let index=0
setInterval(()=>{
    let reviews=document.querySelectorAll(".review")
    reviews[index].classList.remove("active")
    index=(index+1)%reviews.length
    reviews[index].classList.add("active")
},4000)

/* ZOOM for quickview image */
let zoomed = false;
function toggleZoom(){
    const img = document.getElementById("product-image");
    if(!img) return;
    if(!zoomed){
        img.style.transform = "scale(2)";
        img.style.cursor = "zoom-out";
        zoomed = true;
    }else{
        img.style.transform = "scale(1)";
        img.style.cursor = "zoom-in";
        zoomed = false;
    }
}

/* CART button click to open/close cart panel */
document.getElementById("cart-btn").addEventListener("click",toggleCart);

/* initial cart render (in case existing items are present) */
updateCart();
