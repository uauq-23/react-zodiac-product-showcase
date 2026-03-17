exports.up = async function(knex) {
  // Tạo bảng users
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('username').unique().notNullable();
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Tạo bảng todos theo yêu cầu
  await knex.schema.createTable('todos', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable()
        .references('id').inTable('users')
        .onDelete('CASCADE');
    table.string('title').notNullable();
    table.text('description').nullable();
    table.enu('status', ['PENDING', 'DONE']).defaultTo('PENDING');
    table.date('due_date').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('todos');
  await knex.schema.dropTableIfExists('users');
};