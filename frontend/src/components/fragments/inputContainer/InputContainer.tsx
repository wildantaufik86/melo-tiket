import React from "react";

interface InputContainerProps {
  type: string;
  name: string;
  value?: string | number;
  placeholder?: string;
  setValue?: (value: string) => void;
  setFile?: (file: File | null) => void;
  required?: boolean;
  readOnly?: boolean;
  accept?: string;
}

export default function InputContainer({
  type,
  name,
  value,
  placeholder = '',
  setValue,
  setFile,
  required = false,
  readOnly = false,
  accept
}: InputContainerProps) {
  const label = name.length > 0 ? name[0].toUpperCase() + name.slice(1) : '';
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type == 'file' && setFile){
      setFile(e.target.files ? e.target.files[0] : null);
    } else if (setValue) {
      setValue(e.target.value);
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm" htmlFor={name}>{label}</label>
      <input
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        {...(type !== 'file' && { value: value ?? ''})}
        {...(type === 'file' && { accept: accept })}
        onChange={handleChange}
        className="focus:outline-none text-sm bg-bg-secondary border border-black/30 px-2 py-1 rounded-sm"
        autoComplete="off"
        required={required}
        readOnly={readOnly}
      />
    </div>
  );
}
