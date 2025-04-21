// src/docs/ticket.doc.ts

import { z } from 'zod'
import { ZodOpenApiPathsObject } from 'zod-openapi'
import { extendZodWithOpenApi } from 'zod-openapi'

import { HttpStatus } from '@/constants/http-status.constant'
import { ForbiddenResponseDto } from '@/dtos/errors/response/forbidden-response.dto'
import { InternalServerErrorResponseDto } from '@/dtos/errors/response/internal-server-error-response.dto'
import { NotFoundResponseDto } from '@/dtos/errors/response/not-found-response.dto'
import { UnauthorizedResponseDto } from '@/dtos/errors/response/unauthorized-response.dto'
import { UnprocessableEntityResponseDto } from '@/dtos/errors/response/unprocessable-entity-response.dto'
import { CreateTicketRequestDto } from '@/dtos/ticket/request/create-ticket-request.dto'
import { FindTicketByFiltersRequestDto } from '@/dtos/ticket/request/find-ticket-by-filters-request.dto'
import { UpdateTicketRequestBodyDto } from '@/dtos/ticket/request/update-ticket-request-body.dto'
import { UpdateTicketRequestParamDto } from '@/dtos/ticket/request/update-ticket-request-param.dto'
import { FindTicketByFiltersResponseDto } from '@/dtos/ticket/response/find-ticket-by-filters-response.dto'
import { FindTicketByIdResponseDto } from '@/dtos/ticket/response/find-ticket-by-id-response.dto'

import { accessTokenSchema } from './access-token-schema'

extendZodWithOpenApi(z)

