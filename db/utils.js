const db = require('.');

module.exports.JSONSubquery = function JSONSubquery(name, subquery) {
  const alias = `${name}_subquery`;
  return db
  .select(
    db.raw(`array_to_json(array_agg(row_to_json(${alias})))`)
  )
  .from(
    subquery.as(alias)
  )
  .as(name);
};