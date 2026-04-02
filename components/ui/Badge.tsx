interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "danger" | "warning" | "info";
  className?: string;
}

const variantStyles: Record<string, string> = {
  default: "bg-border text-foreground",
  success: "bg-success/20 text-success",
  danger: "bg-danger/20 text-danger",
  warning: "bg-warning/20 text-warning",
  info: "bg-primary/20 text-primary",
};

export default function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
