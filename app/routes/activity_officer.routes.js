module.exports = (app) => {
    const activityOfficer = require('../controllers/activity_officer.controller.js');
    
    // create a new note
    app.post('/activity-officer', activityOfficer.create);
    
    // retrieve all notes by criteria
    app.get('/activity-officer', activityOfficer.findByCriteria);
    
    // retrieve a single note with note id
    app.get('/activity-officer/:activityOfficerId', activityOfficer.findOne);

    // update a note with note id
    app.put('/activity-officer/:activityOfficerId', activityOfficer.update);
    
    // delete a note with note id
    app.delete('/activity-officer/:activityOfficerId', activityOfficer.delete);
}