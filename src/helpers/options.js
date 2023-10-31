/**
 * @returns {Promise<Options>}
 */
const getOptions = async () => {
  return await chrome.storage.sync.get(defaultOptions);
}

/**
 * 
 * @param {Options} opts 
 */
const setOptions = async (opts) => {
  await chrome.storage.sync.set(opts)
}