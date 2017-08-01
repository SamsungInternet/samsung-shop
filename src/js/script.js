$().ready(function() {
	let cart = {}; //cart that gets passed to next page 
	$(".product-page-hide").on("click", function(e) {
		// detach button event handlers
		$("#buyNow").off("click");
		$("#addToCart").off("click");
		$("#single-product").hide();
		e.stopPropagation();
	});

	// event listener for custom pricing
	$("#customInput").on("input", function(){
		$("#customValue").html($("#customInput").val());
	});

	sessionStorage.setItem("samsungPayShopDemoDropDown", $("#serverSwitch").val());
	// event listener for drop down
	$("#serverSwitch").change(function() {
		sessionStorage.setItem("samsungPayShopDemoDropDown", $("#serverSwitch").val());
	});

	$(".product-card").click(function() {
		//get info about selected item
		let prod_page = $("#single-product");
		let image_source = $(this).find("img").attr("src");
		let prod_name = $(this).find("h5").text();
		let prod_price = $(this).find("h6").text();

		$(prod_page).find("img").attr("src", image_source);
		$(prod_page).find("h2").text(prod_name);
		$(prod_page).find("h1").text(prod_price);

		$(prod_page).show("slow");
		//buy now
		$("#buyNow").on("click", function() {
			let itemSummary = [{
				"label": prod_name,
				"value": prod_price
			}];
			console.log(itemSummary);
			let webpayment = new webpay();
			webpayment.setup(itemSummary, prod_price);
		});
		//add to cart
		$("#addToCart").on("click", function() {
			function addToCart(image_source, prod_name, prod_price){
				let cartCount = parseInt($("#shopping-cart-count").text());
				$("#shopping-cart-count").text(++cartCount);
				let count;
				//don"t want duplicate items in cart- just increment
				if(cart[prod_name]){
					console.log(cart[prod_name]["name"]);
					count = parseInt(cart[prod_name]["count"]) + 1; 
				} else {
					count = 1;
					cart[prod_name];
				}
				let item = {
					"image": image_source,
					"name": prod_name,
					"price": prod_price,
					"count": count
				};
				cart[prod_name] = item;
			}
			$("#single-product").hide("slow");
			$("#addToCart").off("click");
			return addToCart(image_source, prod_name, prod_price);
		});
		//cart button
		$("#shopping-cart").on("click", function() {
			//use session storage to pass info, since theres no server side logic handling this
			sessionStorage.setItem("samsungPayShopDemo", JSON.stringify(cart));
			sessionStorage.setItem("samsungPayShopDemoCount", $("#shopping-cart-count").text());
			sessionStorage.setItem("samsungPayShopDemoDropDown", $("#serverSwitch").val());
			location.href = "/samsung-shop/cart.html";
		});

	});
});
