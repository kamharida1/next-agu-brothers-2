'use client'
import { useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export default function PasswordUpdatePrompt() {
  const { data: session } = useSession();
  const [showPrompt, setShowPrompt] = useState(
    session?.user?.isPasswordUpdated === false && !session?.user?.password
  );

  if (!showPrompt) return null;

  return (
    <div className="alert alert-warning shadow-lg p-4 mb-4 flex flex-col sm:flex-row items-start sm:items-center">
      <div className="flex-1 mb-3 sm:mb-0">
        <p className="text-sm sm:text-base font-medium text-left">
          Your account requires a password update. Please update it to continue.
        </p>
      </div>
      <div className="flex-none space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto flex flex-col sm:flex-row">
        <Link href="/profile">
          <button className="btn btn-primary btn-sm w-full sm:w-auto">Go to Profile</button>
        </Link>
        <button
          onClick={() => setShowPrompt(false)}
          className="btn btn-secondary btn-sm w-full sm:w-auto"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
