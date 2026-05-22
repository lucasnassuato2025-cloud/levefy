import Sidebar from "./Sidebar";
import Footer from "./Footer";
import MobileAppShell from "./MobileAppShell";

export default function AppShell({
  children,
  title,
  mobile,
}: {
  children: React.ReactNode;
  title?: string;
  mobile?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-app text-[14px] sm:text-base">
      <div className="hidden min-h-screen lg:flex">
        <Sidebar />
        <main className="flex min-w-0 flex-1 flex-col pb-10">
          <div className="mx-auto w-full max-w-6xl flex-1 animate-fade-in px-3 py-3 sm:px-6 sm:py-6 md:px-7 lg:px-10 lg:py-10">
            {title && (
              <div className="mb-3 sm:mb-7 lg:mb-9">
                <h1 className="text-[1.45rem] leading-tight sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">
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
          <div>
            <Footer />
          </div>
        </main>
      </div>
      <MobileAppShell title={mobile ? undefined : title}>{mobile ?? children}</MobileAppShell>
    </div>
  );
}
