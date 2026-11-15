import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

declare const __FIREBASE_API_KEY__: string

const firebaseConfig = {
  apiKey: __FIREBASE_API_KEY__,
  authDomain: 'focusflow-b883c.firebaseapp.com',
  projectId: 'focusflow-b883c',
  appId: '1:345075631388:web:461cbd6623213e8dc3e6d9'
}

export const firebaseAuth = firebaseConfig.apiKey ? getAuth(initializeApp(firebaseConfig)) : null
