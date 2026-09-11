import List from '../models/List.js';
import { isBoardOwner } from '../utils/checkBoardOwnership.js';


export const createList = async (req, res) => {
  try {
    const { title, board, position } = req.body;
    const owns = await isBoardOwner(board, req.user._id);
    if (!owns) {
      return res.status(403).json({ message: 'Not authorized to create list for this board' });
    }
    const list = await List.create({ title, board, position });
    res.status(201).json(list);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getLists = async (req, res) => {
  try {
    if (req.query.board) {
      const owns = await isBoardOwner(req.query.board, req.user._id);
      if (!owns) return res.status(403).json({ message: 'Not authorized for this board' });
    }
    const filter = req.query.board ? { board: req.query.board } : {};
    const lists = await List.find(filter).sort({ position: 1 });
    res.json(lists);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getListById = async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) return res.status(404).json({ message: 'List not found' });
    const owns = await isBoardOwner(list.board, req.user._id);
    if (!owns) return res.status(403).json({ message: 'Not authorized for this board' });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateList = async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) return res.status(404).json({ message: 'List not found' });
    const owns = await isBoardOwner(list.board, req.user._id);
    if (!owns) return res.status(403).json({ message: 'Not authorized for this list' });

    Object.assign(list, req.body);
    await list.save();
    res.json(list);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteList = async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) return res.status(404).json({ message: 'List not found' });

    const owns = await isBoardOwner(list.board, req.user._id);
    if (!owns) return res.status(403).json({ message: 'Not authorized for this list' });

    await list.deleteOne();
    res.json({ message: 'List deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
