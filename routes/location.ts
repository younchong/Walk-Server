import express from 'express';
import { getAroundSignalInformation } from './controllers/location.controller';

const router = express.Router();

router.post("/", getAroundSignalInformation);

export default router;
