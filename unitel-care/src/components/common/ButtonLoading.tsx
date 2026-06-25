import { Loader2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";
import type React from "react";

interface ButtonLoadingProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  asChild?: boolean;
}

export default function ButtonLoading({ loading, disabled, children, ...props }: ButtonLoadingProps) {
  return (
    <Button {...props} disabled={disabled || loading}>
      {loading && <Loader2 className="animate-spin" />}
      {children}
    </Button>
  );
}
