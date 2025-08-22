import { Box, Text, Button, Input, Spinner } from "zmp-ui";
import { useState } from "react";
import Header from "./header";
import { DraftOrder } from "../services/api";

interface DraftOrderDetailProps {
  orders: DraftOrder[];
  onBack: () => void;
  onConfirm: (
    orderIds: string[],
    updatedItems: { id: string; quantity: number; deliveryDate: string }[],
    notes: string
  ) => void;
  onReject: (orderIds: string[], reason: string) => void;
}

// Custom Date Picker Component
const DatePicker = ({ value, onChange }: { value: string; onChange: (date: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    onChange(date);
    setIsOpen(false);
  };

  const generateCalendarDays = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    
    const days: JSX.Element[] = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<Box key={`empty-${i}`} className="w-8 h-8"></Box>);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${day.toString().padStart(2, '0')}/${(currentMonth + 1).toString().padStart(2, '0')}/${currentYear}`;
      const isSelected = dateStr === selectedDate;
      const isToday = day === today.getDate();
      
      days.push(
        <Box
          key={day}
          className={`w-8 h-8 flex items-center justify-center text-sm cursor-pointer rounded ${
            isSelected 
              ? 'bg-blue-500 text-white' 
              : isToday 
                ? 'bg-gray-200 text-gray-800' 
                : 'hover:bg-gray-100'
          }`}
          onClick={() => handleDateSelect(dateStr)}
        >
          {day}
        </Box>
      );
    }
    
    return days;
  };

  return (
    <Box className="relative">
      <Box className="relative">
                           <Input
            type="text"
            value={selectedDate}
            readOnly
            onClick={() => setIsOpen(!isOpen)}
            className="w-full cursor-pointer pr-10 border-2 border-gray-400 rounded-md px-2 py-1 h-8 text-black bg-white"
          />
        <Box 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
          style={{ color: '#6B7280' }}
        >
          📅
        </Box>
      </Box>
      
      {isOpen && (
        <Box className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-3 min-w-64">
          <Box className="flex justify-between items-center mb-3">
            <Text className="font-semibold text-gray-900">
              {new Date().toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
            </Text>
            <Button
              size="small"
              variant="secondary"
              onClick={() => setIsOpen(false)}
              style={{ padding: '4px 8px', fontSize: '12px' }}
            >
              ✕
            </Button>
          </Box>
          
          <Box className="grid grid-cols-7 gap-1 mb-2">
            {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
              <Box key={day} className="w-8 h-8 flex items-center justify-center text-xs font-semibold text-gray-500">
                {day}
              </Box>
            ))}
          </Box>
          
          <Box className="grid grid-cols-7 gap-1">
            {generateCalendarDays()}
          </Box>
        </Box>
      )}
    </Box>
  );
};

const DraftOrderDetail = ({ orders, onBack, onConfirm, onReject }: DraftOrderDetailProps) => {
  // Initialize quantities for all items in the group
  const initialQuantities = orders.reduce((acc, item) => {
    acc[item.crdfd_kehoachhangve_draftid] = item.crdfd_soluong;
    return acc;
  }, {} as { [key: string]: number });
  const [quantities, setQuantities] = useState<{ [key: string]: number }>(initialQuantities);
  const [notes, setNotes] = useState("");
  const initialDeliveryDatesIso = orders.reduce((acc, item) => {
    const d = new Date(item.cr1bb_ngaygiaodukien);
    const tzAdjusted = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    acc[item.crdfd_kehoachhangve_draftid] = tzAdjusted.toISOString().slice(0, 10);
    return acc;
  }, {} as { [key: string]: string });
  
  const toVNDate = (iso: string) => {
    const [yyyy, mm, dd] = iso.split("-");
    return `${dd}/${mm}/${yyyy}`;
  };
  
  const fromVNDate = (vn: string): string | null => {
    const m = vn.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (!m) return null;
    const dd = m[1].padStart(2, '0');
    const mm = m[2].padStart(2, '0');
    const yyyy = m[3];
    return `${yyyy}-${mm}-${dd}`;
  };
  
  const initialDisplayDates = Object.entries(initialDeliveryDatesIso).reduce((acc, [k, v]) => {
    acc[k] = toVNDate(v);
    return acc;
  }, {} as { [key: string]: string });
  
  const [deliveryDatesIso, setDeliveryDatesIso] = useState<{ [key: string]: string }>(initialDeliveryDatesIso);
  const [displayDates, setDisplayDates] = useState<{ [key: string]: string }>(initialDisplayDates);
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const day = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
      const time = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      return `${day} ${time}`;
    } catch {
      return 'N/A';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleQuantityChange = (orderId: string, newQuantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [orderId]: Math.max(0, newQuantity)
    }));
  };

  const handleOutOfStock = (orderId: string) => {
    setQuantities(prev => ({
      ...prev,
      [orderId]: 0
    }));
  };

  const handleDateChange = (orderId: string, displayDate: string) => {
    setDisplayDates(prev => ({ ...prev, [orderId]: displayDate }));
    
    // Convert VN date format to ISO for backend
    const isoDate = fromVNDate(displayDate);
    if (isoDate) {
      setDeliveryDatesIso(prev => ({ ...prev, [orderId]: isoDate }));
    }
  };

  const handleConfirm = async () => {
    const updatedItems = orders.map(item => ({
      id: item.crdfd_kehoachhangve_draftid,
      quantity: quantities[item.crdfd_kehoachhangve_draftid],
      deliveryDate: deliveryDatesIso[item.crdfd_kehoachhangve_draftid]
    }));
    const orderIds = orders.map(item => item.crdfd_kehoachhangve_draftid);
    onConfirm(orderIds, updatedItems, notes);
  };

  const handleReject = async () => {
    const reason = prompt('Lý do từ chối đơn hàng:');
    if (reason) {
      const orderIds = orders.map(item => item.crdfd_kehoachhangve_draftid);
      onReject(orderIds, reason);
    }
  };

  // Get common info from the first order in the group
  const firstOrder = orders[0];
  if (!firstOrder) {
    return <Box className="p-4 text-red-600">Không tìm thấy thông tin đơn hàng.</Box>;
  }

  return (
    <Box className="bg-gray-50 min-h-screen">
      <Header
        title=""
        subtitle={`Đơn hàng của ${firstOrder.crdfd_nhanvienmuahang}`}
        showBackButton={true}
        onBack={onBack}
      />

      <Box className="p-4">
        {/* Order Info */}
        <Box className="bg-white rounded-lg p-4 shadow-sm mb-4">
          <Text className="text-gray-900 font-semibold mb-2" style={{ fontSize: '16px' }}>
            Thông tin đơn hàng
          </Text>
          <Text className="text-gray-700 text-sm mb-1">
            Nhân viên mua hàng: {firstOrder.crdfd_nhanvienmuahang}
          </Text>
          <Text className="text-gray-700 text-sm mb-1">
            Ngày gửi: {formatDate(firstOrder.createdon)}
          </Text>
        </Box>

        {/* Product Details */}
        <Box className="bg-white rounded-lg p-4 shadow-sm mb-4">
          <Box className="mb-3">
            <Text className="text-gray-900 font-semibold" style={{ fontSize: '16px' }}>
              Thông tin sản phẩm cần xác nhận ({orders.length})
            </Text>
            <Box className="mt-2 border-b border-gray-100"></Box>
          </Box>
          {orders.map((item) => (
            <Box key={item.crdfd_kehoachhangve_draftid} className="mb-3 pb-3 border-b border-gray-100 last:border-b-0 last:pb-0 last:mb-0">
              <Box className="flex-1">
                <Text className="text-gray-900 font-semibold mb-1" style={{ fontSize: '15px' }}>
                  {item.cr1bb_tensanpham}
                </Text>
                <Box className="grid grid-cols-2 gap-2 mb-2">
                  <Text className="text-gray-700 text-sm">Số lượng ({item.cr1bb_onvical})</Text>
                  <Text className="text-gray-900 font-semibold text-right text-sm">Đơn giá: {formatCurrency(item.crdfd_gia)}</Text>
                </Box>
                <Box className="flex items-center space-x-2 mb-2">
                                     <Input
                     type="number"
                     value={quantities[item.crdfd_kehoachhangve_draftid]}
                     onChange={(e) => handleQuantityChange(item.crdfd_kehoachhangve_draftid, parseInt(e.target.value))}
                     className="flex-1 border-2 border-gray-400 rounded-md px-2 py-1 h-8 text-black bg-white"
                     min={0}
                     disabled={quantities[item.crdfd_kehoachhangve_draftid] === 0}
                   />
                  <Button
                    size="small"
                    variant="secondary"
                    className="bg-red-50 text-red-600 border-red-200"
                    onClick={() => handleOutOfStock(item.crdfd_kehoachhangve_draftid)}
                    style={{
                      backgroundColor: '#FEF2F2',
                      borderColor: '#FECACA',
                      color: '#DC2626',
                      height: '32px',
                      padding: '0 10px'
                    }}
                  >
                    Hết hàng
                  </Button>
                </Box>
                {quantities[item.crdfd_kehoachhangve_draftid] === 0 && (
                  <Text className="text-gray-400 text-sm mb-2">Out of stock</Text>
                )}
                <Box className="mt-2">
                  <Text className="text-gray-700 text-sm mb-1">Ngày giao</Text>
                  <DatePicker
                    value={displayDates[item.crdfd_kehoachhangve_draftid]}
                    onChange={(date) => handleDateChange(item.crdfd_kehoachhangve_draftid, date)}
                  />
                </Box>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Notes */}
        <Box className="bg-white rounded-lg p-4 shadow-sm mb-4">
          <Text className="text-gray-900 font-semibold mb-2" style={{ fontSize: '16px' }}>
            Ghi chú
          </Text>
                     <Input
             placeholder="Thêm ghi chú về đơn hàng..."
             value={notes}
             onChange={(e) => setNotes(e.target.value)}
             className="w-full border-2 border-gray-400 rounded-md px-3 py-2 text-black bg-white"
           />
        </Box>

        {/* Total Amount */}
        <Box className="bg-white rounded-lg p-4 shadow-sm mb-4">
          <Box className="flex justify-between items-center">
            <Text className="text-lg font-semibold text-gray-900">Tổng tiền:</Text>
            <Text className="text-xl font-bold text-gray-900">
              {formatCurrency(orders.reduce((sum, item) => sum + (quantities[item.crdfd_kehoachhangve_draftid] * item.crdfd_gia), 0))}
            </Text>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box className="flex space-x-2 justify-end mb-4">
          <Button
            size="large"
            variant="secondary"
            className="bg-red-50 text-red-600 border-red-200 flex-1"
            onClick={handleReject}
            disabled={isLoading}
            style={{
              backgroundColor: '#FEF2F2',
              borderColor: '#FECACA',
              color: '#DC2626'
            }}
          >
            {isLoading ? <Spinner /> : 'Từ chối đơn hàng'}
          </Button>
          <Button
            size="large"
            variant="primary"
            className="bg-primary text-white flex-1"
            onClick={handleConfirm}
            disabled={isLoading}
            style={{
              backgroundColor: '#04A1B3',
              borderColor: '#04A1B3',
              color: 'white'
            }}
          >
            {isLoading ? <Spinner /> : 'Xác nhận đơn hàng'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default DraftOrderDetail;
