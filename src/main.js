// Helpers
const { generateReadMe, handleReadmeGenerationError, handleReadmeGenerationSuccess } = require('./helpers/general');

const main = () => generateReadMe()
    // .then(handleReadmeGenerationSuccess)
    // .catch(handleReadmeGenerationError);

main();
