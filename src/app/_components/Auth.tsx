import { SignInButton, SignedIn, SignedOut, UserButton , } from "@clerk/nextjs";
import { Button } from "../../components/ui/button";
import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";

export const Auth = () => {
    const {userId} = auth()
    if(userId){
        redirect('/dashboard')
    }
  return (
    <div>
      <SignedOut>
        <SignInButton>
          <Button>Sign In</Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton></UserButton>
      </SignedIn>
    </div>
  );
};