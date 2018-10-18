const mongoose = require('mongoose');

const ActivitySchema = mongoose.Schema({
   code: {
      type: String, 
      required: true, 
      index: true, 
      unique: true,
   },
   name: {type: String, required: true},
   description: String,
   activity_date: {type: Date, required: true},
   start_time: Date,
   end_time: Date,
   course: {type: mongoose.Schema.Types.ObjectId, ref: 'Course'},
   activity_officers: [{type: mongoose.Schema.Types.ObjectId, ref: 'ActivityOfficer'}]
}, {
   timestamps: true 
});

module.exports = mongoose.model('Activity', ActivitySchema);