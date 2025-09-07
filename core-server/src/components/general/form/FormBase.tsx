"use client"

import Button from "@/components/ui/Button";
import { Save } from "lucide-react";
import { UseFormReturn, FieldValues } from "react-hook-form";

interface Props<T extends FieldValues> {
  form: UseFormReturn<T>;
  children: React.ReactNode;
  onSubmit: (data: T) => void; 
  btnTxt?: string;
  BtnIcon?: React.ElementType;
}

export default function FormBase<T extends FieldValues>({
  form,
  children,
  onSubmit,
  btnTxt = "Update",
  BtnIcon = Save
}: Props<T>) {
  return (
    <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
      {children}

      <Button
        className="w-full"
        type="submit"
        isLoadingExternal={form.formState.isSubmitting}
      >
        {BtnIcon && <BtnIcon size={16} />}
        {btnTxt}
      </Button>
    </form>
  );
}
