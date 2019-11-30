exports.up = function(knex) {
  return knex.schema
    .createTable('photos', t => {
      t.increments('id');
      t.string('url');
    })
    .createTable('providers', t => {
      t.integer('npi_number');
      t.string('bio');
      t.integer('profile_photo_id')
        .references('id')
        .inTable('photos');
      t.unique(['npi_number']);
    })
    .createTable('provider_photos', t => {
      t.integer('provider_id')
        .references('npi_number')
        .inTable('providers');
      t.integer('photo_id')
        .references('id')
        .inTable('photos');
    })
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('photos')
    .dropTable('providers')
    .dropTable('provider_photos');
};