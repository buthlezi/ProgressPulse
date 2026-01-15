// import { Amplify} from 'aws-amplify';
import { signIn, fetchAuthSession } from 'aws-amplify/auth';

export async function login(email: string, password: string) {
    await signIn({username: email, password});
}

export async function getAccessToken(): Promise<string | null> {
    try {
        const session = await fetchAuthSession();
        return session.tokens?.accessToken?.toString() ?? null;
    } catch (error) {
        console.warn('[auth] getAccessToken failed', error);
        return null;
    }
}


export async function getIdToken() {
const session = await fetchAuthSession();
return session.tokens?.idToken?.toString() ?? null;
}