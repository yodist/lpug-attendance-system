module.exports = (app) => {
    const activity = require('../controllers/activity.controller.js');
    
    // create a new activity
    app.post('/activity', activity.create);
    
    // retrieve all activities by criteria
    app.get('/activity', activity.findByCriteria);
    
    // retrieve a single activity with activity id
    app.get('/activity/:activityId', activity.findOne);

    // update a activity with activity id
    app.put('/activity/:activityId', activity.update);
    
    // delete a activity with activity id
    app.delete('/activity/:activityId', activity.delete);
}