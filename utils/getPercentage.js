function percentage(total, percent=0) {
  return ((percent / 100) * total).toFixed(2);
}

module.exports = percentage;
