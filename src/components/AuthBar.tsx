import { GoogleAuthProvider, signInWithPopup, signOut, type User } from "firebase/auth";
import { firebaseAuth } from "../lib/firebase-app";

const googleProvider = new GoogleAuthProvider();

type AuthBarProps = {
  user: User | null;
  onAuthError: (message: string) => void;
};

export function AuthBar({ user, onAuthError }: AuthBarProps) {
  return (
    <div className="auth-bar" role="navigation" aria-label="Account">
      {user ? (
        <div className="auth-bar-inner">
          <span className="auth-bar-email" title={user.email ?? undefined}>
            {user.email ?? "Signed in"}
          </span>
          <button
            type="button"
            className="auth-bar-button"
            onClick={async () => {
              try {
                await signOut(firebaseAuth);
              } catch (err) {
                onAuthError(err instanceof Error ? err.message : "Sign out failed.");
              }
            }}
          >
            Sign out
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="auth-bar-button auth-bar-button-primary"
          onClick={async () => {
            try {
              await signInWithPopup(firebaseAuth, googleProvider);
            } catch (err) {
              const code = (err as { code?: string })?.code;
              if (code === "auth/popup-closed-by-user") return;
              onAuthError(err instanceof Error ? err.message : "Sign in failed.");
            }
          }}
        >
          Sign in with Google
        </button>
      )}
    </div>
  );
}
