/**
 * Builds a context menu in Chrome.
 *
 * @param {SanitizeAndCopyContextMenuMessage} message
 *
 * @since 0.0.2
 */
const handleContextMenu = (message) => {
  if (message.type !== "sanitizeAndCopyContextMenu") return;

  chrome.contextMenus.removeAll();

  if (!message.shouldSanitizeSelection) {
    return;
  }

  chrome.contextMenus.create({
    id: "sanitizeAndCopyContextMenuItem",
    title: "Sanitize and copy",
    type: "normal",
    contexts: ["selection"],
  });

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (!tab) return;
    if (!tab.id) return;
    if (info.menuItemId !== "sanitizeAndCopyContextMenuItem") return;

    chrome.tabs.sendMessage(tab.id, {
      type: "sanitizeAndCopyContextMenuItemAction",
      text: message.textSelection,
    });
  });
};

chrome.runtime.onMessage.addListener(handleContextMenu);

chrome.runtime.onInstalled.addListener(async () => {
  const contentScripts = chrome.runtime.getManifest().content_scripts;
  if (!contentScripts) return;
  for (const cs of contentScripts) {
    if (!cs.js) return;
    for (const tab of await chrome.tabs.query({ url: cs.matches })) {
      if (!tab.id) return;
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: cs.js,
      });
    }
  }
});
