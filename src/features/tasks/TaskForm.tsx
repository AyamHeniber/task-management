import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Input, Select, Button } from 'antd';
import type { Task } from './tasksSlice';
import { motion, AnimatePresence } from 'framer-motion';

const { Option } = Select;
const { TextArea } = Input;

const TaskSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  status: Yup.string().oneOf(['todo', 'in-progress', 'done']).required('Status is required'),
});

interface TaskFormProps {
  initialValues?: Task;
  onSubmit: (values: Task) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ initialValues, onSubmit, onCancel, isLoading }) => {
  const defaultValues: Task = {
    id: '', 
    title: '',
    description: '',
    status: 'todo',
  };

  return (
    <Formik
      initialValues={initialValues || defaultValues}
      validationSchema={TaskSchema}
      onSubmit={(values) => {
        onSubmit(values);
      }}
      enableReinitialize
    >
      {({ errors, touched, setFieldValue, values }) => (
        <Form className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-xs font-black uppercase tracking-widest text-content-subtle ml-1">Objective Title</label>
            <Field name="title">
              {({ field }: { field: import('formik').FieldInputProps<string> }) => (
                <Input 
                  {...field} 
                  id="title" 
                  placeholder="What needs to be done?"
                  status={touched.title && errors.title ? 'error' : ''} 
                  className="!bg-surface-50/50 !border-border !rounded-xl !h-12 font-medium focus:!border-primary transition-all shadow-inner-sm"
                />
              )}
            </Field>
            <AnimatePresence>
              {touched.title && errors.title && (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[10px] font-bold uppercase ml-1 italic">{errors.title}</motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="text-xs font-black uppercase tracking-widest text-content-subtle ml-1">Context & Details</label>
            <Field name="description">
              {({ field }: { field: import('formik').FieldInputProps<string> }) => (
                <TextArea 
                  {...field} 
                  id="description" 
                  rows={4} 
                  placeholder="Provide some depth to this task..."
                  status={touched.description && errors.description ? 'error' : ''} 
                  className="!bg-surface-100/50 !border-border !rounded-xl font-medium focus:!border-primary transition-all"
                />
              )}
            </Field>
            <AnimatePresence>
              {touched.description && errors.description && (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[10px] font-bold uppercase ml-1 italic">{errors.description}</motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase tracking-widest text-content-subtle ml-1">Execution Status</label>
            <Select
              value={values.status}
              onChange={(value) => setFieldValue('status', value)}
                className="premium-select w-full"
            >
              <Option value="todo"><div className="flex items-center gap-2 font-bold"><div className="w-2 h-2 rounded-full bg-blue-500"></div> TO DO</div></Option>
              <Option value="in-progress"><div className="flex items-center gap-2 font-bold"><div className="w-2 h-2 rounded-full bg-orange-500"></div> IN PROGRESS</div></Option>
              <Option value="done"><div className="flex items-center gap-2 font-bold"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> DONE</div></Option>
            </Select>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-border-subtle mt-2">
            <Button 
              onClick={onCancel}
              className="flex-1 !h-12 !rounded-xl !border-border font-bold text-content-muted hover:!text-content hover:!border-border-muted transition-all"
            >
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={isLoading}
              className="flex-[2] !h-12 !rounded-xl !bg-primary hover:!bg-primary/90 !border-0 font-bold shadow-lg shadow-primary/20"
            >
              {initialValues?.id ? 'Update Strategy' : 'Execute Plan'}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default TaskForm;
