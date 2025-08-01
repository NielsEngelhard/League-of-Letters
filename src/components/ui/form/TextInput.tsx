import React from "react";
import Label from "./Label";

interface InputProps extends React.ComponentProps<"input"> {
    label?: string;
    placeholder?: string;
    errorMsg?: string;
    required?: boolean;
    centerText?: boolean;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    supportedSymbols?: RegExp;

}

const TextInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, centerText, required = false, errorMsg, id, supportedSymbols, onChange, ...props }, ref) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (supportedSymbols) {
        const value = e.target.value;
        const filtered = value.split('').filter(char => supportedSymbols.test(char)).join('');
        if (filtered !== value) {
          e.target.value = filtered; // update the value before passing it on
        }
      }

      // Call external onChange if it exists
      onChange?.(e);
    };

    return (
        <div className="flex flex-col w-full">
            {label && <Label text={label} required={required} />}

            <input
                className={`
                    ${centerText ? 'text-center' : ''}
                    ${errorMsg ? "border-error" : "border-border"}
                    border px-3 py-2 text-sm rounded-md font-monos bg-background`}
                type={type}
                ref={ref}
                onChange={handleChange}
                required={required}
                {...props}
            />
        </div>
    );
});


export default TextInput;