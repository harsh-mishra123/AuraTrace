/* Custom thin-stroke icons for AuraTrace — avoids generic Lucide defaults */
"use client";

interface IconProps {
    size?: number;
    color?: string;
    strokeWidth?: number;
    className?: string;
}

function makeIcon(
    paths: string,
    viewBox = "0 0 24 24"
): React.FC<IconProps> {
    const Icon: React.FC<IconProps> = ({
        size = 16,
        color = "currentColor",
        strokeWidth = 1.2,
        className,
    }) => (
        <svg
            width={size}
            height={size}
            viewBox={viewBox}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            dangerouslySetInnerHTML={{ __html: paths }}
        />
    );
    Icon.displayName = "Icon";
    return Icon;
}

export const LungIcon = makeIcon(
    `<path d="M12 4v8"/>
   <path d="M8 12c-2 0-4 1-4 4s1 4 4 4c1.5 0 3-.5 4-2"/>
   <path d="M16 12c2 0 4 1 4 4s-1 4-4 4c-1.5 0-3-.5-4-2"/>
   <circle cx="12" cy="4" r="1" fill="currentColor" stroke="none"/>`
);

export const ElderlyIcon = makeIcon(
    `<circle cx="12" cy="5" r="2"/>
   <path d="M10 10h4"/>
   <path d="M12 10v5"/>
   <path d="M12 15l-3 5"/>
   <path d="M12 15l3 5"/>
   <path d="M8 10c-2 1-3 3-3 5"/>`
);

export const InfantIcon = makeIcon(
    `<circle cx="12" cy="8" r="4"/>
   <path d="M8 12c-1 2-1 4 0 6"/>
   <path d="M16 12c1 2 1 4 0 6"/>
   <path d="M9 18h6"/>
   <circle cx="10.5" cy="7.5" r="0.5" fill="currentColor" stroke="none"/>
   <circle cx="13.5" cy="7.5" r="0.5" fill="currentColor" stroke="none"/>`
);

export const WindIcon = makeIcon(
    `<path d="M3 8h10a3 3 0 1 0-3-3"/>
   <path d="M3 12h14a3 3 0 1 1-3 3"/>
   <path d="M3 16h7a3 3 0 1 0-3 3"/>`
);

export const ThermometerIcon = makeIcon(
    `<path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
   <circle cx="11.5" cy="17.5" r="1.5" fill="currentColor" stroke="none"/>`
);

export const DropletIcon = makeIcon(
    `<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>`
);

export const ShieldIcon = makeIcon(
    `<path d="M12 2l7 4v5c0 5.25-3.5 9.74-7 11-3.5-1.26-7-5.75-7-11V6l7-4z"/>
   <path d="M9 12l2 2 4-4"/>`
);

export const AlertIcon = makeIcon(
    `<path d="M12 9v4"/>
   <circle cx="12" cy="16" r="0.5" fill="currentColor" stroke="none"/>
   <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>`
);

export const MaskIcon = makeIcon(
    `<path d="M4 10c0-3 3-6 8-6s8 3 8 6-3 5-8 7-8-2-8-5z"/>
   <path d="M8 11h2"/>
   <path d="M14 11h2"/>
   <path d="M4 10c2 0 3 1 4 1s2-1 4-1 3 1 4 1 2-1 4-1"/>`
);

export const HomeIcon = makeIcon(
    `<path d="M3 10l9-7 9 7v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9z"/>
   <path d="M9 21V12h6v9"/>`
);

export const ActivityIcon = makeIcon(
    `<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>`
);

export const EyeIcon = makeIcon(
    `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
   <circle cx="12" cy="12" r="3"/>`
);
