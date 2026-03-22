import { Router } from 'express';
import { getCapabilities } from '../controllers/config.controller';

const router = Router();

router.get('/capabilities', getCapabilities);

export default router;
