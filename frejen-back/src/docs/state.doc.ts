// src/docs/state.doc.ts

// src/docs/department.doc.ts

import { ZodOpenApiPathsObject } from 'zod-openapi'

import { HttpStatus } from '@/constants/http-status.constant'
import { InternalServerErrorResponseDto } from '@/dtos/errors/response/internal-server-error-response.dto'
import { UnauthorizedResponseDto } from '@/dtos/errors/response/unauthorized-response.dto'
import { UnprocessableEntityResponseDto } from '@/dtos/errors/response/unprocessable-entity-response.dto'
import { FindAllStatesResponseDto } from '@/dtos/state/response/find-all-states-response.dto'

import { accessTokenSchema } from './access-token-schema'

export const statePaths: ZodOpenApiPathsObject = {
  '/states': {
    get: {
      description: 'Retrieves a list of states in the system.',
      operationId: 'findAllStates',
      requestParams: {
        cookie: accessTokenSchema,
      },
      responses: {
        [HttpStatus.OK]: {
          content: {
            'application/json': {
              schema: FindAllStatesResponseDto,
            },
          },
          description: 'Retrieves a list of states   successfully.',
        },
        [HttpStatus.UNPROCESSABLE_ENTITY]: {
          content: {
            'application/json': {
              schema: UnprocessableEntityResponseDto('Validation error'),
            },
          },
          description:
            'Invalid data format. The data returned from the database does not match the expected format.',
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
          description:
            'Internal Server Error. There was an issue with the server while processing the request.',
        },
      },
      security: [
        {
          cookieAuth: [],
        },
      ],
      summary: 'List of states',
      tags: ['states'],
    },
  },
}
