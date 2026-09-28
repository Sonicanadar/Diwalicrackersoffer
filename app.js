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
let menu = form1 ? form1.category : null;
let options = form1 && form1.category ? form1.category.options : null;
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


if (iconCart) iconCart.addEventListener('click', ()=> {
    body.classList.toggle('activeTabCart')
})
if (closeBtn) closeBtn.addEventListener('click', ()=> {
    body.classList.toggle('activeTabCart')
})





 
const form = document.querySelector("form");
const fullName = document.getElementById("name");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const pincode = document.getElementById("pincode");
const address = document.getElementById("address");



if (form) form.addEventListener("submit",(e)=>{
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
    // 🛠️ CHANGED: Show a clean, bright badge stating "No Discount" for Gift Boxes
    mrpTagHTML = `<span style="font-size: 0.75rem; color: #ff9f43; background-color: rgba(255, 159, 67, 0.15); padding: 2px 6px; border-radius: 4px; margin-right: 6px; font-weight: 600; text-decoration: none !important;">No Discount</span>`;
}


        newProduct.innerHTML = `
            <button class="share-btn" data-id="${product.id}" aria-label="Share this product" title="Share"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="pointer-events:none"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.6" y1="13.5" x2="15.4" y2="17.5"/><line x1="15.4" y1="6.5" x2="8.6" y2="10.5"/></svg></button>
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

        if (!clickedInsideCartDrawer && !clickedHeaderCartIconRing && !positionClick.closest('.upi-modal')) {
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
    const listHTML = document.querySelector('.listCart');
    const badge = document.querySelector('.icon-cart span');
    const cartTab = document.querySelector('.cartTab');
    let totalQuantity = 0, totalPrice = 0, totalMrp = 0;

    if (listHTML) listHTML.innerHTML = '';

    carts.forEach(item => {
        const info = listProducts.find(v => v.id == item.product_id);
        if (!info) return;

        const isGift = info.category && info.category.trim().toUpperCase() === "GIFT BOXES";
        const unit = isGift ? info.price : Math.floor(info.price * 0.5);
        const lineMrp = info.price * item.quantity;
        const linePay = unit * item.quantity;

        totalQuantity += item.quantity;
        totalPrice += linePay;
        totalMrp += lineMrp;

        const row = document.createElement('div');
        row.classList.add('cx-item');
        row.innerHTML = `
            <img class="cx-img" src="${info.image}" alt="">
            <div class="cx-mid">
                <div class="cx-name">${info.title}</div>
                <div class="cx-unit">Rs.${unit} each${isGift ? ' · No discount' : ''}</div>
                <div class="cx-qty">
                    <button class="minus" data-id="${info.id}">&minus;</button>
                    <span>${item.quantity}</span>
                    <button class="plus" data-id="${info.id}">+</button>
                </div>
            </div>
            <div class="cx-right">
                <button class="cart-item-delete" data-id="${info.id}" title="Remove item">&times;</button>
                <div class="cx-line">
                    ${isGift ? '' : `<s>Rs.${lineMrp}</s>`}
                    <b>Rs.${linePay}</b>
                </div>
            </div>
        `;
        if (listHTML) listHTML.appendChild(row);
    });

    if (totalQuantity === 0 && listHTML) {
        listHTML.innerHTML = `
            <div class="cx-empty-msg">
                <div class="cx-empty-icon">🎆</div>
                <p>Your cart is empty</p>
                <span>Add some crackers to get started</span>
            </div>`;
    }

    if (cartTab) cartTab.classList.toggle('cx-empty', totalQuantity === 0);

    const setText = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };
    setText('cx-count', totalQuantity + (totalQuantity === 1 ? ' item' : ' items'));
    setText('cx-mrp', 'Rs.' + totalMrp);
    setText('cx-save', '- Rs.' + (totalMrp - totalPrice));
    setText('cx-total', 'Rs.' + totalPrice);
    const saveRow = document.getElementById('cx-save-row');
    if (saveRow) saveRow.style.display = (totalMrp - totalPrice) > 0 ? 'flex' : 'none';

    if (badge) {
        if (totalQuantity > 0) {
            badge.innerText = totalQuantity;
            badge.style.display = 'flex';
        } else {
            badge.innerText = '';
            badge.style.display = 'none';
        }
    }

    if (carts.length > 0) {
        localStorage.setItem('shopping_cart', JSON.stringify(carts));
    }
};

// =========================================================================
// PAYMENT: UPI + CASH ON DELIVERY (both confirm through WhatsApp)
// =========================================================================
// ⚠️ REPLACE with your real UPI ID (VPA) and the name shown to customers
const UPI_ID = "yourname@upi";
const UPI_PAYEE_NAME = "Vav Pyro Park";
const BUSINESS_WHATSAPP = "919867731440";

function unitPriceOf(p) {
    return (p.category && p.category.trim().toUpperCase() === "GIFT BOXES")
        ? p.price
        : Math.floor(p.price * 0.5);
}

function getCartTotal() {
    let total = 0;
    carts.forEach(item => {
        const info = listProducts.find(p => p.id == item.product_id);
        if (info) total += unitPriceOf(info) * item.quantity;
    });
    return total;
}

// Name + address are needed for delivery in both payment modes
function getCustomerDetails() {
    const nameEl = document.getElementById('cx-name');
    const addrEl = document.getElementById('cx-address');
    const name = nameEl.value.trim();
    const address = addrEl.value.trim();

    nameEl.classList.toggle('cx-invalid', !name);
    addrEl.classList.toggle('cx-invalid', !address);

    if (!name || !address) {
        alert("Please enter your name and delivery address.");
        (!name ? nameEl : addrEl).focus();
        return null;
    }
    return { name, address };
}

// ---------------------------------------------------------------------
// ORDER IDs + ORDER RECORDS (saved to your Google Sheet)
// Setup: paste the Google Apps Script web-app URL between the quotes below.
// Leave it empty ("") to skip saving orders to a sheet (WhatsApp still works).
// ---------------------------------------------------------------------
const ORDER_SHEET_URL = "";

// Email backup (Web3Forms): paste your access key between the quotes. Leave "" to skip.
const WEB3FORMS_KEY = "";

function generateOrderId() {
    const d = new Date();
    const yy = String(d.getFullYear()).slice(2);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';   // no confusing 0/O/1/I
    let rand = '';
    for (let i = 0; i < 4; i++) rand += chars[Math.floor(Math.random() * chars.length)];
    return `VPP-${yy}${mm}${dd}-${rand}`;
}

function buildOrderRecord(orderId, customer, payment, screenshotUrl) {
    let total = 0;
    const parts = [];
    carts.forEach(ci => {
        const p = listProducts.find(x => x.id == ci.product_id);
        if (!p) return;
        const unit = unitPriceOf(p);
        const line = unit * ci.quantity;
        total += line;
        parts.push(`${p.title} x${ci.quantity} @Rs.${unit} = Rs.${line}`);
    });
    return {
        orderId,
        time: new Date().toISOString(),
        name: customer.name,
        address: customer.address,
        payment,
        items: parts.join('\n'),
        total,
        screenshot: screenshotUrl || '',
        status: 'New'
    };
}

function postOrderRecord(record) {
    return fetch(ORDER_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        keepalive: true,
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(record)
    });
}

function sendOrderEmail(record) {
    if (!WEB3FORMS_KEY) return;
    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        keepalive: true,
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            subject: `New Order ${record.orderId} - Rs.${record.total} (${record.payment})`,
            from_name: 'Vav Pyro Park Website',
            'Order ID': record.orderId,
            'Date & Time': new Date(record.time).toLocaleString('en-IN'),
            'Customer Name': record.name,
            'Address': record.address,
            'Payment': record.payment,
            'Items': record.items,
            'Total (Rs)': record.total,
            'Payment Screenshot': record.screenshot || 'N/A'
        })
    }).catch(() => { /* email is only a backup, ignore failures */ });
}

function sendOrderRecord(record) {
    // Customer's own device keeps a short history of their order IDs
    try {
        const hist = JSON.parse(localStorage.getItem('vpp_my_orders') || '[]');
        hist.unshift({ id: record.orderId, time: record.time, total: record.total, payment: record.payment });
        localStorage.setItem('vpp_my_orders', JSON.stringify(hist.slice(0, 50)));
    } catch (e) { /* ignore */ }

    sendOrderEmail(record);

    if (!ORDER_SHEET_URL) return;
    postOrderRecord(record).catch(() => {
        // No internet at that moment: keep it and retry next time the site opens
        try {
            const q = JSON.parse(localStorage.getItem('vpp_unsent_orders') || '[]');
            q.push(record);
            localStorage.setItem('vpp_unsent_orders', JSON.stringify(q));
        } catch (e) { /* ignore */ }
    });
}

function flushUnsentOrders() {
    if (!ORDER_SHEET_URL) return;
    let q = [];
    try { q = JSON.parse(localStorage.getItem('vpp_unsent_orders') || '[]'); } catch (e) { return; }
    if (!q.length) return;
    localStorage.removeItem('vpp_unsent_orders');
    q.forEach(rec => postOrderRecord(rec).catch(() => {
        const again = JSON.parse(localStorage.getItem('vpp_unsent_orders') || '[]');
        again.push(rec);
        localStorage.setItem('vpp_unsent_orders', JSON.stringify(again));
    }));
}

function showOrderToast(orderId) {
    const t = document.createElement('div');
    t.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:100002;max-width:92vw;background:#161b22;color:#fff;border:2px solid #ff9f43;border-radius:12px;padding:14px 18px;text-align:center;font-size:14px;box-shadow:0 10px 30px rgba(0,0,0,.6);';
    t.innerHTML = `✅ <b>Order placed!</b><br>Your Order ID: <b style="color:#ff9f43;font-size:16px;">${orderId}</b><br><span style="color:#8b949e;font-size:12px;">Send the WhatsApp message to confirm. Keep this ID for reference.</span>`;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 12000);
    t.addEventListener('click', () => t.remove());
}

flushUnsentOrders();

function buildOrderMessage(heading, customer, paymentLines, orderId) {
    let message = `*${heading}*\n🆔 *Order ID:* ${orderId}\n\n`;
    message += `*Name:* ${customer.name}\n*Address:* ${customer.address}\n\n`;
    let grandTotal = 0;
    carts.forEach(cartItem => {
        const p = listProducts.find(x => x.id == cartItem.product_id);
        if (!p) return;
        const unit = unitPriceOf(p);
        const line = unit * cartItem.quantity;
        grandTotal += line;
        message += `*${p.title}*\n   Qty: ${cartItem.quantity} x Rs.${unit} = Rs.${line}\n\n`;
    });
    message += `💰 *Grand Total:* Rs.${grandTotal}\n`;
    message += paymentLines;
    return message;
}

function finishOrder() {
    carts = [];
    localStorage.removeItem('shopping_cart');
    document.getElementById('cx-name').value = '';
    document.getElementById('cx-address').value = '';
    addCartToHTML();
    // Reset the product grid so every card goes back to "Add to Cart"
    addDataToHTML(productFilter || listProducts);
    body.classList.remove('activeTabCart');
}

// ---------- Cash on Delivery ----------
function checkoutCOD() {
    if (!carts || carts.length === 0) { alert("Your cart is empty!"); return; }
    const customer = getCustomerDetails();
    if (!customer) return;

    const orderId = generateOrderId();
    const message = buildOrderMessage(
        "New Order - Cash on Delivery",
        customer,
        `💵 *Payment:* Cash on Delivery (COD)\n\nPlease confirm my order.`,
        orderId
    );
    sendOrderRecord(buildOrderRecord(orderId, customer, 'Cash on Delivery', ''));
    window.open(`https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent(message)}`, '_blank');
    finishOrder();
    showOrderToast(orderId);
}

// ---------- UPI ----------
function buildUpiLink(amount) {
    const params = new URLSearchParams({
        pa: UPI_ID,
        pn: UPI_PAYEE_NAME,
        am: amount.toFixed(2),
        cu: "INR",
        tn: "Crackers order"
    });
    return "upi://pay?" + params.toString();
}

function openUpiModal() {
    if (!carts || carts.length === 0) { alert("Your cart is empty!"); return; }
    if (!getCustomerDetails()) return;

    const total = getCartTotal();
    const link = buildUpiLink(total);

    document.getElementById("upiAmount").innerText = "Rs." + total;
    document.getElementById("upiIdText").innerText = UPI_ID;
    document.getElementById("upiPayLink").href = link;

    const qrBox = document.getElementById("upiQr");
    qrBox.innerHTML = "";
    if (window.QRCode) {
        new QRCode(qrBox, { text: link, width: 180, height: 180 });
    } else {
        qrBox.innerText = "QR unavailable. Use the button or UPI ID above.";
    }
    document.getElementById("upiModal").classList.add("active");
}

function closeUpiModal() {
    resetUpiConfirmButton();
    document.getElementById("upiModal").classList.remove("active");
}

function copyUpiId() {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(UPI_ID).then(() => alert("UPI ID copied: " + UPI_ID));
    } else {
        prompt("Copy this UPI ID:", UPI_ID);
    }
}

function onUpiScreenshotChange(input) {
    resetUpiConfirmButton();
    const file = input.files && input.files[0];
    const preview = document.getElementById('upiShotPreview');
    const label = document.getElementById('upiShotLabel');
    if (!file) {
        preview.style.display = 'none';
        label.innerText = '📸 Attach payment screenshot';
        return;
    }
    if (!file.type.startsWith('image/')) {
        alert('Please choose an image (screenshot) file.');
        input.value = '';
        return;
    }
    if (file.size > 15 * 1024 * 1024) {
        alert('This image is too large. Please choose a smaller screenshot.');
        input.value = '';
        return;
    }
    preview.src = URL.createObjectURL(file);
    preview.style.display = 'block';
    label.innerText = '✅ ' + file.name + ' (tap to change)';
}

function resetUpiScreenshot() {
    const input = document.getElementById('upiShot');
    if (input) input.value = '';
    onUpiScreenshotChange({ files: [] });
}

// ---------------------------------------------------------------------
// Screenshot upload (Cloudinary, free). The uploaded image link is put in
// the WhatsApp order message, so it goes to YOUR number like a COD order.
// Setup: cloudinary.com -> free account -> Settings > Upload > add an
// UNSIGNED upload preset. Then paste your cloud name and preset name below.
// ---------------------------------------------------------------------
const CLOUDINARY_CLOUD_NAME = "jewcomoh";
const CLOUDINARY_UPLOAD_PRESET = "l42y0qa6";

function cloudinaryConfigured() {
    return CLOUDINARY_CLOUD_NAME !== "your_cloud_name" &&
           CLOUDINARY_UPLOAD_PRESET !== "your_unsigned_preset";
}

// Shrinks big phone screenshots so the upload is quick on mobile data
function shrinkImage(file, maxSide = 1280, quality = 0.8) {
    return new Promise(resolve => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
            const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
            const canvas = document.createElement('canvas');
            canvas.width = Math.round(img.width * scale);
            canvas.height = Math.round(img.height * scale);
            canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(blob => { URL.revokeObjectURL(url); resolve(blob || file); }, 'image/jpeg', quality);
        };
        img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
        img.src = url;
    });
}

async function uploadScreenshot(file) {
    const blob = await shrinkImage(file);
    const fd = new FormData();
    fd.append('file', blob, 'payment.jpg');
    fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    fd.append('folder', 'payment-screenshots');
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: fd
    });
    if (!res.ok) throw new Error('Upload failed: ' + res.status);
    const data = await res.json();
    if (!data.secure_url) throw new Error('No image URL returned');
    return data.secure_url;
}

let pendingUpi = null;
const UPI_BTN_DEFAULT_TEXT = 'Send order + screenshot on WhatsApp';

function resetUpiConfirmButton() {
    pendingUpi = null;
    const b = document.querySelector('.upi-confirm');
    if (b) { b.disabled = false; b.innerText = UPI_BTN_DEFAULT_TEXT; }
}

async function confirmUpiPaymentOnWhatsApp() {
    const input = document.getElementById('upiShot');
    const file = input.files && input.files[0];
    if (!file) {
        alert("Please attach a screenshot of your UPI payment.");
        return;
    }
    const customer = getCustomerDetails();
    if (!customer) return;

    const btn = document.querySelector('.upi-confirm');
    const btnText = btn.innerText;

    // Step 2: screenshot already uploaded -> this tap (a real user tap) opens WhatsApp on your number
    if (pendingUpi) {
        const sent = pendingUpi;
        pendingUpi = null;
        sendOrderRecord(sent.record);
        window.open(sent.url, '_blank');
        closeUpiModal();
        resetUpiScreenshot();
        finishOrder();
        showOrderToast(sent.record.orderId);
        return;
    }

    // MAIN FLOW, step 1: upload the screenshot, then wait for one more tap to open WhatsApp
    if (cloudinaryConfigured()) {
        btn.disabled = true;
        btn.innerText = 'Uploading screenshot...';
        try {
            const imageUrl = await uploadScreenshot(file);
            const orderId = generateOrderId();
            const message = buildOrderMessage(
                "New Order - Paid via UPI",
                customer,
                `✅ *Paid via UPI to:* ${UPI_ID}\n📸 *Payment screenshot:* ${imageUrl}\n\nPlease verify the payment and confirm my order.`,
                orderId
            );
            pendingUpi = {
                url: `https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent(message)}`,
                record: buildOrderRecord(orderId, customer, 'UPI (paid)', imageUrl)
            };
            btn.disabled = false;
            btn.innerText = '✅ Screenshot uploaded - Tap to open WhatsApp';
            return;
        } catch (err) {
            console.error(err);
            alert("Could not upload the screenshot. Please check your internet and try again.");
            btn.disabled = false;
            btn.innerText = btnText;
            return;
        }
    }

    // BACKUP FLOW (only if Cloudinary is not set up): opens your WhatsApp number directly, text only
    const orderId = generateOrderId();
    const message = buildOrderMessage(
        "New Order - Paid via UPI",
        customer,
        `✅ *Paid via UPI to:* ${UPI_ID}\n📸 I am attaching my payment screenshot in this chat.\n\nPlease verify the payment and confirm my order.`,
        orderId
    );
    sendOrderRecord(buildOrderRecord(orderId, customer, 'UPI (paid)', ''));
    window.open(`https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent(message)}`, '_blank');
    alert("WhatsApp is opening. Please attach your payment screenshot in the chat and send it.");
    closeUpiModal();
    resetUpiScreenshot();
    finishOrder();
    showOrderToast(orderId);
}

function emailSend() {
    let totalPrice = 0;
    let totalQuantity = 0;

    // 1. Build the dynamic order HTML breakdown table matching your custom layouts
    let messageBody = `Full Name: ${fullName.value}<br> Email: ${email.value}<br> Phone Number: ${phone.value}<br> Pincode : ${pincode.value}<br>Address: ${address.value}<br>`;
    messageBody += "<br><table style=\"border:1px solid black; border-collapse: collapse; width: 100%;\"><tr style=\"background-color: #21262d; color: white;\"><th style=\"border:1px solid black; padding: 8px;\">Name</th><th style=\"border:1px solid black; padding: 8px;\">Quantity</th><th style=\"border:1px solid black; padding: 8px;\">Price</th></tr>";
    
    let messageSubject = `Crackers Order - ${fullName.value}`;
    
    carts.forEach(item => {
        let positionProduct = listProducts.findIndex((value) => value.id == item.product_id);
        let info = listProducts[positionProduct];
        if (info) {
            let itemUnitPrice = Math.floor(info.price * 0.5);
            if (info.category && info.category.trim().toUpperCase() === "GIFT BOXES") {
                itemUnitPrice = info.price;
            }
            
            totalPrice += (itemUnitPrice * item.quantity);
            totalQuantity += item.quantity;
            messageBody += `<tr><td style="border:1px solid black; padding: 8px;">${info.title}</td><td style="border:1px solid black; padding: 8px; text-align: center;">${item.quantity}</td><td style="border:1px solid black; padding: 8px; text-align: right;">Rs.${itemUnitPrice * item.quantity}</td></tr>`;
        }
    });
    
    messageBody += `<tr style="font-weight: bold; background-color: #f1f3f6;"><td style="border:1px solid black; padding: 8px;">Total</td><td style="border:1px solid black; padding: 8px; text-align: center;">${totalQuantity}</td><td style="border:1px solid black; padding: 8px; text-align: right;">Rs.${totalPrice}</td></tr>`;
    messageBody += "</table><br><br>Regards<br>Team";

    // =========================================================================
    // 🛠️ ELASTIC EMAIL REST API V4 INTEGRATION PATHWAY
    // =========================================================================
    
    // ⚠️ CRITICAL STEP: Paste your full unmasked API key from Elastic Email between the quotes below
    const MyElasticApiKey = "YOUR_FULL_UNMASKED_API_KEY_HERE"; 

    // Elastic Email v4 structured request payload
    const emailPayload = {
        Recipients: {
            To: ["sonicawebdev@gmail.com"] // Where you want to receive the order notification
        },
        Content: {
            Body: [
                {
                    ContentType: "HTML",
                    Charset: "utf-8",
                    Content: messageBody
                }
            ],
            From: "sonicawebdev@gmail.com", // ⚠️ Must be your verified Sender email in Elastic Email!
            Subject: messageSubject
        }
    };

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-ElasticEmail-ApiKey': MyElasticApiKey
        },
        body: JSON.stringify(emailPayload)
    };

    // Fire network call directly to the official Elastic Email v4 endpoints transaction hub
    fetch('https://elasticemail.com', requestOptions)
    .then(response => {
        if (response.ok) {
            alert("Order Submitted Successfully!");
            carts = []; // Instantly wipe shopping cart layout tracking matrix arrays
            localStorage.removeItem('shopping_cart');
            addCartToHTML(); // Refresh storefront drawer indicators
        } else {
            return response.json().then(errData => {
                console.error("Elastic Email Error Context:", errData);
                alert("Server rejected the email draft. Verify if your sender domain is authenticated.");
            });
        }
    })
    .catch(error => {
        console.error("Network Dispatch Failed:", error);
        alert("Failed to connect to email servers. Please try again.");
    });
}

// Intelligent step-by-step validator workflow engine
function handleEmailCheckoutStep() {
    if (!carts || carts.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    
    let formWrapper = document.getElementById('cart-form-scroll-wrapper');
    let triggerBtn = document.getElementById('toggle-email-checkout-btn');
    
    // Step A: If fields are hidden, expand them smoothly with a vibrant layout adjustment focus cue
    if (formWrapper.style.display === 'none' || !formWrapper.style.display) {
        formWrapper.style.display = 'block';
        triggerBtn.innerHTML = '🚀 Send Email';
        triggerBtn.style.backgroundColor = '#161b22'; // Sleek dark confirmation tone
        triggerBtn.style.color = '#ff9f43';
        triggerBtn.style.border = '1px solid #ff9f43';
        formWrapper.scrollTop = 0;
    } 
    // Step B: If fields are visible and filled out, programmatically trigger the submission request
    else {
        let hiddenSubmitButton = formWrapper.querySelector('#hidden-submit-trigger');
        if (hiddenSubmitButton) {
            hiddenSubmitButton.click(); // Fires HTML5 validation constraints natively
        }
    }
}

// 🛠️ ADDED: Intelligent step-by-step validator workflow engine
function handleEmailCheckoutStep() {
    if (!carts || carts.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    
    let formWrapper = document.getElementById('cart-form-scroll-wrapper');
    let triggerBtn = document.getElementById('toggle-email-checkout-btn');
    
    // Step A: If fields are hidden, expand them smoothly with a vibrant layout adjustment focus cue
    if (formWrapper.style.display === 'none' || !formWrapper.style.display) {
        formWrapper.style.display = 'block';
        triggerBtn.innerHTML = '🚀 Finalize & Send Email';
        triggerBtn.style.backgroundColor = '#238636'; // Turns vibrant green signaling final execution action
        triggerBtn.style.color = '#ffffff';
        formWrapper.scrollTop = 0;
    } 
    // Step B: If fields are visible and filled out, programmatically trigger the submission request
    else {
        let hiddenSubmitButton = formWrapper.querySelector('#hidden-submit-trigger');
        if (hiddenSubmitButton) {
            hiddenSubmitButton.click(); // Fires HTML5 validation constraints natively
        }
    }
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

    // =========================================================================
    // 🛠️ CHANGED: Set up the bright pricing structure layout matching the cart specs
    // =========================================================================
    let modalDisplayPrice = Math.floor(targetProduct.price * 0.5);

let modalMrpTagHTML = `
    <span style="font-size: 0.95rem; text-decoration: line-through; color: #b3b9c1; margin-left: 8px; font-weight: 500; opacity: 0.85;">
        MRP. ${targetProduct.price}
    </span>
