'use strict';
const SEQUENCE_COLLECTION = "sequence";

module.exports.generateSequence = function (CONNECTION, collectionName, callback) {
    let sequenceCollection = CONNECTION.collection(SEQUENCE_COLLECTION);
    sequenceCollection.findOneAndUpdate({collection: collectionName}, {$inc: {counter: 1}}, {
        upsert: true,
        returnOriginal: false
    }, function (err, updatedSequence) {
        callback(err, updatedSequence.value.counter);
    });
};
