import { useController, Control } from "react-hook-form";
import ToggleSwitch from "./Switch";

interface Props {
  label: string;
  Icon: React.ElementType;
  name: string; // Field name for react-hook-form
  control: Control<any>; // Control from useForm
  defaultValue?: boolean;
}

export default function SwitchInput({ 
  label, 
  Icon, 
  name, 
  control, 
  defaultValue = false 
}: Props) {
  const { field } = useController({
    name,
    control,
    defaultValue
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm cursor-pointer text-foreground">
            {label}
          </span>
        </div>
        <ToggleSwitch
          checked={field.value}
          onClick={() => field.onChange(!field.value)}
        />
      </div>
    </div>        
  );
}