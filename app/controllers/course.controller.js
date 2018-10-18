const Course = require('../models/course.model.js');

exports.create = (req, res) => {
    // validate request
    if (!req.body.code) {
        return res.status(400).send({
            message: "Course code can not be empty"
        });
    }
    if (!req.body.name) {
        return res.status(400).send({
            message: "Course name can not be empty"
        });
    }
    
    // check duplicate
    const checker = new Course();
    checker.constructor.findOne({code: req.body.code})
    .exec(function(err, result) {
        if (err) {
            return res.status(500).send({
                message: err.message || "Some error occured while retrieving courses."
            });
        } else if(result) {
            return res.status(400).send({
                message: "The course with the same code is already exists."
            });
        }
    })
    
    const course = new Course({
        code: req.body.code,
        name: req.body.name,
        description: req.body.description || "No description.",
        start_date: req.body.start_date || null,
        end_date: req.body.end_date || null,
    });
    
    course.save().then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
           message: err.message || "Some error occured while creating the Course." 
        });
    });
};

exports.findByCriteria = (req, res) => {
    
    let query = {};
    if (req.query.code) query.code = new RegExp(req.query.code, 'i');
    if (req.query.name) query.name = new RegExp(req.query.name, 'i');
    // below is used for exact matching string
    // if (req.query.code) query.code = new RegExp('^' + req.query.code + '$', 'i');
    
    Course.find(query).then(courses => {
        res.send(courses);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occured while retrieving courses."
        });
    });
};

exports.findOne = (req, res) => {
    Course.findById(req.params.courseId).then(course => {
        if (!course) {
            return res.status(404).send({
                message: "Course not found with id " + req.params.courseId
            });
        }
        res.send(course);
    }).catch(err => {
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Course not found with id " + req.params.courseId
            });
        }
        return res.status(500).send({
            message: "Error retrieving course with id " + req.params.courseId
        })
    });
};

exports.update = (req, res) => {
    // Validate Request
    if(!req.body.name) {
        return res.status(400).send({
            message: "Course name can not be empty"
        });
    }

    // Find course and update it with the request body
    Course.findByIdAndUpdate(req.params.courseId, {
        name: req.body.name,
        description: req.body.description || "No description.",
        start_date: req.body.start_date || null,
        end_date: req.body.end_date || null,
    }, {new: true})
    .then(course => {
        if(!course) {
            return res.status(404).send({
                message: "Course not found with id " + req.params.courseId
            });
        }
        res.send(course);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Course not found with id " + req.params.courseId
            });                
        }
        return res.status(500).send({
            message: "Error updating course with id " + req.params.courseId
        });
    });
};

// Delete a course with the specified courseId in the request
exports.delete = (req, res) => {
    Course.findByIdAndRemove(req.params.courseId)
    .then(course => {
        if(!course) {
            return res.status(404).send({
                message: "Course not found with id " + req.params.courseId
            });
        }
        res.send({message: "Course deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Course not found with id " + req.params.courseId
            });                
        }
        return res.status(500).send({
            message: "Could not delete course with id " + req.params.courseId
        });
    });
};