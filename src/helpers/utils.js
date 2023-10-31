/**
 * Removes zero-width characters from `text`.
 * 
 * @param {string} text - String to sanitize.
 * @returns Sanitized string.
 */
const sanitize = (text) => {
  return [...text]
    .filter((char) => {
      const unicodeCode = char.codePointAt(0);
      return !zeroWidthCharacterCodes.includes(unicodeCode);
    })
    .join("");
};

// https://stackoverflow.com/a/18455088/6591929
/**
 * Copies `text` to clipboard.
 * 
 * @param {string} text - String to copy to clipboard.
 */
const copyTextToClipboard = (text) => {
  const textArea = document.createElement("textarea");
  textArea.setAttribute("name", "copyTextArea");
  textArea.textContent = text;

  const body = document.body;
  body.appendChild(textArea);

  textArea.select();
  document.execCommand("copy");

  body.removeChild(textArea);
};

const wait = (secs) => {
  return new Promise(resolve => setTimeout(resolve, secs * 1000));
}