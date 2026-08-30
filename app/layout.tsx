import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import TanStackProvider from "../components/TanStackProvider/TanStackProvider";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "700"],
  display: "swap", 
});


export const metadata: Metadata = {
  title: "NoteHUB",
  description: "A simple and fast notes app to create, edit, and manage your personal or work- related notes.Organize your thoughts in one place — anytime, anywhere.",
  openGraph: {
    title: "NoteHUB",
    description: "A simple and fast notes app to create, edit, and manage your personal or work- related notes.Organize your thoughts in one place — anytime, anywhere.",
    url: "https://08-zustand-zeta-tawny.vercel.app/",
     images: [{
            url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
            width: 1200,
            height: 630,
            alt: 'NoteHUB - Personal Notes App'
        }]
  }
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal?: React.ReactNode;
}>) {
  return (
   <html lang="en">
      <body className={roboto.variable}>
        
				<TanStackProvider>
          <Header />
          {children}
          {modal}
					<Footer />
				</TanStackProvider>
			</body>
		</html>
  );
}
