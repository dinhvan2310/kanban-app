import { initializeApp } from 'firebase/app';
import { clientConfig } from '../../config/Firebase/config';
import { getAuth } from 'firebase/auth';


export const app = initializeApp(clientConfig);
const auth = getAuth(app)

export { auth };