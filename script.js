/* ---- your original JS (kept & reused) ---- */
let cart=[]

function scrollShop(){
    document.getElementById("shop").scrollIntoView({behavior:"smooth"})
}

/* QUICK VIEW */
function quickView(name,price,image){
    document.getElementById("quickview").style.display="flex"
    document.getElementById("product-title").innerText=name
    document.getElementById("product-image").src=image
}

function closeQuickView(){
    document.getElementById("quickview").style.display="none"
}

/* CART */
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

    // set title and show bank block
    qrTitle.innerText = "Bank Transfer Details";

    // If the bank details placeholders don't have individual IDs, fill the container
    if (bankDetailsDiv) {
        bankDetailsDiv.style.display = "block";
        // try to find specific ids; otherwise replace innerHTML
        const nameEl = document.getElementById("bank-name");
        const numEl = document.getElementById("bank-number");
        const ibanEl = document.getElementById("bank-iban");

        if (nameEl && numEl && ibanEl) {
            nameEl.innerText = bankInfo.name;
            numEl.innerText = bankInfo.number;
            ibanEl.innerText = bankInfo.iban;
        } else {
            bankDetailsDiv.innerHTML = `
                <p><b>Account Name:</b> ${bankInfo.name}</p>
                <p><b>Account Number:</b> ${bankInfo.number}</p>
                <p><b>IBAN:</b> ${bankInfo.iban}</p>
            `;
        }
    }

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

/* ZOOM */
let zoomed = false
function toggleZoom(){
    const img = document.getElementById("product-image")
    if(!img) return

    if(!zoomed){
        img.style.transform = "scale(2)"
        zoomed = true
    }else{
        img.style.transform = "scale(1)"
        zoomed = false
    }
}

/* CART button */
document.getElementById("cart-btn").addEventListener("click",toggleCart)

updateCart()

/* ===========================
   Product Variant System
   =========================== */

const PRODUCTS = {

  "silk-hijab": {
    title: "Silk Hijab",
    price: 25,
    variants: [
      { colorName: "black", colorHex: "#111111", image: "Assets/products/silkhijab1-black.jpeg" },
      { colorName: "maroon", colorHex: "#6b2637", image: "assets/products/silkhijab1-maroon.jpeg" },
      { colorName: "Beige", colorHex: "#e7d7c2", image: "assets/products/hijab1.jpeg" }
    ]
  },

  "chiffon-hijab": {
    title: "Chiffon Hijab",
    price: 20,
    variants: [
      { colorName: "Dusty Pink", colorHex: "#dca5a5", image: "assets/products/hijab2.jpeg" },
      { colorName: "Olive", colorHex: "#7b8b57", image: "assets/products/hijab2.jpeg" },
      { colorName: "Black", colorHex: "#111111", image: "assets/products/hijab2.jpeg" }
    ]
  },

  "cotton-hijab": {
    title: "Cotton Hijab",
    price: 25,
    variants: [
      { colorName: "Sky Blue", colorHex: "#a8d0e6", image: "assets/products/hijab3.jpeg" },
      { colorName: "Mustard", colorHex: "#d6a04b", image: "assets/products/hijab3.jpeg" },
      { colorName: "Cream", colorHex: "#f3ead6", image: "assets/products/hijab3.jpeg" }
    ]
  },

  "jorget-hijab": {
    title: "Jorget Hijab",
    price: 20,
    variants: [
      { colorName: "Maroon", colorHex: "#6b2637", image: "assets/products/hijab4.jpeg" },
      { colorName: "Teal", colorHex: "#0e6b63", image: "assets/products/hijab4.jpeg" },
      { colorName: "Light Grey", colorHex: "#d6d6d6", image: "assets/products/hijab4.jpeg" }
    ]
  }

}

/* Render swatches */
document.addEventListener("DOMContentLoaded", () => {

  document.querySelectorAll(".product").forEach(productCard => {

    const pid = productCard.dataset.productId
    const productData = PRODUCTS[pid]
    if (!productData) return

    const swatchesContainer = productCard.querySelector(".swatches")
    const mainImg = productCard.querySelector(".product-main-image")
    const title = productCard.querySelector("h3")

    swatchesContainer.innerHTML=""

    productData.variants.forEach((v,idx)=>{

      const btn=document.createElement("button")
      btn.className="swatch"
      btn.style.background=v.colorHex
      btn.title=v.colorName

      btn.onclick=()=>selectVariant(pid,idx)

      swatchesContainer.appendChild(btn)

    })

    productCard.querySelector(".quick-btn").dataset.variant=0
    productCard.querySelector(".add-btn").dataset.variant=0

    mainImg.src=productData.variants[0].image
    title.innerText=`${productData.title} - ${productData.variants[0].colorName}`

    const first=productCard.querySelector(".swatch")
    if(first) first.classList.add("swatch-selected")

  })

  // set default filter to 'all' on initial load
  filterProducts('all')

})

/* SELECT VARIANT */

function selectVariant(productId,variantIndex){

  const productCard=document.querySelector(`.product[data-product-id="${productId}"]`)
  const productData=PRODUCTS[productId]
  const variant=productData.variants[variantIndex]

  const mainImg=productCard.querySelector(".product-main-image")
  const title=productCard.querySelector("h3")

  mainImg.src=variant.image
  title.innerText=`${productData.title} - ${variant.colorName}`

  const quickBtn=productCard.querySelector(".quick-btn")
  const addBtn=productCard.querySelector(".add-btn")

  quickBtn.dataset.variant=variantIndex
  addBtn.dataset.variant=variantIndex

  productCard.querySelectorAll(".swatch").forEach((s,i)=>{
      s.classList.toggle("swatch-selected",i===variantIndex)
  })

}

/* Quick view helper */

function quickViewFromBtn(btn){

  const pid=btn.dataset.product
  const vid=parseInt(btn.dataset.variant)

  const product=PRODUCTS[pid]
  const variant=product.variants[vid]

  quickView(`${product.title} - ${variant.colorName}`,product.price,variant.image)

}

/* Add to cart helper */

function addToCartFromBtn(btn){

  const pid=btn.dataset.product
  const vid=parseInt(btn.dataset.variant)

  const product=PRODUCTS[pid]
  const variant=product.variants[vid]

  addToCart(`${product.title} - ${variant.colorName}`,product.price)

}

/* ================
   FILTER PRODUCTS
   ================ */

/**
 * Show products for a category.
 * category: 'all' or 'hijabs' or 'abayas' or 'headcaps' or 'accessories'
 * btnElem: optional, the button DOM element clicked (for active state)
 */
function filterProducts(category, btnElem) {
  const products = document.querySelectorAll('.product')
  products.forEach(p => {
    const cat = (p.dataset.category || '').toLowerCase()
    if (category === 'all' || cat === category.toLowerCase()) {
      p.style.display = ''
    } else {
      p.style.display = 'none'
    }
  })

  // update active button UI
  const buttons = document.querySelectorAll('.category-btn')
  buttons.forEach(b => b.classList.remove('active'))
  if (btnElem) {
    btnElem.classList.add('active')
  } else {
    // if no btn passed, try to find the button with matching data-cat
    const match = document.querySelector(`.category-btn[data-cat="${category}"]`)
    if (match) match.classList.add('active')
  }
}
function toggleMenu(){
document.querySelector("nav").classList.toggle("active")
}

function subscribeNewsletter(){

let email=document.querySelector(".newsletter input").value

if(email===""){
alert("Please enter email")
return
}

alert("Thank you for subscribing!")

document.querySelector(".newsletter input").value=""

}

window.addEventListener("load",function(){
document.getElementById("loader").style.display="none"
})
