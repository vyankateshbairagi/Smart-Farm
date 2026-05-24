const mongoose = require('mongoose');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sendBadRequest = (res, message) => res.status(400).json({ message });

const validateObjectIdParam = (paramName) => (req, res, next) => {
  const value = req.params[paramName];
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return sendBadRequest(res, `Invalid ${paramName}`);
  }
  return next();
};

const validateRegisterInput = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !String(name).trim()) {
    return sendBadRequest(res, 'Name is required');
  }
  if (!email || !String(email).trim()) {
    return sendBadRequest(res, 'Email is required');
  }
  if (!emailRegex.test(String(email).trim())) {
    return sendBadRequest(res, 'Enter a valid email');
  }
  if (!password || typeof password !== 'string') {
    return sendBadRequest(res, 'Password is required');
  }
  if (password.length < 8) {
    return sendBadRequest(res, 'Password must be at least 8 characters');
  }

  req.body.name = String(name).trim();
  req.body.email = String(email).trim().toLowerCase();
  return next();
};

const validateLoginInput = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !String(email).trim()) {
    return sendBadRequest(res, 'Email is required');
  }
  if (!emailRegex.test(String(email).trim())) {
    return sendBadRequest(res, 'Enter a valid email');
  }
  if (!password || typeof password !== 'string') {
    return sendBadRequest(res, 'Password is required');
  }

  req.body.email = String(email).trim().toLowerCase();
  return next();
};

const validateFarmCreateInput = (req, res, next) => {
  const { name, location, soilType, size } = req.body;

  if (!name || !String(name).trim()) {
    return sendBadRequest(res, 'Farm name is required');
  }
  if (size !== undefined && size !== null && size !== '') {
    const numericSize = Number(size);
    if (Number.isNaN(numericSize) || numericSize < 0) {
      return sendBadRequest(res, 'Farm size must be a non-negative number');
    }
    req.body.size = numericSize;
  }

  req.body.name = String(name).trim();
  if (location !== undefined) req.body.location = String(location).trim();
  if (soilType !== undefined) req.body.soilType = String(soilType).trim();
  return next();
};

const validateFarmUpdateInput = (req, res, next) => {
  const allowed = ['name', 'location', 'soilType', 'size'];
  const keys = Object.keys(req.body || {});

  if (keys.length === 0) {
    return sendBadRequest(res, 'At least one field is required for update');
  }
  if (keys.some((key) => !allowed.includes(key))) {
    return sendBadRequest(res, 'Invalid field in farm update payload');
  }
  if (req.body.size !== undefined) {
    const numericSize = Number(req.body.size);
    if (Number.isNaN(numericSize) || numericSize < 0) {
      return sendBadRequest(res, 'Farm size must be a non-negative number');
    }
    req.body.size = numericSize;
  }
  if (req.body.name !== undefined && !String(req.body.name).trim()) {
    return sendBadRequest(res, 'Farm name cannot be empty');
  }

  if (req.body.name !== undefined) req.body.name = String(req.body.name).trim();
  if (req.body.location !== undefined) req.body.location = String(req.body.location).trim();
  if (req.body.soilType !== undefined) req.body.soilType = String(req.body.soilType).trim();
  return next();
};

const validateCropCreateInput = (req, res, next) => {
  const { farmId, cropName, season, sowingDate, status } = req.body;

  if (!farmId || !mongoose.Types.ObjectId.isValid(farmId)) {
    return sendBadRequest(res, 'Valid farmId is required');
  }
  if (!cropName || !String(cropName).trim()) {
    return sendBadRequest(res, 'cropName is required');
  }
  if (sowingDate !== undefined && sowingDate !== null && sowingDate !== '') {
    const date = new Date(sowingDate);
    if (Number.isNaN(date.getTime())) {
      return sendBadRequest(res, 'sowingDate must be a valid date');
    }
  }

  req.body.farmId = String(farmId);
  req.body.cropName = String(cropName).trim();
  if (season !== undefined) req.body.season = String(season).trim();
  if (status !== undefined) req.body.status = String(status).trim();
  return next();
};

const validateCropUpdateInput = (req, res, next) => {
  const allowed = ['cropName', 'season', 'sowingDate', 'status'];
  const keys = Object.keys(req.body || {});

  if (keys.length === 0) {
    return sendBadRequest(res, 'At least one field is required for update');
  }
  if (keys.some((key) => !allowed.includes(key))) {
    return sendBadRequest(res, 'Invalid field in crop update payload');
  }
  if (req.body.cropName !== undefined && !String(req.body.cropName).trim()) {
    return sendBadRequest(res, 'cropName cannot be empty');
  }
  if (req.body.sowingDate !== undefined && req.body.sowingDate !== null && req.body.sowingDate !== '') {
    const date = new Date(req.body.sowingDate);
    if (Number.isNaN(date.getTime())) {
      return sendBadRequest(res, 'sowingDate must be a valid date');
    }
  }

  if (req.body.cropName !== undefined) req.body.cropName = String(req.body.cropName).trim();
  if (req.body.season !== undefined) req.body.season = String(req.body.season).trim();
  if (req.body.status !== undefined) req.body.status = String(req.body.status).trim();
  return next();
};

const validateIrrigationInput = (req, res, next) => {
  const { soilType, temperature, humidity, rainProbability } = req.body;

  if (!soilType || !String(soilType).trim()) {
    return sendBadRequest(res, 'soilType is required');
  }

  const temp = Number(temperature);
  const hum = Number(humidity);
  const rain = Number(rainProbability);

  if ([temp, hum, rain].some((val) => Number.isNaN(val))) {
    return sendBadRequest(res, 'temperature, humidity and rainProbability must be valid numbers');
  }
  if (hum < 0 || hum > 100 || rain < 0 || rain > 100) {
    return sendBadRequest(res, 'humidity and rainProbability must be between 0 and 100');
  }

  req.body.soilType = String(soilType).trim();
  req.body.temperature = temp;
  req.body.humidity = hum;
  req.body.rainProbability = rain;
  return next();
};

module.exports = {
  validateObjectIdParam,
  validateRegisterInput,
  validateLoginInput,
  validateFarmCreateInput,
  validateFarmUpdateInput,
  validateCropCreateInput,
  validateCropUpdateInput,
  validateIrrigationInput,
};