export const ticketPaths: ZodOpenApiPathsObject = {
  '/tickets': {
    get: {
      description: 'Retrieves a list of tickets based on filters.',
      operationId: 'findTicketsByFilters',
      requestParams: {
        cookie: accessTokenSchema,
        query: FindTicketByFiltersRequestDto,
      },
      responses: {
        [HttpStatus.OK]: {
          content: {
            'application/json': {
              schema: FindTicketByFiltersResponseDto,
            },
          },
          description: 'Tickets retrieved successfully.',
        },
        [HttpStatus.UNAUTHORIZED]: {
          content: {
            'application/json': {
              schema: UnauthorizedResponseDto(
                'Unauthorized access or invalid token',
              ),
            },
          },
          description: 'Unauthorized access or invalid token.',
        },
        [HttpStatus.UNPROCESSABLE_ENTITY]: {
          content: {
            'application/json': {
              schema: UnprocessableEntityResponseDto('Invalid input data'),
            },
          },
          description: 'Invalid input data.',
        },
        [HttpStatus.INTERNAL_SERVER_ERROR]: {
          content: {
            'application/json': {
              schema: InternalServerErrorResponseDto(
                'Internal server error occurred',
              ),
            },
          },
          description: 'Internal server error.',
        },
      },
      security: [
        {
          cookieAuth: [],
        },
      ],
      summary: 'Retrieve a list of tickets based on filters.',
      tags: ['tickets'],
    },
    post: {
      description: 'Creates a new ticket in the system.',
      operationId: 'createTicket',
      requestBody: {
        content: {
          'application/json': {
            schema: CreateTicketRequestDto,
          },
        },
        required: true,
      },
      requestParams: {
        cookie: accessTokenSchema,
      },
      responses: {
        [HttpStatus.CREATED]: {
          description: 'Ticket successfully created.',
        },
        [HttpStatus.UNPROCESSABLE_ENTITY]: {
          content: {
            'application/json': {
              schema: UnprocessableEntityResponseDto('Invalid input data'),
            },
          },
          description: 'Invalid input data.',
        },
        [HttpStatus.UNAUTHORIZED]: {
          content: {
            'application/json': {
              schema: UnauthorizedResponseDto(
                'Unauthorized access or invalid token',
              ),
            },
          },
          description: 'Unauthorized access or invalid token.',
        },
        [HttpStatus.INTERNAL_SERVER_ERROR]: {
          content: {
            'application/json': {
              schema: InternalServerErrorResponseDto(
                'Internal server error occurred',
              ),
            },
          },
          description: 'Internal server error.',
        },
      },
      security: [
        {
          cookieAuth: [],
        },
      ],
      summary: 'Create a new ticket in the system.',
      tags: ['tickets'],
    },
  },
  '/tickets/{id}': {
    get: {
      description: 'Retrieve a ticket by its ID.',
      operationId: 'findTicketById',
      requestParams: {
        cookie: accessTokenSchema,
        path: z
          .object({
            id: z.coerce.number().int().positive().openapi({
              description: 'The ID of the ticket to find',
              example: 1,
            }),
          })
          .strict(),
      },
      responses: {
        [HttpStatus.OK]: {
          content: {
            'application/json': {
              schema: FindTicketByIdResponseDto,
            },
          },
          description: 'Ticket retrieved successfully.',
        },
        [HttpStatus.NOT_FOUND]: {
          content: {
            'application/json': {
              schema: NotFoundResponseDto('Ticket not found'),
            },
          },
          description: 'Ticket not found.',
        },
        [HttpStatus.UNAUTHORIZED]: {
          content: {
            'application/json': {
              schema: UnauthorizedResponseDto(
                'Unauthorized access or invalid token',
              ),
            },
          },
          description: 'Unauthorized access or invalid token.',
        },
        [HttpStatus.FORBIDDEN]: {
          content: {
            'application/json': {
              schema: ForbiddenResponseDto(
                'You do not have permission to access this ticket',
              ),
            },
          },
          description: 'You do not have permission to access this ticket.',
        },
        [HttpStatus.UNPROCESSABLE_ENTITY]: {
          content: {
            'application/json': {
              schema: UnprocessableEntityResponseDto('Invalid input data'),
            },
          },
          description: 'Invalid input data.',
        },
        [HttpStatus.INTERNAL_SERVER_ERROR]: {
          content: {
            'application/json': {
              schema: InternalServerErrorResponseDto(
                'Internal server error occurred',
              ),
            },
          },
          description: 'Internal server error.',
        },
      },
      security: [
        {
          cookieAuth: [],
        },
      ],
      summary: 'Retrieve a ticket by ID.',
      tags: ['tickets'],
    },
    patch: {
      description: 'Update a ticket by its ID.',
      operationId: 'updateTicket',
      requestBody: {
        content: {
          'application/json': {
            schema: UpdateTicketRequestBodyDto,
          },
        },
        required: true,
      },
      requestParams: {
        cookie: accessTokenSchema,
        path: UpdateTicketRequestParamDto,
      },
      responses: {
        [HttpStatus.NO_CONTENT]: {
          description: 'Ticket updated successfully.',
        },
        [HttpStatus.NOT_FOUND]: {
          content: {
            'application/json': {
              schema: NotFoundResponseDto('Ticket not found'),
            },
          },
          description: 'Ticket not found.',
        },
        [HttpStatus.UNAUTHORIZED]: {
          content: {
            'application/json': {
              schema: UnauthorizedResponseDto(
                'Unauthorized access or invalid token',
              ),
            },
          },
          description: 'Unauthorized access or invalid token.',
        },
        [HttpStatus.FORBIDDEN]: {
          content: {
            'application/json': {
              schema: ForbiddenResponseDto(
                'You do not have permission to access this ticket',
              ),
            },
          },
          description: 'You do not have permission to access this ticket.',
        },
        [HttpStatus.UNPROCESSABLE_ENTITY]: {
          content: {
            'application/json': {
              schema: UnprocessableEntityResponseDto('Invalid input data'),
            },
          },
          description: 'Invalid input data.',
        },
        [HttpStatus.INTERNAL_SERVER_ERROR]: {
          content: {
            'application/json': {
              schema: InternalServerErrorResponseDto(
                'Internal server error occurred',
              ),
            },
          },
          description: 'Internal server error.',
        },
      },
      security: [
        {
          cookieAuth: [],
        },
      ],
      summary: 'Update a ticket by ID.',
      tags: ['tickets'],
    },
  },
}
