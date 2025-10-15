import Product from '../models/products.model.js';



// CREATE
export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body)    
    res.status(201).json({ success: true, product })
  } catch (error) {
    next(error);
  }
};

// READ (ALL)
export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

// READ (SINGLE)
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// UPDATE
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// DELETE
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    next(error);
  }
};
