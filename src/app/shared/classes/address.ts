export interface Address {
    id: number;
    address1?: string;
    address2?: string;
    city: string;
    state: string;
    postalCode?: number;
    country: string;
    userId: number;
    createdAt: Date;
    updatedAt: Date;

    // Unmapped
    finalstring?: string;
}
