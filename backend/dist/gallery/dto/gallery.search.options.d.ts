export declare class GetGalleriesQueryDto {
    search?: string;
    sortBy?: 'createdAt' | 'title';
    sortOrder?: 'asc' | 'desc';
    startDate?: string;
    endDate?: string;
    minImages?: number;
    maxImages?: number;
}
