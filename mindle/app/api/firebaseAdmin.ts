import {
  getApp,
  getApps,
  initializeApp,
  ServiceAccount,
  cert,
  App,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// import credentials from "./mindle-7f7ac-firebase-adminsdk-zfv4g-e2abebc037.json";

// const serviceAccount: ServiceAccount = credentials as ServiceAccount;
// const app = admin.initializeApp(
//   {
//     credential: admin.credential.cert(serviceAccount),
//   },
//   "mindle-firebase-admin"
// );

const serviceAccount: ServiceAccount = {
  type: process.env.FIREBASE_ADMIN_TYPE,
  project_id: process.env.FIREBASE_ADMIN_PROJECT_ID,
  private_key_id: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
  client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_ADMIN_CLIENT_ID,
  auth_uri: process.env.FIREBASE_ADMIN_AUTH_URI,
  token_uri: process.env.FIREBASE_ADMIN_TOKEN_URI,
  auth_provider_x509_cert_url:
    process.env.FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_ADMIN_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_ADMIN_UNIVERSE_DOMAIN,
} as ServiceAccount;

// Initialize Firebase Admin
const app: App = !getApps().length
  ? initializeApp({
      credential: cert(serviceAccount),
    })
  : getApp();

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, app };
