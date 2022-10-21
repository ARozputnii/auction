export const getRandomEnumValue = (enumObject: object): string => {
  const length = Object.keys(enumObject).length;
  const index = Math.floor(Math.random() * length);

  return Object.values(enumObject)[index];
};
