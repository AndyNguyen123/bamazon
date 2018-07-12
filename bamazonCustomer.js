const mysql = require('mysql');
const inquirer = require('inquirer');
const { table } = require('table');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'bamazon'
});

function selectAllDepartmentInfo() {
    connection.query('SELECT * FROM departments', function (error, results, fields) {
        if (error) throw error;
        //get headers
        let headers = Object.keys(results[0]);
        let dataSet = [
            headers,
        ];
        //pushing all the entries from department table to data set
        results.forEach(obj => {
            let dataRow = [];
            for(let key in obj) {
                console.log(obj[key]);
                dataRow.push(obj[key]);
            }
            dataSet.push(dataRow);
        });
        let output = table(dataSet);
        console.log(output);
    });
    connection.end();
};