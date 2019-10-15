//Import library
var vorpal = require('vorpal')()
var fs = require('fs');

// Import custom modules - Services available to manage the inventory
var Products = require('./services/Products.js')
var Warehouses = require('./services/Warehouses.js')
var Inventory = require('./services/Inventory.js')

//Helper module for input and output data
var Helper = require('./helper.js');

//Cache command history
const LOG_BATCH_SIZE = 2;
var cmdHistory = [];
var stream = fs.createWriteStream('log.txt')
			   .on('error', function(err) {
			   		vorpal.log('Error writing to file. ' + err.stack);
			   });
var writeToStream = true;

//Initialize CLI with custom delimiter and welcome message
vorpal
	.delimiter('>')
	.show()
	.log('*********************************************************')
	.log('      Welcome to Product Inventory Management System     ')
	.log('*********************************************************')
	.log('\n    ---> Type "help" to see what you can do!! <---   \n');


//Define all commands available for the user to interact with the system


/**
 * @desc Command to add a new product with "Product Name" and SKU to product catalog
 * @usage ADD PRODUCT <ProductName> <SKU> 
**/
vorpal
	.command('ADD PRODUCT <ProductName> <SKU>','Add new product to the catalog.')
	.action(function(args, callback) {
		try {
			Products.addProduct(args.ProductName, args.SKU);
		} catch(error) {
			this.log(error);
		} finally {
			callback();
		}
	});


/**
 * @desc Command to add a new warehouse with Warehouse# and optional STOCK_LIMIT
 * @usage ADD PRODUCT <ProductName> [STOCK_LIMIT]
**/
vorpal
	.command('ADD WAREHOUSE <WarehouseNo> [STOCK_LIMIT]','Add new warehouse (positive ingteger) with optional stock_limit (positive integer)')
	.validate(function (args) {
		if (Number.isInteger(args.WarehouseNo) && (!args.STOCK_LIMIT || Number.isInteger(args.STOCK_LIMIT))) {
			return true;
		} else {
			return 'Invalid input - must be integer!\n\nUsage: ADD WAREHOUSE <Warehouse#> [STOCK_LIMIT]\n';
		}
	})
	.action(function(args, callback) {
		try {
			Warehouses.addWarehouse(args.WarehouseNo, args.STOCK_LIMIT);
		} catch(error) {
			this.log(error);
		} finally {
			callback();
		}
	});


/**
 * @desc Command to stock QTY amount of product with SKU in WAREHOUSE# warehouse
 * @usage STOCK <SKU> <Warehouse#> <QTY>
**/
vorpal
	.command('STOCK <SKU> <WarehouseNo> <QTY>', 'Stocks QTY amount of product with SKU in Warehouse# warehouse')
	.allowUnknownOptions(true)
	.validate(function (args) {
		if (Number.isInteger(args.WarehouseNo) && Number.isInteger(args.QTY)) {
			return true;
		} else {
			return 'Invalid input - Warehouse# and QTY must be integer!\n\nUsage: STOCK <SKU> <Warehouse#> <QTY>\n';
		}
	})
	.action(function(args, callback) {
	    try {
			Inventory.stockWarehouse(args.SKU, args.WarehouseNo, args.QTY);
		} catch(error) {
			this.log(error);
		} finally {
			callback();
		}	
	});


/**
 * @desc Command to unstock QTY amount of product with SKU in WAREHOUSE# warehouse
 * @usage UNSTOCK <SKU> <Warehouse#> <QTY>
**/
vorpal
	.command('UNSTOCK <SKU> <WarehouseNo> <QTY>','Unstocks QTY amount of product with SKU in Warehouse# warehouse')
	.validate(function (args) {
		if (Number.isInteger(args.WarehouseNo) && Number.isInteger(args.QTY)) {
			return true;
		} else {
			return 'Invalid input - Warehouse# and QTY must be positive integer!\n\nUsage: UNSTOCK <SKU> <Warehouse#> <QTY>\n';
		}
	})
	.action(function(args, callback) {
	    try {
			Inventory.unstockWarehouse(args.SKU, args.WarehouseNo, args.QTY);
		} catch(error) {
			this.log(error);
		} finally {
			callback();
		}	
	});


/**
 * @desc Command to list all products in the product catalog
 * @usage LIST PRODUCTS
**/
vorpal
	.command('LIST PRODUCTS','List all products in the catalog')
	.action(function(args, callback) {
	    try {
			products = Products.getProducts();
			this.log(Helper.listProducts(products));
		} catch(error) {
			this.log(error);
		} finally {
			callback();
		}	
	});


/**
 * @desc Command to list all warehouses
 * @usage LIST WAREHOUSES
**/
 vorpal
 	.command('LIST WAREHOUSES','List all warehouses')
 	.action(function(args, callback) {
	    try {
			warehouses = Warehouses.getWarehouses();
			this.log(Helper.listWarehouses(warehouses));
		} catch(error) {
			this.log(error);
		} finally {
			callback();
		} 	
	});


/**
 * @desc Command to list information about the warehouse with the given warehouse# 
 *		 along with a listing of all product stocked in the warehouse
 * @usage LIST WAREHOUSE <WAREHOUSE#>
**/
vorpal
	.command('LIST WAREHOUSE <WarehouseNo>','List warehouse information along with list of all products stocked in it')
	.validate(function (args) {
		if (Number.isInteger(args.WarehouseNo)) {
			return true;
		} else {
			return 'Invalid input - Warehouse# must be positive integer!\n\nUsage: LIST WAREHOUSE <WAREHOUSENo>\n';
		}
	})
	.action(function(args, callback) {
	    try {
			warehouseStock = Inventory.getWarehouseStock(args.WarehouseNo);
			this.log(Helper.listWarehouseStock(warehouseStock));
		} catch(error) {
			this.log(error);
		} finally {
			callback();
		}	
	});


/**
 * @desc Command to close the current CLI session
 * @usage EOF
**/
vorpal
    .command('EOF','Closes the current session')
    .action(function(args, callback) {
		this.log('*********************************************************');
		this.log('                      Goodbye !!!!                       ');
		this.log('*********************************************************');
      	vorpal.ui.cancel();
      	stream.end(JSON.stringify(cmdHistory,null,'\t'));
    });

//Catch all invalid commands and display the message.
vorpal
	.catch('[words...]', 'Catches incorrect commands')
	.action(function (args, callback) {
		this.log(args.words.join(' ') + ' is not a valid command.');
		this.log('\n Type "help" to see all available commands and their usage.\n');
		callback();
	});

vorpal.on('client_prompt_submit',function(value) {
	value = new Date().toJSON() + '      ' + value;
	cmdHistory.push(value);
	
	if(writeToStream && cmdHistory.length > LOG_BATCH_SIZE) {
		var dataChunk = [];
		for (var i = 0; i < LOG_BATCH_SIZE; i++) {
			var data = cmdHistory.shift()
			dataChunk.push(data);
		}

		stream.write(JSON.stringify(dataChunk,null,'\t') + '\n');
	}	
});

//Make write stream flag true for stream to be ready for use 
stream.on('drain', () => {
	writeToStream = true;
});


//Remove in-built exit command
const exit = vorpal.find('exit');
if (exit) {
	exit.remove();
} 