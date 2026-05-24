const Farm = require('../models/Farm');

const createFarm = async (req, res, next) => {
  try {
    const { name, location, soilType, size } = req.body;
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const farm = await Farm.create({ userId, name, location, soilType, size });
    return res.status(201).json(farm);
  } catch (err) {
    return next(err);
  }
};

const getFarms = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const farms = await Farm.find({ userId });
    return res.json(farms);
  } catch (err) {
    return next(err);
  }
};

const getFarmById = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    const { id } = req.params;

    const farm = await Farm.findById(id);
    if (!farm) return res.status(404).json({ message: 'Farm not found' });
    if (farm.userId.toString() !== userId) return res.status(403).json({ message: 'Forbidden' });

    return res.json(farm);
  } catch (err) {
    return next(err);
  }
};

const updateFarm = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    const { id } = req.params;
    const updates = req.body;

    const farm = await Farm.findById(id);
    if (!farm) return res.status(404).json({ message: 'Farm not found' });
    if (farm.userId.toString() !== userId) return res.status(403).json({ message: 'Forbidden' });

    Object.assign(farm, updates);
    await farm.save();

    return res.json(farm);
  } catch (err) {
    return next(err);
  }
};

const deleteFarm = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    const { id } = req.params;

    const farm = await Farm.findById(id);
    if (!farm) return res.status(404).json({ message: 'Farm not found' });
    if (farm.userId.toString() !== userId) return res.status(403).json({ message: 'Forbidden' });

    await farm.deleteOne();
    return res.json({ message: 'Farm deleted' });
  } catch (err) {
    return next(err);
  }
};

module.exports = { createFarm, getFarms, getFarmById, updateFarm, deleteFarm };
