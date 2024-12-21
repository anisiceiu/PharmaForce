export interface User {
    id: number;
    name: string;
    userName: string;
    password: string;
    enabled: boolean;
    expires: Date;
    created: Date;
    userType: string;
    email: string;
    logo: string;
    clientLimit: number;
    description: string;
}