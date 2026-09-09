import express from 'express';
import {
  createCard,
  getCards,
  getCardById,
  updateCard,
  deleteCard,
} from '../controllers/cardControllers.js';

const router = express.Router();

router.post('/', createCard);
router.get('/', getCards);
router.get('/:id', getCardById);
router.put('/:id', updateCard);
router.delete('/:id', deleteCard);

export default router;
