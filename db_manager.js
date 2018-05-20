var sqlite3 = require('sqlite3').verbose();


function DBManager(db_name){
    console.log("init db");
    this.db_name = db_name;
    let db = new sqlite3.Database(db_name);
    db.serialize(function() {
        this.run("CREATE TABLE IF NOT EXISTS `lists` (`pk` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, `name` TEXT);");
        // use text to store boolean done field (angularjs cant bind integer to checkbox ng-model)
        this.run("CREATE TABLE IF NOT EXISTS `todos` (`pk` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, `task` TEXT, `done` TEXT, `note` TEXT `list_pk` INTEGER NOT NULL);");
    });
    db.close();
}


DBManager.prototype.get_lists = function (){
    let db = new sqlite3.Database(this.db_name, sqlite3.READ_ONLY);
    return new Promise(function (resolve, reject) {
        db.all("SELECT pk,* FROM `lists` WHERE 1;", function(err, row) {
            if(err != null){
                reject(err);
                db.close();
            } else {
                resolve(row);
                db.close();
            }
        });
    });
};


DBManager.prototype.get_todo = function (pk){
    let db = new sqlite3.Database(this.db_name, sqlite3.READ_ONLY);
    return new Promise(function (resolve, reject) {
        db.get("SELECT task, done, note FROM `todos` WHERE pk='" + pk + "';", function(err, row) {
            if(err != null){
                reject(err);
                db.close();
            } else {
                resolve(row);
                db.close();
            }
        });
    });
};



DBManager.prototype.add_list = function (name) {
    let db = new sqlite3.Database(this.db_name);
    db.run("INSERT INTO `lists`(`name`) VALUES ('" + name + "');");
    db.close();
};


DBManager.prototype.get_list_todos = function(list_pk){
    let db = new sqlite3.Database(this.db_name);

    return new Promise(function (resolve, reject) {
        db.all("SELECT pk, task, done FROM `todos` WHERE list_pk='" + list_pk + "';", function(err, row) {
            if(err != null){
                reject(err);
                db.close();
            } else {
                resolve(row);
                db.close();
            }
        });
    });
};


DBManager.prototype.add_todo = function (list_pk, task) {
    let db = new sqlite3.Database(this.db_name);
    db.run("INSERT INTO `todos`(`task`,`done`,`list_pk`) VALUES ('" + task + "',0,'" + list_pk + "');");
    db.close();
};


DBManager.prototype.update_list = function (list_pk, name) {
    let db = new sqlite3.Database(this.db_name);
    db.run("UPDATE `lists` SET `name`='" + name + "' WHERE `pk`='" + list_pk + "';");
    db.close();
};


DBManager.prototype.update_todo = function (todo_pk, task="", done="") {
    let db = new sqlite3.Database(this.db_name);

    let query = "UPDATE `todos` SET ";
    if (task){
        query += "`task`='" + task + "'";
    }
    if (done){
        query += "`done`='" + done + "'";
    }
    query += " WHERE `pk`='1';";

    db.run(query);
    db.close();
};


DBManager.prototype.delete_todo = function (todo_pk){
    let db = new sqlite3.Database(this.db_name);
    db.run("DELETE FROM `todos` WHERE `pk`='" + todo_pk + "';");
    db.close();
};


DBManager.prototype.delete_list = function (list_pk){
    let db = new sqlite3.Database(this.db_name);
    db.run("DELETE FROM `lists` WHERE `pk`='" + list_pk + "';");
    db.run("DELETE FROM `todos` WHERE `list_pk`='" + list_pk + "';");
    db.close();
};



var q = new DBManager("db.db");

module.exports = q;