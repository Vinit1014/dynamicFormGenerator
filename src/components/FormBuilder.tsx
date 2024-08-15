// // src/components/FormBuilder.tsx
// import React, { useState } from 'react';
// import { FormFieldConfig, FormFieldType } from '../types/formTypes';
// import { nanoid } from 'nanoid';

// const FormBuilder: React.FC<{ onFormConfigChange: (config: FormFieldConfig[]) => void }> = ({ onFormConfigChange }) => {
//   const [fields, setFields] = useState<FormFieldConfig[]>([]);

//   const addField = (type: FormFieldType) => {
//     const newField: FormFieldConfig = {
//       id: nanoid(),
//       label: '',
//       type,
//     };
//     setFields([...fields, newField]);
//     onFormConfigChange([...fields, newField]);
//   };

//   const removeField = (id: string) => {
//     const updatedFields = fields.filter(field => field.id !== id);
//     setFields(updatedFields);
//     onFormConfigChange(updatedFields);
//   };
  
//   const updateField = (id: string, updatedField: Partial<FormFieldConfig>) => {
//     const updatedFields = fields.map(field =>
//       field.id === id ? { ...field, ...updatedField } : field
//     );
//     setFields(updatedFields);
//     onFormConfigChange(updatedFields);
//   };

//   return (
//     <div className="space-y-4">
//       <div className="flex space-x-2">
//         <button
//           onClick={() => addField('text')}
//           className="px-4 py-1 bg-gray-800 text-white rounded"
//         >
//           Add Text Input
//         </button>
//         <button
//           onClick={() => addField('textarea')}
//           className="px-4 py-1 bg-gray-800 text-white rounded"
//         >
//           Add Text Area
//         </button>
//         <button
//           onClick={() => addField('dropdown')}
//           className="px-4 py-1 bg-gray-800 text-white rounded"
//         >
//           Add Dropdown
//         </button>
//         <button
//           onClick={() => addField('checkbox')}
//           className="px-4 py-1 bg-gray-800 text-white rounded"
//         >
//           Add Checkbox
//         </button>
//         <button
//           onClick={() => addField('radio')}
//           className="px-4 py-1 bg-gray-800 text-white rounded"
//         >
//           Add Radio Button
//         </button>
//         <button
//           onClick={() => addField('file')}
//           className="px-4 py-1 bg-gray-800 text-white rounded"
//         >
//           Add File Upload
//         </button>
//       </div>
  
//       {fields.map(field => (
//         <div key={field.id} className="p-4 border rounded space-y-2">
//           <input
//             type="text"
//             placeholder="Label"
//             value={field.label}
//             onChange={e => updateField(field.id, { label: e.target.value })}
//             className="w-full px-3 py-1 border rounded"
//           />
//           <button onClick={() => removeField(field.id)} className="px-3 py-1 bg-red-500 text-white rounded">Remove</button>
//         </div>
//       ))}
//     </div>
//   );
  
// };

// export default FormBuilder;

// src/components/FormBuilder.tsx
import React, { useState } from 'react';
import { FormFieldConfig, FormFieldType } from '../types/formTypes';
import { nanoid } from 'nanoid';

const FormBuilder: React.FC<{ onFormConfigChange: (config: FormFieldConfig[]) => void }> = ({ onFormConfigChange }) => {
  const [fields, setFields] = useState<FormFieldConfig[]>([]);
  const [error, setError] = useState<string | null>(null);

  const addField = (type: FormFieldType) => {
    if (fields.some(field => !field.label)) {
      setError("All fields must have a label.");
      return;
    }

    const newField: FormFieldConfig = {
      id: nanoid(),
      label: '',
      type,
      options: type === 'dropdown' || type === 'radio' || type === 'checkbox' ? [] : undefined,
    };
    setFields([...fields, newField]);
    onFormConfigChange([...fields, newField]);
    setError(null);
  };

  const removeField = (id: string) => {
    const updatedFields = fields.filter(field => field.id !== id);
    setFields(updatedFields);
    onFormConfigChange(updatedFields);
  };

  const updateField = (id: string, updatedField: Partial<FormFieldConfig>) => {
    const updatedFields = fields.map(field =>
      field.id === id ? { ...field, ...updatedField } : field
    );
    setFields(updatedFields);
    onFormConfigChange(updatedFields);
  };

  const addOption = (id: string) => {
    const updatedFields = fields.map(field => {
      if (field.id === id && (field.type === 'dropdown' || field.type === 'radio' || field.type === 'checkbox')) {
        const updatedOptions = [...(field.options || []), ''];
        return { ...field, options: updatedOptions };
      }
      return field;
    });
    setFields(updatedFields);
    onFormConfigChange(updatedFields);
  };

  const updateOption = (id: string, optionIndex: number, value: string) => {
    const updatedFields = fields.map(field => {
      if (field.id === id && (field.type === 'dropdown' || field.type === 'radio' || field.type === 'checkbox')) {
        const updatedOptions = (field.options || []).map((opt, index) => index === optionIndex ? value : opt);
        return { ...field, options: updatedOptions };
      }
      return field;
    });
    setFields(updatedFields);
    onFormConfigChange(updatedFields);
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <button onClick={() => addField('text')} className="px-4 py-1 bg-gray-800 text-white rounded">Add Text Input</button>
        <button onClick={() => addField('textarea')} className="px-4 py-1 bg-gray-800 text-white rounded">Add Text Area</button>
        <button onClick={() => addField('dropdown')} className="px-4 py-1 bg-gray-800 text-white rounded">Add Dropdown</button>
        <button onClick={() => addField('checkbox')} className="px-4 py-1 bg-gray-800 text-white rounded">Add Checkbox</button>
        <button onClick={() => addField('radio')} className="px-4 py-1 bg-gray-800 text-white rounded">Add Radio Button</button>
        <button onClick={() => addField('file')} className="px-4 py-1 bg-gray-800 text-white rounded">Add File Upload</button>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      {fields.map(field => (
        <div key={field.id} className="p-4 border rounded space-y-2">
          <input
            type="text"
            placeholder="Enter label for this field"
            value={field.label}
            onChange={e => updateField(field.id, { label: e.target.value })}
            className="w-full px-3 py-1 border rounded"
          />

          {(field.type === 'dropdown' || field.type === 'radio' || field.type === 'checkbox') && (
            <div className="space-y-2">
              <button onClick={() => addOption(field.id)} className="px-3 py-1 bg-gray-500 text-white rounded">Add Option</button>
              {field.options?.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={e => updateOption(field.id, index, e.target.value)}
                  className="w-full px-3 py-1 border rounded"
                />
              ))}
            </div>
          )}

          <button onClick={() => removeField(field.id)} className="px-3 py-1 bg-red-500 text-white rounded">Remove</button>
        </div>
      ))}
    </div>
  );
};

export default FormBuilder;

