const path = require('path');
const pjson = require('../package.json');

module.exports = {
    assets: path.resolve(__dirname, '../public/assets'),
    public: path.resolve(__dirname, '../public'),
    src: path.resolve(__dirname, '../src'),
    main: path.resolve(__dirname, `../${pjson.main}`)
};