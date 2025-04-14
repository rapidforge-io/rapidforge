import React, { useState, useRef } from 'react';
import { SlInput, SlDropdown, SlMenu, SlMenuItem } from '@shoelace-style/shoelace/dist/react';
import { useCanvasItems } from './App';

export default function AutocompleteInput(props) {
  const { pageMetaData } = useCanvasItems();
  const {options, handlePropOnChange, value } = props;
  const [filtered, setFiltered] = useState<string[]>([]);
  const dropdownRef = useRef(null);

  const handleInput = (event: CustomEvent) => {
    const inputVal = event.target.value;
    handlePropOnChange("action", inputVal)

    if (inputVal.trim()) {
      const matches = options.filter(opt =>
        opt.toLowerCase().includes(inputVal.toLowerCase())
      );
      setFiltered(matches);
      dropdownRef.current?.show();
    } else {
      setFiltered([]);
      dropdownRef.current?.hide();
    }
  };

  const handleSelect = (val: string) => {
    handlePropOnChange("action", val);
    setFiltered([]);
    dropdownRef.current?.hide();
  };

  return (
    <>
     <style>
    {`
      sl-menu-item::part(base) {
        max-width: 200px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    `}
  </style>
    <SlDropdown ref={dropdownRef} >
      <SlInput
        slot="trigger"
        value={value || ''}
        size={"small"}
        onSlInput={handleInput}
        placeholder="Form Action"
        clearable
      />
      {filtered.length > 0 && (
        <SlMenu>
          {filtered.map(item => (
            <SlMenuItem key={item} onClick={() => handleSelect(`${pageMetaData.baseUrl}/webhook/${item}`)}>
              {item}
            </SlMenuItem>
          ))}
        </SlMenu>
      )}
    </SlDropdown>
    </>
  );
}
