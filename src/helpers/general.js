const path = require('path');
const fs = require('fs');
const colors = require('@colors/colors/safe');
const axios = require('axios');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

// Lodash
const _property = require('lodash/property');
const _noop = require('lodash/noop');

// Constants
const { EMPTY_OBJECT, DAYS } = require('../constants');

// Helpers
const getImages = require('./getImages');
const print = require('./print');
const Handlebars = require("./handlebars");

// Readers
const RepoReader = require('../readers/Repo');

// Data
const DATA = require('../content/data.json');

const TEMPLATE_FILE_NAME = 'template.hbs';

const getDataFromResponse = _property('data');

const getWorkingDirectory = () => process.cwd();

const getTemplate = () => {
  try {
    const workingDirectory = getWorkingDirectory();
    const templatePath = path.join(workingDirectory, TEMPLATE_FILE_NAME);

    const rawTemplate = fs.readFileSync(templatePath, 'utf-8');

    const template = Handlebars.compile(rawTemplate);
    return template;
  }
  catch (error) {
    console.log(error);
    return _noop;
  }
};

const initialiseDayJS = () => {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.tz.setDefault("Asia/Calcutta");

  return dayjs;
};

const handleReadmeGenerationSuccess = () => print({
  "\nBuild File Written": colors.green.bold
});

const handleReadmeGenerationError = (err) => print({
  [`\nBuild process exited with the error ${err}`]: colors.red.bold
});

const getRepoDetails = () => axios.get("https://api.github.com/repos/mynameisankit/mynameisankit").then(getDataFromResponse);

const getCurrentTime = () => {
  const dayjs = initialiseDayJS();

  const time = dayjs().tz("Asia/Calcutta");

  const currentTime = `${DAYS[time.day()]}, ${time.format('D MMMM, hh:mm A')} IST`;
  return currentTime;
};

const updateDataWithGithubRepositoryDetails = async (data = {}) => {
  const repoDetails = await getRepoDetails();

  const stargazersCount = RepoReader.stargazersCount(repoDetails);
  const forks = RepoReader.forks(repoDetails);

  const currentTime = getCurrentTime();

  data.REPOSITORY_DETAILS = {
    REFRESH_DATE: currentTime,
    STARS: stargazersCount,
    FORKS: forks,
  };
  return data;
};

const updateDataWithCityImages = async (data = EMPTY_OBJECT) => {
  const cityImages = await getImages(data.PERSONAL_DETAILS.CURRENT.CITY, 3);

  data.CURRENT_CITY_IMAGES = cityImages;
  return data;
};

const getTemplateData = async () => {
  const data = DATA;

  await updateDataWithGithubRepositoryDetails(data);
  await updateDataWithCityImages(data);

  return data;
};

const generateReadMe = () => {
  const template = getTemplate() || _noop;

  getTemplateData()
    .then(template)
    .then(readme => fs.writeFileSync('README.md', readme))
    .catch(console.log);
}

module.exports = {
  getDataFromResponse,
  generateReadMe,
  handleReadmeGenerationSuccess,
  handleReadmeGenerationError
};
