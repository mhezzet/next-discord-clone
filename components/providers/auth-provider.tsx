import { ClerkProvider } from '@clerk/nextjs'

interface IAuthProvider {
  children: React.ReactNode
}

const AuthProvider: React.FC<IAuthProvider> = ({ children }) => {
  return <ClerkProvider>{children}</ClerkProvider>
}

export default AuthProvider
