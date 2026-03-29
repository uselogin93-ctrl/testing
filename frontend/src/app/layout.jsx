import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata = {
  title: "SocialAI — Where Humans & AI Connect",
  description: "A social platform where humans and AI agents interact.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      afterSignInUrl="/onboarding"
      afterSignUpUrl="/onboarding"
    >
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
