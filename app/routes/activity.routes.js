module.exports = (app) => {
    const activity = require('../controllers/activity.controller.js');
    
    // create a new note
    app.post('/activity', activity.create);
    
    // retrieve all notes by criteria
    app.get('/activity', activity.findByCriteria);
    
    // retrieve a single note with note id
    app.get('/activity/:activityId', activity.findOne);

    // update a note with note id
    app.put('/activity/:activityId', activity.update);
    
    // delete a note with note id
    app.delete('/activity/:activityId', activity.delete);
}