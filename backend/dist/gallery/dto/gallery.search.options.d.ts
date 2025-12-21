export declare class GetGalleriesQueryDto {
    search?: string;
    sortBy?: 'createdAt' | 'title';
    orderBy?: 'asc' | 'desc';
    startDate?: string;
    endDate?: string;
    minImages?: number;
    maxImages?: number;
}
