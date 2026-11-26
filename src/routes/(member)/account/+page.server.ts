import { signOut } from '../../../auth.ts';
import type { Actions } from './$types';

// One click logs out: a POST to this action skips Auth.js's confirmation page.
export const actions: Actions = { logout: signOut };
