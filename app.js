let listProductHTML = document.querySelector('.listProduct');
let iconCart = document.querySelector('.icon-cart');
let closeBtn = document.querySelector('.cartTab .close');
let body=document.querySelector('body');


// iconCart.addEventListener('click', ()=> {
//     body.classList.toggle('activeTabCart');
// })
// closeBtn.addEventListener('click', ()=> {
//     body.classList.toggle('activeTabCart');
// })
let listProducts = [];

const addDataToHTML = () => {
    listProductHTML.innerHTML ='';
    if(listProducts.length > 0){
        listProducts.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.innerHTML =  `
                <img src="${product.image}" alt="">
                <h2>${product.title}</h2>
                <div class="price">Rs.<span> ${product.price} </span>${product.discount}</div>
                 
                `;
                listProductHTML.appendChild(newProduct);
        })
    }
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