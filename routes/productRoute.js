const bcrypt = require("bcrypt");
const { productData } = require("../data/productData");
const { format } = require("date-fns");
const { generateTimestamp } = require("../datetime/datetime");

function getProductById(req, res) {
  try {
    const { id } = req.params;
    const productById = productData.find((item) => item.id === Number(id));
    res.status(200).json(productById);
  } catch (error) {
    res.status(500).send(error);
  }
}
function createProduct(req, res) {
  try {
    const { name, categoryId } = req.body;
    const timestamp = generateTimestamp();
    const formattedDate = format(timestamp, "yyyy-MM-dd'T'HH:mm:ss");
    const id = Date.now();
    const product = {
      id,
      name,
      categoryId,
      createdAt: formattedDate,
      updatedAt: formattedDate,
    };
    productData.push(product);
    res.status(200).json({ message: "Create Succeffully", product });
  } catch (error) {
    res.status(500).send(error);
  }
}
module.exports = { getProductById, createProduct };
