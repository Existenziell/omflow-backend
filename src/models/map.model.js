const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mapSchema = new Schema({
    type: { type: String, required: true },
    data: {
        type: { type: String, required: true },
        features: [
            {
                type: { type: String, required: true },
                id: { type: String, required: true },
                properties: {
                    name: { type: String, required: true },
                    subname: { type: String, required: true },
                    image: { type: String, required: true },
                    date: { type: String, required: true },
                    description: { type: String, required: true },
                    mapOnly: { type: Boolean, required: true }
                },
                geometry: {
                    type: { type: String, required: true },
                    coordinates: []
                }
            }
        ]
    }
}, {
    timestamps: true,
});

const Map = mongoose.model('Map', mapSchema);

module.exports = Map;
