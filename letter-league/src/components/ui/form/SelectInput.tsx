import React from "react";
import { Controller, Control, FieldPath, FieldValues } from "react-hook-form";
import Label from "./Label";

export interface Option<T = string | number> {
  value: T;
  label: string;
}

interface SelectDropdownProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  T extends string | number = string | number
> extends Omit<React.ComponentProps<"select">, 'onChange' | 'value' | 'name'> {
  // Form-related props
  name: TName;
  control: Control<TFieldValues>;
  
  // Component props
  label?: string;
  subText?: string;
  placeholder?: string;
  required?: boolean;
  centerText?: boolean;
  options: Option<T>[];
  
  // Optional custom onChange (in addition to form handling)
  onChange?: (value: T, event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectDropdown = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  T extends string | number = string | number
>({
  name,
  control,
  label,
  subText,
  centerText,
  required = false,
  options,
  placeholder,
  onChange: customOnChange,
  className,
  ...props
}: SelectDropdownProps<TFieldValues, TName, T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
          const selectedValue = e.target.value;
          
          // Find the original option to get the correct typed value
          const selectedOption = options.find(option => String(option.value) === selectedValue);
          
          if (selectedOption) {
            // Update form state
            field.onChange(selectedOption.value);
            
            // Call custom onChange if provided
            customOnChange?.(selectedOption.value, e);
          }
        };

        return (
          <div className="flex flex-col w-full gap-0.5">
            {label && <Label text={label} required={required} />}
            
            <select
              className={`
                ${centerText ? 'text-center' : ''}
                ${fieldState.error ? "border-error" : "border-border"}
                border px-3 py-2 text-sm rounded-md font-monos bg-background focus:border-primary/30 outline-none cursor-pointer
                ${className || ''}`}
              ref={field.ref}
              onChange={handleChange}
              onBlur={field.onBlur}
              value={field.value !== undefined ? String(field.value) : ''}
              required={required}
              {...props}
            >
              {placeholder && (
                <option value="" disabled>
                  {placeholder}
                </option>
              )}
              {options.map((option) => (
                <option key={String(option.value)} value={String(option.value)}>
                  {option.label}
                </option>
              ))}
            </select>
            
            {fieldState.error && (
              <div className="text-xs text-error">
                {fieldState.error.message}
              </div>
            )}
            
            {subText && !fieldState.error && (
              <div className="text-xs text-foreground-muted">
                {subText}
              </div>
            )}
          </div>
        );
      }}
    />
  );
};

SelectDropdown.displayName = "SelectDropdown";

export default SelectDropdown;