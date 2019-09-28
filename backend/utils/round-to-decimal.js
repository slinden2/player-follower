const roundToDecimal = num => {
  return parseFloat(Math.round(num * 100) / 100).toFixed(2)
}

module.exports = roundToDecimal
