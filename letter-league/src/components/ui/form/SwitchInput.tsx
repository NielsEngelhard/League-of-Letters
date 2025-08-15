import { useController, Control } from "react-hook-form";
import ToggleSwitch from "./Switch";

interface Props {
  label: string;
  description?: string;
  Icon: React.ElementType;
  name: string; // Field name for react-hook-form
  control: Control<any>; // Control from useForm
  defaultValue?: boolean;
  disabled?: boolean;
}

export default function SwitchInput({ 
  label, 
  description,
  Icon, 
  name, 
  control, 
  defaultValue = false,
  disabled = false,
}: Props) {
  const { field } = useController({
    name,
    control,
    defaultValue
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className={`w-4 h-4 ${disabled ? 'text-muted-foreground/50' : 'text-muted-foreground'}`} />
          <div className="space-y-1">
            <span className={`text-sm font-medium cursor-pointer ${disabled ? 'text-muted-foreground' : 'text-foreground'}`}>
              {label}
            </span>
            {description && (
              <p className="text-xs text-muted-foreground max-w-sm">
                {description}
              </p>
            )}
          </div>
        </div>
        <ToggleSwitch
          checked={field.value}
          onClick={() => field.onChange(!field.value)}
          disabled={disabled}
        />
      </div>
    </div>        
  );
}