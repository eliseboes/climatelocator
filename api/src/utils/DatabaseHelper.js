
async function initialiseTables() {
    await pg.schema.hasTable('year').then(async (exists) => {
      if (!exists) {
        await pg.schema
          .createTable('year', (table) => {
            table.increments();
            table.uuid('uuid');
            table.string('most_affected_country');
            table.string('hottest_temperature');
            table.string('num_disasters');
            table.timestamps(true, true);
          })
          .then(async () => {
            console.log('created table year');
          });
  
      }
    });
    await pg.schema.hasTable('locations').then(async (exists) => {
      if (!exists) {
        await pg.schema
          .createTable('locations', (table) => {
            table.increments();
            table.uuid('uuid');
            table.string('name');
            table.string('geohash');
            table.string('monthly_av');
            table.string('year');
            table.string('year_id');
            table.timestamps(true, true);
          })
          .then(async () => {
            console.log('created table locations');
          });
  
      }
    });
  }

  module.exports = pg;