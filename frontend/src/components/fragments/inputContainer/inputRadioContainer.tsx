interface InputRadioProps {
  name: string;
  options: { label: string; value: string }[];
  selectedValue?: string;
  setValue: (value: string) => void;
  required?: boolean;
}

export default function InputRadioContainer({
  name,
  options,
  selectedValue,
  setValue,
  required = false,
}: InputRadioProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm">{name}</label>
      <div className="flex items-center gap-4">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-1">
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={selectedValue === opt.value}
              onChange={(e) => setValue(e.target.value)}
              required={required}
            />
            {opt.label}
          </label>
        ))}
      </div>
    </div>
  );
}
