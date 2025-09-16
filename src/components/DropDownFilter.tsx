type DropdownProps = {
  name: string;
  options: any[];
  selected: string;
  onChange: (value: string) => void;
};

export const Dropdown = ({ name, options, selected, onChange }: DropdownProps) => {
  return (
    <div className="dropdown_tabs">
      
      <select
        className="drop_select"
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        
      >
        <option value="" disabled > {name}</option>
        {options.map((opt) => (
          <option key={opt?.name} value={opt?.value}>
            {opt?.name}
          </option>
        ))}
      </select>
    </div>
  );
};
