exports.up = (knex) =>
  knex.schema.createTable("dishes", (table) => {
    table.increments("id");
    table.text("name").notNullable();
    table.text("description").notNullable();
    table.text("category").notNullable();
    table.decimal("price", 10,2).notNullable();
    table.text("image_id").nullable();
    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
  });

exports.down = (knex) => knex.schema.dropTable("dishes");