`;

// Remove discount tracking layout variables strictly for the GIFT BOXES category
if (targetProduct.category && targetProduct.category.trim().toUpperCase() === "GIFT BOXES") {
    modalDisplayPrice = targetProduct.price;
    // 🛠️ CHANGED: Show the "No Discount" badge next to the main modal price label row
    modalMrpTagHTML = `<span style="font-size: 0.8rem; color: #ff9f43; background-color: rgba(255, 159, 67, 0.15); padding: 3px 8px; border-radius: 4px; margin-left: 8px; font-weight: 600;">No Discount</span>`;
}


    mainDetailsContainer.innerHTML = `
        <img src="${targetProduct.image}" alt="${targetProduct.title}">
        <div class="modal-info-text">
            <h2>${targetProduct.title}</h2>
            <p style="color: #8b949e; font-size: 13px; margin-bottom: 8px;">Category: ${targetProduct.category}</p>
            
            <!-- Stacks the pricing components cleanly just like the shopping cart drawer row grid -->
            <div style="font-size: 1.3rem; font-weight: 700; color: #ff9f43; margin-bottom: 15px; display: flex; align-items: center; gap: 4px;">
                Rs.${modalDisplayPrice}
                ${modalMrpTagHTML}
            </div>
            
            <!-- CART INTERFACE ANCHOR POINT -->
            <div class="action-container" data-id="${targetProduct.id}">
                ${modalActionControlHTML}
            </div>
            <button class="share-btn share-inline" data-id="${targetProduct.id}"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="pointer-events:none"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.6" y1="13.5" x2="15.4" y2="17.5"/><line x1="15.4" y1="6.5" x2="8.6" y2="10.5"/></svg> Share</button>
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
            
            // Apply category specific base calculations for related items strip prices
