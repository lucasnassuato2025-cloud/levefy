import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import Footer from "./Footer";

export default function AppShell({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="min-h-screen flex bg-[#f8fafc]">
      <Sidebar />
      <main className="flex-1 pb-24 lg:pb-10 flex flex-col min-w-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-10 flex-1 w-full">
          {title && (
            <div className="mb-6 lg:mb-8">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">{title}</h1>
              <div className="h-1 w-12 rounded-full gradient-brand mt-2" />
            </div>
          )}
          {children}
        </div>
        <Footer />
      </main>
      <MobileNav />
    </div>
  );
}
