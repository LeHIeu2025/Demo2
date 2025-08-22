import { Box, Text, Button } from "zmp-ui";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  const getIcon = (iconType: string, isActive: boolean) => {
    const color = isActive ? '#04A1B3' : '#9CA3AF';
    
    switch (iconType) {
      case 'home':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill={color}>
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
        );
      case 'orders':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill={color}>
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
        );

      case 'profile':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill={color}>
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const tabs = [
    {
      id: 'home',
      label: 'Trang chủ',
      icon: 'home'
    },
    {
      id: 'orders',
      label: 'Đơn hàng',
      icon: 'orders'
    },

    {
      id: 'profile',
      label: 'Hồ sơ',
      icon: 'profile'
    }
  ];

  return (
    <Box 
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2"
      style={{
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
        zIndex: 1000
      }}
    >
      <Box className="flex justify-around items-center">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant="tertiary"
            size="medium"
            onClick={() => onTabChange(tab.id)}
            className="flex flex-col items-center justify-center min-w-0 flex-1"
            style={{
              background: 'transparent',
              border: 'none',
              padding: '8px 4px',
              height: 'auto'
            }}
          >
            <Box className="flex flex-col items-center space-y-1">
              <Box className="flex items-center justify-center" style={{ minHeight: '20px' }}>
                {getIcon(tab.icon, activeTab === tab.id)}
              </Box>
              <Text 
                style={{ 
                  fontSize: '12px',
                  color: activeTab === tab.id ? '#04A1B3' : '#6b7280',
                  fontWeight: activeTab === tab.id ? '600' : '400',
                  lineHeight: '1'
                }}
              >
                {tab.label}
              </Text>
            </Box>
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default BottomNavigation;