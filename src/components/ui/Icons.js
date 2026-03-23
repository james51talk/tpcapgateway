export function Icon({ children, className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function LayoutDashboardIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M3 3h8v8H3z" />
      <path d="M13 3h8v5h-8z" />
      <path d="M13 10h8v11h-8z" />
      <path d="M3 13h8v8H3z" />
    </Icon>
  );
}

export function FileTextIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h8" />
      <path d="M8 9h2" />
    </Icon>
  );
}

export function ShieldIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M12 2l8 4v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6z" />
    </Icon>
  );
}

export function HelpCircleIcon({ className }) {
  return (
    <Icon className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.1 9a3 3 0 1 1 4.7 2.5c-.9.6-1.3 1.1-1.3 2.5" />
      <path d="M12 17h.01" />
    </Icon>
  );
}

export function BuildingIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M3 21h18" />
      <path d="M6 21V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v14" />
      <path d="M9 9h.01" />
      <path d="M9 12h.01" />
      <path d="M9 15h.01" />
      <path d="M12 9h.01" />
      <path d="M12 12h.01" />
      <path d="M12 15h.01" />
      <path d="M15 9h.01" />
      <path d="M15 12h.01" />
      <path d="M15 15h.01" />
    </Icon>
  );
}

export function LogOutIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </Icon>
  );
}

export function MenuIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </Icon>
  );
}

export function XIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </Icon>
  );
}

export function ChevronDownIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M6 9l6 6 6-6" />
    </Icon>
  );
}

export function UsersIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Icon>
  );
}

export function UserCheckIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <path d="M17 11l2 2 4-4" />
    </Icon>
  );
}

export function UserMinusIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <path d="M17 11h6" />
    </Icon>
  );
}

export function TrendingUpIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M23 6l-9.5 9.5-5-5L1 18" />
      <path d="M17 6h6v6" />
    </Icon>
  );
}

export function GraduationCapIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M22 10l-10 5-10-5 10-5 10 5z" />
      <path d="M6 12v5c0 1 3 3 6 3s6-2 6-3v-5" />
    </Icon>
  );
}

export function CalendarIcon({ className }) {
  return (
    <Icon className={className}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
    </Icon>
  );
}

export function PieChartIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </Icon>
  );
}

export function BookOpenIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M2 4h7a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 4h-7a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h8z" />
    </Icon>
  );
}

export function BookIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </Icon>
  );
}

export function PesoSignIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M8 21V3h6a5 5 0 0 1 0 10H8" />
      <path d="M8 11h8" />
      <path d="M8 7h8" />
    </Icon>
  );
}

export function LayersIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M12 2l10 6-10 6L2 8z" />
      <path d="M2 12l10 6 10-6" />
    </Icon>
  );
}

export function CalendarCheckIcon({ className }) {
  return (
    <Icon className={className}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
      <path d="M9 16l2 2 4-4" />
    </Icon>
  );
}

export function UserIcon({ className }) {
  return (
    <Icon className={className}>
      <circle cx="12" cy="7" r="4" />
      <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
    </Icon>
  );
}
