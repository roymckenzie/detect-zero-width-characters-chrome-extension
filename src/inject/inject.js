(function() {
  let elementsWithZWCC = [];

  /**
   * Highlight zero-width character in DOM element
   *
   * @param  {dom node} element   A DOM node.
   */
  const highlightCharacters = function(element) {
    const zeroWidthCharacters = String.fromCodePoint(...zeroWidthCharacterCodes);
    const regExp = new RegExp(`([${zeroWidthCharacters}])`, 'g')

    element.innerHTML = element.innerHTML
      .replace(regExp, '$1<span class="zero-width-character"></span>');
  };

  /**
  * Checks DOM element for zero-width character.
  *
  * @param {dom node} element   A DOM node.
  *
  * @since 0.0.1
  */
  // From: https://jsfiddle.net/tim333/np874wae/13/
  const checkElement = function( element ) {
    const text = textWithoutChildren( element );

    [...text].forEach( function( character ) {
      unicodeCode = character.codePointAt(0);

      if (
        zeroWidthCharacterCodes.includes( unicodeCode )
        && !elementsWithZWCC.includes(element)
      ) {
        elementsWithZWCC.push(element)
      }
    });
  }

  /**
  * Pulls text from DOM node not including child DOM nodes.
  *
  * @param {node} element   A DOM node.
  *
  * @since 0.0.1
  *
  * @return {string}  The text inside the DOM node.
  */
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

  /**
  * Checks current document for zero-width characters.
  *
  * @since 0.0.1
  */
  const checkPage = function() {
    const allElements = document.getElementsByTagName('*');

    [...allElements].forEach(checkElement);

    elementsWithZWCC.forEach(function( element ) {
      element.classList.add('zero-width-characters');
      highlightCharacters(element);
    });
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

  document.body.addEventListener('mouseup', function ( event ) {
    const selection = window.getSelection();

    const shouldSanitizeSelection = elementsWithZWCC
      .map(function(element) {
        return selection.containsNode(element, true);
      })
      .includes(true);

    try {
      chrome.runtime.sendMessage({
        "shouldSanitizeSelection": shouldSanitizeSelection,
        "selection": selection.toString()
      });
    } catch(event) {
      if (
        event.message.match(/Invocation of form runtime\.connect/) &&
        event.message.match(/doesn't match definition runtime\.connect/)
      ) {
        console.error('Chrome extension has been reloaded. Please refresh the page');
      } else {
        throw(event);
      }
    }
  });

})();
