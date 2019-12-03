exports.up = async function(knex) {
  // Enable postgres extension for auto-incrementing UUIDs
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  
  // Create Photos table
  await knex.schema.createTable('photos', t => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.string('url');
  });
  
  // Create Providers table
  await knex.schema.createTable('providers', t => {
    t.integer('npi_number').primary();
    t.string('bio');
    t.uuid('profile_photo_id').references('id').inTable('photos');
  });
  
  // Create Provider Photos table
  await knex.schema.createTable('provider_photos', t => {
    t.integer('provider_npi_number').references('npi_number').inTable('providers');
    t.uuid('photo_id').references('id').inTable('photos');
  });
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('photos')
    .dropTable('providers')
    .dropTable('provider_photos');
};