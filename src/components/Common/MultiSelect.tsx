import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';

interface MultiSelectProps {
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
  className?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ 
  options, 
  selectedValues, 
  onChange, 
  placeholder, 
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectAll = () => {
    onChange(options);
  };

  const handleDeselectAll = () => {
    onChange([]);
  };

  const handleToggleOption = (optionValue: string) => {
    if (selectedValues.includes(optionValue)) {
      onChange(selectedValues.filter(v => v !== optionValue));
    } else {
      onChange([...selectedValues, optionValue]);
    }
  };

  const removeTag = (tagValue: string) => {
    onChange(selectedValues.filter(v => v !== tagValue));
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        className="min-h-[40px] border border-gray-300 rounded-md px-3 py-2 cursor-pointer bg-white flex flex-wrap gap-1 items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedValues.length === 0 ? (
          <span className="text-gray-500">{placeholder}</span>
        ) : (
          <>
            {selectedValues.map(val => (
              <span
                key={val}
                className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800"
              >
                {val}
                <X
                  size={12}
                  className="ml-1 cursor-pointer hover:text-blue-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTag(val);
                  }}
                />
              </span>
            ))}
          </>
        )}
        <ChevronDown size={16} className="ml-auto text-gray-400" />
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          <div className="px-3 py-2 border-b border-gray-200 flex gap-2">
            <button
              onClick={handleSelectAll}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              全选
            </button>
            <button
              onClick={handleDeselectAll}
              className="text-xs text-gray-600 hover:text-gray-800"
            >
              清空
            </button>
          </div>
          {options.map(option => (
            <div
              key={option}
              className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center"
              onClick={() => handleToggleOption(option)}
            >
              <div className="flex items-center justify-center w-4 h-4 mr-2">
                {selectedValues.includes(option) && <Check size={14} className="text-blue-600" />}
              </div>
              <span className="text-sm">{option}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelect; 