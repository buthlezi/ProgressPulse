// import { Amplify} from 'aws-amplify';
import { signIn, fetchAuthSession } from 'aws-amplify/auth';

export async function login(email: string, password: string) {
    await signIn({username: email, password});
}

export async function getIdToken() {
    const session = await fetchAuthSession();
    return session.tokens?.idToken?.toString() ?? null;
}