import { EmptyState } from "@/components/common/EmptyState";

/** Placeholder – sẽ gắn StockBar/Countdown + useFlashSaleWs ở bước sau. */
export default function FlashSalePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-ink">Flash Sale</h1>
      <p className="text-sm text-ink-2">
        Danh sách phiên đang và sắp diễn ra. Trang này sẽ subscribe STOMP để cập nhật tồn kho theo thời gian thực.
      </p>
      <EmptyState
        title="Chưa có phiên nào"
        description="Khi admin mở khung giờ mới, danh sách sẽ hiển thị tại đây."
      />
    </div>
  );
}
