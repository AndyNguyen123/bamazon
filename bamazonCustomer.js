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
    connection.query(query, (error, results, fields) => {
        if (error) throw error;
        connection.end();
    });
};

function showOrderDetail(item, qtyPurchase, unitCost) {
    let data = [
        ['Item', 'Quantity', 'Unit Cost', 'Total'],
        [item, qtyPurchase, unitCost, qtyPurchase*unitCost],
    ];
    let output = table(data);
    console.log(`
Here is your Order Detail:
${output}`);
};

function sellProducts(products) {
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
            if (isNaN(answer.pID)) console.log('Err: Product ID must be a number')
            else if (isNaN(answer.qty)) console.log('Err: Quantity must be a number');

            let itemPurchased = products.find(product => product.item_id == answer.pID);
            let itemQty = itemPurchased.stock_quantity;
            let itemName = itemPurchased.product_name;
            let unitCost = itemPurchased.price;
            if (answer.qty > itemQty) console.log('Insufficient Inventory!')
            else {
                updateInventory(answer.pID, answer.qty);
                showOrderDetail(itemName, answer.qty, unitCost);
            }
        });
};

getAllProductInfo()
    .then(products => {
        displayProductInfo(products);
        sellProducts(products);
    })
    .catch(err => console.error(err));