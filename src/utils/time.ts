export const sleep = (millisecons: number) =>
  new Promise((resolve) => setTimeout(resolve, millisecons));

export default {
  sleep,
};
