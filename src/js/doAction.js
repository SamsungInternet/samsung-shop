/**
	* @param {string} command - action word from grammer list
	* @param {array} list - words after command
  */
function doAction(command, list) {
  let listSize = list.length;
  if (command === "select" || command === "click"){
    select(command, list, listSize);
  } else if (command === "go") {
    voiceFeedback("Going to checkout");
    go();
  } else if (command === "add") { //assume add to cart
    console.log("add");
    voiceFeedback("adding to cart");
    add(list);
  } else if (command === "buy") {
    console.log("buy");
    voiceFeedback("Buying item");
    buy(list);
  } else if (command === "check") {
    console.log("checkout");
    voiceFeedback("Going to checkout");
    checkout();
  } else if (command === "remove") {
    console.log("remove");
    voiceFeedback("Removing item");
    remove(list);
  } else if (command === "back") {
    console.log("back");
    voiceFeedback("Going back");
    back();
  } else {
    voiceFeedback("Sorry, I did not get that.");
    console.log("no action");
    return;
  }
}

/**
  * select or click
  * @param {string} command - action word from grammar list
  * @param {string} list - words after the command
  * @param {int} listSize - size of list
  */
function select(command, list, listSize) {
  for(let i = 0; i < listSize; i++){
    if(list[i] === "cart"){
      go();
    } else if(list[i] === "checkout"){
      checkout();
    } else if (list[i] !== command){
      clickItem(list, i, listSize);
    } else {
      //do nothing
    }
  }
}

/**
  * go (to cart)
  */
function go() {
  document.getElementById("shopping-cart").click();
}

/**
  * add to cart button
  * {string} list - words after the command
  */
function add(list) {
  if(document.getElementById("single-product").style.display === "block"){
    document.getElementById("addToCart").click();
  } else {
    clickItem(list, 1, list.length);
    document.getElementById("addToCart").click();
  }
}

/**
 * remove item in cart
 * @param  {string} list - words after the command
 */
function remove( list) {
  let id = list.join().replace(/ /g, "-");
  console.log(id);
  let container = document.getElementById(id);
  container.closest(".item-remove").click();
}

/**
  * go back
  */
function back() {
  history.back();
}

/**
  * buy (button)
  * @param {string} list - words after the command
  */
function buy(list) {
  if(document.getElementById("single-product").style.display === "block"){
    document.getElementById("buyNow").click();
  } else {
    clickItem(list, 1, list.length);
    document.getElementById("buyNow").click();
  }
}

/**
  * checkout
  */
function checkout() {
  document.getElementById("checkout-button").click();
}

/**
  * click on item
  * @param  {string} list - words after the command
  * @param {int} start - index of where to parse list
  * @param {int} listSize - length of list
  */
function clickItem(list, start, listSize) {
  console.log("click item");
  let item = "";
  for(let i = start; i < listSize; i++)
    item += (list[i] + " ");
  let h5 = document.getElementsByTagName("h5");
  let h5Length = h5.length;
  let product;
  for(let i = 0; i < h5Length; i++){
    if( (h5[i].innerHTML + " ").toLowerCase() === item.toLowerCase() ) {
      product = (h5[i].parentNode).parentNode;
      product.click();
      return;
    }
  }
}

/**
 * audio feedback via speech synthesis
 * @param  {String} text - text to be utterred
 */
function voiceFeedback(text) {
  console.log("feedback");
  let synthesis = window.speechSynthesis;
  let textToSpeech = new SpeechSynthesisUtterance(text);
  if (!synthesis.speaking && !synthesis.pending) {
    synthesis.speak(textToSpeech);
  }
}