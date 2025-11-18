import { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface TemplateConfig {
  sections?: Section[];
  quadrants?: Quadrant[];
  steps?: Step[];
  followUp?: FollowUpField;
}

interface Section {
  id: string;
  label: string;
  description: string;
  inputType: 'text' | 'multiline' | 'list';
  maxItems?: number;
  placeholder?: string;
}

interface Quadrant {
  id: string;
  label: string;
  description: string;
  inputType: string;
  maxItems?: number;
  prompt?: string;
}

interface Step {
  id: string;
  label: string;
  description: string;
  inputType: string;
  minItems?: number;
  maxItems?: number;
  placeholder?: string;
  fields?: string[];
}

interface FollowUpField {
  label: string;
  description: string;
  inputType: string;
  maxItems?: number;
}

interface ExerciseData {
  [key: string]: any;
}

interface Props {
  templateConfig: TemplateConfig;
  initialData?: ExerciseData;
  onChange: (data: ExerciseData) => void;
  readOnly?: boolean;
}

export function ExerciseTemplateRenderer({ templateConfig, initialData = {}, onChange, readOnly = false }: Props) {
  const [data, setData] = useState<ExerciseData>(initialData);

  useEffect(() => {
    onChange(data);
  }, [data]);

  const updateField = (fieldId: string, value: any) => {
    setData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const addListItem = (fieldId: string) => {
    const current = data[fieldId] || [];
    setData(prev => ({
      ...prev,
      [fieldId]: [...current, '']
    }));
  };

  const updateListItem = (fieldId: string, index: number, value: string) => {
    const current = data[fieldId] || [];
    const updated = [...current];
    updated[index] = value;
    updateField(fieldId, updated);
  };

  const removeListItem = (fieldId: string, index: number) => {
    const current = data[fieldId] || [];
    const updated = current.filter((_: any, i: number) => i !== index);
    updateField(fieldId, updated);
  };

  const renderTextInput = (field: Section | Quadrant, value: string = '') => (
    <input
      type="text"
      value={value}
      onChange={(e) => updateField(field.id, e.target.value)}
      placeholder={field.placeholder || field.description}
      disabled={readOnly}
      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100"
    />
  );

  const renderMultilineInput = (field: Section | Quadrant | Step, items: string[] = []) => {
    const maxItems = field.maxItems || 10;
    const currentItems = items.length > 0 ? items : [''];

    return (
      <div className="space-y-3">
        {currentItems.map((item, index) => (
          <div key={index} className="flex gap-2 items-start">
            <div className="flex-1">
              <textarea
                value={item}
                onChange={(e) => updateListItem(field.id, index, e.target.value)}
                placeholder={(field as Section).placeholder || `Item ${index + 1}`}
                disabled={readOnly}
                rows={2}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 resize-none"
              />
            </div>
            {!readOnly && currentItems.length > 1 && (
              <button
                onClick={() => removeListItem(field.id, index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
        {!readOnly && currentItems.length < maxItems && (
          <button
            onClick={() => addListItem(field.id)}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            Add Item
          </button>
        )}
      </div>
    );
  };

  const renderListInput = (step: Step) => {
    const items = data[step.id] || [];

    return (
      <div className="space-y-3">
        {items.map((item: any, index: number) => (
          <div key={index} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            {step.fields ? (
              <div className="space-y-3">
                {step.fields.map(fieldName => (
                  <div key={fieldName}>
                    <label className="block text-sm font-medium text-slate-700 mb-1 capitalize">
                      {fieldName.replace('_', ' ')}
                    </label>
                    <input
                      type="text"
                      value={item[fieldName] || ''}
                      onChange={(e) => {
                        const updated = [...items];
                        updated[index] = { ...updated[index], [fieldName]: e.target.value };
                        updateField(step.id, updated);
                      }}
                      disabled={readOnly}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100"
                    />
                  </div>
                ))}
                {!readOnly && (
                  <button
                    onClick={() => removeListItem(step.id, index)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateListItem(step.id, index, e.target.value)}
                  placeholder={step.placeholder}
                  disabled={readOnly}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100"
                />
                {!readOnly && (
                  <button
                    onClick={() => removeListItem(step.id, index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
        {!readOnly && (
          <button
            onClick={() => {
              const newItem = step.fields
                ? step.fields.reduce((acc, field) => ({ ...acc, [field]: '' }), {})
                : '';
              addListItem(step.id);
            }}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            Add {step.label.includes('Step') ? 'Entry' : 'Item'}
          </button>
        )}
      </div>
    );
  };

  if (templateConfig.sections) {
    return (
      <div className="space-y-8">
        {templateConfig.sections.map((section) => (
          <div key={section.id} className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-2">{section.label}</h3>
            <p className="text-sm text-slate-600 mb-4">{section.description}</p>

            {section.inputType === 'text' && renderTextInput(section, data[section.id])}
            {section.inputType === 'multiline' && renderMultilineInput(section, data[section.id])}
          </div>
        ))}
      </div>
    );
  }

  if (templateConfig.quadrants) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {templateConfig.quadrants.map((quadrant) => (
            <div key={quadrant.id} className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-2">{quadrant.label}</h3>
              <p className="text-sm text-slate-600 mb-4">{quadrant.description}</p>
              {quadrant.prompt && (
                <p className="text-xs text-slate-500 mb-4 italic">{quadrant.prompt}</p>
              )}
              {renderMultilineInput(quadrant, data[quadrant.id])}
            </div>
          ))}
        </div>

        {templateConfig.followUp && (
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-2">{templateConfig.followUp.label}</h3>
            <p className="text-sm text-slate-600 mb-4">{templateConfig.followUp.description}</p>
            {renderMultilineInput(
              { id: 'followUp', ...templateConfig.followUp } as Section,
              data.followUp
            )}
          </div>
        )}
      </div>
    );
  }

  if (templateConfig.steps) {
    return (
      <div className="space-y-8">
        {templateConfig.steps.map((step, index) => (
          <div key={step.id} className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                {index + 1}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-1">{step.label}</h3>
                <p className="text-sm text-slate-600">{step.description}</p>
                {step.minItems && (
                  <p className="text-xs text-slate-500 mt-2">
                    Minimum {step.minItems} items required
                  </p>
                )}
              </div>
            </div>

            {step.inputType === 'list' && renderListInput(step)}
            {step.inputType === 'multiline' && renderMultilineInput(step, data[step.id])}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 rounded-lg text-center text-slate-600">
      Template type not supported yet
    </div>
  );
}
