import Board from '../models/Board.js';
import Card from '../models/Card.js';
import List from '../models/List.js';

export const createBoard = async (req, res) => {
  try {
    const board = await Board.create({ title: req.body.title, user: req.user._id });
    res.status(201).json(board);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getBoards = async (req, res) => {
  try {
    const boards = await Board.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(boards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBoardById = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: 'Board not found' });
    if (board.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this board' });
    }
    res.json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: 'Board not found' });
    if (board.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this board' });
    }
    board.title = req.body.title || board.title;
    await board.save();
    res.json(board);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: 'Board not found' });
    if (board.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this board' });
    }
    const lists = await List.find({ board: board._id });
    const listIds = lists.map((list) => list._id);
    await Card.deleteMany({ list: { $in: listIds } });
    await List.deleteMany({ board: board._id });
    await board.deleteOne();
    res.json({ message: 'Board deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
