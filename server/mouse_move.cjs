// Move the mouse across the screen as a sine wave.
var robot = require("robotjs");
const { hexToRegArr, getBetAmount } = require("./utils.cjs");

const mouseDelay = (delay = 200) => robot.setMouseDelay(delay);

const keyboardDelay = (delay = 200) => robot.setKeyboardDelay(delay);

// 判断是否赢了
const checkIsWin = () => {
  let result = true;
  for (let i = 1; i <= 30; i++) {
    const x = 1294 + i;
    const y = 342;
    const hex = robot.getPixelColor(x, y);
    const rgbArr = hexToRegArr("#" + hex);
    // console.log([x, y], rgbArr, hex);
    if (rgbArr[1] > rgbArr[0] && rgbArr[1] > rgbArr[2]) {
      return true;
    }
    if (hex !== "131116") {
      result = false;
    }
  }
  return result;
};

// 轮盘是否在转动
let isWheelSpinning = false;

// 是否正在被控制
let isControlled = false;

// 判断轮盘是否在转动
const checkWheelSpinning = () => {
  const hex = robot.getPixelColor(330, 408);
  if (hex === "0b090e") {
    // setTimeout(() => {
    //   isWheelSpinning = true;
    // }, 2000);
    isWheelSpinning = true;
  } else {
    isWheelSpinning = false;
  }
};

// 输了的次数
let lostCount = 0;

// 金额基数
const BASE_AMOUNT = 1;

// 获取下注的金额
const handleBetAmount = () => {
  if (checkIsWin() || lostCount >= 2) {
    lostCount = 0;
  } else {
    lostCount += 1;
  }
  // console.log(33, checkIsWin(), lostCount);
  robot.moveMouseSmooth(220, 418);
  mouseDelay();
  robot.mouseClick();
  robot.mouseClick();
  robot.mouseClick("left", true);
  keyboardDelay();
  robot.keyTap("backspace");
  robot.keyTap("backspace");
  robot.keyTap("backspace");
  const betAmount = getBetAmount(BASE_AMOUNT, lostCount) + "";
  for (let i = 0; i < betAmount.length; i++) {
    robot.keyTap(betAmount[i]);
  }
};

const MAX_COUNT = 20;
let count = 0;

const bettingRobot = () => {
  console.log(count, isWheelSpinning);
  if (!isWheelSpinning) {
    isWheelSpinning = true;
    // 挪动到输入框，输入金额
    handleBetAmount();
    // 开启开关
    robot.moveMouseSmooth(300, 588);
    // if (Math.random() > 0.5) {
    //   robot.moveMouseSmooth(300, 588);
    // } else {
    //   robot.moveMouseSmooth(380, 588);
    // }
    robot.mouseClick();
    count += 1;
  } else {
    checkWheelSpinning();
  }
};

const interval1 = setInterval(() => {
  // if (count >= MAX_COUNT) {
  //   clearInterval(interval1);
  // }
  bettingRobot();
}, 3000);

// bettingRobot();
