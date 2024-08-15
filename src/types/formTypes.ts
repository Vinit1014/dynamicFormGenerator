export type FormFieldType = 'text' | 'textarea' | 'dropdown' | 'checkbox' | 'radio' | 'file';

export interface FormFieldConfig{
    id: string;
    label: string;
    type: FormFieldType;
    options?: string[]; // Only for dropdown and radio
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string; // Regex pattern for validation
    conditionalLogic?: {
        dependsOn: string;
        showIfValue: string;
    };
}

export interface FormConfig{
    fields: FormFieldConfig[];
}
