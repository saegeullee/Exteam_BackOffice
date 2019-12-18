exports.convertDateToString = datetime => {
  if (datetime !== null) {
    const date = new Date(datetime);
    const year = String(date.getFullYear());
    const month = String(date.getMonth() + 1);
    const day = String(date.getDate());

    return `${year.slice(2)}.${month.length === 1 ? '0' + month : month}.${
      day.length === 1 ? '0' + day : day
    }`;
  } else {
    return '';
  }
};

exports.convertStringToDate = string => {
  const year = '20' + string.slice(0, 2) + '.';
  const dateString = year + string.slice(3);

  return new Date(dateString).toISOString();
};
