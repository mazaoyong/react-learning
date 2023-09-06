const numbro = require("numbro");

const ODDS = 1.95;

const getBetAmount = (
  curAmount = 2,
  lostCount = 0,
  _props = {
    totalAmount: 0,
    totalCount: 0,
  }
) => {
  if (lostCount === 0) {
    return curAmount;
  }
  let { totalAmount, totalCount } = _props;
  let nexBetAmount = numbro(curAmount)
    .add(totalAmount)
    .divide(ODDS - 1)
    .add(0.1)
    .multiply(100)
    .value();

  nexBetAmount = numbro(Math.round(nexBetAmount)).divide(100).value();
  totalAmount += curAmount;
  totalCount += 1;
  if (lostCount === totalCount) {
    return nexBetAmount;
  } else {
    return getBetAmount(nexBetAmount, lostCount, {
      totalCount,
      totalAmount,
    });
  }
};

const hexToRegArr = (hex) => {
  const r = parseInt("0x" + hex.slice(1, 3));
  const g = parseInt("0x" + hex.slice(3, 5));
  const b = parseInt("0x" + hex.slice(5, 7));
  return [r, g, b];
};

module.exports = {
  getBetAmount,
  hexToRegArr,
};

for (let i = 0; i < 10; i++) {
  console.log(getBetAmount(1, i));
}
