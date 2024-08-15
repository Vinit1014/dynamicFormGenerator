
import React, { useState, useEffect } from 'react';
import { z, ZodObject, ZodSchema } from 'zod';

type FieldType = 'text' | 'textarea' | 'dropdown' | 'radio' | 'checkbox' | 'file';

interface FieldConfig {
  id: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[]; // For dropdown, radio, and checkbox fields
}

interface DynamicFormProps {
  config: FieldConfig[];
}

const createFormSchema = (config: FieldConfig[]): ZodObject<any> => {
  const schemaShape: { [key: string]: ZodSchema } = {};

  config.forEach(field => {
    switch (field.type) {
      case 'text':
      case 'textarea':
        schemaShape[field.id] = z.string().min(1, `${field.label} is required`);
        break;
      case 'dropdown':
      case 'radio':
        schemaShape[field.id] = z.string().min(1, `Please select an option for ${field.label}`);
        break;
      case 'checkbox':
        schemaShape[field.id] = z.array(z.string()).min(1, `Please select at least one option for ${field.label}`);
        break;
      case 'file':
        schemaShape[field.id] = z.any().optional(); // Optional by default
        break;
      default:
        break;
    }
  });

  return z.object(schemaShape);
};

const DynamicForm: React.FC<DynamicFormProps> = ({ config }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const handleChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const schema = createFormSchema(config);

    const validationResult = schema.safeParse(formData);

    if (validationResult.success) {
      console.log('Form submitted successfully:', formData);
      setErrors({});
    } else {
      const errorMessages = validationResult.error.flatten().fieldErrors;
      setErrors(errorMessages as Record<string, string[]>);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {config.map((field) => {
        const inputId = `form-field-${field.id}`;
        return (
          <div key={field.id} className="space-y-1">
            <label htmlFor={inputId} className="block text-sm font-medium">{field.label}</label>
            
            {/* Dynamic field rendering */}
            {field.type === 'text' && (
              <input
                id={inputId}
                type="text"
                value={formData[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                required={field.required}
                className="w-full px-3 py-2 border rounded"
              />
            )}
            {field.type === 'textarea' && (
              <textarea
                id={inputId}
                value={formData[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                required={field.required}
                className="w-full px-3 py-2 border rounded"
              />
            )}
            {field.type === 'dropdown' && (
              <select
                id={inputId}
                value={formData[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                required={field.required}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">Select an option</option>
                {field.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
            {field.type === 'radio' && (
              <>
                {field.options?.map((option) => (
                  <label key={option} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={inputId}
                      value={option}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      required={field.required}
                      className="form-radio"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </>
            )}
            {field.type === 'checkbox' && (
              <>
                {field.options?.map((option) => (
                  <label key={option} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name={inputId}
                      value={option}
                      onChange={(e) => {
                        const values = formData[field.id] || [];
                        if (e.target.checked) {
                          handleChange(field.id, [...values, option]);
                        } else {
                          handleChange(field.id, values.filter((val: string) => val !== option));
                        }
                      }}
                      required={field.required}
                      className="form-checkbox"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </>
            )}
            {field.type === 'file' && (
              <input
                id={inputId}
                type="file"
                onChange={(e) => handleChange(field.id, e.target.files?.[0] || null)}
                required={field.required}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border file:border-gray-300 file:bg-gray-50"
              />
            )}

            {/* Displaying error message if exists */}
            {errors[field.id] && (
              <p className="text-red-500 text-sm">{errors[field.id][0]}</p>
            )}
          </div>
        );
      })}
      <button type="submit" className="px-4 py-2 bg-gray-500 text-white rounded">Submit</button>
    </form>
  );
};

export default DynamicForm;
