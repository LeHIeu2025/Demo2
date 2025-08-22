import { Box, Text, Button, Icon } from "zmp-ui";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  leftAction?: {
    icon: string;
    onClick: () => void;
  };
  rightAction?: {
    icon: string;
    onClick: () => void;
  };
}

const Header = ({ title, subtitle, showBackButton = false, onBack, leftAction, rightAction }: HeaderProps) => {
  return (
    <Box className="text-white shadow-lg relative" style={{ backgroundColor: '#04A1B3' }}>
      <Box className="pt-12 pb-4 px-4 relative">
        {/* Back Button */}
        {(showBackButton || leftAction) && (
          <Box className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
            {showBackButton && onBack ? (
              <Button
                onClick={onBack}
                className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-all duration-200 backdrop-blur-sm"
                style={{ minWidth: '40px', height: '40px' }}
              >
                <Icon icon="zi-arrow-left" className="text-white" size={20} />
              </Button>
            ) : leftAction ? (
              <Button
                onClick={leftAction.onClick}
                className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-all duration-200 backdrop-blur-sm"
                style={{ minWidth: '40px', height: '40px' }}
              >
                <Icon icon={leftAction.icon} className="text-white" size={20} />
              </Button>
            ) : null}
          </Box>
        )}

        {/* Right Action */}
        {rightAction && (
          <Box className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
            <Button
              onClick={rightAction.onClick}
              className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-all duration-200 backdrop-blur-sm"
              style={{ minWidth: '40px', height: '40px' }}
            >
              <Icon icon={rightAction.icon} className="text-white" size={20} />
            </Button>
          </Box>
        )}

        {/* Title Section */}
        <Box className="flex items-center justify-center w-full">
          <Box className="text-center flex-1 px-16">
            <Text.Title size="large" className="text-white mb-1 font-semibold" style={{ fontSize: '18px' }}>
              {title}
            </Text.Title>
            {subtitle && (
              <Text size="small" className="text-white opacity-90" style={{ fontSize: '14px' }}>
                {subtitle}
              </Text>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Header; 