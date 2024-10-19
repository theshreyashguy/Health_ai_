import axios, { AxiosResponse } from 'axios';
import { AxiosService } from '@gateway/services/axios';
import { config } from '@gateway/config';


export let axiosOrderInstance: ReturnType<typeof axios.create>;

class OrderService {
  axiosService: AxiosService;

  constructor() {
    this.axiosService = new AxiosService(`${config.ORDER_BASE_URL}/api/v1/order`, 'order');
    axiosOrderInstance = this.axiosService.axios;
  }

  // order functions

  async getOrder(orderId: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosOrderInstance.get(`/orders/${orderId}`);
    return response;
  }

  async getOrdersUser(userId: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosOrderInstance.get(`/orders/user/${userId}`);
    return response;
  }

  async updateOrder(orderId: string, updateData: any): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosOrderInstance.put(`/orders/${orderId}`, updateData);
    return response;
  }

  async createOrder(orderData: any): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosOrderInstance.post('/orders', orderData);
    return response;
  }

  async deleteOrder(orderId: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosOrderInstance.delete(`/orders/${orderId}`);
    return response;
  }

  //// payments functions

  async getPayment(paymentId: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosOrderInstance.get(`/payments/${paymentId}`);
    return response;
  }

  async createPayment(paymentData: any): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosOrderInstance.post(`/payments`, paymentData);
    return response;
  }

  async updatePayment(paymentId: string, updateData: any): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosOrderInstance.put(`/payments/${paymentId}`, updateData);
    return response;
  }

  async deletePayment(paymentId: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosOrderInstance.delete(`/payments/${paymentId}`);
    return response;
  }
}

export const orderService: OrderService = new OrderService();
