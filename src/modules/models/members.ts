export type Member = {
    id: string;
    name: string;
    roles: ('ux' | 'frontend' | 'backend')[];
}