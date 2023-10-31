/**
 * @typedef {object} SanitizeAndCopyContextMenuMessage
 * 
 * @property {"sanitizeAndCopyContextMenu"} type
 * @property {boolean} shouldSanitizeSelection - Should the menu item be added to the context menu.
 * @property {string} textSelection - The text to copy to clipboard.
 */

/**
 * @typedef {object} SanitizeAndCopyContextMenuActionMessage
 * 
 * @property {"sanitizeAndCopyContextMenuItemAction"} type
 * @property {string} text - The text to copy to clipboard.
 */


/**
 * @typedef {object} Options
 * 
 * @property {Option} CHECK_PAGE_IN_SECS
 */

/**
 * @typedef {object} Option
 * 
 * @property {string} name
 * @property {*} value
 */
