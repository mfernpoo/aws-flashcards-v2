import React from 'react';

interface FileImportInputProps {
  inputRef: React.RefObject<HTMLInputElement>;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FileImportInput: React.FC<FileImportInputProps> = ({ inputRef, onChange }) => {
  return (
    <input
      type="file"
      ref={inputRef}
      onChange={onChange}
      accept=".json,.xlsx,.xls"
      className="hidden"
    />
  );
};
