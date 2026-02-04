export interface ISideMenuItem {
    id: number;
    title: string;
    icon?: string;
    url?: string;
    baseUrl?: string;
    options?: ISideMenuItem[];
    roles?: string[];
}
