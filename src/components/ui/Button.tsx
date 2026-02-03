import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 disabled:pointer-events-none disabled:opacity-50",
	{
		variants: {
			variant: {
				default: "bg-white text-black hover:bg-white/90",
				secondary:
					"bg-white/10 border border-white/10 text-white hover:bg-white/15",
				ghost: "text-white/60 hover:text-white hover:bg-white/5",
				outline: "border border-white/20 text-white hover:bg-white/5",
			},
			size: {
				default: "h-10 px-5",
				sm: "h-8 px-3 text-xs",
				lg: "h-11 px-6",
				icon: "h-9 w-9",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		);
	},
);
Button.displayName = "Button";

export { Button, buttonVariants };
