const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const ManageZoneSchema = new Schema({
    zones: {
        type: [String],
        default: undefined,
    }
});

const ManageZone = mongoose.model('managezone', ManageZoneSchema);
module.exports = {ManageZone};