import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';
import { BAD_REQUEST, CREATED, NOT_FOUND, OK } from '../constants/http';
import TicketTemplate from '../models/TemplateModel';
import path from 'path';
import fs from 'fs';

const getBaseUrl = (req: Request): string => `${req.protocol}://${req.get('host')}`;

export const createTemplate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description } = req.body;

    if (!req.file) {
      return next(new AppError(BAD_REQUEST, 'Gambar template wajib diunggah.'));
    }
    const baseUrl = getBaseUrl(req);
    const templateImagePath = `${baseUrl}/uploads/templateImage/${req.file.filename}`;

    const newTemplate = await TicketTemplate.create({
      name,
      description,
      templateImage: templateImagePath,
    });

    res.status(CREATED).json({
      status: 'success',
      data: newTemplate,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllTemplates = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const templates = await TicketTemplate.find({ status: 'active' });
    res.status(OK).json({
      status: 'success',
      count: templates.length,
      data: templates,
    });
  } catch (error) {
    next(error);
  }
};

export const getTemplateById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const template = await TicketTemplate.findById(req.params.id);

    if (!template) {
      return next(new AppError(NOT_FOUND, 'Template tidak ditemukan.'));
    }

    res.status(OK).json({
      status: 'success',
      data: template,
    });
  } catch (error) {
    next(error);
  }
};
