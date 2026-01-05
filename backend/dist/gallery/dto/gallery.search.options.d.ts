export declare class GetGalleriesQueryDto {
    search?: string;
    sortBy?: 'createdAt' | 'title';
    orderBy?: 'asc' | 'desc';
    startDate?: Date;
    endDate?: Date;
    minImages?: number;
    maxImages?: number;
}
