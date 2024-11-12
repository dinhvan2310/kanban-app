import { initializeApp } from 'firebase/app';
import { clientConfig } from '../../config/Firebase/config';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


export const app = initializeApp(clientConfig);
const auth = getAuth(app)
const db = getFirestore(app);

export { auth, db };