module.exports = function (title) {
  let re = ''
  switch(title) {
    case 'finish':
      re = '已完成的任务';
      break;
    case 'fail':
      re = '逾期任务';
      break;
    case 'history':
      re = '历史任务';
      break;
  }
  return re;
}