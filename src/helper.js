//Helper functions - to format data displayed to the user
var Table = require('cli-table');

//Display products in the catalog in tabular format
exports.listProducts = function(products) {
	var productsTable = new Table({head:['Product Name','SKU']});
	products.forEach((product) => productsTable.push(Object.values(product)));
	return productsTable.toString();
}


//Display warehouses in tabular format
exports.listWarehouses = function(warehouses) {
	var warehousesTable = new Table({head:['Warehouse#']});
	warehouses.forEach((warehouse) => warehousesTable.push([warehouse.warehouseNo]));
	return  warehousesTable.toString();
}

//Display all products in warehouse in tabular format
exports.listWarehouseStock = function(warehouseStock) {
	var warehouseStockTable = new Table({head:['Product Name','SKU','QTY']});
	warehouseStock.forEach((stock) => warehouseStockTable.push([stock.name,stock.SKU,stock.QTY]));
	return warehouseStockTable.toString();
}
