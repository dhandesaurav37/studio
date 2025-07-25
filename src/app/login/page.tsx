
import LoginPageClient from './client-page';

export default function LoginPage() {
  // This page remains a server component that renders the client component.
  // This is a good practice for separating concerns and improving initial load.
  return <LoginPageClient />;
}
