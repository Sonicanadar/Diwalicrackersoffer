let listProductHTML = document.querySelector('.listProduct');
let iconCart = document.querySelector('.icon-cart');
let closeBtn = document.querySelector('.close');
let body=document.querySelector('body');
let listCartHTML = document.querySelector('.listCart');
let iconCartSpan = document.querySelector('.icon-cart span');
let productFilter=[];
let plus = document.querySelector('.plus');
let popup = document.getElementById("popup");
let popup2 = document.getElementById("popup2");
let form1 = document.forms['my-form'];
let menu = form1.category;
let options =form1.category.options;
let filter = document.querySelector(".filter");


if (form1) {
    form1.onchange = function(event) {
        event.preventDefault();

        let valueFilter = this.category.value;
        console.log("Selected Category Filter:", valueFilter);

        // RESET TRAP: If default placeholder or "all" is picked, return everything
        if (valueFilter === '' || valueFilter === 'All') {
            productFilter = [...listProducts]; 
        } else {
            productFilter = listProducts.filter(item => {
                // 🛡️ SAFETY CHECK 1: Skip if the product doesn't have a category field at all
                if (item.category === undefined || item.category === null) {
                    return false;
                }

                // 🛡️ SAFETY CHECK 2: Convert the category to a String first.
                // This stops numbers or empty fields from crashing the code!
                let itemCategoryString = String(item.category);

                // Trim whitespace and compare case-insensitively
                return itemCategoryString.trim().toLowerCase() === valueFilter.trim().toLowerCase();
            });
        }

        console.log(`Products matching this category: ${productFilter.length}`);
        
        // Re-render the updated product grid instantly
        addDataToHTML(productFilter);
    };
}




        function openPopup(){
            popup.classList.add("open-popup");
        }
        function closePopup(){
            popup.classList.remove("open-popup");
        }
        function openPopup2(){
            popup2.classList.add("open-popup2");
        }
        function closePopup2(){
            popup2.classList.remove("open-popup2");
        }


iconCart.addEventListener('click', ()=> {
    body.classList.toggle('activeTabCart')
})
closeBtn.addEventListener('click', ()=> {
    body.classList.toggle('activeTabCart')
})


plus.addEventListener('click', ()=> {
    let idProduct = positionClick.dataset.id; 
    console.log(idProduct);
})


 
const form = document.querySelector("form");
const fullName = document.getElementById("name");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const pincode = document.getElementById("pincode");
const address = document.getElementById("address");



form.addEventListener("submit",(e)=>{
    e.preventDefault();
    emailSend();
})

let listProducts = [];
let carts = localStorage.getItem('shopping_cart') ? JSON.parse(localStorage.getItem('shopping_cart')) : [];
let totalQuantity = 0 ;




// function showProduct(productFilter){
//     count.innerText = productFilter.length;
//     listCartHTML.innerHTML='';
//     productFilter.forEach(item => {
//         let newProduct = document.createElement('div');
//             newProduct.classList.add('item');
//             newProduct.dataset.id=product.id;
//             newProduct.innerHTML =  `
//                 <img src="${product.image}" alt="">
//                 <h2>${product.title}</h2>
//                 <div class="price"><span>MRP. ${product.price} </span>Our Price.${Math.floor((product.price*0.5))}</div>
//                  <button class="addCart" data-id="${product.id}">Add to Cart</button>
//                 `;
//                 listProductHTML.appendChild(newProduct); 
//     })
// }


function addDataToHTML(productFilter){
    listProductHTML.innerHTML = '';
    
    productFilter.forEach(product => {
        let newProduct = document.createElement('div');
        newProduct.classList.add('item');
        newProduct.dataset.id = product.id;

        // Check if this specific item is currently present in the cart array
        let cartItemIndex = carts.findIndex((value) => value.product_id == product.id);
        let currentQty = cartItemIndex < 0 ? 0 : carts[cartItemIndex].quantity;

        // Visual setup conditions
        let actionControlHTML = '';
        if (currentQty > 0) {
            // 🛠️ UPDATED: Render the integrated dark continuous counter UI state matching your cart drawer exactly!
            actionControlHTML = `
                <div class="quantity grid-quantity-counter">
                    <button class="minus" data-id="${product.id}">-</button>
                    <span>${currentQty}</span>
                    <span class="plus" data-id="${product.id}">+</span>
                </div>
            `;
        } else {
            // Render the raw standard Add to Cart element
            actionControlHTML = `
                <button class="addCart" data-id="${product.id}">Add to Cart</button>
            `;
        }

        newProduct.innerHTML = `
            <img src="${product.image}" alt="">
            <h2>${product.title}</h2>
            <div class="price"><span>MRP. ${product.price} </span>Rs.${Math.floor((product.price * 0.5))}</div>
            <div class="action-container" data-id="${product.id}">
                ${actionControlHTML}
            </div>
        `;
        listProductHTML.appendChild(newProduct);
    });
}




