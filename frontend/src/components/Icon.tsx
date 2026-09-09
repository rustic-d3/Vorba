interface IconProps {
    name: string;
    filled?: boolean;
    size?: number;
    color?: string;
    className?: string;
}

export default function Icon({
    name,
    filled = false,
    size,
    color,
    className = "",
}: IconProps) {
    return (
        <span
            className={`material-symbols-rounded ${filled ? "icon-filled" : "icon-outline"} ${className}`}
            style={{ fontSize: size, color: color }}
            aria-hidden="true"
        >
            {name}
        </span>
    );
}
