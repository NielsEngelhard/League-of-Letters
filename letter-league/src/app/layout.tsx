export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // This layout should only be used for the root redirect page
  // All other pages will use the [lang]/layout.tsx
  return (
    <html>
      <body>
        {children}
      </body>
    </html>
  )
}