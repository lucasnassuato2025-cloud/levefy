import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import Footer from "./Footer";

export default function AppShell({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar />
      <main className="flex-1 pb-24 lg:pb-10 flex flex-col">
        <div className="max-w-6xl mx-auto px-5 lg:px-10 py-8 flex-1 w-full">
          {title && <h1 className="text-2xl lg:text-3xl font-bold mb-6">{title}</h1>}
          {children}
        </div>
        <Footer />
      </main>
      <MobileNav />
    </div>
  );
}
