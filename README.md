# Product Inventory Management System
A simple REPL CLI application to manage products in the inventory. 

-----> Submitted as part of Rooms To Go Engineering: Take Home Assignment <----

## How to use this repository?
1. Clone the repository.

2. `npm install` to get all packages. 

3. `npm start` to start a new CLI session. 

4. Type `EOF` in the CLI to quit the session. 

## Commands Supported 
1. **ADD PRODUCT**  "PRODUCT NAME"  SKU 

  This command adds a new product to the product catalog.
Products with the same name can exist but not with the same SKU. 

2. **ADD WAREHOUSE**  WAREHOUSE#  [STOCK_LIMIT]

  * This command creates a new warehouse to stock products. By default, warehouses can store infinitely many products unless STOCK_LIMIT is specified. 

3. **STOCK** SKU  WAREHOUSE#  QTY

  * Stocks QTY amount of product with SKU in WAREHOUSE# warehouse. If a store has a stock limit that will be exceeded by this shipment, stock is updated with enough products so that stock limit is fulfilled. 

4. **UNSTOCK**  SKU  WAREHOUSE#  QTY

  * Unstocks QTY amount of product with SKU in WAREHOUSE# warehouse. If a store has a stock that will go below 0 for a shipment the code only unstocks enough so that 0 qunatity of the product is left in the warehouse. 

5. **LIST PRODUCTS**

  * List all the products in the catalog. 

6. **LIST WAREHOUSES**

  * List all the warehouses. 


7. **LIST WAREHOUSE** WAREHOUSE#

  * List all the products stocked in the specified warehouse along with the quantity of each product. 


## Command History

All the commands issued in a session are stored in the `log.txt` file asynchronously (in batches of 2) i.e. If a user types in two commands we want those two to be in the same batch, if they type 3 commands, the first two are streamed and the system waits for the fourth command. 

## Example Session
<img src="Screenshot.png" height="500">

## To be done -
* Unit test cases to test individual function components. Sample test cases - 
  * Test case 1 - Function `addProduct()` in `services/Products.js` should not allow entry of products with same SKU. 
  * Test case 2 - Similarly, function `addWarehouse()` in `services/Products.js` should not allow entry of warehouse with same number.
  * Test case 3- Check if product added successfuly to the database (here stored in memory in array object)
  * Test case 4 - Check if warehouse added successfuly 
  * Test case 5 - Function `stockWarehouse` in `services/Inventory.js` should throw error if SKU or warehouse# not in data store. 
  . Test case 6 - `index.js` Commands intended in application exists. 
  .
  .
  and more....
  
 * Integration tests. Sample - 
    * Test case 1 - If cli is initialized correctly and accepts commands from the user.
    * Test case 2 - Command entered performs the intended action.
    .
    .
    and more....




