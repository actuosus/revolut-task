import RX from "reactxp";

const blurRegExp = new RegExp("blur\\((\\d+).*\\)");

function blurConvertValueToNumeric(inputVal: number | string): number {
  if (!inputVal) {
    return 0;
  }
  if (typeof inputVal === "number") {
    return inputVal;
  }
  const match = blurRegExp.exec(inputVal);
  if (match) {
    return parseFloat(match[1]);
  }
  return 0;
}

export const blur = (
  value: RX.Animated.Value,
  config: RX.Types.InterpolationConfig
) => {
  const interpolated = value.interpolate(config);
  // eslint-disable-next-line @typescript-eslint/unbound-method
  interpolated._convertValueToNumeric = blurConvertValueToNumeric;

  return interpolated;
};
