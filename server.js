const express = require('express');
const mysql = require('mysql');
const app = express();
const bcrypt = require('bcrypt');
const saltRounds = 10; 
const randomstring = require("randomstring");
const bodyparser = require('body-parser');
const datetime = require('node-datetime');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

var connection = mysql.createConnection({
    //properties...
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sampleDB',
    multipleStatements: true
});

connection.connect(function(error) {
    if (!!error) {
        console.log('Error');
    }
    else {
        console.log('Connected');
    }
});

app.get('/api/customers', (req, res) => {
  const customers = [
    {id: 1, firstName: 'John', lastName: 'Doe'},
    {id: 2, firstName: 'Brad', lastName: 'Traversy'},
    {id: 3, firstName: 'Mary', lastName: 'Swanson'},
  ];

  res.json(customers);
});


app.get('/name', function(req, resp) {
    //about mysql
    connection.query("SELECT * FROM mySampleTable", function(error, rows, fields){
        //callback
        if (!!error){
            console.log('error in the query');
        }
        else {
            console.log('successful query \n');
            console.log(rows); 
            //parse with your rows / fields
            resp.send('Hello '+ rows[0].Name);
        }
    });
});

//Get all employees
app.get('/employees', (req, res) => {
    connection.query('SELECT * FROM EmployeeDB', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//Get an employees
app.get('/employees/:id', (req, res) => {
    connection.query('SELECT * FROM EmployeeDB WHERE EmpID = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//Delete an employees
app.delete('/employees/:id', (req, res) => {
    connection.query('DELETE FROM EmployeeDB WHERE EmpID = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send('Deleted successfully.');
        else
            console.log(err);
    })
});
//Insert an employees
app.post('/employees', (req, res) => {
    let emp = req.body;
    var sql = "SET @EmpID = ?;SET @Name = ?;SET @EmpCode = ?;SET @Salart = ?; \
    CALL EmployeeAddOrEdit(@EmpID,@Name,@EmpCode,@Salart);";
    connection.query(sql, [emp.EmpID, emp.Name, emp.EmpCode, emp.Salart], (err, rows, fields) => {
        if (!err)
            rows.forEach(element => {
                if(element.constructor == Array)
                res.send(`Inserted employee id : ${element[0].EmpID}`);
            });
        else
            console.log(err);
    })
});
//How to insert
// {
// 	"Username" : "Red",
// 	"Password" : "12345678"
// }


//Update an employees
app.put('/employees', (req, res) => {
    let emp = req.body;
    var sql = "SET @EmpID = ?;SET @Name = ?;SET @EmpCode = ?;SET @Salart = ?; \
    CALL EmployeeAddOrEdit(@EmpID,@Name,@EmpCode,@Salart);";
    connection.query(sql, [emp.EmpID, emp.Name, emp.EmpCode, emp.Salart], (err, rows, fields) => {
        if (!err)
            res.send('Updated successfully');
        else
            console.log(err);
    })
});





//Get all data
app.get('/register', (req, res) => {

    connection.query('SELECT * FROM Authentication', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//Get an employees
app.get('/register/:name', (req, res) => {
    connection.query('SELECT * FROM Authentication WHERE Username = ?', [req.params.name], (err, rows, fields) => {
        if (!err)
            res.send(rows[0].Password);
        else
            console.log(err);
    })
});

//Delete an username
app.delete('/register/:name', (req, res) => {
    connection.query('DELETE FROM Authentication WHERE Username = ?', [req.params.name], (err, rows, fields) => {
        if (!err)
            res.send('Deleted successfully.');
        else
            console.log(err);
    })
});

//Insert an username
app.post('/register', (req, res) => {
    let emp = req.body;
    var usern = emp.Username;
    var passw = emp.Password;
    var hashedPass = bcrypt.hashSync(passw, saltRounds); 
    console.log("Username", usern);
    console.log("Password", passw);
    console.log("Hashed pass",hashedPass);

    var sql = "INSERT INTO Authentication(Username, Password) \
	VALUES (?, ?);";
    connection.query(sql, [emp.Username, hashedPass], (err, rows, fields) => {
        if (!err) 
            res.send(rows);
            // rows.forEach(element => {
            //     if(element.constructor == Array)
            //     res.send(rows);
            // });
        else
            console.log("error \n");
            console.log(err);
    })
});

//Update an username
app.put('/register', (req, res) => {
    let emp = req.body;
    var usern = emp.Username;
    var passw = emp.Password;
    var hashedPass = bcrypt.hashSync(passw, saltRounds); 
    console.log("Username", usern);
    console.log("Password", passw);
    console.log("Hashed pass",hashedPass);

    var sql = "UPDATE Authentication\
    SET Password = ? \
	WHERE Username = ?;";
    connection.query(sql, [emp.hashedPass, emp.Username], (err, rows, fields) => {
        if (!err) 
            res.send(rows);
            // rows.forEach(element => {
            //     if(element.constructor == Array)
            //     res.send(rows);
            // });
        else
            console.log("error \n");
            console.log(err);
    })
});

//Insert an username
app.post('/signup', (req, res) => {
    let emp = req.body;
    var usern = emp.username;
    var passw =randomstring.generate(7);
    var name = emp.name;
    var phone = emp.phone;
    var current_company = emp.current_company;
    var division = emp.division;

    var now = datetime.create();
    var created_at = now.format('Y-m-d H:M:S');
    
    var hashedPass = bcrypt.hashSync(passw, saltRounds); 
    console.log("Username ", usern);
    console.log("Password", passw);
    console.log("Hashed pass ",hashedPass);
    console.log("date time: ", created_at);

    var sql = "INSERT INTO user_data(username, password, name, phone, current_company, division, created_at) \
	VALUES (?, ?, ?, ?, ?, ?, ?);";
    connection.query(sql, [usern, hashedPass, name, phone, current_company, division, created_at], (err, rows, fields) => {
        if (!err) {
            res.send(rows);
            console.log("Success \n");
        }
        else {
            console.log("error \n");
            console.log(err);
        }
    })
});

//Authenticate user data
app.post('/authenticate', (req, res) => {
    console.log(req.body)
    const username = req.body.username
    const password = req.body.password

    //hash the password
    var hashedPass = bcrypt.hashSync(password, saltRounds); 
    console.log("Hashed password: ",hashedPass);   
    const sql = 'SELECT * FROM user_data WHERE username = ?'
    connection.query(sql, [username], (err, result) => {
        if(result.length > 0) {
            // var hasil = bcrypt.compareSync(password, result[0].Password); 
            
            const dbpass = result[0].password;
            console.log(dbpass);

            bcrypt.compare(password, dbpass, function(err, resp) {
                if(resp) {
                    // Passwords match
                    console.log("match");
                    var now = datetime.create();
                    var last_login = now.format('Y-m-d H:M:S');
                    
                    var sqlUpdate = "UPDATE user_data SET last_login = ? WHERE username = ?";
                    connection.query(sqlUpdate, [last_login, username] ,(err, result) => {
                        if (!err) {
                            console.log('updated last login at ', last_login);
                        }
                        else {
                            console.log("error \n");
                            console.log(err);
                        }
                 })

                 res.status(200).json({
                    statusCode: 200,
                    loginSuccess: true,
                    message: "Login Success Yey"
                })
                } else {
                 // Passwords don't match
                 console.log("not match");
                 res.status(200).json({
                    statusCode: 401,
                    loginSuccess: false,
                    message: "Failed : Password is wrong"
                })
                } 
              });
              
        } else {
            console.log("not match");
            res.status(200).json({
                statusCode: 404,
                loginSuccess: false,
                message: "Failed : Username does not exist"
            })
        }
    })
})


const port = 1339;

app.listen(port, () => `Server running on port ${port}`);


//USERNAME : bla@gmail.com
//PASSWORD : turFDnR