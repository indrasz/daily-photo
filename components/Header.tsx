import Link from "next/link";
import { ActivityIcon } from "./icons";

type HeaderProps = {
  /** Subtitle or paragraph under main title. */
  subtitle?: string;
  /** Right-side slot (e.g. timers on processing screen). */
  right?: React.ReactNode;
  /** Override the main title. Defaults to brand name. */
  title?: string;
};

export function Header({
  title = "Rancang Bangun Static Posturografi",
  subtitle = "Berbasis Sensor Load Cell",
  right,
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-surface-line shadow-soft">
      <div className="mx-auto max-w-[1024px] px-4 sm:px-6 py-4">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/"
            aria-label="Beranda"
            className="flex items-center justify-center w-10 h-10 rounded-[10px] bg-brand-600 text-white shrink-0"
          >
            <ActivityIcon className="w-5 h-5" />
          </Link>
          <div className="flex flex-col min-w-0 flex-1">
            <h1 className="text-base font-normal text-ink-deep tracking-tight truncate">
              {title}
            </h1>
            {subtitle ? (
              <p className="text-sm text-ink-muted truncate">{subtitle}</p>
            ) : null}
          </div>
          {right ? <div className="flex items-center gap-3">{right}</div> : null}
        </div>
      </div>
    </header>
  );
}
