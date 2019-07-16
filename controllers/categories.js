const path = require('path');
const fs = require('fs');

const Category = require('./../models/category');
const Product = require('./../models/product');

exports.getCategories = async (req, res, next) => {
   try {
      const categories = await Category.find({user: req.userId}).populate('products');
      res.status(200).json(categories)
   } catch (err) {
      if (!err.statusCode) err.statusCode = 500;
      if (!err.message) err.message = 'Something Went Wrong';
      next(err)
   }
};

exports.postCategory = async (req, res, next) => {
   try {
      const name = req.body.name;
      const userId = req.userId;
      let newCategory = new Category({
         name: name,
         user: userId,
         products: []
      });
      newCategory = await newCategory.save();
      res.status(201).json(newCategory)
   } catch (err) {
      if (!err.statusCode) err.statusCode = 500;
      if (!err.message) err.message = 'Something Went Wrong';
      next(err)
   }

};

exports.putCategory = async (req, res, next) => {
   try {
      const categoryId = req.params.id;
      const name = req.body.name;
      const category = await Category.findById(categoryId);
      category.name = name ? name : category.name;
      const savedCategory = await category.save();
      res.status(202).json(savedCategory);
   } catch (err) {
      if (!err.statusCode) err.statusCode = 500;
      if (!err.message) err.message = 'Something Went Wrong';
      next(err)
   }
};

exports.deleteCategory = async (req, res, next) => {
   try {
      const categoryId = req.params.id;
      const category = await Category.findById(categoryId);
      if(category.products.length > 0) {
         category.products.forEach(async elem => {
            let prod = await Product.findById(elem)
            clearImage(prod.image)
            prod = await prod.remove()
         });
      }
      await category.remove();
      res.status(200).json({message: 'Category sucessfully removed.'})
   } catch (err) {
      if (!err.statusCode) err.statusCode = 500;
      if (!err.message) err.message = 'Something Went Wrong';
      next(err)
   }
};

const clearImage = filePath => {
   if(!filePath) return
   filePath = path.join(__dirname, '..', filePath);
   fs.unlink(filePath, err => console.log(err));
};