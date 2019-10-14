//Define Inventory object for storing stock information
exports.Inventory = function(SKU, warehouseNo, QTY) {
	this.SKU = SKU;
	this.warehouseNo = warehouseNo;
	this.QTY = QTY;
}