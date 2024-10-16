class Converter {
  constructor(basePx = 16) {
    this.basePx = basePx;
  }

  pxToRem(px) {
    return parseFloat(px) / this.basePx;
  }

  remToPx(rem) {
    return parseFloat(rem) * this.basePx;
  }
}

module.exports = Converter;