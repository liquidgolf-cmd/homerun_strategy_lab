import { useState, useEffect } from 'react';
import type { ModuleConfig, Question } from '../types';

interface ManualFormProps {
  config: ModuleConfig;
  existingData: Record<string, any>;
  onSave: (data: { formData: Record<string, any> }) => void;
  onComplete: () => void;
  onSwitchToAI: () => void;
}

export default function ManualForm({
  config,
  existingData,
  onSave,
  onComplete,
  onSwitchToAI,
}: ManualFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>(existingData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Auto-save on change
    const timer = setTimeout(() => {
      onSave({ formData });
    }, 1000);

    return () => clearTimeout(timer);
  }, [formData]);

  const handleChange = (questionId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [questionId]: value }));
    // Clear error for this field
    if (errors[questionId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    config.questions.forEach((question) => {
      if (question.required && !formData[question.id]?.trim()) {
        newErrors[question.id] = 'This field is required';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onComplete();
    }
  };

  const renderQuestion = (question: Question) => {
    const value = formData[question.id] || '';
    const error = errors[question.id];

    switch (question.type) {
      case 'textarea':
        return (
          <textarea
            id={question.id}
            value={value}
            onChange={(e) => handleChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent resize-none ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            rows={4}
          />
        );

      case 'select':
        return (
          <select
            id={question.id}
            value={value}
            onChange={(e) => handleChange(question.id, e.target.value)}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select an option...</option>
            {question.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'multiselect':
        // For simplicity, treating multiselect as textarea with comma-separated values
        return (
          <textarea
            id={question.id}
            value={value}
            onChange={(e) => handleChange(question.id, e.target.value)}
            placeholder={question.placeholder || 'Enter items separated by commas'}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent resize-none ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            rows={3}
          />
        );

      default:
        return (
          <input
            type="text"
            id={question.id}
            value={value}
            onChange={(e) => handleChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-primary">{config.title}</h2>
            <p className="text-secondary mt-2">{config.description}</p>
          </div>
          <button
            onClick={onSwitchToAI}
            className="text-sm text-primary hover:underline"
          >
            Switch to AI Chat
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
        <div className="space-y-8">
          {config.questions.map((question, _index) => (
            <div key={question.id}>
              <label
                htmlFor={question.id}
                className="block text-lg font-semibold text-gray-900 mb-2"
              >
                {question.label}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {question.helpText && (
                <p className="text-sm text-gray-600 mb-2">{question.helpText}</p>
              )}
              {renderQuestion(question)}
              {errors[question.id] && (
                <p className="text-red-500 text-sm mt-1">{errors[question.id]}</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => onSave({ formData })}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Save Progress
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary-dark transition-colors"
          >
            Complete & Generate Review
          </button>
        </div>
      </form>
    </div>
  );
}

