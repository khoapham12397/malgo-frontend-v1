export const getDuration = (time: number) => {
  const duration = time / 1000000; // nanoseconds to milliseconds
  const hours = Math.floor(duration / 3600000);
  const minutes = Math.floor((duration % 3600000) / 60000);
  const seconds = Math.floor(((duration % 3600000) % 60000) / 1000);
  return `${hours}h ${minutes === 0 ? '' : minutes + 'm'} ${
    seconds === 0 ? '' : seconds + 's'
  }`;
};
