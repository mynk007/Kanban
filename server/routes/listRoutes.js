import express from 'express';
import {
  createList,
  getLists,
  getListById,
  updateList,
  deleteList,
} from '../controllers/listControllers.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createList);
router.get('/', protect, getLists);
router.get('/:id', protect, getListById);
router.put('/:id', protect, updateList);
router.delete('/:id', protect, deleteList);

export default router;
