// src/docs/user.doc.ts

import { z } from 'zod'
import { ZodOpenApiPathsObject } from 'zod-openapi'
import { extendZodWithOpenApi } from 'zod-openapi'

import { HttpStatus } from '@/constants/http-status.constant'
import { BadRequestResponseDto } from '@/dtos/errors/response/bad-request-response.dto'
import { InternalServerErrorResponseDto } from '@/dtos/errors/response/internal-server-error-response.dto'
import { UnauthorizedResponseDto } from '@/dtos/errors/response/unauthorized-response.dto'
import { UnprocessableEntityResponseDto } from '@/dtos/errors/response/unprocessable-entity-response.dto'

import { accessTokenSchema } from './access-token-schema'

extendZodWithOpenApi(z)

export const userPaths: ZodOpenApiPathsObject = {
  '/users/{id}': {
    patch: {
      description:
        'Updates user details like name, department, and password by user ID.',
      operationId: 'updateUser',
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: {
            description: 'ID of the user to be updated',
            example: 1,
            type: 'integer',
          },
        },
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: z
              .object({
                id_department: z.number().int().positive().optional().openapi({
                  description: 'ID of the department to which the user belongs',
                  example: 1,
                }),
                name: z.string().nonempty().optional().openapi({
                  description: 'Name of the user',
                  example: 'John Doe',
                }),
                newPassword: z.string().min(8).optional().openapi({
                  description: 'New password for the user account',
                  example: 'newpassword123',
                }),
                password: z.string().min(8).optional().openapi({
                  description: 'Current password of the user account',
                  example: 'password123',
                }),
              })
              .strict()
              .refine(
                (data) => {
                  const { newPassword, password } = data

                  // - If newPassword is provided, password must also be provided.
                  // - If newPassword is not provided, password can be omitted.
                  return !(newPassword && !password) // If newPassword exists, password must also exist
                },
                {
                  message:
                    'If newPassword is provided, password must also be provided',
                },
              ),
          },
        },
        required: true,
      },
      requestParams: {
        cookie: accessTokenSchema,
      },

      responses: {
        [HttpStatus.NO_CONTENT]: {
          description:
            'User successfully updated. A new HttpOnly access token is issued and sent as a cookie and the old is removed.',
        },
        [HttpStatus.BAD_REQUEST]: {
          content: {
            'application/json': {
              schema: BadRequestResponseDto('No data has been updated'),
            },
          },
          description: 'No data has been updated',
        },
        [HttpStatus.UNPROCESSABLE_ENTITY]: {
          content: {
            'application/json': {
              schema: UnprocessableEntityResponseDto('Invalid input data'),
            },
          },
          description: 'Invalid input data',
        },
        [HttpStatus.UNAUTHORIZED]: {
          content: {
            'application/json': {
              schema: UnauthorizedResponseDto(
                'Unauthorized access or invalid token',
              ),
            },
          },
          description: 'Unauthorized access or invalid token',
        },
        [HttpStatus.INTERNAL_SERVER_ERROR]: {
          content: {
            'application/json': {
              schema: InternalServerErrorResponseDto(
                'Internal server error occurred',
              ),
            },
          },
          description: 'Internal server error',
        },
      },
      security: [
        {
          cookieAuth: [],
        },
      ],
      summary: 'Update an existing user.',
      tags: ['users'],
    },
  },
}
