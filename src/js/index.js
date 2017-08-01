window.onload = function(e) {
  if (location.protocol != "https:") {
    // For Web APIs that only work in a secure context
    location.href = "https:" + window.location.href.substring(window.location.protocol.length);
  }
	let microphone = document.getElementById("mic");
  // microphone.onclick = function(){
  if(!("webkitSpeechRecognition" in window )) {
    console.warn("Web Speech API isn\"t available in this browser");
    return;
  }
  let speech = new webkitSpeechRecognition();
  let finalText = document.getElementById("final-text");
  let interimText = document.getElementById("interim-text");

  // list of words to be recognized for specific actions
  let actions = ["select", "go", "add", "buy", "buy now", "checkout", "remove", "back"];
  let grammar = "#JSGF V1.0; grammar actions; public <actions> = " + actions.join(" | ") + ";";
  let speechRecognitionList = new webkitSpeechGrammarList();
  speechRecognitionList.addFromString(grammar, 1);
  speech.grammars = speechRecognitionList;
  // set language to english(US)
  speech.lang = "en-US";
  // continual listening set true
  speech.continuous = true;
  // text output may change during translation/conversion
  speech.interimResults = true;
  // set the maximum of alternatives of matching words
  speech.maxAlternatives = 1;
  // set the URI for speech recognition service
  //speech.speechURI = ";
  // when start() is called

	let microphoneListenTime = 0;
	let hasMic = true;

  speech.onstart = function() {
    console.log("listening...");
  }

  // continuous listening
  speech.onend = function() {
		if (hasMic) {
			if (microphoneListenTime < 1000) {
				setTimeout(function() {
	              speech.start();
	      }, 1000 - microphoneListenTime)
			} else {
				speech.start();
			}
		}
  }

  // output result to text field
  speech.onresult = function(e) {
    //console.log(e.results);
    // final match results
    let final = "";
    // possible match results
    let interim = "";
    for(let i = e.resultIndex; i < e.results.length; ++i) {
      if(e.results[i].isFinal){
        final += e.results[i][0].transcript;
      } else {
        interim += e.results[i][0].transcript;
      }
    }
    // finalText.innerHTML = final;
    // interimText.innerHTML = interim;
    let finalList = final.split(" ");
    doAction(finalList[0].toLowerCase(), finalList);
    console.log("result");
  }
	// log errors
	speech.onerror = function(error){
		if (error.error === "not-allowed" || error.error === "service-not-allowed") {
			hasMic = false;
			console.warn("cannot connect to mic - voice recognition stopped.")
		} else {
			console.warn(error);
		}
	}

  microphone.onclick = function() {
    speech.start();
  };

  microphone.click();
};
