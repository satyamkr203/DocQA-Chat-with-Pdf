import { AuthProvider } from "../modules/auth/auth.hooks";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
