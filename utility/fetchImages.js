const puppeteer = require('puppeteer');
const dayjs = require('dayjs');
const colors = require('colors/safe');

async function fetchImages(query, count) {
    const startTime = dayjs();
    console.log(colors.blue.bold("Fetching Images....\n"));
    const TIMER = setInterval(() => {
        console.log(colors.green(`Time Elapsed : ${dayjs().diff(startTime, 'second')} seconds`));
    }, 1000);

    const browser = await puppeteer.launch();
    let page = await browser.newPage();
    await page.goto(`https://www.google.co.in/search?q=${query}+unsplash&tbm=isch`);
    const IMAGE_SELECTOR = '.n3VNCb';
    const IMAGE_TILE_SELECTOR = '.wXeWr.islib.nfEiy';

    let imageHrefs = [];
    try {
        googleImageHrefs = await page.evaluate((config) => {
            const hrefsList = Array.from(document.querySelectorAll(config.sel));

            const hrefs = [];
            for (i = 0; i < config.count; i++) {
                hrefsList[i].click();
                hrefs.push(hrefsList[i].href);
            }

            return hrefs;
        }, {
            sel: IMAGE_TILE_SELECTOR,
            count
        });

        await page.close();
        for (let i in googleImageHrefs) {
            page = await browser.newPage();
            await page.goto(googleImageHrefs[i], { waitUntil: 'networkidle0' });
            await page.waitForSelector('body');

            const image = await page.evaluate((sel) => {
                return document.querySelector(sel).src;
            }, IMAGE_SELECTOR);

            await page.close();
            imageHrefs.push(image);
        }

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