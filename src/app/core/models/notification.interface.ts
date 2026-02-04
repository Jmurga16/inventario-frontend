export interface NotificationDto {
  id: number;
  userId: number;
  productId?: number | null;
  productName?: string | null;
  notificationTypeId: number;
  notificationTypeCode?: string | null;
  title: string;
  message: string;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
}
