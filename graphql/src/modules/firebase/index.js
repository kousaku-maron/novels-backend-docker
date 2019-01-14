import admin from 'firebase-admin'
import serviceAccount from './admin.json'

const firebaseDatabaseEndpoint = process.env.FIREBASE_DATABASE_ENDPOINT
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: firebaseDatabaseEndpoint,
})

export default admin