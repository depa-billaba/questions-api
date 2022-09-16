
const maps = [
  {
    mapId: 'questionsMap',
    idProperty: 'question_id',
    properties: ['question_body', 'question_date', 'asker_name', 'reported', 'question_helpfulness'],
    collections: [
      {name: 'answers', mapId: 'answerMap', columnPrefix: 'a_'}
    ]
  },
  {
    mapId: 'answerMap',
    idProperty: 'id',
    properties: ['body', 'date', 'answerer_name', 'reported', 'helpfulness'],
    collections: [
      {name: 'photos', mapId: 'photoMap', columnPrefix: 'p_'}
    ]
  },
  {
    mapId: 'photoMap',
    idProperty: 'id',
    properties: ['answer_id', 'url'],
  },
]

module.exports = maps;