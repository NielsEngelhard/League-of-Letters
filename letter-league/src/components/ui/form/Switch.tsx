interface Props {
    checked: boolean;
    onClick: () => void;
    disabled?: boolean;
}

const ToggleSwitch = ({ checked, onClick, disabled = false }: Props) => {
  return (
    <div className="flex items-center">
      <button
        type="button"
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-primary' : 'bg-gray-200'
        } ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled}
      >
        <span
          className={`${
            checked ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
        />
      </button>
    </div>
  );
};

export default ToggleSwitch;