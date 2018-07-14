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

function getAllProductInfo() {
    let query = `SELECT * FROM products`;
    return new Promise((resolve, reject) => {
        return connection.query(query, (error, results, fields) => {
            if (error) throw error;
            resolve(results);
        });
    });
};

function displayProductInfo(products) {
    let data = [
        //headers of id, name and price
        Object.keys(products[0]).filter(header => header === 'item_id' || header === 'product_name' || header === 'price'),
    ];
    //pushing product info to data
    products.forEach(obj => {
        let dataRow = [];
        dataRow.push(obj.item_id, obj.product_name, obj.price);
        data.push(dataRow);
    });
    let output = table(data);
    console.log(output);
};

function updateInventory(productID, qtyPurchase) {
    let query = `UPDATE products
    SET stock_quantity = stock_quantity - ${qtyPurchase}
    WHERE item_id = ${productID}
`;
    return connection.query(query, (error, results, fields) => {
        if (error) throw error;
    });
};

function showOrderDetail(item, qtyPurchase, unitCost) {
    let data = [
        ['Item', 'Quantity', 'Unit Cost', 'Total'],
        [item, qtyPurchase, unitCost, qtyPurchase * unitCost],
    ];
    let output = table(data);
    console.log(`
Here is your Order Detail:
${output}`);
};

function validateUserInput(productID, qtyPurchase) {
    let isValid = false;
    if (isNaN(productID) && isNaN(qtyPurchase)) console.log('\nProduct ID & Quantiy must be a number\n')
    else if (isNaN(productID)) console.log('\nProduct ID must be a number\n')
    else if (isNaN(qtyPurchase)) console.log('\nQuantity must be a number\n')
    else isValid = true;
    return isValid;
};

function checkInventory(inputQty, invQty) {
    let isValid = false;
    if (inputQty > invQty) {
        console.log('\nInsufficient Inventory!');
        isValid = false;
    } else {
        console.log('\nProcessing Order....');
        isValid = true;
    }
    return isValid;
};

function inquireLog(products) {
    inquirer
        .prompt([
            {
                name: 'pID',
                message: 'Please enter the product ID that you want to purchase:',
            },
            {
                name: 'qty',
                message: 'Enter your quantity'
            },
        ])
        .then(answer => {
            const isInputValid = validateUserInput(answer.pID, answer.qty);
            if (isInputValid) {
                const productObj = products.find(product => product.item_id == answer.pID);
                const productQty = productObj.stock_quantity;
                const productName = productObj.product_name;
                const productPrice = productObj.price;
                const isOrderValid = checkInventory(answer.qty, productQty);
                if (isOrderValid) {
                    updateInventory(answer.pID, answer.qty);
                    showOrderDetail(productName, answer.qty, productPrice);
                    connection.end();
                };
            } else inquireLog(products);
        })
        .catch(err => console.error(err));
};

getAllProductInfo()
    .then(products => {
        displayProductInfo(products);
        inquireLog(products);
    })
    .catch(err => console.error(err));