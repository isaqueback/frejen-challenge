// src/docs/department.doc.ts

import { ZodOpenApiPathsObject } from 'zod-openapi'

import { HttpStatus } from '@/constants/http-status.constant'
import { FindDepartmentByFiltersRequestDto } from '@/dtos/department/request/find-department-by-filters-request.dto'
import { FindDepartmentByFiltersResponseDto } from '@/dtos/department/response/find-department-by-filters-response.dto'
import { InternalServerErrorResponseDto } from '@/dtos/errors/response/internal-server-error-response.dto'
import { UnprocessableEntityResponseDto } from '@/dtos/errors/response/unprocessable-entity-response.dto'

export const departmentPaths: ZodOpenApiPathsObject = {
  '/departments': {
    get: {
      description: 'Retrieves a list of departments in the system.',
      operationId: 'findDepartmentByFilters',
      requestParams: {
        query: FindDepartmentByFiltersRequestDto,
      },
      responses: {
        [HttpStatus.OK]: {
          content: {
            'application/json': {
              schema: FindDepartmentByFiltersResponseDto,
            },
          },
          description: 'Retrieves a list of departments successfully.',
        },
        [HttpStatus.UNPROCESSABLE_ENTITY]: {
          content: {
            'application/json': {
              schema: UnprocessableEntityResponseDto('Validation error'),
            },
          },
          description:
            'Unprocessable Entity. The request was well-formed but was unable to be followed due to semantic errors.',
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
      summary: 'List of departments',
      tags: ['departments'],
    },
  },
}
