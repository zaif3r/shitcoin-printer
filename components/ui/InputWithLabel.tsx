import * as React from "react";
import { Label } from "@/components/ui/label";

import { cn } from "@/utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const InputWithLabel = React.forwardRef<
    React.ElementRef<typeof Label>,
    React.ComponentPropsWithoutRef<typeof Label>
>(({ className, children, title, ...props }) => {
    return (
        <div className={cn("grid w-full items-center gap-1.5", className)}>
            <Label {...props}>{title}</Label>
            {children}
        </div>
    );
});

InputWithLabel.displayName = "InputWithLabel";

export { InputWithLabel }
