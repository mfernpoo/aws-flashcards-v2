import React from 'react';

interface FileImportInputProps {
  inputRef: React.RefObject<HTMLInputElement>;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  inputId: string;
  descriptionId: string;
}

export const FileImportInput: React.FC<FileImportInputProps> = ({
  inputRef,
  onChange,
  inputId,
  descriptionId,
}) => {
  return (
    <div className="sr-only">
      <label htmlFor={inputId}>Importar mazo desde archivo</label>
      <p id={descriptionId}>Formatos aceptados: JSON, XLSX y XLS.</p>
      <input
        id={inputId}
        type="file"
        ref={inputRef}
        onChange={onChange}
        accept=".json,.xlsx,.xls"
        aria-describedby={descriptionId}
      />
    </div>
  );
};
