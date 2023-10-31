(function () {
  /** @type {Element[]} */
  let elementsWithZWCC = [];

  /**
   * Highlight zero-width character in DOM element.
   *
   * @param {Element} element - A DOM node Element.
   */
  const highlightCharacters = (element) => {
    const zeroWidthCharacters = String.fromCodePoint(
      ...zeroWidthCharacterCodes
    );
    const regExp = new RegExp(`([${zeroWidthCharacters}])`, "g");

    element.innerHTML = element.innerHTML.replace(
      regExp,
      '$1<span class="zero-width-character"></span>'
    );
  };

  /**
   * Checks DOM element for zero-width character.
   *
   * @param {Element} element - A DOM node Element.
   *
   * @since 0.0.1
   */
  // From: https://jsfiddle.net/tim333/np874wae/13/
  const checkElement = (element) => {
    const text = textWithoutChildren(element);

    [...text].forEach((character) => {
      const unicodeCode = character.codePointAt(0);

      if (!unicodeCode) return;

      if (
        zeroWidthCharacterCodes.includes(unicodeCode) &&
        !elementsWithZWCC.includes(element)
      ) {
        elementsWithZWCC.push(element);
      }
    });
  };

  /**
   * Pulls text from DOM node not including child DOM nodes.
   *
   * @param {Element} element - A DOM node Element.
   *
   * @since 0.0.1
   *
   * @return {string}  The text inside the DOM node.
   */
  // From: https://stackoverflow.com/a/9340862/535363
  const textWithoutChildren = (element) => {
    let child = element.firstChild,
      texts = [];

    while (child) {
      if (child.nodeType == 3) {
        texts.push(child.data);
      }
      child = child.nextSibling;
    }

    return texts.join("");
  };

  /**
   * Checks current document for zero-width characters.
   *
   * @since 0.0.1
   */
  const checkPage = async () => {
    const opts = await getOptions()

    if (opts.CHECK_PAGE_IN_SECS.value > 0) {
      await wait(opts.CHECK_PAGE_IN_SECS.value)
    }

    const allElements = document.getElementsByTagName("*");

    [...allElements].forEach(checkElement);

    elementsWithZWCC.forEach((element) => {
      element.classList.add("zero-width-characters");
      highlightCharacters(element);
    });
  };

  document.body.addEventListener("mouseup", () => {
    const selection = window.getSelection();

    if (!selection) return;

    const shouldSanitizeSelection = elementsWithZWCC
      .map((element) => selection.containsNode(element, true))
      .includes(true);

    try {
      /** @type {SanitizeAndCopyContextMenuMessage} */
      const message = {
        type: "sanitizeAndCopyContextMenu",
        shouldSanitizeSelection: shouldSanitizeSelection,
        textSelection: selection.toString(),
      }

      chrome.runtime.sendMessage(message);
    } catch (event) {
      if (
        event.message.match(/Invocation of form runtime\.connect/) &&
        event.message.match(/doesn't match definition runtime\.connect/)
      ) {
        console.error(
          "Chrome extension has been reloaded. Please refresh the page"
        );
      } else {
        throw event;
      }
    }
  });

  /**
   * Handle Sanitize and Copy context menu item action
   * @param {SanitizeAndCopyContextMenuActionMessage} message 
   */
  const handleMenuItemAction = (message) => {
    if (message.type !== "sanitizeAndCopyContextMenuItemAction") return;
    sanitizeAndCopy(message.text);
  }

  /**
   * Sanitizes and copies some text.
   *
   * @since 0.0.2
   */
  const sanitizeAndCopy = (text) => {
    copyTextToClipboard(sanitize(text));
  };

  chrome.runtime.onMessage.addListener(handleMenuItemAction);

  checkPage();
})();
