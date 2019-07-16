const path = require('path')
const fs = require('fs')
const Product = require('./../models/product');
const Category = require('./../models/category');

exports.getProducts = async (req, res, next) => {
   try {
      const productId = req.body.productId;
      const product = await Product.findById(productId);
      res.status(200).json(product)
   } catch (err) {
      if (!err.statusCode) err.statusCode = 500;
      if (!err.message) err.message = 'Something Went Wrong';
      next(err)
   }
};

exports.postProduct = async (req, res, next) => {
   try {
      const name = req.body.name;
      const price = req.body.price;
      const description = req.body.description;
      const categoryId = req.body.categoryId;
      const show = req.body.show;
      const category = await Category.findById(categoryId);
      let imageUrl = '#';

      if (req.file) {
         imageUrl = req.file.path.replace("\\", "/");
      }

      if (!category._id) {
         const error = new Error('Category Not Found!');
         throw error
      }

      let newProduct = new Product({
         name: name,
         price: price,
         description: description,
         show: show,
         image: imageUrl,
         category: categoryId
      });
      newProduct = await newProduct.save();
      category.products.push(newProduct);
      await category.save();
      res.status(201).json(newProduct)
   } catch (err) {
      if (!err.statusCode) err.statusCode = 500;
      if (!err.message) err.message = 'Something Went Wrong';
      next(err)
   }
};

exports.putProduct = async (req, res, next) => {
   try {
      const productId = req.body.productId;
      const name = req.body.name;
      const price = req.body.price;
      const description = req.body.description;
      const show = req.body.show;
      let imageUrl = null;
      let product = await Product.findById(productId);

      if (!product) throw new Error('Product not found');

      if (req.file) {
         clearImage(product.image);
         imageUrl = req.file.path.replace("\\", "/");
      }

      product.name = name ? name : product.name;
      product.price = price ? price : product.price;
      product.description = description ? description : product.description;
      product.show = show ? show : product.show;
      product.image = imageUrl ? imageUrl : product.image;

      product = await product.save();

      res.status(201).json(product)
   } catch (err) {
      if (!err.statusCode) err.statusCode = 500;
      if (!err.message) err.message = 'Something Went Wrong.';
      next(err)
   }
};

exports.deleteProduct = async (req, res, next) => {
   try {
      const productId = req.params.id;
      const product = await Product.findById(productId);
      clearImage(product.image);
      await product.remove();
      res.status(200).json({message: 'Product successfully deleted.', success: true})
   } catch (err) {
      if (!err.statusCode) err.statusCode = 500;
      if (!err.message) err.message = 'Something Went Wrong.';
      next(err)
   }
};

const clearImage = filePath => {
   filePath = path.join(__dirname, '..', filePath);
   fs.unlink(filePath, err => console.log(err));
};

