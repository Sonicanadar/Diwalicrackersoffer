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


form1.onchange = function(event){
    event.preventDefault();

    let valueFilter = this.category.value;
    console.log(valueFilter);
    productFilter = listProducts.filter(item =>{
        
       if(valueFilter !=''){
        console.log(item.category);
                   if(item.category !=  valueFilter)
                    
                    return false;
       }
        return true;
    })
    addDataToHTML(productFilter);
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
let carts = [];
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
//                 <div class="price"><span>MRP. ${product.price} </span>Our Price.${Math.floor((product.price*0.3))}</div>
//                  <button class="addCart" data-id="${product.id}">Add to Cart</button>
//                 `;
//                 listProductHTML.appendChild(newProduct); 
//     })
// }


function addDataToHTML(productFilter){
    listProductHTML.innerHTML ='';
    
        productFilter.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.dataset.id=product.id;
            newProduct.innerHTML =  `
                <img src="${product.image}" alt="">
                <h2>${product.title}</h2>
                <div class="price"><span>MRP. ${product.price} </span>Rs.${Math.floor((product.price*0.3))}</div>
                 <button class="addCart" data-id="${product.id}">Add to Cart</button>
                `;
                listProductHTML.appendChild(newProduct);
        })
    
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
    let totalPriceHTML = document.querySelector('.cartTab .foot span');
    let totalQuantity = 0;
    listHTML.innerHTML = null;
  
    
    let totalPrice = 0;
    totalPriceHTML.innerText = totalPrice;
   
    totalHTML.innerText = totalQuantity;
//  console.log(idProduct,positionThisProductInCart,quantity);
if(carts.length == 0){
    document.getElementById("total_price").innerHTML = "$ "+0+".00";
    document.getElementsByClassName('.listCart .name').innerText = "Your cart is empty";
   
}
else{
        carts.forEach(item => {
        totalQuantity=totalQuantity + item.quantity;
        
            let newCart = document.createElement('div');
            newCart.classList.add('item');
            let positionProduct = listProducts.findIndex((value) => value.id == item.product_id);
            //console.log(positionProduct)
            let info = listProducts[positionProduct];
            totalPrice = totalPrice+Math.floor(info.price*0.3*item.quantity);
           // console.log(info);
            newCart.innerHTML = `<div class="image">
                    <img src="${info.image}" alt="">
                </div>
                <div class="name">
                    ${info.title}
                </div>
                <div class="totalPrice">
                    ${Math.floor(info.price*0.3*item.quantity)}
                </div>
                <div class="quantity">
                    <button class="minus" data-id="${info.id}"><</button>
                    <span>${item.quantity}</span>
                    <span class="plus" data-id="${info.id}">></span>
                </div>`;
                listCartHTML.appendChild(newCart);
        })
    }
    totalHTML.innerText = totalQuantity;
    totalPriceHTML.innerText ="Rs."+ totalPrice+".00";
    console.log(totalPrice);
}

function emailSend(){
    
    var messageBody = '';
     let totalPrice = 0;
    let totalQuantity = 0;
    // carts.forEach(item => {
      
    //     let positionProduct = listProducts.findIndex((value) => value.id == item.product_id);
    //     let info = listProducts[positionProduct];
    //     totalPrice = totalPrice+(info.price*0.3*item.quantity);
    //     messageBody = messageBody + "<br>Name :"+info.title+" &nbsp;Quantity :"+item.quantity+" &emsp; Price :"+info.price*0.3*item.quantity;
    // })

    // <table><tr><th>Company</th><th>Contact</th><th>Country</th></tr></table>

    messageBody = `Full Name: ${fullName.value}<br> Email: ${email.value}<br> Phone Number: ${phone.value}<br> Pincode : ${pincode.value}<br>Address: ${address.value}<br>`;

    messageBody=messageBody+"<br><table style=\"border:1px solid black;\"><tr style=\"border:1px solid black;\"><th style=\"border:1px solid black;\">Name</th><th style=\"border:1px solid black;\">Quantity</th><th style=\"border:1px solid black;\">Price</th></tr>";
    messaageSubject = `Crackers Order - ${fullName.value}`;
    carts.forEach(item => {
      
        let positionProduct = listProducts.findIndex((value) => value.id == item.product_id);
        let info = listProducts[positionProduct];
        totalPrice = totalPrice+Math.floor(info.price*0.3*item.quantity);
        totalQuantity = totalQuantity+(item.quantity);
        messageBody = messageBody + "<tr style=\"border:1px solid black;\"><td style=\"border:1px solid black;\">"+info.title+"</td><td style=\"border:1px solid black;\">"+item.quantity+"</td><td style=\"border:1px solid black;\">"+Math.floor(info.price*0.3)+"</td></tr>";
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


const initApp = () => {
    //get data from json
    fetch('products.json')
    .then(response => response.json())
    .then(data=> {
        listProducts = data;
        productFilter = listProducts;
        addDataToHTML(productFilter);
        
    })
}
initApp();