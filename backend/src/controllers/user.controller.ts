import { RequestHandler, Request, Response } from "express";
import UserModel from "../models/UserModel";
import appAssert from "../utils/appAssert";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from "../constants/http";
import AppErrorCode from "../constants/appErrorCode";
import path from "path";
// import { ConsultationModel } from "../models/consultationModel";
import mongoose from "mongoose";
