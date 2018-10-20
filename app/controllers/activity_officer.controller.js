const ActivityOfficer = require('../models/activity_officer.model.js');

exports.create = (req, res) => {
    // validate request
    if (!req.body.activity) {
        return res.status(400).send({
            message: "Activity officer activity can not be empty"
        });
    }
    if (!req.body.employee) {
        return res.status(400).send({
            message: "Activity officer employee can not be empty"
        });
    }
    if (!req.body.position) {
        return res.status(400).send({
            message: "Activity officer position can not be empty"
        });
    }
    
    // check duplicate
    // const checker = new ActivityOfficer();
    // checker.constructor.findOne({code: req.body.code})
    // .exec(function(err, result) {
    //     if (err) {
    //         return res.status(500).send({
    //             message: err.message || "Some error occured while retrieving activities."
    //         });
    //     } else if(result) {
    //         return res.status(400).send({
    //             message: "The activity officer with the same code is already exists."
    //         });
    //     }
    // })
    
    const activityOfficer = new ActivityOfficer({
        position: req.body.position,
        activity: req.body.activity,
        employee: req.body.employee
    });
    
    activityOfficer.save().then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
           message: err.message || "Some error occured while creating the ActivityOfficer." 
        });
    });
};

exports.findByCriteria = (req, res) => {
    
    let query = {};
    if (req.query.code) query.code = new RegExp(req.query.code, 'i');
    if (req.query.name) query.name = new RegExp(req.query.name, 'i');
    if (req.query.activity_date) {
        let activity_date = new Date(req.query.activity_date);
        // set to 00 to ignore time
        activity_date.setHours(0,0,0,0);
        let max = new Date(activity_date);
        // add 1 day
        max.setDate(max.getDate() + 1)
        query.activity_date = {$gte: activity_date, $lt: max};
    }
    // below is used for exact matching string
    // if (req.query.code) query.code = new RegExp('^' + req.query.code + '$', 'i');
    
    ActivityOfficer.find(query).then(activities => {
        res.send(activities);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occured while retrieving activities."
        });
    });
};

exports.findOne = (req, res) => {
    ActivityOfficer.findById(req.params.activityOfficerId).then(activityOfficer => {
        if (!activityOfficer) {
            return res.status(404).send({
                message: "Activity officer not found with id " + req.params.activityOfficerId
            });
        }
        res.send(activityOfficer);
    }).catch(err => {
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Activity officer not found with id " + req.params.activityOfficerId
            });
        }
        return res.status(500).send({
            message: "Error retrieving activity officer with id " + req.params.activityOfficerId
        })
    });
};

exports.update = (req, res) => {
    // Validate Request
    if(!req.body.position) {
        return res.status(400).send({
            message: "Activity officer position can not be empty"
        });
    }
    if (!req.body.activity) {
        return res.status(400).send({
            message: "Activity officer activity can not be empty"
        });
    }
    if (!req.body.employee) {
        return res.status(400).send({
            message: "Activity officer employee can not be empty"
        });
    }

    // Find activity officer and update it with the request body
    ActivityOfficer.findByIdAndUpdate(req.params.activityId, {
        name: req.body.name,
        description: req.body.description || "No description.",
        start_date: req.body.start_date || null,
        end_date: req.body.end_date || null,
    }, {new: true})
    .then(activity => {
        if(!activity) {
            return res.status(404).send({
                message: "Activity officer not found with id " + req.params.activityId
            });
        }
        res.send(activity);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Activity officer not found with id " + req.params.activityId
            });                
        }
        return res.status(500).send({
            message: "Error updating activity officer with id " + req.params.activityId
        });
    });
};

// Delete a activity with the specified activityId in the request
exports.delete = (req, res) => {
    ActivityOfficer.findByIdAndRemove(req.params.activityId)
    .then(activity => {
        if(!activity) {
            return res.status(404).send({
                message: "Activity officer not found with id " + req.params.activityId
            });
        }
        res.send({message: "Activity officer deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Activity officer not found with id " + req.params.activityId
            });                
        }
        return res.status(500).send({
            message: "Could not delete activity officer with id " + req.params.activityId
        });
    });
};