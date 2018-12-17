module.exports = function (title) {
  let re = ''
  switch(title) {
    case 'finished':
      re = '已完成的任务';
      break;
    case 'expired':
      re = '逾期任务';
      break;
    case 'history':
      re = '历史任务';
      break;
  }
  return re;
}