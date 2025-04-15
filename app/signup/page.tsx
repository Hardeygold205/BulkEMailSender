import React from 'react'
import { SignUp } from "@stackframe/stack";

export default function Page() {
  return (
    <div>
      <SignUp
        fullPage={true}
        automaticRedirect={true}
        firstTab="password"
        extraInfo={
          <>
            By signing up, you agree to our <a href="/terms">Terms</a>
          </>
        }
      />
    </div>
  );
}