// =========================================================================
// UNIFIED DELEGATED CLICK EVENT INTERCEPTOR (ALL ACTION PATHWAYS)
// =========================================================================
document.addEventListener('click', (event) => {
    let positionClick = event.target;
    
    // ---------------------------------------------------------------------
    // PHASE A: CLOSE CART DRAWER AUTOMATICALLY IF CLICKED OUTSIDE BOUNDS
    // ---------------------------------------------------------------------
    let cartTabElement = document.querySelector('.cartTab');
    if (body.classList.contains('activeTabCart') && cartTabElement && iconCart) {
        const clickedInsideCartDrawer = cartTabElement.contains(positionClick);
        const clickedHeaderCartIconRing = iconCart.contains(positionClick);

        if (!clickedInsideCartDrawer && !clickedHeaderCartIconRing) {
            body.classList.remove('activeTabCart');
        }
    }

    // ---------------------------------------------------------------------
    // 🎯 NEW FIX: CAPTURE ACCESSIBLE CLOSE BUTTON EVENT CLICKS
    // ---------------------------------------------------------------------
    if (positionClick.classList.contains('close')) {
        body.classList.remove('activeTabCart');
        return; // Exit interceptor early since drawer window is closed
    }

    // ---------------------------------------------------------------------
    // PHASE B: EVALUATE & RESOLVE PRODUCT STATE UPDATES
    // ---------------------------------------------------------------------
    let idProduct = positionClick.dataset.id;
    
    if (!idProduct && positionClick.parentElement && positionClick.parentElement.dataset.id) {
        idProduct = positionClick.parentElement.dataset.id;
    }

    if (!idProduct) return;

    let positionThisProductInCart = carts.findIndex((value) => value.product_id == idProduct);
    let quantity = positionThisProductInCart < 0 ? 0 : carts[positionThisProductInCart].quantity;
    
    if (positionClick.classList.contains('cart-item-delete')) {
        quantity = 0;
        addToCart(idProduct, quantity, positionThisProductInCart);
        addDataToHTML(productFilter || listProducts);
    }
    else if (positionClick.classList.contains('addCart')) {
        quantity = 1; 
        addToCart(idProduct, quantity, positionThisProductInCart);
        addDataToHTML(productFilter || listProducts); 
    } 
    else if (positionClick.classList.contains('plus')) {
        quantity++;
        addToCart(idProduct, quantity, positionThisProductInCart);
        addDataToHTML(productFilter || listProducts);
    } 
    else if (positionClick.classList.contains('minus')) {
        quantity--;
        addToCart(idProduct, quantity, positionThisProductInCart);
        addDataToHTML(productFilter || listProducts);
    }
});


const addToCart = (idProduct, quantity, positionThisProductInCart) => {
    if (quantity > 0) {
        if (positionThisProductInCart < 0) {
            carts.push({
                product_id: idProduct,
                quantity: quantity
            }); 
        } else {
            carts[positionThisProductInCart].quantity = quantity;
        }
    } else {
        if (positionThisProductInCart >= 0) {
            carts.splice(positionThisProductInCart, 1);
        }
    }

    // ⚡ PRE-SAVE PROTECTION: If the cart hits zero, instantly clear memory paths
    if (carts.length === 0) {
        localStorage.removeItem('shopping_cart');
    } else {
        localStorage.setItem('shopping_cart', JSON.stringify(carts));
    }

    addCartToHTML();
}

