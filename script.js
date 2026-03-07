/* -----------------------------
VELA GRACE MAIN SCRIPT
----------------------------- */

let cart = []

/* Load saved cart */
function loadCart(){
    const saved = localStorage.getItem("vela_cart")
    if(saved){
        cart = JSON.parse(saved)
    }
}

/* Save cart */
function saveCart(){
    localStorage.setItem("vela_cart", JSON.stringify(cart))
}

/* Smooth scroll */
function scrollShop(){
    const el = document.getElementById("shop")
    if(el) el.scrollIntoView({behavior:"smooth"})
}

/* QUICK VIEW */

function quickView(name,price,image){
    const qv = document.getElementById("quickview")
    if(!qv) return

    qv.style.display="flex"
    document.getElementById("product-title").innerText=name
    document.getElementById("product-image").src=image
}

function closeQuickView(){
    const qv = document.getElementById("quickview")
    if(qv) qv.style.display="none"
}

/* CART */

function addToCart(name,price){

    let existing = cart.find(item => item.name === name)

    if(existing){
        existing.quantity += 1
    }else{
        cart.push({name, price, quantity:1})
    }

    saveCart()
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

    const countEl = document.getElementById("cart-count")
    const itemsEl = document.getElementById("cart-items")

    if(countEl) countEl.innerText=count
    if(itemsEl) itemsEl.innerHTML=html
}

function changeQty(index,change){

    cart[index].quantity += change

    if(cart[index].quantity <= 0){
        cart.splice(index,1)
    }

    saveCart()
    updateCart()
}

function toggleCart(){
    const panel = document.getElementById("cart-panel")
    if(panel) panel.classList.toggle("open")
}

/* WHATSAPP */

const WHATSAPP_NUMBER = "923096502422"

let selectedPaymentMethod = null

let bankInfo = {
    name: "ABC Company",
    number: "123456789",
    iban: "PK00ABCD123456789"
}

function checkoutWhatsApp(){

    if(cart.length === 0){
        alert("Your cart is empty!")
        return
    }

    let message = "Hello! I want to order:\n"

    cart.forEach(item=>{
        message += `${item.name} - Qty: ${item.quantity} - $${item.price * item.quantity}\n`
    })

    const total = cart.reduce((sum,item)=>sum + item.price * item.quantity,0)

    message += `\nTotal: $${total}`

    if(selectedPaymentMethod){

        if(selectedPaymentMethod === "bank"){
            message += `\n\nPayment method: Bank Transfer\nAccount Name: ${bankInfo.name}\nAccount Number: ${bankInfo.number}\nIBAN: ${bankInfo.iban}`
        }else{
            message += `\n\nPayment method: ${selectedPaymentMethod}`
        }
    }

    const encoded = encodeURIComponent(message)

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, "_blank")
}

/* QR FILES */

const qrFiles = {
    jazzcash:"jazzcash.jpeg",
    easypaisa:"easypaisa.png",
    sadapay:"sadapay.png"
}

function setImageWithFallback(imgEl, filename){

    const bases = ["assets/payments/"]
    const commonExts = [".jpeg",".jpg",".png"]

    const dot = filename.lastIndexOf(".")
    const baseName = filename.slice(0,dot)
    const originalExt = filename.slice(dot)

    const exts=[originalExt].concat(commonExts.filter(e=>e!==originalExt))

    const candidates=[]

    bases.forEach(base=>{
        exts.forEach(ext=>{
            candidates.push(base + baseName + ext)
        })
    })

    let i=0

    imgEl.src=candidates[0]

    imgEl.onerror=function(){

        i++

        if(i<candidates.length){
            imgEl.src=candidates[i]
        }else{
            imgEl.style.display="none"
        }
    }
}

/* PAYMENT SELECT */

function selectPayment(method){

    selectedPaymentMethod = method

    const pm = document.getElementById("payment-modal")
    if(pm) pm.style.display="none"

    if(method==="bank"){
        showBankDetails()
    }else{
        showQRCode(method)
    }
}

function showQRCode(method){

    const modal=document.getElementById("qr-modal")
    const title=document.getElementById("qr-title")
    const img=document.getElementById("qr-image")

    if(!modal) return

    title.innerText=`Scan QR for ${method}`

    modal.style.display="flex"

    const filename=qrFiles[method]

    if(filename){
        setImageWithFallback(img,filename)
    }
}

function showBankDetails(){

    const modal=document.getElementById("qr-modal")
    const title=document.getElementById("qr-title")
    const details=document.getElementById("bank-details")

    if(!modal) return

    title.innerText="Bank Transfer Details"

    if(details){
        details.style.display="block"
        details.innerHTML=`
        <p><b>Account Name:</b> ${bankInfo.name}</p>
        <p><b>Account Number:</b> ${bankInfo.number}</p>
        <p><b>IBAN:</b> ${bankInfo.iban}</p>
        `
    }

    modal.style.display="flex"
}

function closeQRCode(){
    const modal=document.getElementById("qr-modal")
    if(modal) modal.style.display="none"
}

function openPaymentOptions(){
    const pm=document.getElementById("payment-modal")
    if(pm) pm.style.display="flex"
}

function closePaymentOptions(){
    const pm=document.getElementById("payment-modal")
    if(pm) pm.style.display="none"
}

/* REVIEW SLIDER */

function startReviewSlider(){

    const reviews=document.querySelectorAll(".review")
    if(!reviews.length) return

    let index=0

    reviews[0].classList.add("active")

    setInterval(()=>{

        reviews[index].classList.remove("active")

        index=(index+1)%reviews.length

        reviews[index].classList.add("active")

    },4000)
}

/* ESC CLOSE MODALS */

document.addEventListener("keydown",function(e){

    if(e.key==="Escape"){
        closeQuickView()
        closeQRCode()
        closePaymentOptions()
    }

})

/* PRODUCT DATA */

const PRODUCTS={

"silk-hijab":{
title:"Silk Hijab",
price:25,
variants:[
{colorName:"Black",colorHex:"#111",image:"assets/products/silkhijab1-black.jpeg"},
{colorName:"Maroon",colorHex:"#6b2637",image:"assets/products/silkhijab1-maroon.jpeg"},
{colorName:"Beige",colorHex:"#e7d7c2",image:"assets/products/hijab1.jpeg"}
]
},

"chiffon-hijab":{
title:"Chiffon Hijab",
price:20,
variants:[
{colorName:"Dusty Pink",colorHex:"#dca5a5",image:"assets/products/hijab2.jpeg"},
{colorName:"Olive",colorHex:"#7b8b57",image:"assets/products/hijab2.jpeg"},
{colorName:"Black",colorHex:"#111",image:"assets/products/hijab2.jpeg"}
]
}

}

/* VARIANT RENDER */

document.addEventListener("DOMContentLoaded",()=>{

loadCart()
updateCart()
startReviewSlider()

const cartBtn=document.getElementById("cart-btn")
if(cartBtn) cartBtn.addEventListener("click",toggleCart)

})
