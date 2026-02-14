import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import { setTasks, addTask, updateTask, deleteTask, type Task, setLoading } from './tasksSlice';
import { logout } from '../auth/authSlice';
import axios from 'axios';
import { Button, Card, Modal, message, Typography, Popconfirm, Input } from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  LogoutOutlined, SearchOutlined, MoonOutlined, 
  SunOutlined 
} from '@ant-design/icons';
import TaskForm from './TaskForm';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import SkeletonTask from './SkeletonTask';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state: RootState) => state.tasks);
  const { theme, toggleTheme } = useTheme();
  const hasFetched = useRef(false);
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText, setDebouncedSearchText] = useState('');

  // Debounce search text
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchText]);

  const fetchTasks = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      if (process.env.NODE_ENV !== 'test') {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      const response = await axios.get('/tasks');
      dispatch(setTasks(response.data));
    } catch {
      message.error({ content: 'Failed to fetch tasks', className: 'rounded-xl' });
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateOrUpdate = async (values: Task) => {
    try {
      if (editingTask) {
        const response = await axios.put(`/tasks/${editingTask.id}`, values);
        dispatch(updateTask(response.data));
        message.success({ content: 'Task updated', className: 'rounded-xl' });
      } else {
        const response = await axios.post('/tasks', values);
        dispatch(addTask(response.data));
        message.success({ content: 'Task created', className: 'rounded-xl' });
      }
      setIsModalVisible(false);
      setEditingTask(undefined);
    } catch {
      message.error({ content: 'Operation failed', className: 'rounded-xl' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/tasks/${id}`);
      dispatch(deleteTask(id));
      message.success({ content: 'Task deleted', className: 'rounded-xl' });
    } catch {
      message.error({ content: 'Failed to delete task', className: 'rounded-xl' });
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesSearch = task.title.toLowerCase().includes(debouncedSearchText.toLowerCase()) || 
                          task.description.toLowerCase().includes(debouncedSearchText.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'todo': return { color: 'blue', label: 'To Do', bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400' };
      case 'in-progress': return { color: 'orange', label: 'In Progress', bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400' };
      case 'done': return { color: 'emerald', label: 'Done', bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400' };
      default: return { color: 'zinc', label: 'Unknown', bg: 'bg-zinc-50 dark:bg-zinc-900/20', text: 'text-zinc-600 dark:text-zinc-400' };
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 transition-colors duration-700 font-display">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-accent/5 blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Top Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 sm:mb-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Title level={1} className="!mb-1 !text-3xl sm:!text-5xl font-black tracking-tighter !text-content">
              Projects
            </Title>
            <Text className="text-content-muted font-bold uppercase tracking-[0.3em] text-[10px] sm:text-xs opacity-70">
              Management Workspace
            </Text>
          </motion.div>

          <div className="flex items-center gap-2 sm:gap-4 self-end md:self-auto">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                shape="circle" 
                size="large"
                icon={theme === 'dark' ? <SunOutlined /> : <MoonOutlined />} 
                onClick={toggleTheme}
                className="!bg-surface-100 !border-border shadow-sm transition-all text-content !w-12 !h-12"
              />
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                type="primary" 
                size="large"
                icon={<PlusOutlined />} 
                onClick={() => {
                  setEditingTask(undefined);
                  setIsModalVisible(true);
                }}
                className="!bg-primary hover:!bg-primary/90 !border-0 !rounded-2xl px-5 sm:px-8 font-bold shadow-lg shadow-primary/20 !h-12 text-sm sm:text-base"
              >
                New Task
              </Button>
            </motion.div>

            <Button 
              danger 
              size="large"
              shape="circle"
              icon={<LogoutOutlined />} 
              onClick={() => dispatch(logout())}
              className="!border-border hover:!bg-red-50 dark:hover:!bg-red-950/20 shadow-sm !w-12 !h-12"
            />
          </div>
        </header>

        {/* Filters & Actions Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-10 bg-surface-100/30 backdrop-blur-md p-2 sm:p-3 rounded-[2rem] border border-border">
          <div className="relative flex-1 group">
            <SearchOutlined className="absolute left-5 top-1/2 -translate-y-1/2 text-content-subtle group-focus-within:text-primary transition-colors z-10" />
            <Input 
              placeholder="Search tasks..." 
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              variant="borderless"
              className="!bg-surface-50/50 !rounded-2xl !h-14 !pl-12 !pr-4 !text-content font-medium focus:!border-primary transition-all shadow-inner-sm"
            />
          </div>

          <div className="flex items-center overflow-x-auto no-scrollbar pb-1 lg:pb-0">
            <div className="flex items-center bg-surface-50/50 p-1 rounded-2xl border border-border-subtle whitespace-nowrap">
              {['all', 'todo', 'in-progress', 'done'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 sm:px-6 py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${
                    filterStatus === status 
                    ? 'bg-surface-100 text-primary shadow-sm' 
                    : 'text-content-muted hover:text-content'
                  } cursor-pointer`}
                >
                  {status.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Task Grid */}
        <AnimatePresence mode='wait'>
          {loading ? (
            <motion.div 
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonTask key={i} />)}
            </motion.div>
          ) : (
            filteredTasks.reverse().length > 0 ? (
              <motion.div 
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              > 
                {filteredTasks.map((task, i) => {
                  const status = getStatusInfo(task.status);
                  return (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                    >
                      <Card 
                        className="glass-card !p-0 overflow-hidden group border-0 shadow-lg hover:shadow-2xl h-full flex flex-col justify-between"
                        actions={[
                          <button data-testid="edit-task-1" onClick={() => { setEditingTask(task); setIsModalVisible(true); }} className="w-full h-full py-2 flex items-center justify-center text-content-subtle hover:text-primary hover:bg-surface-50/50 transition-all border-r border-border-subtle/50 cursor-pointer">
                            <EditOutlined className="text-lg" />
                          </button>,
                          <Popconfirm title="Delete this task?" onConfirm={() => handleDelete(task.id)} okText="Yes" cancelText="No">
                            <button data-testid="delete-task-1" className="w-full h-full py-2 flex items-center justify-center text-content-subtle hover:text-red-500 hover:bg-red-500/5 transition-all cursor-pointer">
                              <DeleteOutlined className="text-lg" />
                            </button>
                          </Popconfirm>,
                        ]}
                      >
                        <div className="p-6 sm:p-8 flex-1">
                          <div className="flex justify-between items-start mb-6">
                            <div className={`${status.bg} ${status.text} px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border border-current opacity-80 backdrop-blur-sm`}>
                              {status.label}
                            </div>
                            {/* <Dropdown menu={{ items: [{ key: '1', label: 'Feature', icon: <MoreOutlined /> }] }} trigger={['click']}>
                               <MoreOutlined className="text-content-subtle hover:text-content cursor-pointer transition-colors p-1" />
                            </Dropdown> */}
                          </div>
                          
                          <Title level={4} className="!mb-4 !text-xl sm:!text-2xl !font-black !text-content group-hover:!text-primary transition-colors leading-tight">
                            {task.title}
                          </Title>
                          
                          <Text className="text-content-muted/80 leading-relaxed text-sm sm:text-base font-medium block line-clamp-3">
                            {task.description}
                          </Text>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center lg:py-22 text-center"
              >
                <div className="w-24 h-24 bg-surface-100 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-inner-sm">
                  <span className="text-5xl">🔭</span>
                </div>
                <Title level={3} className="!mb-2 !text-content">Nothing here, yet</Title>
                <Text className="text-content-muted font-medium">Create your task to see it appear here in the dashboard.</Text>
                <Button 
                  type="primary" 
                  size="large"
                  onClick={() => setIsModalVisible(true)}
                  className="mt-8 !rounded-xl px-8 !bg-primary !h-12 font-bold shadow-lg"
                >
                  Create Task
                </Button>
              </motion.div>
            )
          )}
        </AnimatePresence>

        <Modal
          title={<span className="text-xl font-black uppercase tracking-widest text-primary flex items-center gap-2">
            {editingTask ? <EditOutlined /> : <PlusOutlined />}
            {editingTask ? 'Edit Strategy' : 'Execute New Plan'}
          </span>}
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            setEditingTask(undefined);
          }}
          footer={null}
          destroyOnHidden
          className="premium-modal p-2 sm:p-6 mb-8 border-b-0"
          centered
        >
          <TaskForm 
            initialValues={editingTask} 
            onSubmit={handleCreateOrUpdate} 
            onCancel={() => setIsModalVisible(false)}
          />
        </Modal>
      </div>
    </div>
  );
};

export default Dashboard;
