import express from 'express'
import cors from 'cors'
import IDatabaseConnection from './contracts/iDatabaseConnection'
import DbMigrator from './migrators/dbMigrator'
import routes from './routes'

if (process.argv.includes('--migrate')) {
  const migrator = new DbMigrator()
  migrator.migrate(function () {
    console.log('Database migrated')
    process.exit(0)
  })
}

const app = express()
app.use(cors())
app.use(express.json())
app.use(routes)

export default async function (databases: IDatabaseConnection[]) {
  for (const db of databases) {
    const connectionWorking = await db.test()
    if (!connectionWorking) {
      console.trace('It was not possible to connect to database')
      return process.exit(1)
    }
  }

  return { databases, app }
}
