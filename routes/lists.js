var express = require('express');
var router = express.Router();
var db_manager = require("../db_manager");

// Get all lists
router.get('/', function(req, res, next) {
    db_manager.get_lists().then(function(data) {
        res.json(data);
    }).catch(function () {
        res.json({"error":""})
    });
});

// Create list
router.post('/', function(req, res, next) {
    db_manager.add_list(req.body.name);
    res.json({'success':true});
});

// Get list's todos
router.get('/:pk', function(req, res, next) {
    db_manager.get_list_todos(req.params.pk).then(function(data) {
        res.json(data);
    }).catch(function () {
        res.json({"error":""})
    });
});

// create new todo_
router.post('/:pk', function(req, res, next) {
    db_manager.add_todo(req.params.pk, req.body.task);
    res.json({'success': true});
});

// update list
router.put('/:pk', function(req, res, next) {
    console.log(req.body.name);
    db_manager.update_list(req.params.pk, req.body.name);
    res.json({'success': true});
});

// update todo_ by it's pk
router.put('/l/todos/:pk', function (req, res, next) {
    db_manager.update_todo(req.params.pk, req.body.task, req.body.done)
    res.json({'success':true});
});

// get todo_ information
router.get('/l/todos/:pk', function (req, res, next) {
    db_manager.get_todo(req.params.pk).then(function(data) {
        res.json(data);
    }).catch(function () {
        res.json({"error":""})
    });
});

// delete todo_
router.delete('/l/todos/:pk',function (req, res, next) {
    db_manager.delete_todo(req.params.pk);
    res.json({'success':true});
});

//delete list
router.delete('/:pk',function (req, res, next) {
    db_manager.delete_list(req.params.pk);
    res.json({'success':true});
});

module.exports = router;
