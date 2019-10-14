//Import custom modules
var { Warehouse } = require('./../models/Warehouse.js');
var { Warehouses } = require('./../data.js');

/**
 * @desc - Find if warehouse already exists.
 * @params - warehouseNo
 * @return - returns Warehouse object array {warehouseNo, STOCK_LIMIT}
**/
exports.findWarehouse = function(warehouseNo) {
	var warehouse = Warehouses.filter(warehouse => warehouse.warehouseNo === warehouseNo);
	return warehouse;
}

/**
 * @desc - Add new warehouse to inventory.
 * @params - warehouseNO, STOCK_LIMIT (Optional). If not specified, take infinity as default value. 
 * @return - Message if successfully added, else  throw error. 
**/
exports.addWarehouse = function(warehouseNo, STOCK_LIMIT = Infinity) {
    var warehouse = exports.findWarehouse(warehouseNo);
    
    if (!warehouse.length) {
    	var newWarehouse = new Warehouse(warehouseNo, STOCK_LIMIT);
    	Warehouses.push(newWarehouse);
    	return "Warehouse succesfully added!!";
    } else {
    	error = "Warehouse " + warehouseNo + " already exists.";
    	throw error;
    }
}	

/**
 * @desc - get all warehouses in the inventroy. 
 * @params - None
 * @return - array of warehouses [{warehouseNo, STOCK_LIMIT}]
**/
exports.getWarehouses = function() {
    return Warehouses;
}


