(() => {
    "use strict";

    const mongoose = require('mongoose');
    const mongoosePaginate = require('mongoose-paginate');

    module.exports = () => {
        const schema = mongoose.Schema({
            title: {type: String},
            description: {type: String},
            done: {type: Boolean, default: false},
            userId: {type: Number},
            createdAt: {type: Date, default: Date.now}
        });

        schema.plugin(mongoosePaginate);

        return mongoose.model("TodoItem", schema);
    };
})();
