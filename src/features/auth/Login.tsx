import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from './authSlice';
import axios from 'axios';
import { Button, Input, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, RocketFilled, SunOutlined, MoonOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const { Title, Text } = Typography;

const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [error, setError] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-surface-50 transition-colors duration-700">
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-6 right-6 z-50">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            shape="circle" 
            size="large"
            icon={theme === 'dark' ? <SunOutlined /> : <MoonOutlined />} 
            onClick={toggleTheme}
            className="!bg-surface-100/50 backdrop-blur-md !border-border shadow-lg transition-all text-content !w-12 !h-12"
          />
        </motion.div>
      </div>
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] animate-pulse-slow"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-accent/20 blur-[120px] animate-pulse-slow"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className="w-full max-w-[440px] z-10"
      >
        <Card className="glass-card !border-0 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary via-secondary to-accent"></div>
          
          <div className="flex flex-col items-center mb-10 mt-6 text-center">
            <motion.div
              initial={{ rotate: -20, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
              className="w-16 h-16 bg-gradient-to-br from-primary to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg transform mb-6"
            >
              <RocketFilled className="text-3xl text-white" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Title level={1} className="!text-3xl font-black tracking-tight !mb-2 bg-clip-text text-transparent bg-gradient-to-r from-content via-content-muted to-content">
                TaskFlow
              </Title>
              <Text className="text-content-muted font-medium tracking-wide">
                ELEVATE YOUR WORKFLOW WITH SEAMLESS ARCHITECTURAL PRECISION
              </Text>
            </motion.div>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                className="mb-6"
              >
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 p-4 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400">
                  <Text className="text-inherit font-medium">{error}</Text>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Formik
            initialValues={{ username: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                if (process.env.NODE_ENV !== 'test') {
                  await new Promise(resolve => setTimeout(resolve, 800));
                }
                const response = await axios.post('/login', {
                  username: values.username.trim(),
                  password: values.password.trim(),
                });
                dispatch(login(response.data));
                message.success({ content: 'Welcome back!', className: 'rounded-xl' });
                navigate('/');
              } catch {
                setError('Invalid username or password');
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="flex flex-col gap-5">
                <div className="relative group">
                  <Field name="username">
                    {({ field }: { field: import('formik').FieldInputProps<string> }) => (
                      <Input
                        {...field}
                        size="large"
                        placeholder="Username"
                        prefix={<UserOutlined className="text-content-subtle group-hover:text-primary transition-colors" />}
                        status={touched.username && errors.username ? 'error' : ''}
                        className="!bg-surface-50/50 !border-0 !rounded-2xl !h-14 font-medium hover:!bg-surface-100/50 transition-all shadow-inner-sm"
                      />
                    )}
                  </Field>
                  <AnimatePresence>
                    {touched.username && errors.username && (
                      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-red-500 text-xs mt-1 ml-2 font-semibold uppercase">{errors.username}</motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="relative group">
                  <Field name="password">
                    {({ field }: { field: import('formik').FieldInputProps<string> }) => (
                      <Input.Password
                        {...field}
                        size="large"
                        placeholder="Password"
                        prefix={<LockOutlined className="text-content-subtle group-hover:text-primary transition-colors" />}
                        status={touched.password && errors.password ? 'error' : ''}
                        className="!bg-surface-50/50 !border-0 !rounded-2xl !h-14 font-medium hover:!bg-surface-100/50 transition-all shadow-inner-sm"
                      />
                    )}
                  </Field>
                  <AnimatePresence>
                    {touched.password && errors.password && (
                      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-red-500 text-xs mt-1 ml-2 font-semibold uppercase">{errors.password}</motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="mt-4">
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    block
                    loading={isSubmitting}
                    className="!h-14 !rounded-2xl !bg-primary hover:!bg-primary/90 !border-0 text-lg font-bold shadow-lg shadow-primary/20 transition-all uppercase tracking-wider"
                  >
                    {isSubmitting ? 'Authenticating...' : 'Sign In'}
                  </Button>
                </motion.div>
                
                <div className="mt-8 p-5 bg-surface-100/50 rounded-3xl border border-border-subtle text-center">
                  <Text className="text-content-subtle text-[10px] font-bold uppercase tracking-widest block mb-2">Internal Access</Text>
                  <div className="flex justify-center gap-4 text-xs font-mono">
                    <Text className="text-content-muted">USR: <span className="text-primary font-bold">test</span></Text>
                    <div className="w-px h-3 bg-border"></div>
                    <Text className="text-content-muted">PWD: <span className="text-primary font-bold">test123</span></Text>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
