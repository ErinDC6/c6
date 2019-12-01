exports.up = function(knex) {
  return knex.schema
    .createTable('photos', t => {
      t.uuid('id').primary();
      t.string('url');
    })
    .createTable('providers', t => {
      t.integer('npi_number').primary();
      t.string('bio');
      t.uuid('profile_photo_id').references('id').inTable('photos');
    })
    .createTable('provider_photos', t => {
      t.integer('provider_npi_number').references('npi_number').inTable('providers');
      t.uuid('photo_id').references('id').inTable('photos');
    })
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('photos')
    .dropTable('providers')
    .dropTable('provider_photos');
};