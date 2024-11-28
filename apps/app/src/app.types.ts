import {
  BadRequestException,
  HttpExceptionBody,
  HttpExceptionOptions,
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class HttpErrorSchema implements HttpExceptionBody {
  @ApiProperty({
    description: 'Error message',
    oneOf: [
      {
        example: 'Validation error',
        type: 'string',
      },
      {
        type: 'array',
        description: 'As array of strings in case of validation input data',
        example: ['field is required', 'field is not valid'],
        items: {
          type: 'string',
        },
      },
    ],
    example: ['field is required', 'field is not valid'],
  })
  message: string | string[];

  @ApiProperty({
    description: 'Error status code',
    examples: [400, 401, 404, 500],
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    examples: ['ValidationError', 'BadRequestError'],
    example: 'ValidationError',
    required: false,
  })
  error?: string;
}

export class HttpValidationError extends BadRequestException {
  constructor(message: string, options?: HttpExceptionOptions) {
    super(message, { description: 'Validation Error', ...options });
  }
}
