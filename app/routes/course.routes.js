module.exports = (app) => {
    const course = require('../controllers/course.controller.js');
    
    // create a new note
    app.post('/course', course.create);
    
    // retrieve all notes by criteria
    app.get('/course', course.findByCriteria);
    
    // retrieve a single note with note id
    app.get('/course/:courseId', course.findOne);

    // update a note with note id
    app.put('/course/:courseId', course.update);
    
    // delete a note with note id
    app.delete('/course/:courseId', course.delete);
}