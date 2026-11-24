export const axis = (categories, horizontal = false) => ({
  grid: {
    left: 8,
    right: 18,
    top: 27,
    bottom: 10,
    outerBoundsMode: "same",
    outerBoundsContain: "axisLabel",
  },
  xAxis: horizontal
    ? { type: "value" }
    : { type: "category", data: categories },
  yAxis: horizontal
    ? { type: "category", data: categories, inverse: true }
    : { type: "value" },
});
export function result(headers, rows, option) {
  return { headers, rows, option };
}
export const weekly = ["1–7", "8–14", "15–21", "22–28"];
export const models = ["Jolion", "Vesta", "Atlas", "Tiggo", "X50"];
export const bodyTypes = ["Кроссовер", "Седан", "Универсал", "Хэтчбек"];
export function figures(oct) {
  return oct ? [9, 15, 7, 11, 6] : [14, 12, 10, 8, 7];
}
export const named = (names, values) =>
  names.map((name, i) => ({ name, value: values[i] }));
