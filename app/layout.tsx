import { ClerkProvider,ClerkLoaded, ClerkLoading } from '@clerk/nextjs'
import './globals.css'
import { dark } from '@clerk/themes'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
    appearance={{
      baseTheme: dark,
    }}>
      <html lang="en">
        <body>
          <header>
            <ClerkLoading>
              <h1>Clerk is Loading</h1>
            </ClerkLoading>
          </header>
          <ClerkLoaded>
            <main>{children}</main>
          </ClerkLoaded>
        </body>
      </html>
    </ClerkProvider>
  )
}