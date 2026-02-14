import React from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { useTheme } from '../../context/ThemeContext';

interface AntdProviderProps {
  children: React.ReactNode;
}

const AntdProvider: React.FC<AntdProviderProps> = ({ children }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: '#6366f1', // Indigo-500
          borderRadius: 16,
          fontFamily: "'Outfit', 'Inter', system-ui, sans-serif",
          colorBgContainer: isDark ? '#18181b' : '#ffffff', // zinc-900 or white
          colorBgElevated: isDark ? '#27272a' : '#ffffff', // zinc-800 or white
        },
        components: {
          Card: {
            colorBgContainer: 'transparent', 
            paddingLG: 24,
          },
          Button: {
            borderRadiusLG: 12,
            controlHeightLG: 48,
          },
          Input: {
            borderRadiusLG: 12,
            controlHeightLG: 48,
          },
          Modal: {
             borderRadiusLG: 24,
             paddingContentHorizontalLG: 32,
             paddingMD: 32,
          }
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default AntdProvider;
