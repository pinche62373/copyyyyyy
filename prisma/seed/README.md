# Seed

| Command                      | Function
|------------------------------|---------------------------------------------------
| `npm run postmigrate`        | Generates required `.snaplet/dataModel.json` by syncing with database
| `npm run seed`               | Preview generated seeds (without touching database)
| `npm run seed -- -- --force` | Write seeds to database (deletes existing tables)

## Good to Know

- Run postmigrate to fix `Error: @snaplet/seed client is missing. Please use npx @snaplet/seed sync or npx @snaplet/seed init to generate the client.`
- This repo does not use AI-generated data
