/* eslint-disable */
"use client"

import { useToaster } from "@/components/general/toaster/ToasterContext";
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
  const toaster = useToaster();

  const handleSubmit = async (data: TFormData) => {
    try {
      const response = await onSubmit(data);
      if (response.ok && response.data) {
        handleSuccess(response.data);
      } else {
        handleExpectedError(response.errorMsg);
      }
    } catch {
      handleUnexpectedError();
    }
  };

  function handleSuccess(data: TResponseData) {
    onSuccess?.(data);
    if (successMsg) toaster.successToast(successMsg);
  }

  function handleExpectedError(errorMsg?: string) {
    if (!errorMsg) {
      handleUnexpectedError();
      return;
    }

    onError?.(errorMsg);
    toaster.errorToast(errorMsg);
    form.setError("root", {
        message: errorMsg
    });    
  }

  function handleUnexpectedError() {
    toaster.errorToast("Server error");

    form.setError("root", {
        message: "Server error"
    });    
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
      {children}
      
      <div className="mb-4">
        <Button
          className="w-full"
          type="submit"
          variant="primaryFade"
          isLoadingExternal={form.formState.isSubmitting}
        >
          {BtnIcon && <BtnIcon size={16} />}
          {btnTxt}
        </Button>

        <ErrorText>
            <>{form.formState.errors.root?.message}</>
        </ErrorText>           
      </div>
    </form>
  );
}