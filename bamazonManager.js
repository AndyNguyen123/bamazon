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


function viewProductForSale() {
    const query = 'select * from products';
    return new Promise((resolve, reject) => {
        return connection.query(query, (error, results, fields) => {
            if (error) throw error;
            logObjectAsTable(results);
            resolve('\nFinishing Product View....\n');
        });
    });
};

function viewLowInventory() {
    const query = 'select * from products where quantity < 5';
    return new Promise((resolve, reject) => {
        return connection.query(query, (error, results, fields) => {
            if (error) throw error;
            logObjectAsTable(results);
            resolve('\nFinishing Low Inventory View....\n');
        });
    });
};

function addToInventory(itemID, qty) {
    const query = `update products set quantity = quantity + ${qty} where product_id = ${itemID}`;
    return new Promise((resolve, reject) => {
        return connection.query(query, (error, results, fields) => {
            if (error) throw error;
            resolve('\nQuantity added!\n');
        });
    });
};

function promptToAddQty() {
    return new Promise((resolve, reject) => {
        return inquirer
            .prompt([{
                    name: 'pID',
                    message: "Enter the Product ID that you want to re-stock:",
                },
                {
                    name: 'qty',
                    message: "How many units are you adding?",
                }
            ])
            .then(answer => {
                resolve(answer);
            })
            .catch(err => console.error(err));
    });
}

function addNewProduct(productName, price, qty, unitCost) {
    const query = `
    insert into products (product_name, price, quantity, unit_cost)
    values ("${productName}", ${price}, ${qty}, ${unitCost})`;
    return new Promise((resolve, reject) => {
        return connection.query(query, (error, results, fields) => {
            if (error) throw error;
            resolve('\nProduct added!\n');
        });
    });
};

function promptToAddProduct() {
    return new Promise((resolve, reject) => {
        return inquirer
            .prompt([{
                    name: 'productName',
                    message: "What product do you want to add?",
                },
                {
                    name: 'price',
                    message: "What is its price?",
                },
                {
                    name: 'cost',
                    message: "How much does its cost? (the Cost of Good Sold)",
                },
                {
                    name: 'qty',
                    message: "How many of these do you want to add?"
                }
            ])
            .then(answer => {
                resolve(answer);
            })
            .catch(err => console.error(err));
    });
}

function stopApp() {
    connection.end();
    return;
}

function runApp() {
    inquirer
        .prompt([{
            name: "options",
            type: "list",
            message: "Select an Option:",
            choices: [
                'View Products for Sales',
                'View Low Inventory',
                'Add to Inventory',
                'Add New Product',
                'Quit Application'
            ]
        }])
        .then(answer => {
            switch (answer.options) {
                case 'View Products for Sales':
                    viewProductForSale().then((status) => {
                        console.log(status);
                        runApp();
                    });
                    break;
                case 'View Low Inventory':
                    viewLowInventory().then((status) => {
                        console.log(status);
                        runApp();
                    });
                    break;
                case 'Add to Inventory':
                    promptToAddQty().then(answer => {
                        addToInventory(answer.pID, answer.qty).then((status) => {
                            console.log(status);
                            runApp();
                        });
                    });
                    break;
                case 'Add New Product':
                    promptToAddProduct().then(answer => {
                        console.log(answer);
                        addNewProduct(answer.productName, answer.price, answer.qty, answer.cost).then((status) => {
                            console.log(status);
                            runApp()
                        });
                    });
                    break;
                case 'Quit Application':
                    stopApp();
                    break;
            }
        })
}

runApp();