import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { WalletProvider } from '@/lib/wallet-context';
import { ToastContainer } from '@/components/ui/use-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ZSecretEscrow - Secure Cross-Chain Transactions',
  description: 'Privacy-focused cryptocurrency escrow platform with smart contract protection',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background text-white antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="crypto-escrow-theme"
        >
          <WalletProvider>
            <ToastContainer>
              {children}
            </ToastContainer>
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}