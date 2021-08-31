const puppeteer = require('puppeteer');
const dayjs = require('dayjs');
const colors = require('@colors/colors/safe');

// Helpers
const print = require('./print');
const getImageUrls = require('./getImageUrls');

const IMAGE_TILE_SELECTOR = '.H8Rx8c';

const getNumberOfSecondsElapsed = startTime => dayjs().diff(startTime, 'second');

const printTimeElapsed = startTime => {
  const numberOfSecondsElapsed = getNumberOfSecondsElapsed(startTime);

  const timeElapsedMessage = `Time Elapsed : ${numberOfSecondsElapsed} seconds`;

  print({
    [timeElapsedMessage]: colors.green,
  });
};

const startTimer = () => {
  const startTime = dayjs();

  const timerId = setInterval(() => printTimeElapsed(startTime), 1000);

  return timerId;
};

async function fetchImages(query, maxCount, browser) {
  const page = await browser.newPage();
  
  await page.goto(`https://www.google.co.in/search?q=${query}+unsplash&tbm=isch`);

  const imageUrls = await page.evaluate(getImageUrls, {
    selector: IMAGE_TILE_SELECTOR,
    maxCount
  });

  await page.close();

  print({
    '\nImages Fetched': colors.green.bold,
  });

  return imageUrls;
}


async function getImages(query, maxCount) {
  print({
    "Fetching Images....\n": colors.blue.bold,
  });

  const timerId = startTimer();
  const browser = await puppeteer.launch();

  try {
    const images = await fetchImages(query, maxCount, browser);
    return images;
  }
  catch (err) {
    print({
      '\nCannot Fetch Images': colors.red.bold,
      [`Program exited with the error : , ${err}`]: undefined,
    });
  }
  finally {
    browser.close();
    clearInterval(timerId);
  }
}

module.exports = getImages;
