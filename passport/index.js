const passport = require('passport');
const google = require('./googleStrategy');

module.exports = () => google();