export interface IHeaderMenuItem {
  id: number;
  text: string;
  icon: string;
  actionName?: string;
  element?: any;
  action: (element: any) => void;
  isVisible?: (element: any) => boolean;
}