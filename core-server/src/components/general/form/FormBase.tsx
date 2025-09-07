"use client"

import { useMessageBar } from "@/components/layout/MessageBarContext";
import Button from "@/components/ui/Button";
import ErrorText from "@/components/ui/text/ErrorText";
import { ServerResponse } from "@/lib/response-handling/response-factory";
import { Save } from "lucide-react";
import { UseFormReturn, FieldValues } from "react-hook-form";

interface Props<TFormData extends FieldValues, TResponseData = any> {
  form: UseFormReturn<TFormData>;
  children: React.ReactNode;
  
  // Generic submit function that returns a Promise with your API response structure
  onSubmit: (data: TFormData) => Promise<ServerResponse<TResponseData>>;
  
  // Success callback - called when response.ok is true and data exists
  onSuccess?: (data: TResponseData) => void;
  
  // Error callback - called when request fails or response.ok is false
  onError?: (error?: any) => void;

  successMsg?: string;
  
  // UI props
  btnTxt?: string;
  BtnIcon?: React.ElementType;
}

export default function FormBase<TFormData extends FieldValues, TResponseData = any>({
  form, children, onSubmit, onSuccess, onError, successMsg, btnTxt = "Update", BtnIcon = Save
}: Props<TFormData, TResponseData>) {
  const msgBar = useMessageBar();

  const handleSubmit = async (data: TFormData) => {
    try {
      const response = await onSubmit(data);
      if (response.ok && response.data) {
        onSuccess?.(response.data);
        msgBar.pushSuccessMsg(successMsg);
      } else {
        msgBar.pushErrorMsg(response.errorMsg);
      }
    } catch (error) {
      onError?.(error);
    }
  };

  return (
    <form className="space-y-8" onSubmit={form.handleSubmit(handleSubmit)}>
      {children}
      
      <Button
        className="w-full"
        type="submit"
        isLoadingExternal={form.formState.isSubmitting}
      >
        {BtnIcon && <BtnIcon size={16} />}
        {btnTxt}
      </Button>

      <ErrorText>
          <span>
              {form.formState.errors.root?.message}
          </span>
      </ErrorText>      
    </form>
  );
}