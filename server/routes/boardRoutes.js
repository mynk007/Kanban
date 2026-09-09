import express from 'express';
import { createBoard, deleteBoard, getBoardById, getBoards, updateBoard } from '../controllers/boardController.js';
import { protect } from '../middleware/authMiddleware.js';


const router = express.Router();

router.post('/', protect, createBoard);
router.get('/', protect, getBoards);
router.get('/:id', protect, getBoardById);
router.put('/:id', protect, updateBoard);
router.delete('/:id', protect, deleteBoard);

export default router;
