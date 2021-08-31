// Note - Cannot use functions/variables from outer scope in this file i.e. from outside functions
const getImageUrls = (config = EMPTY_OBJECT) => {
  const { selector, maxCount } = config;

  const tileElements = document.querySelectorAll(selector);
  const tileElementsList = Array.from(tileElements);

  const requiredTiles = tileElementsList.slice(2, 2 + maxCount);

  const imageUrls = requiredTiles.map(tile => {
    const imageElement = (tile.getElementsByTagName('img') || [])[0];

    const { src: imageUrl } = imageElement || {};
    return imageUrl;
  });
  return imageUrls;
};

module.exports = getImageUrls;
