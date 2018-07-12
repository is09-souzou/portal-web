export type Work = {
    id: string;
    userId: string;
    tags?: [string];
    createdAt: number;
    title: string
    imageUris?: [string]
    description: string
};

export type WorkConnection = {
    items: [Work];
    exclusiveStartKey: string;
};
