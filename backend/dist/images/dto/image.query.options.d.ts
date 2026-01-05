export declare class GetImagesQueryDto {
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'name';
    sortOrder?: 'asc' | 'desc';
    name?: string;
    dateFrom?: Date;
    dateTo?: Date;
}
