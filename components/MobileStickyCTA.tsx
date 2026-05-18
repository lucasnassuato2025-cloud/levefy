interface MobileStickyCTAProps {
  href: string;
  label: string;
}

export default function MobileStickyCTA({
  href,
  label,
}: MobileStickyCTAProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-black/80 backdrop-blur md:hidden">
      <a
        href={href}
        className="block w-full rounded-xl bg-green-500 py-4 text-center font-bold text-white"
      >
        {label}
      </a>
    </div>
  );
}