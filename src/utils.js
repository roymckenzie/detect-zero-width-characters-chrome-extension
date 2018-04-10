const sanitize = function( text ) {
  return [...text].filter( function( char ) {
    const unicodeCode = char.codePointAt(0);
    return !zeroWidthCharacterCodes.includes( unicodeCode );
  }).join("");
}

//https://stackoverflow.com/a/18455088/6591929
const copyTextToClipboard = function (text) {
  const copyFrom = document.createElement("textarea");
  const body = document.body;
  copyFrom.textContent = text;
  body.appendChild( copyFrom );
  copyFrom.select();
  document.execCommand('copy');
  body.removeChild( copyFrom );
}
