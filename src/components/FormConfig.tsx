// src/components/FormConfig.tsx
import React from 'react';
import { FormFieldConfig } from '../types/formTypes';

interface FormConfigProps {
  config: FormFieldConfig[];
  onLoadConfig: (config: FormFieldConfig[]) => void;
}

const FormConfig: React.FC<FormConfigProps> = ({ config, onLoadConfig }) => {
  const saveConfig = () => {
    const jsonConfig = JSON.stringify(config, null, 2);
    const blob = new Blob([jsonConfig], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'form-config.json';
    link.click();
  };

  const loadConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const loadedConfig = JSON.parse(fileReader.result as string);
      console.log(loadConfig);
      onLoadConfig(loadedConfig);
    };
    if (event.target.files) {
      fileReader.readAsText(event.target.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <button onClick={saveConfig} className="px-4 py-2 bg-gray-800 text-white rounded">Save Config</button>
      <input type="file" onChange={loadConfig} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border file:border-gray-300 file:bg-gray-50" />
    </div>
  );
};

export default FormConfig;
