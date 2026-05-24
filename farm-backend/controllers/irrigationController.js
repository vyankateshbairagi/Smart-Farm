const recommend = (req, res, next) => {
  try {
    const { soilType, temperature, humidity, rainProbability } = req.body;

    const soil = String(soilType).toLowerCase();
    const temp = Number(temperature);
    const hum = Number(humidity);
    const rain = Number(rainProbability);

    // High rain probability overrides other rules
    if (rain >= 70) {
      return res.json({ recommendation: 'skip_watering', reason: 'High probability of rain', suggestion: 'Do not irrigate now' });
    }

    // Basic rule scoring
    let recommendation = 'normal_watering';
    let reason = 'Default conditions';
    let suggestion = 'Irrigate as per schedule (every 2-3 days)';

    if (soil === 'sandy') {
      if (temp >= 30 || hum < 30) {
        recommendation = 'frequent_watering';
        reason = 'Sandy soil with high temperature or low humidity';
        suggestion = 'Irrigate frequently (daily or every 24 hours)';
      } else {
        recommendation = 'moderate_watering';
        reason = 'Sandy soil';
        suggestion = 'Irrigate moderately (every 1-2 days)';
      }
    } else if (soil === 'clay') {
      recommendation = 'infrequent_watering';
      reason = 'Clay soil retains moisture';
      suggestion = 'Irrigate less frequently (every 4-7 days)';
    } else if (soil === 'loam' || soil === 'silt' || soil === 'loamy') {
      if (temp > 30 && hum < 40) {
        recommendation = 'moderate_watering';
        reason = 'Warm and relatively dry';
        suggestion = 'Irrigate every 2 days';
      } else {
        recommendation = 'normal_watering';
        reason = 'Balanced conditions for loamy soil';
        suggestion = 'Irrigate every 2-3 days';
      }
    } else {
      // Generic fallback with checks for temperature/humidity
      if (temp >= 32 || hum < 30) {
        recommendation = 'moderate_watering';
        reason = 'High temperature or low humidity';
        suggestion = 'Increase watering frequency slightly';
      }
    }

    // If rain probability moderate, reduce frequency slightly
    if (rain >= 40 && rain < 70 && recommendation !== 'skip_watering') {
      if (recommendation === 'frequent_watering') {
        recommendation = 'moderate_watering';
        suggestion = 'Reduce frequency due to moderate rain chance';
        reason += '; moderate rain probability';
      } else if (recommendation === 'moderate_watering') {
        recommendation = 'normal_watering';
        suggestion = 'Reduce frequency due to moderate rain chance';
        reason += '; moderate rain probability';
      }
    }

    return res.json({ recommendation, reason, suggestion });
  } catch (err) {
    return next(err);
  }
};

module.exports = { recommend };
