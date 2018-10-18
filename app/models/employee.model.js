const mongoose = require('mongoose');

const EmployeeSchema = mongoose.Schema({
   code: {
      type: String, 
      required: true, 
      index: true, 
      unique: true,
   },
   first_name: {type: String, required: true},
   last_name: String,
   full_name: {type: String, required: true},
   location: String,
   birth_date: Date,
   mobile_phone: {type: String, required: true},
   email: {type: String, required: true},
}, {
   timestamps: true 
});

module.exports = mongoose.model('Employee', EmployeeSchema);