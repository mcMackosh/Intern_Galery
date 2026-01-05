import { BadRequestException } from "@nestjs/common";

export const validateDateRange = (dateFrom?: Date, dateTo?: Date) => {
  if (dateFrom && dateTo && dateFrom > dateTo) {
    throw new BadRequestException(
      'Start date cannot be greater than end date',
    );
  }
}