export const getFormattedTime = (date: Date) =>
  date.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

export const getFormattedDate = (date: Date) => {
  const dateString = date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  return dateString.replace(/\//g, '-');
};

export const getFormattedDateTime = (date: Date) =>
  `${getFormattedDate(date)} ${getFormattedTime(date)}`;
