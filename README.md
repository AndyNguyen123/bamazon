# bamazon
### bamazonCustomer.js
* Running this app will display all the __product_id__, __product_name__ and __price__ of all products in store.
* The customer/user would then be prompted to purchase by entering the __product_id__ and __quantity__ of the item.
* The app will then display an order confirmation and decrease the input quantity in the database to reflect the purchase.

### bamazonManager.js
Running this app will prompt multiple options for the manager/user to take:
1. View Products for Sale
    * Displaying all information of every product in inventory
2. View Low Inventory
    * Display all information of only product with __quantity__ less than 5
3. Add to Inventory
    * Allow manager to re-stock the quantity of a product. This would update the database to increase the __quantity__ from manager input
4. Add New Product
    * Allow manager to add a completely new product by inputing the __product_name__, __price__, __cost of good sold__, and __quantity__
5. Quit Application
    * Stop the application and disconnect from mysql database