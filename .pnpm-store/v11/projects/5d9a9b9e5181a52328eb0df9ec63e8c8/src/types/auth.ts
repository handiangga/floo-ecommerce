import { Customer } from "./customer";

export interface LoginResponse {
  access_token: string;

  customer: Customer;
}