const addCartToHTML = () => {
    let listHTML = document.querySelector('.listCart');
    let totalHTML = document.querySelector('.icon-cart span');
    let totalPriceHTML = document.querySelector('.cartTab .foot span');
    let totalQuantity = 0;
    
    if (listHTML) listHTML.innerHTML = null;
  
    let totalPrice = 0;
    if (totalPriceHTML) totalPriceHTML.innerText = "Rs. 0.00";
    if (totalHTML) totalHTML.innerText = totalQuantity;

    if (carts.length == 0) {
        let totalPriceElement = document.getElementById("total_price");
        if (totalPriceElement) {
            totalPriceElement.innerHTML = "Rs. 0.00";
        }
        
        if (listHTML) {
            listHTML.innerHTML = `<div class="empty-message" style="padding: 20px; text-align: center; color: #8b949e; width: 100%;">Your cart is empty</div>`;
        }
    } 
    else {
        carts.forEach(item => {
            totalQuantity = totalQuantity + item.quantity;
        
            let newCart = document.createElement('div');
            newCart.classList.add('item');
            let positionProduct = listProducts.findIndex((value) => value.id == item.product_id);
            let info = listProducts[positionProduct];
            
            if (info) {
                totalPrice = totalPrice + Math.floor(info.price * 0.5 * item.quantity);
                
                // Explicitly bind the template strings matching our updated tracking nodes layout mapping
                newCart.innerHTML = `
                    <div class="image" style="display: flex; align-items: center; justify-content: center;">
                        <img src="${info.image}" alt="" style="max-height: 45px; width: auto; object-fit: contain;">
                    </div>
                    <div class="name">
                        ${info.title}
                    </div>
                    <div class="totalPrice">
                        Rs.${Math.floor(info.price * 0.5 * item.quantity)}
                    </div>
                    <div class="quantity">
                        <button class="minus" data-id="${info.id}">-</button>
                        <span>${item.quantity}</span>
                        <span class="plus" data-id="${info.id}">+</span>
                    </div>
                    <button class="cart-item-delete" data-id="${info.id}" title="Remove Item">×</button>
                `;
                if (listHTML) listHTML.appendChild(newCart);
            }
        });
    }

    if (totalHTML) {
        if (totalQuantity > 0) {
            totalHTML.innerText = totalQuantity;
            totalHTML.style.display = 'flex';
        } else {
            totalHTML.innerText = '';
            totalHTML.style.display = 'none';
        }
    }

    if (totalPriceHTML) {
        totalPriceHTML.innerText = "Rs." + totalPrice + ".00";
    }

    if (carts.length > 0) {
        localStorage.setItem('shopping_cart', JSON.stringify(carts));
    }
}


  function checkoutViaWhatsApp() {
    // 1. Set your business phone number (include country code, no spaces or +)
    const businessPhone = "919867731440"; 

    // 2. Safety Check: Verify if the cart exists and has items
    // (Replace 'cart' with the actual name of your cart array variable)
    if (!carts || carts.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    let message = ` *New Order Summary* \n\n`;
    let grandTotal = 0;

    // 3. Loop through your cart items to build the list
    carts.forEach(cartItem => {
        // Find the full product details from your master product array using the ID
        // (Replace 'products' with your actual master data array name)
        const productDetails = listProducts.find(p => p.id == cartItem.product_id);
        
        if (productDetails) {
            // Calculate your discounted price matching your HTML: Rs. Math.floor(price * 0.5)
            const discountedPrice = Math.floor(productDetails.price * 0.5);
            const itemTotal = discountedPrice * cartItem.quantity;
            grandTotal += itemTotal;

            // Add the item line item to your text message
            message += ` *${productDetails.title}*\n`;
            message += `   Qty: ${cartItem.quantity} x Rs.${discountedPrice} = Rs.${itemTotal}\n\n`;
        }
    });

    // 4. Append the final bill total to the text message
    message += `💰 *Grand Total:* Rs.${grandTotal}\n\n`;
    message += `Please confirm my order and send payment details!`;

    // 5. URL encode the message and trigger WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${businessPhone}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    carts = [];
    localStorage.removeItem('shopping_cart'); 
    addCartToHTML();
}

function emailSend(){
    
    var messageBody = '';
     let totalPrice = 0;
    let totalQuantity = 0;
    // carts.forEach(item => {
      
    //     let positionProduct = listProducts.findIndex((value) => value.id == item.product_id);
    //     let info = listProducts[positionProduct];
    //     totalPrice = totalPrice+(info.price*0.5*item.quantity);
    //     messageBody = messageBody + "<br>Name :"+info.title+" &nbsp;Quantity :"+item.quantity+" &emsp; Price :"+info.price*0.5*item.quantity;
    // })

    // <table><tr><th>Company</th><th>Contact</th><th>Country</th></tr></table>

    messageBody = `Full Name: ${fullName.value}<br> Email: ${email.value}<br> Phone Number: ${phone.value}<br> Pincode : ${pincode.value}<br>Address: ${address.value}<br>`;

    messageBody=messageBody+"<br><table style=\"border:1px solid black;\"><tr style=\"border:1px solid black;\"><th style=\"border:1px solid black;\">Name</th><th style=\"border:1px solid black;\">Quantity</th><th style=\"border:1px solid black;\">Price</th></tr>";
    messaageSubject = `Crackers Order - ${fullName.value}`;
    carts.forEach(item => {
      
        let positionProduct = listProducts.findIndex((value) => value.id == item.product_id);
        let info = listProducts[positionProduct];
        totalPrice = totalPrice+Math.floor(info.price*0.5*item.quantity);
        totalQuantity = totalQuantity+(item.quantity);
        messageBody = messageBody + "<tr style=\"border:1px solid black;\"><td style=\"border:1px solid black;\">"+info.title+"</td><td style=\"border:1px solid black;\">"+item.quantity+"</td><td style=\"border:1px solid black;\">"+Math.floor(info.price*0.5)+"</td></tr>";
    })
    messageBody = messageBody + "<tr style=\"border:1px solid black;\"><td style=\"border:1px solid black;\">Total</td><td style=\"border:1px solid black;\">"+totalQuantity+"</td><td style=\"border:1px solid black;\">"+totalPrice+"</td></tr>";
    messageBody = messageBody + "</table>";
    
     //messageBody = messageBody + "<br>Total Price :"+totalPrice;
    // messageBody = messageBody + "<table style=\"border:1px solid black;\"><tr style=\"border:1px solid black;\"><th style=\"border:1px solid black;\">Total</th><th style=\"border:1px solid black;\">"+totalQuantity+"</th><th style=\"border:1px solid black;\">"+totalPrice+"</th></tr>";
     messageBody = messageBody + "<br><br>Regards<br>Team";
     

   
    Email.send({
    SecureToken : "5bd59612-66e9-4b83-a8a7-1defb6c6490e",
    To : 'sonicawebdev@gmail.com',
    From : "sonicawebdev@gmail.com",
    Subject : messaageSubject,
    Body : messageBody
 }).then(
  message => {
      if(message=='OK'){
          //alert("Successful", "You clicked the button!", "success");
          carts = [];
          addCartToHTML();
          }
      else{
          alert("Error", "You clicked the button!", "error");
      }
  }
 );

}

// Locate the action footer buttons inside addCartToHTML and update the grid row container:
let buttonContainer = document.querySelector('.cartTab .btn');
if (buttonContainer) {
    // 🛠️ CHANGED: Set up 3 dynamic columns for a clean side-by-side responsive layout buttons row
    buttonContainer.style.display = 'grid';
    buttonContainer.style.gridTemplateColumns = '1fr 1fr 1fr';
    buttonContainer.style.height = '60px';
    
    buttonContainer.innerHTML = `
        <button class="close">CLOSE</button>
        <a href="tel:+919867731440" class="call-btn-link" style="display: flex; align-items: center; justify-content: center; background-color: #ff9f43; color: #0d1117; text-decoration: none; font-weight: 600; font-size: 14px; border-right: 1px solid #30363d;">
            📞 Call Us
        </a>
        <button onclick="checkoutViaWhatsApp()" style="background-color: #25D366; color: white; border: none; font-weight: 500; cursor: pointer;">
            WhatsApp
        </button>
    `;
}

const initApp = () => {
    // 1. Fetch the master catalog data structure from your local file
    fetch('products.json')
    .then(response => response.json())
    .then(data => {
        // 2. Hydrate your master tracking arrays FIRST
        listProducts = data;
        productFilter = listProducts; // Needed if you use the category filters
        
        // 3. Render the store layout item cards on screen next
        addDataToHTML(productFilter || listProducts);
        
        // 4. 🎯 CRITICAL FIX: Only evaluate and draw the cart drawer AFTER listProducts exists!
        if (localStorage.getItem('shopping_cart')) {
            carts = JSON.parse(localStorage.getItem('shopping_cart'));
        }
        
        // This execution call will now successfully find all matching product information details!
        addCartToHTML();
    })
    .catch(error => {
        console.error("Critical: Master product data catalog failed to load properly.", error);
    });
}

// Fire the application setup sequence
initApp();
