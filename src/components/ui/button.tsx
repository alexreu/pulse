import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Le focus n'est pas stylé ici : `:focus-visible` est défini une fois dans
 * les styles de base, pour que tout l'applicatif partage le même anneau.
 */
const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap",
    "border border-transparent bg-clip-padding font-medium select-none",
    "transition-[background-color,border-color,box-shadow,color] duration-200 ease-out-soft",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-primary text-primary-foreground shadow-subtle",
          "hover:bg-brand-hover hover:shadow-lifted",
          // Filet clair en haut : de la profondeur sans dégradé visible.
          "inset-shadow-[0_1px_0_oklch(1_0_0/0.16)]",
        ],
        secondary: [
          "border-border bg-surface text-foreground shadow-subtle",
          "hover:border-line-strong hover:bg-sunk",
        ],
        ghost: "text-muted-foreground hover:bg-sunk hover:text-foreground",
        danger: [
          "border-danger/25 bg-danger-tint text-danger",
          "hover:border-danger/45 hover:bg-danger hover:text-primary-foreground",
        ],
        link: "text-brand-text underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 rounded-md px-3 text-label",
        md: "h-9 rounded-md px-3.5 text-body",
        lg: "h-10 rounded-lg px-5 text-body",
        icon: "size-9 rounded-md",
        "icon-sm": "size-8 rounded-md",
      },
    },
    defaultVariants: { variant: "secondary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { buttonVariants };