let relatedDisplayPrice = Math.floor(item.price * 0.5);
let relatedMrpHTML = `<span style="font-size: 0.75rem; text-decoration: line-through; color: #b3b9c1; margin-left: 4px; font-weight: 400; opacity: 0.8;">Rs.${item.price}</span>`;

if (item.category && item.category.trim().toUpperCase() === "GIFT BOXES") {
    relatedDisplayPrice = item.price; // Sell related gift boxes at full MRP
    // 🛠️ CHANGED: Add inline indicator layout for compact related item cards
    relatedMrpHTML = `<span style="font-size: 0.7rem; color: #ff9f43; font-weight: 600; margin-left: 4px;">(No Disc.)</span>`;
}

            
            relatedCard.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <h4>${item.title}</h4>
                <div style="color: #ff9f43; font-size: 12px; font-weight: bold; margin-top: 4px; display: flex; align-items: center; justify-content: center; gap: 2px;">
                    Rs.${relatedDisplayPrice} ${relatedMrpHTML}
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

        // Opened from a shared link (?p=ID): show that product
        const sharedId = new URLSearchParams(window.location.search).get('p');
        if (sharedId !== null && listProducts.some(p => p.id == sharedId)) {
            openProductModal(sharedId);
        }
    })
    .catch(error => {
        if (listProductHTML) { listProductHTML.innerHTML = '<p style="color:#ff9f43;text-align:center;padding:30px;grid-column:1/-1;">Could not load products. Please refresh (Ctrl+F5). If you opened the file directly from your computer, run it through a web server or your hosting instead.</p>'; }
        console.error("Critical: Master product data catalog failed to load properly.", error);
    });
}

