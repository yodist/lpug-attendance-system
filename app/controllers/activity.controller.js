const Activity = require('../models/activity.model.js');

exports.create = (req, res) => {
    // validate request
    if (!req.body.code) {
        return res.status(400).send({
            message: "Activity code can not be empty"
        });
    }
    if (!req.body.name) {
        return res.status(400).send({
            message: "Activity name can not be empty"
        });
    }
    if (!req.body.activity_date) {
        return res.status(400).send({
            message: "Activity date can not be empty"
        });
    }
    
    // check duplicate
    const checker = new Activity();
    checker.constructor.findOne({code: req.body.code})
    .exec(function(err, result) {
        if (err) {
            return res.status(500).send({
                message: err.message || "Some error occured while retrieving activities."
            });
        } else if(result) {
            return res.status(400).send({
                message: "The activity with the same code is already exists."
            });
        }
    })
    
    const activity = new Activity({
        code: req.body.code,
        name: req.body.name,
        description: req.body.description || "No description.",
        activity_date: req.body.activity_date,
        start_time: req.body.start_time || null,
        end_time: req.body.end_time || null,
        course: req.body.course || null,
        activity_officers: req.body.activity_officers || null
    });
    
    activity.save().then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
           message: err.message || "Some error occured while creating the Activity." 
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
    
    Activity.find(query)
    .populate('course')
    .then(activities => {
        res.send(activities);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occured while retrieving activities."
        });
    });
};

exports.findOne = (req, res) => {
    Activity.findById(req.params.activityId).then(activity => {
        if (!activity) {
            return res.status(404).send({
                message: "Activity not found with id " + req.params.activityId
            });
        }
        res.send(activity);
    }).catch(err => {
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Activity not found with id " + req.params.activityId
            });
        }
        return res.status(500).send({
            message: "Error retrieving activity with id " + req.params.activityId
        })
    });
};

exports.update = (req, res) => {
    // Validate Request
    if(!req.body.name) {
        return res.status(400).send({
            message: "Activity name can not be empty"
        });
    }
    if (!req.body.activity_date) {
        return res.status(400).send({
            message: "Activity date can not be empty"
        });
    }

    // Find activity and update it with the request body
    Activity.findByIdAndUpdate(req.params.activityId, {
        name: req.body.name,
        description: req.body.description || "No description.",
        activity_date: req.body.activity_date,
        start_time: req.body.start_time || null,
        end_time: req.body.end_time || null,
        course: req.body.course || null,
        activity_officers: req.body.activity_officers || null
    }, {new: true})
    .then(activity => {
        if(!activity) {
            return res.status(404).send({
                message: "Activity not found with id " + req.params.activityId
            });
        }
        res.send(activity);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Activity not found with id " + req.params.activityId
            });                
        }
        return res.status(500).send({
            message: "Error updating activity with id " + req.params.activityId
        });
    });
};

// Delete a activity with the specified activityId in the request
exports.delete = (req, res) => {
    Activity.findByIdAndRemove(req.params.activityId)
    .then(activity => {
        if(!activity) {
            return res.status(404).send({
                message: "Activity not found with id " + req.params.activityId
            });
        }
        res.send({message: "Activity deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Activity not found with id " + req.params.activityId
            });                
        }
        return res.status(500).send({
            message: "Could not delete activity with id " + req.params.activityId
        });
    });
};