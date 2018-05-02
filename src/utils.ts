// todo: check the performance. Divider takes 4 sec for the image. Concat it the possible problem

export const splitInParts = <T>(input: Array<T>, partLength: number): Array<Array<T>> => {
  if (input.length <= partLength) {
    return [input];
  }
  let startPoint: Array<Array<T>> = [[]];
  const divider = (total: Array<Array<T>>, current: T) => {
    let lastChunk = total[total.length - 1];
    if (lastChunk.length < partLength) {
      lastChunk.push(current);
      return total;
    }
    return total.concat([[current]]);
  };
  return input.reduce(divider, startPoint);
};