// Fire the application setup sequence
initApp();

// =========================================================================
// CUSTOM CATEGORY DROPDOWN (replaces the phone's native picker, so there is no "Done" button)
// =========================================================================
(function buildCategoryDropdown() {
    const nativeSelect = document.querySelector('.filter select[name="category"]');
    if (!nativeSelect) return;
    const filterForm = nativeSelect.closest('.filter');
    filterForm.classList.add('cx-custom');

    const wrap = document.createElement('div');
    wrap.className = 'cx-dd';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cx-dd-btn';
    const list = document.createElement('ul');
    list.className = 'cx-dd-list';
    list.setAttribute('role', 'listbox');

    const setLabel = () => {
        btn.textContent = nativeSelect.options[nativeSelect.selectedIndex].text;
        list.querySelectorAll('li').forEach(li =>
            li.classList.toggle('selected', li.dataset.value === nativeSelect.value));
    };

    Array.from(nativeSelect.options).forEach(opt => {
        const li = document.createElement('li');
        li.textContent = opt.text;
        li.dataset.value = opt.value;
        li.setAttribute('role', 'option');
        li.addEventListener('click', () => {
            nativeSelect.value = opt.value;
            setLabel();
            wrap.classList.remove('open');
            nativeSelect.dispatchEvent(new Event('change', { bubbles: true }));
        });
        list.appendChild(li);
    });

    btn.addEventListener('click', () => {
        wrap.classList.toggle('open');
        if (wrap.classList.contains('open')) wrap.scrollIntoView({ block: 'start', behavior: 'smooth' });
    });
    document.addEventListener('click', (e) => { if (!wrap.contains(e.target)) wrap.classList.remove('open'); });

    wrap.appendChild(btn);
    wrap.appendChild(list);
    filterForm.appendChild(wrap);
    setLabel();
})();

