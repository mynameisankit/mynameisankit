//node_modules
const Handlebars = require("handlebars");
const fs = require('fs');
const path = require('path');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const dayjs = require('dayjs');
const axios = require('axios');
const colors = require('colors/safe');

//custom modules
const fetchImages = require('./utility/fetchImages');

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Calcutta");

const MAIN_TEMPLATE_PATH = path.join(__dirname, 'template.hbs');
const RAW_DATA_PATH = path.join(__dirname, 'content', 'data.json');

const RAW_template = fs.readFileSync(MAIN_TEMPLATE_PATH, 'utf-8');
const RAW_DATA = fs.readFileSync(RAW_DATA_PATH, 'utf8');

let template = Handlebars.compile(RAW_template);

Handlebars.registerHelper("isColorGiven", function (color) {
    return color === undefined ? false : true;
});

async function generateReadMe(RAW_DATA) {
    let data = JSON.parse(RAW_DATA);
   
    const REPO_DETAILS = (await axios.get("https://api.github.com/repos/mynameisankit/mynameisankit")).data;
    
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const time = dayjs().tz("Asia/Calcutta");
    data.repo_details = {
        refresh_date: `${days[time.day()]}, ${time.format('D MMMM, hh:mm A')} IST`,
        stars: REPO_DETAILS['stargazers_count'],
        forks: REPO_DETAILS['forks'],
    }

    data.current_city_images = await fetchImages(data.personal_details.current.city, 3);

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