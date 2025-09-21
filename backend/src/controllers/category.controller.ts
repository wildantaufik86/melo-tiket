import { RequestHandler } from 'express';
import CategoryModel from '../models/CategoryModel';
import { ICategory } from '../types/Category';
import mongoose from 'mongoose';
import appAssert from '../utils/appAssert';
import { BAD_REQUEST, FORBIDDEN, NOT_FOUND, OK } from '../constants/http';

export const getCategories: RequestHandler = async (req, res) => {
  try {
    const categories = await CategoryModel.find({});
    res.status(200).json({ status: 'success', message: 'Category successfully retrieved.', data: categories });
  } catch (error: any) {
    console.error('Error getting categories:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Failed to retrieve category.' });
  }
};

export const getCategoryById: RequestHandler = async (req, res) => {
  try {
    const category = await CategoryModel.findById(req.params.id);
    if (!category) {
      res.status(404).json({ message: 'Category not found.' });
      return;
    }
    res.status(200).json({ status: 'success', message: 'Category successfully retrieved.', data: category });
  } catch (error: any) {
    console.error('Error getting category by ID:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Failed to retrieve category..' });
  }
};

export const createCategory: RequestHandler = async (req, res) => {
  try {
    const newCategory: ICategory = req.body;
    const createdCategory = await CategoryModel.create(newCategory);
    res.status(201).json({ status: 'success', message: 'Category successfully created.', data: createdCategory });
  } catch (error: any) {
    console.error('Error membuat kategori:', error);
    if (error.code === 11000) {
      res.status(409).json({ status: 'error', message: 'The category name or slug already exists.' });
      return;
    }
    res.status(500).json({ status: 'error', message: error.message || 'Failed to create category.' });
  }
};

export const updateCategory: RequestHandler = async (req, res) => {
  try {
    const updatedCategoryData: ICategory = req.body;
    const category = await CategoryModel.findByIdAndUpdate(req.params.id, updatedCategoryData, { new: true, runValidators: true });

    if (category?.deletedAt) {
      res.status(FORBIDDEN).json({
        message: "This category cannoy be update, because the category has been deleted"
      })
      return;
    }

    if (!category) {
      res.status(404).json({ message: 'Category not found to update.' });
      return;
    }
    res.status(200).json({ status: 'success', message: 'Category successfully updated.', data: category });
  } catch (error: any) {
    console.error('Error updating category:', error);
    if (error.code === 11000) {
      res.status(409).json({ status: 'error', message: 'The category name or slug already exists.' });
      return;
    }
    res.status(500).json({ status: 'error', message: error.message || 'Failed to update category.' });
  }
};

export const deleteCategory: RequestHandler = async (req, res) => {
  try {
    const result = await CategoryModel.findByIdAndDelete(req.params.id);
    if (!result) {
      res.status(404).json({ message: 'Category not found to be deleted.' });
      return;
    }
    res.status(200).json({ status: 'success', message: 'Category successfully deleted.' });
  } catch (error: any) {
    console.error('Error deleting category:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Failed to delete category.' });
  }
};

export const softDeleteCategoryHandler: RequestHandler = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { categoryId } = req.params;

    const category = await CategoryModel.findById(categoryId).session(session);

    appAssert(category, NOT_FOUND, "Category not found");
    appAssert(category.deletedAt === null, BAD_REQUEST, "This category has already been deleted.");

    category.deletedAt = new Date();
    await category.save({ session });

    await session.commitTransaction();

    res.status(OK).json({
      message: "Category has been successfully soft-deleted.",
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};
