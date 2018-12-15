module.exports = clock => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = clock.substring(0,2);
  const minute = clock.substring(3);

  return [year, month, day].join('-') + ' ' + [hour, minute].join(':')
}