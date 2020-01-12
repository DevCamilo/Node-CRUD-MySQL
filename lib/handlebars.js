const { format } = require('timeago.js');

const helpers = {};

helpers.timeAgo = (timeStamp) => {
    return format(timeStamp)
};

module.exports = helpers;
