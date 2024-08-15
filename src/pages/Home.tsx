// src/pages/Home.tsx
import React, { useState } from 'react';
import FormBuilder from '../components/FormBuilder';
import DynamicForm from '../components/DynamicForm';
import FormConfig from '../components/FormConfig';
import { FormFieldConfig } from '../types/formTypes';

const Home: React.FC = () => {
  const [formConfig, setFormConfig] = useState<FormFieldConfig[]>([]);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow rounded">
      <h1 className="text-3xl font-bold mb-6">Dynamic Form Generator</h1>

      <FormBuilder onFormConfigChange={setFormConfig} />
      <hr className="my-6" />
      <FormConfig config={formConfig} onLoadConfig={setFormConfig} />
      <hr className="my-6" />
      <DynamicForm config={formConfig} />
    </div>
  );
};

export default Home;
