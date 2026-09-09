import express from 'express';
import {
  createCard,
  getCards,
  getCardById,
  updateCard,
  deleteCard,
} from '../controllers/cardControllers.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createCard);
router.get('/', protect, getCards);
router.get('/:id', protect, getCardById);
router.put('/:id', protect, updateCard);
router.delete('/:id', protect, deleteCard);

export default router;
