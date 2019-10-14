//Import custom modules
var Products = require('./../services/Products.js');
var Warehouses = require('./../services/Warehouses.js');
var { Inventory } = require('./../models/Inventory.js');
var { Stock } = require('./../data.js');

/**
 * @desc - Find if product with SKU already in stock in the warehouse
 * @params - SKU, warehouseNo
 * @return - Stock entry for corresponding SKU and warehouse
**/
const findSKUinWarehouse = function(SKU, warehouseNo) {
	var foundSKUinWarehouse = Stock.filter(stock => stock.SKU === SKU && stock.warehouseNo === warehouseNo);
	return foundSKUinWarehouse;
}


/**
 * @desc - Update quantity of product in the warehouse
 * @params - SKU, warehouseNo, QTY
**/
const updateQTYforSKUinWarehouse = function(SKU, warehouseNo, QTY) {
	//Find the index of stock entry from array to update quantity.
	const stockIndex = Stock.findIndex(stock => stock.SKU === SKU && stock.warehouseNo === warehouseNo);
	Stock[stockIndex].QTY = QTY;
}


/**
 * @desc - stock the product in the warehouse. 
           If already exists, update the quantity. If reaches stock_limit of the warehouse, then add quantity that satisfies warehouse limit. 
 * @params - SKU, warehouseNo, QTY
 * @return - Message if succesfully able to add, else throw error. 
**/
exports.stockWarehouse = function(SKU, warehouseNo, QTY) {
	var product = Products.findProduct(SKU);
	var warehouse = Warehouses.findWarehouse(warehouseNo);

	//Throw error message if either product or warehouse or both are not in the inventory. 
	if (!product.length && warehouse.length) {
		throw "Couldn't find product with SKU " + SKU + ".";
	} else if (product.length && !warehouse.length) {
		throw "Couldn't find warehouse " + warehouseNo + "."
	} else if (!product.length && !warehouse.length) {
		throw "Couldn't find product with SKU " + SKU + " and warehouse " + warehouseNo + "."
	}
	
	//Check if product with SKU already in stock in the warehouse. If exists, update stock quantity. Else, create new stock inventory and add. 
	var stockSKUinWarehouse = findSKUinWarehouse(SKU, warehouseNo);
	var warehouseLimit = warehouse[0].STOCK_LIMIT;

	if (!stockSKUinWarehouse.length) {
		if( QTY > warehouseLimit) {
			QTY = warehouseLimit;
		}
		var stockSKUinWarehouse = new Inventory(SKU, warehouseNo, QTY);
		Stock.push(stockSKUinWarehouse);
	} else {
		var updatedQTY = (stockSKUinWarehouse[0].QTY + QTY) < warehouseLimit ? (stockSKUinWarehouse[0].QTY + QTY) : warehouseLimit;
		updateQTYforSKUinWarehouse(SKU, warehouseNo, updatedQTY);
	}

	return "Successfully stocked the inventory.";
}


/**
 * @desc - unstock the product with given quantity from the warehouse. 
 		   If not sufficient quantity, then unstock whatever is available and set available quantity in stock to 0. 
 * @params - SKU, warehouseNo, QTY
 * @return - Message if succesfully able to unstock, else throw error. 
**/
exports.unstockWarehouse = function(SKU, warehouseNo, QTY) {
	var stockSKUinWarehouse = findSKUinWarehouse(SKU, warehouseNo);

	if (!stockSKUinWarehouse.length) {
		throw "Couldn't find product with SKU " + SKU + " and warehouse " + warehouseNo + " in the inventory.";
	}
	
	var updatedQTY = (stockSKUinWarehouse[0].QTY - QTY) > 0 ? (stockSKUinWarehouse[0].QTY - QTY) : 0;
	updateQTYforSKUinWarehouse(SKU, warehouseNo, updatedQTY);

	return "Successfully unstocked the inventory.";
}

/**
 * @desc - Get information about all the products (name, SKU) and their quantity in stock in the query warehouse. 
 * @params - warehouseNo
 * @return - Array of products where each product is an object {name, sku, quantity} 
**/
exports.getWarehouseStock = function(warehouseNo) {	
	var warehouseStock = Stock.filter(stock => stock.warehouseNo === warehouseNo);
	
	if (!warehouseStock.length) {
		throw "Couldn't find any stock information for warehouse " + warehouseNo;
	}

	var products = Products.getProducts();

	//Map each product in warehouseStock with product in the products catalog with same SKU and return name, sku, quantity for each product. 
	var warehouseStockwithProductNames = warehouseStock.map((stock) => {
		var haveSameSKU = (product) => product.SKU === stock.SKU;
		var productWithSKU = products.find(haveSameSKU)
		var stockWithProductName = Object.assign({}, stock,  productWithSKU)
  		delete stockWithProductName.warehouseNo; 	

  		return stockWithProductName;
  	}); 

  	return warehouseStockwithProductNames;
}

