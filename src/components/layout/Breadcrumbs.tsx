import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export type Crumb = { label: string; href?: string };

/**
 * Compact, transparent trail. It is rendered *inside* a page's hero section so
 * it shares that background instead of sitting in a separate white band.
 */
export function Breadcrumbs({
  items,
  right,
}: {
  items: Crumb[];
  right?: React.ReactNode;
}) {
  return (
    <nav aria-label="Breadcrumb" className="relative">
      <div className="shell flex items-center justify-between gap-4 pt-5 pb-6">
        <ol className="no-scrollbar flex min-w-0 items-center gap-1.5 overflow-x-auto text-[0.8125rem] whitespace-nowrap">
          <li className="flex items-center gap-1.5">
            <Link
              to="/"
              className="flex items-center gap-1.5 font-semibold text-muted transition-colors hover:text-primary"
            >
              <Home size={13} />
              Home
            </Link>
          </li>
          {items.map((item, i) => (
            <li key={item.label} className="flex items-center gap-1.5">
              <ChevronRight size={12} className="text-primary-200" aria-hidden="true" />
              {item.href && i < items.length - 1 ? (
                <Link
                  to={item.href}
                  className="text-muted transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page" className="font-semibold text-secondary">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
        {right ? (
          <div className="hidden shrink-0 items-center gap-3 text-[0.8125rem] lg:flex">
            {right}
          </div>
        ) : null}
      </div>
    </nav>
  );
}
