import Card from '../models/Card.js';
import List from '../models/List.js';
import { isBoardOwner } from '../utils/checkBoardOwnership.js';

const isListOwner = async (listId, userId) => {
  const list = await List.findById(listId);
  if (!list) return false;
  return isBoardOwner(list.board, userId);
};

export const createCard = async (req, res) => {
  try {
    const { title, description, list, position } = req.body;

    const owns = await isListOwner(list, req.user._id);
    if (!owns) return res.status(403).json({ message: 'Not authorized for this list' });

    const card = await Card.create({ title, description, list, position });
    res.status(201).json(card);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getCards = async (req, res) => {
  try {
    if (req.query.list) {
      const owns = await isListOwner(req.query.list, req.user._id);
      if (!owns) return res.status(403).json({ message: 'Not authorized for this list' });
    }

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

    const owns = await isListOwner(card.list, req.user._id);
    if (!owns) return res.status(403).json({ message: 'Not authorized for this card' });

    res.json(card);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ message: 'Card not found' });

    const owns = await isListOwner(card.list, req.user._id);
    if (!owns) return res.status(403).json({ message: 'Not authorized for this card' });

    Object.assign(card, req.body);
    await card.save();
    res.json(card);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ message: 'Card not found' });

    const owns = await isListOwner(card.list, req.user._id);
    if (!owns) return res.status(403).json({ message: 'Not authorized for this card' });

    await card.deleteOne();
    res.json({ message: 'Card deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
