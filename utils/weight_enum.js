const weightEnum = {
  importantAndUrgent: 4,
  importantButNotUrgent: 3,
  NotImportantButUrgent: 2,
  NeitherImportantNorUrgent: 1,
  properties: {
    "既不紧急也不重要": 1,
    "紧急但不重要": 2,
    "重要但不紧急": 3,
    "重要且紧急": 4
  }
};

module.exports = weightEnum;