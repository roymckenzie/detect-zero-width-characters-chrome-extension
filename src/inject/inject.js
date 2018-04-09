(function() {
  let elementsWithZLCC = [];

  const checkPage = function() {
    const allElements = document.getElementsByTagName('*');
    [...allElements].forEach( checkElement );
  }

  // From: https://jsfiddle.net/tim333/np874wae/13/
  const checkElement = function( element ) {
    const text = textWithoutChildren( element );

    [...text].forEach( function( character ) {
      unicodeCode = character.codePointAt(0);

      if (
        zeroLengthCharacterCodes.includes( unicodeCode )
        && !elementsWithZLCC.includes(element)
      ) {
        elementsWithZLCC.push(element)
      }
    });

    elementsWithZLCC.forEach(function( element ) {
      element.classList.add('zero-length-characters');
    })
  }

  // From: https://stackoverflow.com/a/9340862/535363
  const textWithoutChildren = function( element ) {
    let child = element.firstChild,
    texts = [];

    while (child) {
        if (child.nodeType == 3) {
            texts.push(child.data);
        }
        child = child.nextSibling;
    }

    return texts.join("");
  }

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

  document.body.addEventListener('mouseup', function (e) {
    const selection = window.getSelection();

    const shouldSanitizeSelection  = elementsWithZLCC
      .map(function(element) {
        return selection.containsNode(element, true);
      })
      .includes(true);

    try {
      chrome.runtime.sendMessage({
        "shouldSanitizeSelection": shouldSanitizeSelection,
        "selection": selection.toString()
      });
    } catch(e) {
      if (
        e.message.match(/Invocation of form runtime\.connect/) &&
        e.message.match(/doesn't match definition runtime\.connect/)
      ) {
        console.error('Chrome extension has been reloaded. Please refresh the page');
      } else {
        throw(e);
      }
    }
  });

})();