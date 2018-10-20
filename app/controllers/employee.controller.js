const Employee = require('../models/employee.model.js');

exports.create = (req, res) => {
    // validate request
    if (!req.body.code) {
        return res.status(400).send({
            message: "Employee code can not be empty"
        });
    }
    if (!req.body.first_name) {
        return res.status(400).send({
            message: "Employee first name can not be empty"
        });
    }
    if (!req.body.full_name) {
        return res.status(400).send({
            message: "Employee full name can not be empty"
        });
    }
    if (!req.body.mobile_phone) {
        return res.status(400).send({
            message: "Employee mobile phone can not be empty"
        });
    }
    if (!req.body.email) {
        return res.status(400).send({
            message: "Employee email can not be empty"
        });
    }
    
    // check duplicate
    const checker = new Employee();
    checker.constructor.findOne({code: req.body.code})
    .exec(function(err, result) {
        if (err) {
            return res.status(500).send({
                message: err.message || "Some error occured while retrieving employees."
            });
        } else if(result) {
            return res.status(400).send({
                message: "The employee with the same code is already exists."
            });
        }
    })
    
    const employee = new Employee({
        code: req.body.code,
        first_name: req.body.first_name,
        last_name: req.body.last_name || null,
        full_name: req.body.full_name,
        location: req.body.location || null,
        birth_date: req.body.birth_date || null,
        mobile_phone: req.body.mobile_phone,
        email: req.body.email
    });
    
    employee.save().then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
           message: err.message || "Some error occured while creating the Employee." 
        });
    });
};

exports.findByCriteria = (req, res) => {
    
    let query = {};
    if (req.query.code) query.code = new RegExp(req.query.code, 'i');
    if (req.query.name) query.$or = [{"first_name": new RegExp(req.query.name, 'i')}, 
                                    {"last_name": new RegExp(req.query.name, 'i')},
                                    {"full_name": new RegExp(req.query.name, 'i')}];
    
    if (req.query.birth_date) {
        let birth_date = new Date(req.query.birth_date);
        // set to 00 to ignore time
        birth_date.setHours(0,0,0,0);
        let max = new Date(birth_date);
        // add 1 day
        max.setDate(max.getDate() + 1);
        query.birth_date = {$gte: birth_date, $lt: max};
    }
    // below is used for exact matching string
    // if (req.query.code) query.code = new RegExp('^' + req.query.code + '$', 'i');
    
    Employee.find(query).then(employees => {
        res.send(employees);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occured while retrieving employees."
        });
    });
};

exports.findOne = (req, res) => {
    Employee.findById(req.params.employeeId).then(employee => {
        if (!employee) {
            return res.status(404).send({
                message: "Employee not found with id " + req.params.employeeId
            });
        }
        res.send(employee);
    }).catch(err => {
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Employee not found with id " + req.params.employeeId
            });
        }
        return res.status(500).send({
            message: "Error retrieving employee with id " + req.params.employeeId
        })
    });
};

exports.update = (req, res) => {
    // Validate Request
    if (!req.body.first_name) {
        return res.status(400).send({
            message: "Employee first name can not be empty"
        });
    }
    if (!req.body.full_name) {
        return res.status(400).send({
            message: "Employee full name can not be empty"
        });
    }
    if (!req.body.mobile_phone) {
        return res.status(400).send({
            message: "Employee mobile phone can not be empty"
        });
    }
    if (!req.body.email) {
        return res.status(400).send({
            message: "Employee email can not be empty"
        });
    }

    // Find employee and update it with the request body
    Employee.findByIdAndUpdate(req.params.employeeId, {
        first_name: req.body.first_name,
        last_name: req.body.last_name || null,
        full_name: req.body.full_name,
        location: req.body.location || null,
        birth_date: req.body.birth_date || null,
        mobile_phone: req.body.mobile_phone,
        email: req.body.email
    }, {new: true})
    .then(employee => {
        if(!employee) {
            return res.status(404).send({
                message: "Employee not found with id " + req.params.employeeId
            });
        }
        res.send(employee);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Employee not found with id " + req.params.employeeId
            });                
        }
        return res.status(500).send({
            message: "Error updating employee with id " + req.params.employeeId
        });
    });
};

// Delete a employee with the specified employeeId in the request
exports.delete = (req, res) => {
    Employee.findByIdAndRemove(req.params.employeeId)
    .then(employee => {
        if(!employee) {
            return res.status(404).send({
                message: "Employee not found with id " + req.params.employeeId
            });
        }
        res.send({message: "Employee deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Employee not found with id " + req.params.employeeId
            });                
        }
        return res.status(500).send({
            message: "Could not delete employee with id " + req.params.employeeId
        });
    });
};