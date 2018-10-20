module.exports = (app) => {
    const employee = require('../controllers/employee.controller.js');
    
    // create a new note
    app.post('/employee', employee.create);
    
    // retrieve all notes by criteria
    app.get('/employee', employee.findByCriteria);
    
    // retrieve a single note with note id
    app.get('/employee/:employeeId', employee.findOne);

    // update a note with note id
    app.put('/employee/:employeeId', employee.update);
    
    // delete a note with note id
    app.delete('/employee/:employeeId', employee.delete);
}