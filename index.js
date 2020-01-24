'use strict';

let client;
let checkout;
let collection;
let lineItemIds=[];

function initializeClient () {
  let url = 'https://zach-api.counsel.bitbakeryapps.in/api?path=storefront_access_tokens.json'  

  fetch(url, {type: 'POST'})
    .then((res) => {
      return res.json()
    })
    .then((res) => {    
      res = JSON.parse(res);
      let accessToken = res.storefront_access_tokens[0].access_token;

      client = ShopifyBuy.buildClient({
                        domain: 'katy-keto.myshopify.com',
                        storefrontAccessToken: accessToken
                    });  
      client.checkout.create().then((co) => {  
        checkout = co;      
        fetchCollection();      
      //  console.log(checkout);        
      });                    
    });
};

async function fetchCollection () {  
  let collectionId = btoa(`gid://shopify/Collection/161766015057`);

  collection = await client.collection.fetchWithProducts(collectionId);
  displayProducts(collection.products);
  // for final version, hide the loading message and show the products div
}

function displayProducts(products) {
    // for (let i = 0; i < collection.products.length; i++){
    //     $('#ul-offer-list').append(`
    //       <li>
    //         <img src=${collection.products[i].images[0].src} class="product-images"/>
    //         <p>Price Per Day $${collection.products[i].variants[0].price/30} </p>
    //       </li>      
    //     `)
    // };
    $('#js-1-month').append(`
    <li>
      <img src=${collection.products[0].images[0].src} class="product-images"/>
      <p>Price Per Day $${collection.products[0].variants[0].price/30} </p>
    </li>      
  `)

  $('#js-3-months').append(`
    <li>
      <img src=${collection.products[1].images[0].src} class="product-images"/>
      <p>Price Per Day $${collection.products[1].variants[0].price/30} </p>
    </li>      
  `)

  $('#js-6-months').append(`
    <li>
      <img src=${collection.products[2].images[0].src} class="product-images"/>
      <p>Price Per Day $${collection.products[2].variants[0].price/30} </p>
    </li>      
  `)
};

//remove previous items from the cart
async function emptyCart () {  
  await client.checkout.removeLineItems(checkout.id, lineItemIds);
  lineItemIds = [];
  return;

};

async function click1month () {
  await emptyCart();

  const checkoutId = checkout.id;
  const lineItemsToAdd = [
    {
      variantId: collection.products[0].variants[0].id,
      quantity: 1      
    }    
  ];

// Add item to the checkout
  client.checkout.addLineItems(checkoutId, lineItemsToAdd).then((checkout) => {
  });

// assign checkoutURL to button 
  $('#js-checkout-button').html(`
  <form action="${checkout.webUrl}">
  <input type="submit" value="Checkout" id="checkout-button"/>
  </form>`)
};



async function click3months() {
  await emptyCart();

  const checkoutId = checkout.id;
  const lineItemsToAdd = [
    {
      variantId: collection.products[1].variants[0].id,
      quantity: 1      
    }    
  ];

// Add item to the checkout
  client.checkout.addLineItems(checkoutId, lineItemsToAdd).then((checkout) => {
  });

// assign checkoutURL to button 
$('#js-checkout-button').html(`
<form action="${checkout.webUrl}">
<input type="submit" value="Checkout" id="checkout-button"/>
</form>`)
};


async function click6months() {
  await emptyCart();

  const checkoutId = checkout.id;
  const lineItemsToAdd = [
    {
      variantId: collection.products[2].variants[0].id,
      quantity: 1      
    }    
  ];
// Add item to the checkout
  client.checkout.addLineItems(checkoutId, lineItemsToAdd).then((checkout) => {
  });
// assign checkoutURL to button 
$('#js-checkout-button').html(`
  <form action="${checkout.webUrl}">
  <input type="submit" value="Checkout" id="checkout-button"/>
  </form>`)
};


function initializeListeners () {
  $('#js-1-month').on('click', function(){
    click1month();
    console.log('1 month clicked')
  });

  $('#js-3-months').on('click', function(){
    click3months();
  });

  $('#js-6-months').on('click', function(){
    click6months();
  });
}


//booting up the event listeners
function bootUp() {
    initializeClient()
    initializeListeners()    
   };
  
   $(bootUp);