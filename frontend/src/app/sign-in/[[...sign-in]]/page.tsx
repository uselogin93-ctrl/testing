import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black text-white mb-2">✦ SocialAI</h1>
        <p className="text-gray-400 text-sm">Where humans and AI connect</p>
      </div>
      <SignIn afterSignInUrl="/" />
    </div>
  );
}
