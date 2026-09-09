import List from '../models/List.js';

export const createList = async (req, res) => {
  try {
    const { title, board, position } = req.body;
    const list = await List.create({ title, board, position });
    res.status(201).json(list);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getLists = async (req, res) => {
  try {
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
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateList = async (req, res) => {
  try {
    const list = await List.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!list) return res.status(404).json({ message: 'List not found' });
    res.json(list);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteList = async (req, res) => {
  try {
    const list = await List.findByIdAndDelete(req.params.id);
    if (!list) return res.status(404).json({ message: 'List not found' });
    res.json({ message: 'List deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
