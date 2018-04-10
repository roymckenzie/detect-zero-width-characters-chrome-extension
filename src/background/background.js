(function() {
  let contextMenuOptionId, selectionText;

  /**
   * Sanitizes and copies some text.
   *
   * @since 0.0.2
   */
  const sanitizeAndCopy = function() {
    copyTextToClipboard( sanitize( selectionText ) );
  };

  /**
   * Builds a context menu in Chrome.
   *
   * @param {object} request  The chrome.runtime.onMessage object.
   *
   * @since 0.0.2
   */
  const handleContextMenu = function( request ) {
    if ( request.shouldSanitizeSelection ) {
      selectionText = request.selection;

      if ( !contextMenuOptionId ) {
        contextMenuOptionId = chrome.contextMenus.create({
          "title" : "Sanitize and copy",
          "type" : "normal",
          "contexts" : [ "selection" ],
          "onclick" : sanitizeAndCopy
        });
      }
    } else {
      if ( contextMenuOptionId ) {
        chrome.contextMenus.remove( contextMenuOptionId );
        contextMenuOptionId = null;
      }
    }
  };

  chrome.runtime.onMessage.addListener( handleContextMenu );
})();
