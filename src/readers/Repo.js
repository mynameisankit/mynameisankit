const _property = require('lodash/property');

const stargazersCount = _property('stargazers_count');
const forks = _property('forks');

const REPO_READER = {
    stargazersCount,
    forks,
};

module.exports = REPO_READER;
