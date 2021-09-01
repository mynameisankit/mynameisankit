//node_modules
const Handlebars = require("handlebars");
const fs = require('fs');
const path = require('path');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const dayjs = require('dayjs');
const axios = require('axios');
const colors = require('colors/safe');
const puppeteer = require('puppeteer');

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Calcutta");

const MAIN_TEMPLATE_PATH = path.join(__dirname, 'template.md');
const RAW_DATA_PATH = path.join(__dirname, 'content', 'data.json');

const RAW_template = fs.readFileSync(MAIN_TEMPLATE_PATH, 'utf-8');
const RAW_DATA = fs.readFileSync(RAW_DATA_PATH, 'utf8');

let template = Handlebars.compile(RAW_template);

Handlebars.registerHelper("isColorGiven", function (color) {
    return color === undefined ? false : true;
});

async function fetchImages(query) {
    const startTime = dayjs();
    console.log(colors.blue.bold("Fetching Images....\n"));
    const TIMER = setInterval(() => {
        console.log(colors.green(`Time Elapsed : ${dayjs().diff(startTime, 'second')} seconds`));
    }, 1000);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`https://unsplash.com/s/photos/${query}`);
    const IMAGE_SELECTOR = '.oCCRx';

    let imageHrefs = [];
    try {
        imageHrefs = await page.evaluate((sel) => {
            let imagesList = Array.from(document.querySelectorAll(sel));

            const images = [];
            for (i = 0; i < 3; i++) {
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


async function generateReadMe(RAW_DATA) {
    let data = JSON.parse(RAW_DATA);
   
    const REPO_DETAILS = (await axios.get("https://api.github.com/repos/mynameisankit/mynameisankit")).data;
    
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const time = dayjs().tz("Asia/Calcutta");
    data.repo_details = {
        refresh_date: `${days[time.day()]}, ${time.format('D MMMM, hh:mm A')}`,
        stars: REPO_DETAILS['stargazers_count'],
        forks: REPO_DETAILS['forks'],
    }

    data.current_city_images = await fetchImages(data.personal_details.current.city);

    const converted = template(data);
    fs.writeFileSync('README.md', converted);
}

generateReadMe(RAW_DATA)
    .then(() => {
        console.log(colors.green.bold("\nBuild File Written"));
    })
    .catch((err) => {
        console.log(colors.red.bold(`\nBuild process exited with the error ${err}`));
    });