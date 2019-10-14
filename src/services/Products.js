//Import custom modules
var { Product } = require('./../models/Product.js');
var { Products } = require('./../data.js');

/**
 * @desc - Find if product with SKU exists in the catalog. 
 * @params - SKU
 * @return - returns product object {name, sku}
**/
exports.findProduct = function(SKU) {
	var product = Products.filter(product => product.SKU === SKU);
	return product;
}

/**
 * @desc - Add new product to catalog.
 * @params - productName, SKU
 * @return - Message if successfully added, else  throw error. 
**/
exports.addProduct = function(productName, SKU) {
	var product = exports.findProduct(SKU);
    
    if (!product.length) {
    	var newProduct = new Product(productName, SKU);
    	Products.push(newProduct);
    	return "Product succesfully added!!";
    } else {
    	error = "Product with SKU " + SKU + " already exists.";
    	throw error;
    }
}

/**
 * @desc - get all products in the catalog. 
 * @params - None
 * @return - array of products [{name, sku}]
**/
exports.getProducts = function() {
    return Products;
}


