const puppeteer = require('puppeteer');
const dayjs = require('dayjs');
const colors = require('colors/safe');

async function fetchImages(query) {
    const startTime = dayjs();
    console.log(colors.blue.bold("Fetching Images....\n"));
    const TIMER = setInterval(() => {
        console.log(colors.green(`Time Elapsed : ${dayjs().diff(startTime, 'second')} seconds`));
    }, 1000);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`https://www.google.co.in/search?q=${query}+unsplash&tbm=isch`);
    const IMAGE_SELECTOR = '.oCCRx';

    let imageHrefs = [];
    try {
        imageHrefs = await page.evaluate((sel) => {
            let imagesList = Array.from(document.images);

            const images = [];
            for (i = 0; i < 6; i++) {
                images.push(imagesList[i].src);
            }

            return images;
        }, IMAGE_SELECTOR);

        console.log(colors.green.bold('\nImages Fetched'));
    }
    catch (err) {
        console.log(colors.red.bold('\nCannot Fetch Images'));
        console.log("Program exited with the error : ", err);
    }
    finally {
        browser.close();
        clearInterval(TIMER);
        return imageHrefs;
    }
}

module.exports = fetchImages;