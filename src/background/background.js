(function() {
  let contextMenuOptionId, selectionText;

  const sanitizeAndCopy = function() {
    copyTextToClipboard(sanitize(selectionText));
  };

  const handleContextMenu = function(request) {
    if (request.shouldSanitizeSelection) {
      selectionText = request.selection;

      if (!contextMenuOptionId) {
        contextMenuOptionId = chrome.contextMenus.create({
          "title" : "Sanitize and copy",
          "type" : "normal",
          "contexts" : ["selection"],
          "onclick" : sanitizeAndCopy
        });
      }
    } else {
      if (contextMenuOptionId) {
        chrome.contextMenus.remove(contextMenuOptionId);
        contextMenuOptionId = null;
      }
    }
  };

  chrome.runtime.onMessage.addListener(handleContextMenu);
})();