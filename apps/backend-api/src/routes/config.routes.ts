import { Router } from 'express';
import { getCapabilities, testConnections } from '../controllers/config.controller';

const router = Router();

router.get('/capabilities', getCapabilities);
router.get('/test-connections', testConnections);

export default router;
