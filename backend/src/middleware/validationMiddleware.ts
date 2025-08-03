import { RequestHandler } from 'express';
import { BAD_REQUEST } from '../constants/http';
import { ZodObject } from 'zod';

const validate = (schema: ZodObject): RequestHandler => async (req, res, next) => {
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    } catch (error) {
        res.status(BAD_REQUEST).json(error);
    }
};

export default validate;
