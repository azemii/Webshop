const searchBar = document.querySelector("#search-bar");
const productsContainer = document.querySelector(".products");
const navbar = document.querySelector(".navbar");
const carousel = document.querySelector(".carousel");

// ---------------------
//  API calls
//  -----------------------

/**
 * Retrive all the products from the webshop API
 */
async function getProducts() {
  const data = await fetch(
    "https://webshop.wm3.se/api/v1/shop/products.json?media_file=true"
  )
    .then(checkStatus)
    .then((data) => data.json())
    .then(createAndDisplayProducts)
    .catch(displayErrorMessage);

}
/**
 * Sends a GET request to the product database with the given search term.
 * @param {String} searchTerm the name of the product
 */
async function searchProduct(searchTerm) {
  if (searchTerm === "") {
    getProducts();
  } else {
    const data = await fetch(
      `https://webshop.wm3.se/api/v1/shop/products/search.json?q=${searchTerm}&media_file=true`
    )
      .then(checkStatus)
      .then((data) => data.json())
      .then(createAndDisplayProducts)
      .catch(displayErrorMessage);
  }
}

// ---------------------
//   Event Listners
//  -----------------------

/**
 * On search, call API and request the searched product
 */
searchBar.addEventListener("keydown", async (event) => {
  // When user presses enter, search for the text.
  if (event.keyCode === 13) {
    searchProduct(event.target.value);
  }
});

/**
 * Get all products once the user clears the input field.
 */
searchBar.addEventListener("input", async (event) => {
  if (!event.target.value) {
    await getProducts();
  }
});

/**
 * Add background color to the nav bar as the user scrolls past the carousel image.
 */
window.addEventListener("scroll", () => {
  const offSet = window.scrollY - carousel.clientHeight / 2;
  const alpha = offSet / 300;
  navbar.style.backgroundColor = `rgba(0,0,0,${alpha})`;
});

// ---------------------
//   HTML Elements Factory
//  -----------------------

function createAndDisplayProducts(data) {
  const numOfProducts = data.products.length;
  const maxNumOfVisibleProducts = numOfProducts > 6 ? 6 : numOfProducts;

  // Create row div to hold products
  if (productsContainer.querySelector(".row") === null) {
    const row = document.createElement("div");
    row.classList.add("row");
    productsContainer.appendChild(row);
  } else {
    // If we have products, remove all of them before appending new ones.
    while (productsContainer.querySelector(".row").lastChild) {
      productsContainer.querySelector(".row").lastChild.remove();
    }
  }

  // Create and add all the HTML products to the DOM.
  // We show at most 6 products at a time.
  for (let i = 0; i < maxNumOfVisibleProducts; i++) {
    let product = document.createElement("div");
    product.classList.add("col-md-6", "col-lg-4");

    let card = document.createElement("div");
    card.classList.add("card", "mb-3");

    let img = document.createElement("img");
    img.classList.add("card-img-top");
    img.src = data.products[i].product_image.url;

    let cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    let title = document.createElement("p");
    title.classList.add("card-title-shoe");
    title.innerHTML = data.products[i].name;

    cardBody.appendChild(title);
    card.append(img, cardBody);
    product.appendChild(card);
    productsContainer.querySelector(".row").appendChild(product);
  }
}

// ---------------------
//   Helper Methods
//  -----------------------

function checkStatus(response) {
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}

/**
 * Displays a user friendly error-alert on the page if there is an error.
 * @param {Object} error the error object
 */
function displayErrorMessage(error) {
  const alert = document.createElement("div");
  alert.classList.add("alert", "alert-danger");
  alert.setAttribute("role", "alert");
  alert.innerHTML = `There was a problem fetching the products from our datase, please try again soon! <br> ${error}`;

  productsContainer.appendChild(alert);
}

getProducts();
