import express from 'express';
import {
  createList,
  getLists,
  getListById,
  updateList,
  deleteList,
} from '../controllers/listControllers.js';

const router = express.Router();

router.post('/', createList);
router.get('/', getLists);
router.get('/:id', getListById);
router.put('/:id', updateList);
router.delete('/:id', deleteList);

export default router;
