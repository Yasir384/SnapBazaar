document.addEventListener("DOMContentLoaded", function (event) {
    var cartContent = document.getElementsByClassName("cart-content")[0];
    var cartTab = document.getElementsByClassName("cart-tab")[0];
    var cartDet = document.getElementsByClassName("cart-detail")[0];

    var inTab = false;
    var inDet = false;

    cartTab.onclick = function () {
        cartContent.classList.toggle("cart-open");
        cartContent.classList.remove("cart-partial-open");
        inTab = false;
        inDet = false;
    };
    cartTab.onmouseover = function () {
        if (!cartContent.classList.contains("cart-open")) {
            cartContent.classList.add("cart-partial-open");
            inTab = true;
        }
    };
    cartTab.onmouseout = function () {
        inTab = false;
        CheckCloseCart();
    }
    cartDet.onmouseover = function () {
        if (!cartContent.classList.contains("cart-open")) {
            inDet = true;
        }
    }
    cartDet.onmouseout = function () {
        inDet = false;
        CheckCloseCart();
    }

    function CheckCloseCart() {
        setTimeout(function () {
            if (!inTab && !inDet) {
                cartContent.classList.remove("cart-partial-open");
            }
        }, 100);
    }

    var hamburger = document.getElementById("hamburger");
    var navLinks = document.getElementsByClassName("nav-links")[0];

    hamburger.onclick = function () {
        navLinks.classList.toggle("open");
        hamburger.classList.toggle("is-active");
    };

});