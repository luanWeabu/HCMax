const bcrypt = require("bcrypt");
const { productData } = require("../data/productData");
const { categoryData } = require("../data/categoryData");
const { format } = require("date-fns");
const { generateTimestamp } = require("../datetime/datetime");

function getProducts(req, res) {
  handleRequest(() => {
    let { page, size, order_by, sort_by, search } = req.query;
    // validate params
    if (!page) {
      page = 1;
    }
    if (!size) {
      size = 10;
    }
    if (!order_by) {
      order_by = "id";
    }
    if (!sort_by) {
      sort_by = "asc";
    }

    let products = productData;
    if (search) {
      products = products.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (order_by && sort_by) {
      products = products.sort((a, b) => {
        if (sort_by === "desc") {
          return b[order_by] - a[order_by];
        } else {
          return a[order_by] - b[order_by];
        }
      });
    }
    const startIndex = (page - 1) * size;
    const endIndex = page * size;
    const results = products.slice(startIndex, endIndex);
    res.status(200).json({
      total: products.length,
      page: +page,
      size: +size,
      products: results,
    });
  }, res);
}

function getProductById(req, res) {
  handleRequest(() => {
    const { id } = req.params;
    const productById = productData.find((item) => item.id === Number(id));
    if (!productById) {
      res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(productById);
  }, res);
}

function createProduct(req, res) {
  handleRequest(() => {
    const { name, categoryId } = req.body;
    // validate categoryId
    const categoryIndex = categoryData.findIndex(
      (item) => item.id === categoryId
    );
    if (categoryIndex === -1) {
      res.status(404).json({ message: "Category not found" });
    }

    const id = Date.now();
    const product = {
      id,
      name,
      categoryId,
    };
    productData.push(product);
    res.status(200).json(product);
  }, res);
}

function updateProductById(req, res) {
  handleRequest(() => {
    const { id } = req.params;
    const { name, categoryId } = req.body;

    // validate categoryId
    const categoryIndex = categoryData.findIndex(
      (item) => item.id === categoryId
    );
    if (categoryIndex === -1) {
      res.status(404).json({ message: "Category not found" });
    }

    // validate productId
    const productIndex = productData.findIndex(
      (item) => item.id === Number(id)
    );
    if (productIndex === -1) {
      res.status(404).json({ message: "Product not found" });
    }

    const timestamp = generateTimestamp();
    const formattedDate = format(timestamp, "yyyy-MM-dd'T'HH:mm:ss");
    productData[productIndex] = {
      ...productData[productIndex],
      name,
      categoryId,
      updatedAt: formattedDate,
    };
    res.status(200).json({ productData });
  }, res);
}

function deleteProductById(req, res) {
  handleRequest(() => {
    const { id } = req.params;
    const productIndex = productData.findIndex(
      (item) => item.id === Number(id)
    );
    if (productIndex === -1) {
      res.status(404).json({ message: "Product not found" });
    }
    productData.splice(productIndex, 1);
    res.status(200).json({ message: "Delete Successfully" });
  }, res);
}

const handleRequest = (callBack, res) => {
  try {
    callBack();
  } catch (err) {
    res.status(400).json({
      message: "Something went wrong",
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
};
