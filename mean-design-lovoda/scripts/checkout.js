let subTotal = 0;
let subTotalWithoutDiscount = 0;

// product display function
let displayProductList = (cart_items, loginUser) => {
  if (!cart_items) return;
  let productList = document.getElementById("product-list");
  productList.innerHTML = "";

  let elements = cart_items.filter((ele) => {
    if (loginUser.email == ele.email) return ele;
  });

  let data = [];
  for (let i = 0; i < elements.length; i++) {
    let x = elements[i].cartItems;
    for (let j = 0; j < x.length; j++) {
      data.push(x[j]);
    }
  }

  data.forEach((element) => {
    let row = document.createElement("div");
    row.setAttribute("id", "row");

    let img_box = document.createElement("div");
    img_box.setAttribute("id", "img-box");

    let p1 = document.createElement("p");
    p1.innerText = element.count;

    let img = document.createElement("img");
    img.src = element.image;

    img_box.append(p1, img);

    let title = document.createElement("h3");
    title.innerText = element.head;
    title.setAttribute("id", "che_title");

    let price = document.createElement("h3");
    let totalPrice = element.count * element.price;
    subTotal += totalPrice;
    subTotalWithoutDiscount += totalPrice;

    totalPrice = totalPrice.toFixed(2);
    price.innerText = `$${totalPrice}`;
    price.setAttribute("id", "che_price");

    row.append(img_box, title, price);
    productList.append(row);
  });
};

let cart_items = JSON.parse(localStorage.getItem("cart_items")) || [];
let loginUser = JSON.parse(localStorage.getItem("loginUser")) || null;
displayProductList(cart_items, loginUser);

// display total Amount of Checkout
let displaySubTotal = () => {
  let sub_top = document.getElementById("sub-total-top");
  let sub_bottom = document.getElementById("sub-total-bottom");
  let sbTotal = localStorage.getItem("discountSubTotal");

  let cuponApply = localStorage.getItem("cuponApply") || null;
  sub_top.innerText = `$${Number(subTotalWithoutDiscount).toFixed(2)}`;

  if (cuponApply) {
    sub_bottom.innerHTML = `<span>USD</span> $${Number(sbTotal).toFixed(2)}`;
  } else {
    sub_bottom.innerHTML = `<span>USD</span> $${Number(subTotal).toFixed(2)}`;
  }
};
displaySubTotal();

// coupon applied status function
let apply_stat = document.querySelector("#apply-stat");
let sheckStatus = () => {
  let checkCupon = localStorage.getItem("cuponApply");
  if (checkCupon) {
    apply_stat.style.display = "block";
    apply_stat.innerText = "Click on it to remove cupon";
    apply_stat.style.color = "red";
    apply_stat.style.cursor = "pointer";
  }
};
sheckStatus();

// display Discount Amount
let displayDiscountAmount = () => {
  let displayAmountLS = localStorage.getItem("discountAmount") || null;
  let discount_amount = document.getElementById("discount-amount");
  let cuponApply = localStorage.getItem("cuponApply");

  if (cuponApply) {
    discount_amount.innerText = `$${Number(displayAmountLS).toFixed(2)}`;
  } else {
    discount_amount.innerText = `$0.00`;
  }
};
displayDiscountAmount();

// remove the coupon
let removeCupon = () => {
  let checkCupon = localStorage.getItem("cuponApply");
  if (checkCupon) {
    document.querySelector("#coupon-input").value = "";
    apply_stat.style.display = "none";
    localStorage.removeItem("cuponApply");
    localStorage.removeItem("discountAmount");
    localStorage.removeItem("discountSubTotal");
    displayDiscountAmount();
    displaySubTotal();
  }
};
apply_stat.addEventListener("click", removeCupon);

