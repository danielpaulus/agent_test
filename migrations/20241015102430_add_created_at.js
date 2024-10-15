/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.table('checkly_alerts', (table) => {
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
  });

  // Remove the default value for future inserts
  await knex.schema.alterTable('checkly_alerts', (table) => {
    table.timestamp('created_at').alter().notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  table.timestamp('created_at').defaultTo(knex.fn.now());
};
