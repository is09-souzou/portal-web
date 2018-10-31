export type User = {
    id: string;
    email?: string;
    displayName: string;
    career?: string;
    avatarUri?: string;
    message?: string;
    skill?: string;
    works?: WorkConnection;
};

export type Work = {
    id: string;
    userId: string;
    tags?: string[];
    createdAt: number;
    title: string;
    imageUrl: string;
    description: string;
    user?: User;
};

export type WorkConnection = {
    items: Work[];
    exclusiveStartKey: string;
};

export type PopularTag = {
    name: string;
    count: number;
};

export type PopularTags = PopularTag[];
