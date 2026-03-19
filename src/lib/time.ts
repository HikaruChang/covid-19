function getTimezoneOffset(date: Date): number {
  let offset = date.getTimezoneOffset();
  if (offset === -485) {
    offset = -485 - 43 / 60;
  }
  return offset;
}

export function fromOADate(oadate: number): Date {
  const offsetDay = oadate - 25569;
  const date = new Date(offsetDay * 86400000);
  const adjustValue = offsetDay >= 0 ? 1 : -1;
  const oldOffset = getTimezoneOffset(date);
  const ms =
    (oadate * 86400000 * 1440 +
      adjustValue -
      25569 * 86400000 * 1440 +
      oldOffset * 86400000) /
    1440;
  const firstResult = new Date(ms);

  const fixHourSign = oldOffset >= 0 ? 1 : -1;
  const nextHour = new Date(ms + fixHourSign * 3600000);
  const nextOffset = getTimezoneOffset(nextHour);

  if (oldOffset !== nextOffset) {
    const newResult = new Date(ms + (nextOffset - oldOffset) * 60 * 1000);
    if (oldOffset > nextOffset) {
      if (fixHourSign === -1 || nextOffset === getTimezoneOffset(firstResult)) {
        return newResult.getMilliseconds() === 999
          ? new Date(newResult.valueOf() + 1)
          : newResult;
      }
    } else {
      if (fixHourSign === 1 || nextOffset === getTimezoneOffset(firstResult)) {
        return newResult.getMilliseconds() === 999
          ? new Date(newResult.valueOf() + 1)
          : newResult;
      }
    }
  }

  return firstResult.getMilliseconds() === 999
    ? new Date(firstResult.valueOf() + 1)
    : firstResult;
}
