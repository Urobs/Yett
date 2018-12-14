const { formatTime } = require('./util');

module.exports = (rows) => {
  return rows.map(row => {
    let {
      id,
      content,
      weight,
      expireTime,
      isFinished,
      isExpired,
      createTime
    } = row;
    expireTime = new Date(expireTime).getTime();
    createTime = formatTime(new Date(createTime));
    return {
      id,
      content,
      weight,
      expireTime,
      isFinished,
      isExpired,
      createTime
    };
  });
}