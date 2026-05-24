const Crop = require('../models/Crop');
const Farm = require('../models/Farm');

const createCrop = async (req, res, next) => {
  try {
    const { farmId, cropName, season, sowingDate, status } = req.body;
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const farm = await Farm.findById(farmId);
    if (!farm) return res.status(404).json({ message: 'Farm not found' });
    if (farm.userId.toString() !== userId) return res.status(403).json({ message: 'Forbidden' });

    const crop = await Crop.create({ farmId, cropName, season, sowingDate, status });
    return res.status(201).json(crop);
  } catch (err) {
    return next(err);
  }
};

const getCropsByFarm = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    const { farmId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const farm = await Farm.findById(farmId);
    if (!farm) return res.status(404).json({ message: 'Farm not found' });
    if (farm.userId.toString() !== userId) return res.status(403).json({ message: 'Forbidden' });

    const crops = await Crop.find({ farmId });
    return res.json(crops);
  } catch (err) {
    return next(err);
  }
};

const updateCrop = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    const { id } = req.params;
    const updates = req.body;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const crop = await Crop.findById(id);
    if (!crop) return res.status(404).json({ message: 'Crop not found' });

    const farm = await Farm.findById(crop.farmId);
    if (!farm) return res.status(404).json({ message: 'Farm not found' });
    if (farm.userId.toString() !== userId) return res.status(403).json({ message: 'Forbidden' });

    Object.assign(crop, updates);
    await crop.save();
    return res.json(crop);
  } catch (err) {
    return next(err);
  }
};

const deleteCrop = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    const { id } = req.params;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const crop = await Crop.findById(id);
    if (!crop) return res.status(404).json({ message: 'Crop not found' });

    const farm = await Farm.findById(crop.farmId);
    if (!farm) return res.status(404).json({ message: 'Farm not found' });
    if (farm.userId.toString() !== userId) return res.status(403).json({ message: 'Forbidden' });

    await crop.deleteOne();
    return res.json({ message: 'Crop deleted' });
  } catch (err) {
    return next(err);
  }
};

module.exports = { createCrop, getCropsByFarm, updateCrop, deleteCrop };
