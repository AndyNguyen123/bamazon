//dependencies
const mysql = require('mysql');
const inquirer = require('inquirer');
const { table } = require('table');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'bamazon'
});

function logObjectAsTable(object) {
    let data = [
        object.keys,
    ];
    object.forEach(obj => {
        let dataRow = [];
        for (let key in obj) dataRow.push(obj[key]);
        data.push(dataRow);
    });
    let output = table(data);
    console.log(output);
};


function viewProductForSale() {
    const query = 'select item_id, product_name, price, stock_quantity from products ';
    connection.query(query, (error, results, fields) => {
        if (error) throw error;
        logObjectAsTable(results);
    });
};

function viewLowInventory() {
    const query = 'select item_id, product_name, stock_quantity from products where stock_quantity < 5';
    connection.query(query, (error, results, fields) => {
        if (error) throw error;
        logObjectAsTable(results);
    });
};

function addToInventory(itemID, qty) {
    const query = `update products; set stock_quantity = ${qty} where item_id = ${itemID}`;
    connection.query(query, (error, results, fields) => {
        if (error) throw error;
    });
};

function addNewProduct(productName, price, qty, unitCost) {
    const query = `insert into
    products (product_name, price, stock_quantity, unit_cost`;
    connection.query(query, (error, results, fields) => {
        if (error) throw error;
    });
};

inquirer
    .prompt([
        {
            name: "options",
            type: "list",
            message: "Select an Option:",
            choices: [
                'View Products for Sales',
                'View Low Inventory',
                'Add to Inventory',
                'Add New Product',
            ]
        }
    ])
    .then(answer => {
        console.log(answer.options);
        switch(answer.options)
    })