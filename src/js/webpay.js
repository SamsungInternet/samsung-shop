let webpay = function (){
	//init
	if (!window.PaymentRequest) {
		// PaymentRequest API is not available. Forwarding to
		// legacy form based experience.
		location.href = '/samsung-shop/checkout.html';
		return;
	}
}

webpay.prototype.setup = function(itemSummary, total){
	let discount = 0.00;//-10.00;
	// Supported payment methods
	let supportedInstruments = [
	{
		supportedMethods: ['amex', 'discover','mastercard','visa']
	},
	{
    supportedMethods: ['basic-card'],
    data: {
      supportedNetworks: ['unionpay', 'visa', 'mastercard', 'amex', 'discover',
        'diners', 'jcb', 'mir'
      ],
      supportedTypes: ['prepaid', 'debit', 'credit']
    }
  }
 	];

 	// details contain info about the transaction
	let details = {
		displayItems: [],
		shippingOptions: [
	    {
	      id: 'standard',
	      label: 'Standard shipping',
	      amount: {currency: 'USD', value: '0.00'},
	      selected: true
	    },
	    {
	      id: 'express',
	      label: 'Express shipping',
	      amount: {currency: 'USD', value: '10.00'}
	    }
		]
	};

	// populate display items with items from cart/buy now
	itemSummary.forEach( function(element){
		let val = element['value'];
		if( (typeof val) === 'string' ) val = val.replace('$', '');
		details['displayItems'].push({
			label: element['label'],
	  	amount: { currency: 'USD', value : val }
		});
	});

	// shipping 
	details['displayItems'].push(
	{
		label: 'Loyal customer discount',
		amount: { currency: 'USD', value : discount }, // -US$10.00
		pending: true 																 // The price is not determined yet
	});

	// total
	let finalCost = parseFloat(total.replace('$', '')) - discount;
	details['total'] = {
  		label: 'Total',
  		amount: { currency: 'USD', value : finalCost},
	};
	if(finalCost < 0.00){
		alert('Your cart is empty');
		return;
	}

	// collect additional information
	let options = {
	  requestPayerEmail: true,
		requestPayerName: true,
	  requestShipping: true,
		shippingType: 'shipping' // "shipping"(default), "delivery" or "pickup"
	};

	let payment = new PaymentRequest(
		supportedInstruments, // required payment method data
		details,              // required information about transaction
		options               // optional parameter for things like shipping, etc.
	);

	// detect when shipping address changes
 	payment.addEventListener('shippingaddresschange', e => {
		console.log("address change");
		e.updateWith(new Promise( resolve => {
			resolve(details);
		}));
	});
	 
 	// detect shipping option changes
 	payment.addEventListener('shippingoptionchange', e => {
	  e.updateWith(((details, shippingOption) => {
	  	let originalCost = finalCost;
	    let selectedShippingOption;
	    let otherShippingOption;
	    if (shippingOption === 'standard') {
	      selectedShippingOption = details['shippingOptions'][0];
	      otherShippingOption = details['shippingOptions'][1];
	      details['total']['amount']['value'] = originalCost + 0.00;
				details['displayItems'][1]['amount']['value'] = 0.00;
	    } else {
	      selectedShippingOption = details['shippingOptions'][1];
	      otherShippingOption = details['shippingOptions'][0];
	      details['total']['amount']['value'] = originalCost + 10.00;
				details['displayItems'][1]['amount']['value'] = 10.00;
			}
	    selectedShippingOption.selected = true;
	    otherShippingOption.selected = false;
	      return Promise.resolve(details);
		  })(details, payment.shippingOption));
		});

	// Make PaymentRequest show to display payment sheet 
	payment.show().then( paymentResponse => {	
		console.log(paymentResponse);
	  // Process response
	  let paymentData = {
		  // payment method string
		  "method": paymentResponse.methodName,
		  // payment details as you requested
		  "details": JSON.stringify(paymentResponse.details),
		  // shipping address information
		  "address": JSON.stringify(paymentResponse.shippingAddress)
	  };
	  sessionStorage.setItem("samsungPayShopDemoEmail", paymentResponse.payerEmail); 
	  console.log(paymentData);
	  console.log(JSON.stringify(paymentData));
	  this.processPayment(paymentResponse, details['total']['amount']['value']).then( success => {
	  	console.log(success);
	  	console.log(JSON.stringify(success));
	  	if (success) {
				// Call complete to hide payment sheet
				paymentResponse.complete('success');
				window.top.location.href = '/samsung-shop/order-confirm.html';
	   	} else {
		   	// Call complete to hide payment sheet
				paymentResponse.complete('fail');
				console.log("Something went wrong with processing payment");
		  }
	  }).catch(err => {
	      console.error("Uh oh, something bad happened while processing payment", err.message);
	  });
	}).catch(err => {
	  console.error("Uh oh, something bad happened", err);
	});
}

webpay.prototype.processPayment = function(paymentResponse, total) {
	console.log(payload);
  console.log(JSON.stringify(payload));
  return new Promise( (resolve, reject) => {
  	setTimeout(function() { 
	    // approve all the transactions!
	    console.log("payment success");
	    resolve(true);
	  }, 1000);
  });
}