// =========================================================================
// SHARE A PRODUCT WITH FRIENDS
// =========================================================================
async function shareProduct(id) {
    const p = listProducts.find(x => x.id == id);
    if (!p) return;

    const price = unitPriceOf(p);
    const isGift = p.category && p.category.trim().toUpperCase() === "GIFT BOXES";
    const link = `${window.location.origin}${window.location.pathname}?p=${p.id}`;
    const priceLine = isGift ? `Rs.${price}` : `Rs.${price} (MRP Rs.${p.price} - 50% OFF)`;
    const text = `🎆 ${p.title}\n💰 ${priceLine}\nDiwali crackers at Vav Pyro Park\n\n${link}`;

    if (navigator.share) {
        // Try to include the product picture so friends see it in WhatsApp
        try {
            const res = await fetch(p.image);
            const blob = await res.blob();
            const file = new File([blob], 'product.' + (blob.type.split('/')[1] || 'png'), { type: blob.type });
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({ files: [file], text });
                return;
            }
        } catch (err) {
            if (err && err.name === 'AbortError') return;
        }
        try {
            await navigator.share({ title: p.title, text });
        } catch (err) { /* user closed the share sheet */ }
        return;
    }

    // Desktop fallback: WhatsApp share link
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}

document.addEventListener('click', (event) => {
    const shareBtn = event.target.closest('.share-btn');
    if (!shareBtn) return;
    event.stopPropagation();
    shareProduct(shareBtn.dataset.id);
});
