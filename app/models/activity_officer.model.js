const mongoose = require('mongoose');

const ActivityOfficerSchema = mongoose.Schema({
   position: {type: String, required: true},
   activity: {type: mongoose.Schema.Types.ObjectId, ref: 'Activity'},
   employee: {type: mongoose.Schema.Types.ObjectId, ref: 'Employee'}
}, {
   timestamps: true 
});

module.exports = mongoose.model('ActivityOfficer', ActivityOfficerSchema);