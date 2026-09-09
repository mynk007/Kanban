import Board from '../models/Board.js';

export const createBoard = async (req, res) => {
  console.log(req, "bbbbbbbbbbbb")
  try {
    const board = await Board.create({ title: req.body.title });
    res.status(201).json(board);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getBoards = async (req, res) => {
  try {
    const boards = await Board.find().sort({ createdAt: -1 });
    res.json(boards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBoardById = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: 'Board not found' });
    res.json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateBoard = async (req, res) => {
  try {
    const board = await Board.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title },
      { new: true, runValidators: true }
    );
    if (!board) return res.status(404).json({ message: 'Board not found' });
    res.json(board);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteBoard = async (req, res) => {
  try {
    const board = await Board.findByIdAndDelete(req.params.id);
    if (!board) return res.status(404).json({ message: 'Board not found' });
    res.json({ message: 'Board deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
