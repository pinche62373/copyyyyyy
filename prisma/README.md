# Database

## Creating a Fresh Init Migration

1. Delete database tables
2. Delete `prisma/migrations` folder
3. Run `npx prisma migrate reset`
4. Run `prisma migrate dev --name init` to generate new migrations folder
5. Run `npm run postmigrate` to sync Snaplet client
6. Run `npm run seed -- -- --force` to seed database
7. Commit new init migration to repo
