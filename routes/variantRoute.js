const { variantData } = require("../data/variantData");
const { productData } = require("../data/productData");
const {
  ERROR_MESSAGE,
  RESOLVE_MESSAGE,
} = require("../constants/message.constant");

function getVariants(req, res) {
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

    let variants = variantData;
    if (search) {
      variants = variants.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (order_by && sort_by) {
      variants = variants.sort((a, b) => {
        if (sort_by === "desc") {
          return b[order_by] - a[order_by];
        } else {
          return a[order_by] - b[order_by];
        }
      });
    }
    const startIndex = (page - 1) * size;
    const endIndex = page * size;
    const results = variants.slice(startIndex, endIndex);
    res.json({
      total: variants.length,
      page: +page,
      size: +size,
      variants: results,
    });
  }, res);
}

function getVariantById(req, res) {
  handleRequest(() => {
    const { id } = req.params;
    const variantById = variantData.find((item) => item.id === Number(id));
    if (!variantById) {
      res.status(404).json({ message: ERROR_MESSAGE.VARIANT_NOT_FOUND });
    }
    res.status(200).json(variantById);
  }, res);
}

function createVariant(req, res) {
  handleRequest(() => {
    const { productId, title, compareAtPrice, price, quantity } = req.body;

    // validate exist productId
    const productIndex = productData.findIndex(
      (item) => item.id === Number(productId)
    );
    if (productIndex === -1) {
      res.status(404).json({ message: ERROR_MESSAGE.PRODUCT_NOT_FOUND });
    }

    const variant = {
      id: Date.now(),
      productId,
      title,
      compareAtPrice,
      price,
      quantity,
    };
    variantData.push(variant);
    res.status(201).json(variant);
  }, res);
}

function updateVariant(req, res) {
  handleRequest(() => {
    const { id } = req.params;
    const { productId, title, compareAtPrice, price, quantity } = req.body;

    // validate exist productId
    const productIndex = productData.findIndex(
      (item) => item.id === Number(productId)
    );
    if (productIndex === -1) {
      res.status(404).json({ message: ERROR_MESSAGE.PRODUCT_NOT_FOUND });
    }

    const variantById = variantData.find((item) => item.id === Number(id));
    if (!variantById) {
      res.status(404).json({ message: ERROR_MESSAGE.VARIANT_NOT_FOUND });
    }
    variantById.productId = productId;
    variantById.title = title;
    variantById.compareAtPrice = compareAtPrice;
    variantById.price = price;
    variantById.quantity = quantity;
    res.status(200).json(variantById);
  }, res);
}

function deleteVariant(req, res) {
  handleRequest(() => {
    const { id } = req.params;
    const variantIndex = variantData.findIndex(
      (item) => item.id === Number(id)
    );
    if (variantIndex === -1) {
      res.status(404).json({ message: ERROR_MESSAGE.VARIANT_NOT_FOUND });
    }
    const variant = variantData.splice(variantIndex, 1);
    res.status(200).json({ message: RESOLVE_MESSAGE.DELETE_VARIANT_SUCCESS });
  }, res);
}

function deleteVariantsByProductId(productId) {
  const variantsByProductId = variantData.filter(
    (item) => item.productId === Number(productId)
  );
  if (variantsByProductId.length === 0) {
    return;
  }
  variantsByProductId.forEach((item) => {
    const variantIndex = variantData.findIndex(
      (variant) => variant.id === item.id
    );
    variantData.splice(variantIndex, 1);
  });
}

const handleRequest = (callBack, res) => {
  try {
    callBack();
  } catch (err) {
    res.status(400).json({
      message: ERROR_MESSAGE.SOMETHING_WENT_WRONG,
    });
  }
};

module.exports = {
  getVariants,
  getVariantById,
  createVariant,
  updateVariant,
  deleteVariant,
  deleteVariantsByProductId,
};
