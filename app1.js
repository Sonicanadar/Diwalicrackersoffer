let listProductHTML = document.querySelector('.listProduct');
let iconCart = document.querySelector('.icon-cart');
let closeBtn = document.querySelector('.close');
let body=document.querySelector('body');
let listCartHTML = document.querySelector('.listCart');
let iconCartSpan = document.querySelector('.icon-cart span');

let plus = document.querySelector('.plus');

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

let listProducts = [];
let carts = [];
let totalQuantity = 0 ;

const addDataToHTML = () => {
    listProductHTML.innerHTML ='';
    if(listProducts.length > 0){
        listProducts.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.dataset.id=product.id;
            newProduct.innerHTML =  `
                <img src="${product.image}" alt="">
                <h2>${product.title}</h2>
                <div class="price"><span>MRP. ${product.price} </span>SP.${Math.floor((product.price*0.3))}</div>
                 <button class="addCart" data-id="${product.id}">Add to Cart</button>
                `;
                listProductHTML.appendChild(newProduct);
        })
    }
}


document.addEventListener('click', (event) => {
    let positionClick = event.target;
    console.log(positionClick);
    let idProduct = positionClick.dataset.id;
    //console.log(positionClick.parentElement.dataset);
    console.log(idProduct);
    let positionThisProductInCart = carts.findIndex((value) => value.product_id == idProduct);
    //console.log(positionThisProductInCart);
    
    let quantity = positionThisProductInCart < 0 ? 0 : carts[positionThisProductInCart].quantity;
    
    if(positionClick.classList.contains('addCart') ){
        let idProduct = positionClick.parentElement.dataset.id;
        // let idProduct = positionClick.parentElement.dataset.id;
      //  console.log(positionClick.parentElement.dataset);
        quantity++;
        //console.log(positionThisProductInCart);
        addToCart(idProduct,quantity,positionThisProductInCart);
    } else if(positionClick.classList.contains('plus')){
         let idProduct = positionClick.dataset.id; 
        // positionThisProductInCart = carts.findIndex((value) => value.product_id == idProduct);
        //console.log(idProduct);
        //console.log(positionClick.parentElement.dataset);
        quantity++;
        //console.log(quantity);
        addToCart(idProduct,quantity,positionThisProductInCart);
        
    }else if(positionClick.classList.contains('minus')){
        quantity--;
        addToCart(idProduct,quantity,positionThisProductInCart);
    }
})

const addToCart = (idProduct,quantity,positionThisProductInCart) => {
    
    if(quantity >0){
        if(positionThisProductInCart < 0){
           
        carts.push({
            product_id:idProduct,
            quantity:quantity
        }); 
        }else {
        carts[positionThisProductInCart].quantity = quantity;
    }
}else{
    carts.splice(positionThisProductInCart,1);
}
    addCartToHTML();
}

const addCartToHTML = () => {
    let listHTML = document.querySelector('.listCart');
    let totalHTML = document.querySelector('.icon-cart span');
    let totalQuantity = 0;
    listHTML.innerHTML = null;
   
 
//  console.log(idProduct,positionThisProductInCart,quantity);
        carts.forEach(item => {
        totalQuantity=totalQuantity + item.quantity;
        
            let newCart = document.createElement('div');
            newCart.classList.add('item');
            let positionProduct = listProducts.findIndex((value) => value.id == item.product_id);
            //console.log(positionProduct)
            let info = listProducts[positionProduct];
           // console.log(info);
            newCart.innerHTML = `<div class="image">
                    <img src="${info.image}" alt="">
                </div>
                <div class="name">
                    ${info.title}
                </div>
                <div class="totalPrice">
                    ${info.price*item.quantity}
                </div>
                <div class="quantity">
                    <button class="minus" data-id="${info.id}"><</button>
                    <span>${item.quantity}</span>
                    <span class="plus" data-id="${info.id}">></span>
                </div>`;
                listCartHTML.appendChild(newCart);
        })
    
    totalHTML.innerText = totalQuantity;
}



const initApp = () => {
    //get data from json
    fetch('products.json')
    .then(response => response.json())
    .then(data=> {
        listProducts = data;
        addDataToHTML();
    })
}
initApp();