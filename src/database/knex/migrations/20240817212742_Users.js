exports.up = (knex) =>
  knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.text("name").notNullable();
    table.string("email").notNullable();
    table.string("password").notNullable();

    table
      .enum("role", ["admin", "customer"], {
        useNative: true,
        enumName: "roles",
      })
      .notNullable()
      .default("customer");

    table.datetime("created_at").defaultTo(knex.fn.now());
    table.datetime("updated_at").defaultTo(knex.fn.now());
  });

exports.down = (knex) => knex.schema.dropTable("users");
