import { Router } from 'express';
import multer from 'multer';
import {
  createJob,
  downloadJson,
  downloadResult,
  getJob
} from '../controllers/jobs.controller';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('file'), createJob);
router.get('/:jobId', getJob);
router.get('/:jobId/result', downloadResult);
router.get('/:jobId/json', downloadJson);

export default router;
