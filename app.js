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


// 🎯 CRITICAL CHECK: Verify your grid card renderer matches this exactly
function addDataToHTML(productFilter){
    listProductHTML.innerHTML = '';
    
    productFilter.forEach(product => {
        let newProduct = document.createElement('div');
        newProduct.classList.add('item'); 
        newProduct.dataset.id = product.id; 

        let cartItemIndex = carts.findIndex((value) => value.product_id == product.id);
        let currentQty = cartItemIndex < 0 ? 0 : carts[cartItemIndex].quantity;

        let actionControlHTML = '';
        if (currentQty > 0) {
            actionControlHTML = `
                <div class="quantity grid-quantity-counter">
                    <button class="minus" data-id="${product.id}">-</button>
                    <span>${currentQty}</span>
                    <span class="plus" data-id="${product.id}">+</span>
                </div>
            `;
        } else {
            actionControlHTML = `
                <button class="addCart" data-id="${product.id}">Add to Cart</button>
            `;
        }

        // 🎯 FIX: Remove discount specifically for the GIFT BOXES category
        let finalDisplayPrice = Math.floor(product.price * 0.5);
        let mrpTagHTML = `<span>MRP. ${product.price} </span>`;

        if (product.category && product.category.trim().toUpperCase() === "GIFT BOXES") {
            finalDisplayPrice = product.price; // Sell at full price
            mrpTagHTML = ''; // Hide the slashed-out lower price text decoration
        }

        newProduct.innerHTML = `
            <img src="${product.image}" alt="">
            <h2>${product.title}</h2>
            <div class="price">${mrpTagHTML}Rs.${finalDisplayPrice}</div>
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
    let targetTag = positionClick.tagName.toUpperCase();
    
    // ---------------------------------------------------------------------
    // PHASE A: CLOSE DRAWERS & POPUPS ON ACCESSIBLE INPUT ACTIONS
    // ---------------------------------------------------------------------
    let cartTabElement = document.querySelector('.cartTab');
    
    if (body.classList.contains('activeTabCart') && cartTabElement && iconCart) {
        const clickedInsideCartDrawer = cartTabElement.contains(positionClick);
        const clickedHeaderCartIconRing = iconCart.contains(positionClick);

        if (!clickedInsideCartDrawer && !clickedHeaderCartIconRing) {
            body.classList.remove('activeTabCart');
        }
    }

    if (positionClick.classList.contains('close')) {
        body.classList.remove('activeTabCart');
        return; 
    }

    if (positionClick.classList.contains('modal-close-btn')) {
        closeProductModal();
        return; 
    }

    // ---------------------------------------------------------------------
    // PHASE B: INTERCEPT VISUAL MODAL TRIGGERS (IMAGE / TITLE SELECTION)
    // ---------------------------------------------------------------------
    // Skip modal opening triggers completely if clicking action buttons!
    let isCartActionButton = positionClick.classList.contains('addCart') || 
                             positionClick.classList.contains('plus') || 
                             positionClick.classList.contains('minus') ||
                             positionClick.classList.contains('cart-item-delete');

    if (!isCartActionButton) {
        // Trigger 1: Clicked Main Grid Item Card Images/Titles
        if (targetTag === 'IMG' || targetTag === 'H2') {
            let itemCard = positionClick.closest('.item');
            if (itemCard) {
                let clickedProductId = itemCard.dataset.id;
                openProductModal(clickedProductId);
                return; 
            }
        }

        // Trigger 2: Clicked Related Cards Inside the Opened Popup View Strip
        let relatedCardTarget = positionClick.closest('.related-item-card');
        if (relatedCardTarget) {
            let nestedProductId = relatedCardTarget.dataset.id;
            
            document.getElementById("modalMainDetails").innerHTML = '';
            document.getElementById("relatedProductsList").innerHTML = '';
            
            openProductModal(nestedProductId);
            return;
        }
    }

    // ---------------------------------------------------------------------
    // PHASE C: BULLETPROOF PRODUCT QUANTITY & CART SYSTEM MUTATIONS
    // ---------------------------------------------------------------------
    if (isCartActionButton) {
        // 1. Trace product ID from dataset attributes across the target or closest action parent element
        let idProduct = positionClick.dataset.id;
        if (!idProduct && positionClick.parentElement) {
            idProduct = positionClick.parentElement.dataset.id;
        }
        if (!idProduct) {
            let contextWrapper = positionClick.closest('.action-container') || positionClick.closest('.quantity-counter-inline');
            if (contextWrapper) idProduct = contextWrapper.dataset.id;
        }

        // Exit early if we absolutely cannot find an ID
        if (!idProduct) return;

        // 2. Core lookup logic using loose comparison (==) to handle string/number mismatches safely
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
            
            // Instantly refresh the popup elements if open
            if (document.getElementById("productModal").classList.contains("active")) {
                openProductModal(idProduct);
            }
        } 
        else if (positionClick.classList.contains('plus')) {
            quantity++;
            addToCart(idProduct, quantity, positionThisProductInCart);
            addDataToHTML(productFilter || listProducts);
            
            if (document.getElementById("productModal").classList.contains("active")) {
                openProductModal(idProduct);
            }
        } 
        else if (positionClick.classList.contains('minus')) {
            quantity--;
            addToCart(idProduct, quantity, positionThisProductInCart);
            addDataToHTML(productFilter || listProducts);
            
            if (document.getElementById("productModal").classList.contains("active")) {
                openProductModal(idProduct);
            }
        }
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
                // 🎯 FIX: Apply category specific base calculations inside the drawer summary fields
                let itemUnitPrice = Math.floor(info.price * 0.5);
                if (info.category && info.category.trim().toUpperCase() === "GIFT BOXES") {
                    itemUnitPrice = info.price;
                }

                let totalItemCost = itemUnitPrice * item.quantity;
                totalPrice = totalPrice + totalItemCost;
                
                newCart.innerHTML = `
                    <div class="image" style="display: flex; align-items: center; justify-content: center;">
                        <img src="${info.image}" alt="" style="max-height: 45px; width: auto; object-fit: contain;">
                    </div>
                    <div class="name">
                        ${info.title}
                    </div>
                    <div class="totalPrice">
                        Rs.${totalItemCost}
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

        // Loop through your cart items to build the list
    carts.forEach(cartItem => {
        const productDetails = listProducts.find(p => p.id == cartItem.product_id);
        
        if (productDetails) {
            // 🎯 FIX: Calculate price based on category rule variations
            let transactionalPrice = Math.floor(productDetails.price * 0.5);
            if (productDetails.category && productDetails.category.trim().toUpperCase() === "GIFT BOXES") {
                transactionalPrice = productDetails.price;
            }

            const itemTotal = transactionalPrice * cartItem.quantity;
            grandTotal += itemTotal;

            // Add the item line item to your text message
            message += ` *${productDetails.title}*\n`;
            message += `   Qty: ${cartItem.quantity} x Rs.${transactionalPrice} = Rs.${itemTotal}\n\n`;
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
// =========================================================================
// ⭐ ADD STEP 3 HERE: STANDALONE MODAL STATE RENDERING CONTROLLERS
// =========================================================================
function openProductModal(productId) {
    const modal = document.getElementById("productModal");
    const mainDetailsContainer = document.getElementById("modalMainDetails");
    const relatedContainer = document.getElementById("relatedProductsList");
    
    const targetProduct = listProducts.find(p => p.id == productId);
    if (!targetProduct) return;

    mainDetailsContainer.innerHTML = '';
    relatedContainer.innerHTML = '';

    // DYNAMIC STATE ENGINE: Determine if this item is currently inside the shopping cart memory matrix
    let cartItemIndex = carts.findIndex((value) => value.product_id == targetProduct.id);
    let currentQty = cartItemIndex < 0 ? 0 : carts[cartItemIndex].quantity;

    let modalActionControlHTML = '';
    if (currentQty > 0) {
        modalActionControlHTML = `
            <div class="quantity-counter-inline" data-id="${targetProduct.id}">
                <button class="minus" data-id="${targetProduct.id}">-</button>
                <div class="qty-display">${currentQty}</div>
                <button class="plus" data-id="${targetProduct.id}">+</button>
            </div>
        `;
    } else {
        modalActionControlHTML = `
            <button class="addCart" data-id="${targetProduct.id}">Add to Cart</button>
        `;
    }

    // ==========================================
    // 🎯 START OF STEP 4 ADDITION
    // ==========================================
    let modalDisplayPrice = Math.floor(targetProduct.price * 0.5);
    let modalMrpTagHTML = `
        <span style="font-size: 0.9rem; text-decoration: line-through; color: #8b949e; margin-left: 8px;">
            MRP. ${targetProduct.price}
        </span>
    `;

    // Remove discount tracking layout variables strictly for the GIFT BOXES category
    if (targetProduct.category && targetProduct.category.trim().toUpperCase() === "GIFT BOXES") {
        modalDisplayPrice = targetProduct.price;
        modalMrpTagHTML = ''; // Hides slashed original pricing text completely
    }
    // ==========================================
    // 🎯 END OF STEP 4 ADDITION
    // ==========================================

    mainDetailsContainer.innerHTML = `
        <img src="${targetProduct.image}" alt="${targetProduct.title}">
        <div class="modal-info-text">
            <h2>${targetProduct.title}</h2>
            <p style="color: #8b949e; font-size: 13px; margin-bottom: 8px;">Category: ${targetProduct.category}</p>
            <div style="font-size: 1.2rem; font-weight: 700; color: #ff9f43; margin-bottom: 10px;">
                Rs.${modalDisplayPrice}
                ${modalMrpTagHTML}
            </div>
            
            <!-- CART INTERFACE ANCHOR POINT -->
            <div class="action-container" data-id="${targetProduct.id}">
                ${modalActionControlHTML}
            </div>
        </div>
    `;

    // Render related item category strip loops metrics below
    const relatedItems = listProducts.filter(p => 
        p.category === targetProduct.category && p.id != targetProduct.id
    );

        if (relatedItems.length === 0) {
        relatedContainer.innerHTML = `<div style="color: #8b949e; font-size: 13px; padding: 10px;">No related items found in this category.</div>`;
    } else {
        relatedItems.forEach(item => {
            let relatedCard = document.createElement('div');
            relatedCard.classList.add('related-item-card');
            relatedCard.dataset.id = item.id; 
            
            // 🎯 FIX: Apply category specific base calculations for related items strip prices
            let relatedDisplayPrice = Math.floor(item.price * 0.5);
            if (item.category && item.category.trim().toUpperCase() === "GIFT BOXES") {
                relatedDisplayPrice = item.price; // Sell related gift boxes at full MRP
            }
            
            relatedCard.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <h4>${item.title}</h4>
                <div style="color: #ff9f43; font-size: 12px; font-weight: bold; margin-top: 4px;">
                    Rs.${relatedDisplayPrice}
                </div>
            `;
            relatedContainer.appendChild(relatedCard);
        });
    }


    modal.classList.add("active");
}


function closeProductModal() {
    document.getElementById("productModal").classList.remove("active");
}

// Optional background auto-close handle listener layer configurations
let modalOverlayNode = document.getElementById("productModal");
if(modalOverlayNode) {
    modalOverlayNode.addEventListener('click', function(e) {
        if (e.target === this) {
            closeProductModal();
        }
    });
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
