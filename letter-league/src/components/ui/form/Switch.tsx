interface Props {
    checked: boolean;
    onClick: () => void;
}

const ToggleSwitch = ({ checked, onClick }: Props) => {
  return (
    <div className="flex items-center">
      <button
        type="button"
        onClick={onClick}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-primary' : 'bg-gray-200'
        }`}
        role="switch"
        aria-checked={checked}
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