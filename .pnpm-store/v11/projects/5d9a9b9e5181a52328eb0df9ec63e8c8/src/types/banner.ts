export interface Banner {
  id: string;
  title: string;
  image: string;
  link: string;
  description?: string | null;
  button_text?: string | null;
  sort_order: number;
}
