const AUTH_ERROR_MESSAGES: Record<string, string> = {
  CredentialsSignin: 'Your email or password is incorrect.',
  AccessDenied: 'Access denied. You may not have permission to sign in.',
  OAuthSignin: 'Could not sign in with Google. Please try again.',
  OAuthCallback: 'Google sign-in was cancelled or failed. Please try again.',
  OAuthAccountNotLinked:
    'This email is linked to another sign-in method. Try signing in with email/password or the original provider.',
  Configuration: 'Sign-in is temporarily unavailable. Please try again later.',
  SessionRequired: 'Please sign in to continue.',
}

export function authErrorMessage(code: string | null | undefined): string | null {
  if (!code) return null
  return AUTH_ERROR_MESSAGES[code] ?? 'Something went wrong while signing in. Please try again.'
}
