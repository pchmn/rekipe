import { signOut } from '@rekipe/supabase/auth.server';
import { type ActionFunctionArgs, data, redirect } from 'react-router';

export async function action({ request }: ActionFunctionArgs) {
  const { error, headers } = await signOut(request);

  if (error) {
    throw data({ error }, { headers });
  }

  return redirect('/', { headers });
}
