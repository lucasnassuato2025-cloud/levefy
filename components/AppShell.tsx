import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import Footer from "./Footer";

export default function AppShell({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="min-h-screen flex bg-app">
      <Sidebar />
      <main className="flex-1 pb-28 lg:pb-10 flex flex-col min-w-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-10 flex-1 w-full animate-fade-in">
          {title && (
            <div className="mb-7 lg:mb-9">
              <h1 className="text-[26px] sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">
                {title}
              </h1>
              <div className="mt-2 flex items-center gap-2">
                <span className="h-1 w-10 rounded-full gradient-brand" />
                <span className="h-1 w-2 rounded-full bg-brand-200" />
                <span className="h-1 w-1 rounded-full bg-brand-100" />
              </div>
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
