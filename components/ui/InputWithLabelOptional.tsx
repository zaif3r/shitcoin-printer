import * as React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "./checkbox";

import { cn } from "@/utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const InputWithLabelOptional = React.forwardRef<
    React.ElementRef<typeof Label>,
    React.ComponentPropsWithoutRef<typeof Label & typeof Checkbox>
>(({ className, children, title, checked, onCheckedChange }, ref) => {
    const inputChildClass =
        children && checked == true
            ? "opacity-100 h-10 visible"
            : "opacity-0 h-0 invisible";
    return (
        <div className={cn("grid w-full items-center gap-1.5 relative", className)}>
            <Label ref={ref}>
                <div className="flex flex-row items-center gap-2">
                    <Checkbox
                        checked={checked}
                        onCheckedChange={onCheckedChange}
                        className="-mt-0.5"
                    />
                    {title}
                </div>
            </Label>
            <div
                className={cn("transition-all ease-in-out", inputChildClass)}
            >
                {children}
            </div>
        </div>
    );
});

InputWithLabelOptional.displayName = "InputWithLabelOptional";

export { InputWithLabelOptional };
