(() => {
    "use strict";

    const mongoose = require('mongoose');

    module.exports = (uri) => {
        mongoose.Promise = global.Promise;
        mongoose.connect(uri);
    };
})();
