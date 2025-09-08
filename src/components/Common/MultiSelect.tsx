import React, { useState, useRef, useEffect } from "react";

export interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  id: string;
  label: string;
  options: Option[];
  values: string[];
  onChange: (values: string[]) => void;
  searchable?: boolean;
  placeholder?: string;
  error?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  id,
  label,
  options,
  values,
  onChange,
  searchable = true,
  placeholder = "Select…",
  error,
  className = "",
  disabled = false,
  required = false,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const filtered = query
    ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : options;

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleOptionClick = (optionValue: string) => {
    let newValues;
    if (values.includes(optionValue)) {
      newValues = values.filter((v) => v !== optionValue);
    } else {
      newValues = [...values, optionValue];
    }
    onChange(newValues);
    if (!searchable) {
      setOpen(false);
    }
    setQuery("");
  };

  const selectedLabels = options
    .filter((o) => values.includes(o.value))
    .map((o) => o.label);

  return (
    <div className="relative" ref={ref}>
      {required && values.length === 0 && (
        <input type="hidden" name={id} value="" required />
      )}
      {values.map((val) => (
        <input key={val} type="hidden" name={`${id}[]`} value={val} />
      ))}

      <label htmlFor={id} className="block text-white font-medium mb-2">
        {label}
      </label>

      <div
        id={id}
        role="button"
        aria-disabled={disabled}
        aria-expanded={open}
        className={
          `w-full px-4 py-3 border rounded-lg flex flex-wrap items-center justify-between gap-2 bg-secondary-800 text-white transition-all duration-200 ` +
          (error ? "border-red-500 " : "border-secondary-700 hover:border-primary-500 focus:border-primary-500 ") +
          (disabled ? "opacity-50 cursor-not-allowed " : "cursor-pointer hover:bg-secondary-700 ") +
          className
        }
        onClick={() => {
          if (disabled) return;
          setOpen((o) => !o);
          setQuery("");
        }}
      >
        {selectedLabels.length > 0 ? (
          selectedLabels.map((labelTxt) => (
            <span
              key={labelTxt}
              className="inline-flex items-center px-3 py-1 rounded-full bg-primary-600/20 border border-primary-500/30 text-primary-300 text-sm"
            >
              {labelTxt}
              <button
                type="button"
                className="ml-2 -mr-1 h-4 w-4 flex items-center justify-center rounded-full hover:bg-primary-500 hover:text-white transition-all duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOptionClick(
                    options.find((o) => o.label === labelTxt)?.value || ""
                  );
                }}
              >
                &times;
              </button>
            </span>
          ))
        ) : (
          <span className="text-secondary-400">{placeholder}</span>
        )}
        <svg
          className="w-4 h-4 text-secondary-400 ml-auto transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M6 8l4 4 4-4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {open && (
        <div className="absolute z-10 mt-1 w-full bg-secondary-800 border border-secondary-700 rounded-lg shadow-xl max-h-60 overflow-auto backdrop-blur-sm">
          {searchable && (
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-3 border-b border-secondary-700 bg-secondary-800 text-white placeholder-secondary-400 focus:outline-none focus:border-primary-500"
              placeholder="Search…"
            />
          )}
          <ul>
            {filtered.map((opt) => (
              <li
                key={opt.value}
                className={`px-4 py-3 cursor-pointer transition-all duration-200 ${
                  values.includes(opt.value)
                    ? "bg-primary-600/20 border-l-4 border-primary-500 text-primary-300"
                    : "hover:bg-secondary-700 text-secondary-300 hover:text-white"
                }`}
                onClick={() => handleOptionClick(opt.value)}
              >
                {opt.label}
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-4 py-3 text-secondary-500">No options found</li>
            )}
          </ul>
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
};

export default MultiSelect;
