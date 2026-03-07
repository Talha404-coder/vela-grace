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

/* WhatsApp */
const WHATSAPP_NUMBER = "923096502422";

let selectedPaymentMethod = null

function checkoutWhatsApp() {

    if (cart.length === 0) {
        alert("Your cart is empty!")
        return
    }

    let message = "Hello! I want to order:%0A"

    cart.forEach(item=>{
        message += `${item.name} - Qty: ${item.quantity}%0A`
    })

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`,"_blank")
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
      { colorName: "black", colorHex: "#f2a6b3", image: "Assets/products/silkhijab1-black.jpeg" },
      { colorName: "Navy Blue", colorHex: "#173a57", image: "assets/products/hijab1.jpeg" },
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
