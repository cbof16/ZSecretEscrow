export const truncateZAddress = (address: string, length = 10): string => {
  return address.length > length ? address.slice(0, length) + "..." : address;
};
