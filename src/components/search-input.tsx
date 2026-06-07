type SearchInputProps = {
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
};

export function SearchInput({ placeholder, value, onChange }: SearchInputProps) {
  return (
    <input
      type="search"
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
      style={{ width: '100%', maxWidth: 420, padding: 12, border: '1px solid var(--border-strong)', borderRadius: 10 }}
    />
  );
}