let discountAmount = 0;
// coupon code function
document.querySelector("#apply-btn").addEventListener("click", (e) => {
  let cuponVal = document.querySelector("#coupon-input");
  let checkCupon = localStorage.getItem("cuponApply");

  if (checkCupon) {
    alert("Cupon already applied");
  } else if (cuponVal.value == "masai-30" || cuponVal.value == "lovoda-2022") {
    if (cuponVal.value == "masai-30") {
      discountSubTotal = Number((subTotal * 0.7).toFixed(2));
      discountAmount = Number(subTotalWithoutDiscount - discountSubTotal);
      localStorage.setItem("discountSubTotal", discountSubTotal);
      localStorage.setItem("discountAmount", discountAmount);
    } else {
      discountSubTotal = Number((subTotal * 0.8).toFixed(2));
      discountAmount = Number(subTotalWithoutDiscount - discountSubTotal);
      localStorage.setItem("discountSubTotal", discountSubTotal);
      localStorage.setItem("discountAmount", discountAmount);
    }
    localStorage.setItem("cuponApply", "true");
    displaySubTotal();
    displayDiscountAmount();
    sheckStatus();
  } else {
    alert("Please enter valid cupon code");
  }
});

// apply button color
let coupon_input = document.getElementById("coupon-input");
let apply_btn = document.getElementById("apply-btn");
coupon_input.addEventListener("input", (e) => {
  if (coupon_input.value == "") {
    apply_btn.style.backgroundColor = "#C8C8C8";
    apply_btn.style.pointerEvents = "none";
  } else {
    apply_btn.style.backgroundColor = "#000000";
    apply_btn.style.pointerEvents = "all";
  }
});

// checkout Function
let form = document.querySelector("form");
let orders = JSON.parse(localStorage.getItem("orders")) || [];

let checkoutFunction = (event) => {
  event.preventDefault();

  let elements = cart_items.filter((ele, index) => {
    if (loginUser.email == ele.email) {
      return ele;
    }
  });
  let flag = false;
  for (let i = 0; i < elements.length; i++) {
    let x = elements[i].cartItems;
    if (x.length > 0) flag = true;
  }
  if (flag == false) {
    alert("Please select a cart item first");
    return;
  }

  let email_mobile = form.emailmobile.value;
  let country = form.country.value;
  let firstname = form.firstname.value;
  let lastname = form.lastname.value;
  let company = form.company.value;
  let address = form.address.value;
  let apartment = form.apartment.value;
  let city = form.city.value;
  let state = form.state.value;
  let zipcode = form.zipcode.value;

  if (email_mobile == "") {
    alert("Please enter a email or mobile number");
  } else if (country == "") {
    alert("Please select a country");
  } else if (firstname == "") {
    alert("Please enter first name");
  } else if (lastname == "") {
    alert("Please enter last name");
  } else if (address == "") {
    alert("Please enter address");
  } else if (city == "") {
    alert("Please enter city");
  } else if (state == "") {
    alert("Please select state");
  } else if (zipcode == "") {
    alert("Please enter zipcode");
  } else {
    let flag = false;
    while (true) {
      let msg = prompt("We have sent a OTP, Enter this here (e.g:1234)");
      if (msg == 1234) {
        let shippingAddress = {
          email_mobile: email_mobile,
          country: country,
          firstname: firstname,
          lastname: lastname,
          company: company,
          address: address,
          apartment: apartment,
          city: city,
          state: state,
          zipcode: zipcode,
        };
        let loginUserLS = JSON.parse(localStorage.getItem("loginUser"));

        let randNum = Math.floor(Math.random() * 100000 + 1);
        let newOrders = {
          order_id: randNum,
          email: loginUserLS.email,
          shippingAddress: shippingAddress,
          orderItems: cart_items,
        };
        orders.push(newOrders);
        localStorage.setItem("orders", JSON.stringify(orders));
        localStorage.removeItem("cart_items");
        localStorage.removeItem("discountAmount");
        localStorage.removeItem("cuponApply");
        localStorage.removeItem("discountSubTotal");
        alert("Congratulations! your orders will be sent to your address");
        flag = true;
      } else {
        alert("Wrong OTP!");
        flag = false;
      }
      if (flag == false) continue;
      if (flag) {
        window.location.href = "index.html";
        break;
      }
    }
  }
};
form.addEventListener("submit", checkoutFunction);
