const mongoose = require('mongoose');

const CourseSchema = mongoose.Schema({
   code: {
      type: String, 
      required: true, 
      index: true, 
      unique: true,
   },
   name: {type: String, required: true},
   description: String,
   start_date: Date,
   end_date: Date,
}, {
   timestamps: true 
});

module.exports = mongoose.model('Course', CourseSchema);