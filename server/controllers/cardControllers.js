import Card from '../models/Card.js';

export const createCard = async (req, res) => {
  try {
    const { title, description, list, position } = req.body;
    const card = await Card.create({ title, description, list, position });
    res.status(201).json(card);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getCards = async (req, res) => {
  try {
    const filter = req.query.list ? { list: req.query.list } : {};
    const cards = await Card.find(filter).sort({ position: 1 });
    res.json(cards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCardById = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ message: 'Card not found' });
    res.json(card);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!card) return res.status(404).json({ message: 'Card not found' });
    res.json(card);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.id);
    if (!card) return res.status(404).json({ message: 'Card not found' });
    res.json({ message: 'Card deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
