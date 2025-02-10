import { BaseAuthenticatedDTO } from '../shared/BaseAuthenticatedDTO';
import { OrderStatus } from '@domain/entities/SparePartOrderEntity';

export interface ValidateSparePartOrderDTO extends BaseAuthenticatedDTO {
  orderId: string;
  action: 'CONFIRM' | 'CANCEL';
}

export interface ValidateSparePartOrderResponseDTO {
  success: boolean;
  message: string;
  orderId: string;
  newStatus: OrderStatus;
  updatedStock?: {
    sparePartReference: string;
    newQuantity: number;
  }[];
}
