chrome.extension.sendMessage({}, function(response) {
  var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);

      // Check Page
      checkPage();

      // Check page again when any input field is changed
      const inputs = document.querySelectorAll('input');
      [...inputs].forEach( function( input ) {
        input.addEventListener( 'change', checkPage );
      });

    }
  }, 10);

});

const checkPage = function() {
  const allElements = document.getElementsByTagName('*');
  [...allElements].forEach( checkElement );
}

// From: https://jsfiddle.net/tim333/np874wae/13/
const checkElement = function( element ) {
  const text = textWithoutChildren( element );
  const zeroLengthCharacterCodes = [ 8203, 8204, 8205, 8288 ];

  [...text].forEach( function( character ) {
    unicodeCode = character.codePointAt(0);
    if ( zeroLengthCharacterCodes.includes( unicodeCode ) ) {
      element.classList.add('zero-length-characters');
    }
  });
}

// From: https://stackoverflow.com/a/9340862/535363
const textWithoutChildren = function( element ) {
  child = element.firstChild,
  texts = [];

  while (child) {
      if (child.nodeType == 3) {
          texts.push(child.data);
      }
      child = child.nextSibling;
  }

  return texts.join("");
}