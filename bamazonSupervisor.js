//dependencies
const mysql = require('mysql');
const inquirer = require('inquirer');
const {
    table
} = require('table');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456789',
    database: 'bamazon'
});

function logObjectAsTable(arrayOfObjects) {
    let data = [
        Object.keys(arrayOfObjects[0]),
    ];
    arrayOfObjects.forEach(obj => {
        let dataRow = [];
        for (let key in obj) dataRow.push(obj[key]);
        data.push(dataRow);
    });
    let output = table(data);
    console.log(output);
};

function viewPerformanceByDept(callback) {
    let query = `
select
	department_name,
	overhead_cost,
    sum(quantity_sold * price) as sales,
	sum(quantity_sold * (price - unit_cost)) as gross_margin,
	sum(quantity_sold * (price - unit_cost))  - overhead_cost as net_margin
from departments d
	left join products p on d.department_id = p.department_id
group by d.department_name, overhead_cost`;

    return connection.query(query, (error, results, fields) => {
        if (error) throw error;
        logObjectAsTable(results);
        callback();
    });
};

function createNewDept(department, overhead) {
    let query = `
insert into departments (department_name, overhead_cost)
values  ('${department}', ${overhead})`

    return connection.query(query, (error, results, fields) => {
        if (error) throw error;
    });
}

function promptCreateDept() {
    return new Promise((resolve, reject) => {
        return inquirer.prompt([{
                    name: 'deptName',
                    message: "What's the department name"
                },
                {
                    name: 'overhead',
                    message: "How much is it overhead?"
                }
            ]).then(answer => resolve(answer))
            .catch(err => console.error(err));
    });
}

function quitApp() {
    connection.end();
    return;
}

function runApp() {
    return inquirer
        .prompt([{
            name: "option",
            type: "list",
            message: "Select an option:",
            choices: [
                'View Performance by Department',
                'Create a New Department',
                'Quit Application'
            ]
        }])
        .then(answer => {
            switch (answer.option) {
                case 'View Performance by Department':
                    viewPerformanceByDept(runApp);
                    break;
                case 'Create a New Department':
                    promptCreateDept()
                        .then(deptObj => createNewDept(deptObj.deptName, deptObj.overhead))
                        .then(() => runApp());
                    break;
                case 'Quit Application':
                    quitApp();
            };
        })
        .catch(err => console.error(err));
};

runApp();