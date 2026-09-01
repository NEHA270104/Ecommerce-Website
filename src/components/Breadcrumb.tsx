import { Link } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  to?: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5 flex-wrap">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && (
              <span style={{ color: "#D1D5DB" }} className="text-xs">/</span>
            )}
            {item.to ? (
              <Link
                to={item.to}
                style={{ color: "#6B7280", fontFamily: "'Manrope', sans-serif" }}
                className="text-xs hover:text-[#C99724] transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span style={{ color: "#171717", fontFamily: "'Manrope', sans-serif" }} className="text-xs font-medium">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
