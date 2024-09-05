var title = document.getElementById("title");
var price = document.getElementById("price");
var taxes = document.getElementById("taxes");
var ads = document.getElementById("ads");
var count = document.getElementById("count");
var discount = document.getElementById("discount");
var category = document.getElementById("category");

var total = document.getElementById("total");

var submit = document.getElementById("submit");

var search = document.getElementById("search");
var searchTitle = document.getElementById("search-title");
var searchCategory = document.getElementById("search-category");

let products;
let mode = "create";
let searchMode = "general";
let q;

if (localStorage.product) {
  products = JSON.parse(localStorage.product);
} else products = [];

function getTotal() {
  if (price.value !== "" && taxes.value !== "" && ads.value !== "") {
    let result = +price.value + +taxes.value + +ads.value - +discount.value;

    total.innerHTML = result + " L.E";
    total.style.background = "var(--active-color)";
  } else {
    total.innerHTML = "";
    total.style.background = "var(--deactive-color)";
  }
}

function createNewProduct() {
  let newProduct = {
    title: title.value.toLowerCase(),
    price: price.value,
    taxes: taxes.value,
    ads: ads.value,
    discount: discount.value || 0,
    total: total.innerHTML,
    count: count.value,
    category: category.value.toLowerCase(),
  };

  products.push(newProduct);
}

function createData(e) {
  e.preventDefault();

  let flag;

  if (
    title.value !== "" &&
    price.value !== "" &&
    taxes.value !== "" &&
    ads.value !== "" &&
    category.value !== ""
  ) {
    flag = true;
  } else flag = false;

  if (flag) {
    if (mode === "create") {
      if (count.value > 1 && count.value <= 100) {
        for (let i = 0; i < count.value; i++) {
          createNewProduct();
        }
      } else {
        createNewProduct();
      }
    } else {
      products[q].title = title.value;
      products[q].price = price.value;
      products[q].taxes = taxes.value;
      products[q].ads = ads.value;
      products[q].discount = discount.value;
      products[q].total = total.innerHTML;
      products[q].category = category.value;

      mode = "create";

      submit.value = "Create";
      submit.style.background = "var(--bg-btn)";
      total.style.background = "var(--deactive-color)";
      count.style.display = "block";
    }

    localStorage.product = JSON.stringify(products);

    clearInputs();
  } else {
    if (title.value == "") {
      title.style.border = "1px solid var(--deactive-color)";
    }

    if (price.value == "") {
      price.style.border = "1px solid var(--deactive-color)";
    }

    if (taxes.value == "") {
      taxes.style.border = "1px solid var(--deactive-color)";
    }

    if (ads.value == "") {
      ads.style.border = "1px solid var(--deactive-color)";
    }

    if (category.value == "") {
      category.style.border = "1px solid var(--deactive-color)";
    }
  }

  showData();
}

// clear inputs
function clearInputs() {
  title.value = "";
  price.value = "";
  taxes.value = "";
  ads.value = "";
  discount.value = "";
  total.innerHTML = "";
  count.value = "";
  category.value = "";

  title.style.border = "none";
  price.style.border = "none";
  taxes.style.border = "none";
  ads.style.border = "none";
  category.style.border = "none";
}

function showData() {
  let table = "";

  if (products.length > 0) {
    for (let i = 0; i < products.length; i++) {
      table += `
             <tr>
                  <td>${i + 1}</td>
                  <td>
                  ${products[i].title}
                  </td>
                  <td>
                  ${products[i].price} L.E
                  </td>
                  <td>
                  ${products[i].taxes} L.E
                  </td>
                  <td>
                  ${products[i].ads} L.E
                  </td>
                  <td>
                  ${products[i].discount} L.E
                  </td>
                  <td>
                  ${products[i].total}
                  </td>
                  <td>
                  ${products[i].category}
                  </td>
                  <td>
                    <button onclick="updateProduct(${i})">Update</button>
                    <button onclick="deleteProduct(${i})">Delete</button>
                  </td>
                </tr>
            `;
    }
  } else table = "";

  document.querySelector("tbody").innerHTML = table;

  if (products.length > 0) {
    document.querySelector(".deleteAll").innerHTML = `
    <button onclick="deleteAllProducts()">Delete All (${products.length})</button>
    `;
  } else document.querySelector(".deleteAll").innerHTML = "";
}

showData();

// delete All

function deleteAllProducts() {
  localStorage.removeItem("product");
  products = [];
  showData();
}

// delete product

function deleteProduct(index) {
  products.splice(index, 1);
  localStorage.product = JSON.stringify(products);
  showData();
}

// update product

function updateProduct(index) {
  window.scrollTo(0, 0);

  title.value = products[index].title;
  price.value = products[index].price;
  taxes.value = products[index].taxes;
  ads.value = products[index].ads;
  discount.value = products[index].discount;
  total.innerHTML = products[index].total;
  category.value = products[index].category;

  mode = "update";
  count.style.display = "none";
  submit.value = "Update";
  submit.style.background = "var(--active-color)";
  total.style.background = "var(--active-color)";

  q = index;
}

// search type

function searchType(id) {
  if (id == "search-title") {
    search.placeholder = "Search By Title";
    searchMode = "title";
  } else {
    search.placeholder = "Search By Category";
    searchMode = "category";
  }
  search.focus();
  search.value = "";
}

// search product

function searchProduct(value) {
  let newPro;
  if (search.value !== "") {
    if (searchMode === "title") {
      newPro = products.filter((pro) => {
        return pro.title.toLowerCase().includes(value.toLowerCase());
      });
    } else if (searchMode === "category") {
      newPro = products.filter((pro) => {
        return pro.category.toLowerCase().includes(value.toLowerCase());
      });
    } else {
      newPro = products.filter((pro) => {
        return (
          pro.title.toLowerCase().includes(value.toLowerCase()) ||
          pro.category.toLowerCase().includes(value.toLowerCase()) ||
          pro.price.toLowerCase().includes(value.toLowerCase()) ||
          pro.taxes.toLowerCase().includes(value.toLowerCase()) ||
          pro.ads.toLowerCase().includes(value.toLowerCase()) ||
          pro.discount.toLowerCase().includes(value.toLowerCase()) ||
          pro.total.toLowerCase().includes(value.toLowerCase())
        );
      });
    }

    products = newPro;
  } else {
    products = JSON.parse(localStorage.product);
  }

  showData();
}
