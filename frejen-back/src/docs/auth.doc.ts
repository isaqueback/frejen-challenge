// src/docs/auth.doc.ts

import { ZodOpenApiPathsObject } from 'zod-openapi'

import { HttpStatus } from '@/constants/http-status.constant'
import { SignInRequestDto } from '@/dtos/auth/request/sign-in-request.dto'
import { SignUpRequestDto } from '@/dtos/auth/request/sign-up-request.dto'
import { MeResponseDto } from '@/dtos/auth/response/me-response.dto'
import { ConflictResponseDto } from '@/dtos/errors/response/conflict-response.dto'
import { InternalServerErrorResponseDto } from '@/dtos/errors/response/internal-server-error-response.dto'
import { NotFoundResponseDto } from '@/dtos/errors/response/not-found-response.dto'
import { UnauthorizedResponseDto } from '@/dtos/errors/response/unauthorized-response.dto'
import { UnprocessableEntityResponseDto } from '@/dtos/errors/response/unprocessable-entity-response.dto'

import { accessTokenSchema } from './access-token-schema'

export const authPaths: ZodOpenApiPathsObject = {
  '/auth/me': {
    get: {
      description: 'Retrieves user information.',
      operationId: 'me',
      requestParams: {
        cookie: accessTokenSchema,
      },
      responses: {
        [HttpStatus.OK]: {
          content: {
            'application/json': {
              schema: MeResponseDto,
            },
          },
          description: 'User information retrieved successfully.',
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
      summary: 'User information retrieval.',
      tags: ['auth'],
    },
  },
  '/auth/sign-in': {
    post: {
      description:
        'Authenticates a user by email and password, and returns an HTTP-only access token as a cookie.',

      requestBody: {
        content: {
          'application/json': {
            schema: SignInRequestDto,
          },
        },
      },

      responses: {
        [HttpStatus.NO_CONTENT]: {
          description:
            'Login successful. An HTTP-only "accessToken" cookie is set for the user.',
          headers: {
            'Set-Cookie': {
              description:
                'Sets the HTTP-only "accessToken" as a cookie with expiration.',
            },
          },
        },
        [HttpStatus.UNAUTHORIZED]: {
          content: {
            'application/json': {
              schema: UnauthorizedResponseDto('User unauthorized'),
            },
          },
          description: 'Unauthorized. Invalid email or password.',
        },
        [HttpStatus.NOT_FOUND]: {
          content: {
            'application/json': {
              schema: NotFoundResponseDto('User not found'),
            },
          },
          description:
            'Not Found. The user with the provided email does not exist.',
        },
        [HttpStatus.UNPROCESSABLE_ENTITY]: {
          content: {
            'application/json': {
              schema: UnprocessableEntityResponseDto('Validation error'),
            },
          },
          description:
            'Validation error for request body. The email or password is incorrectly formatted.',
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

      summary: 'User login.',

      tags: ['auth'],
    },
  },
  '/auth/sign-out': {
    get: {
      description: 'Logs out the user by clearing the access token cookie.',
      responses: {
        [HttpStatus.NO_CONTENT]: {
          description: 'Logout successful. The access token cookie is cleared.',
        },
      },
      summary: 'User logout.',
      tags: ['auth'],
    },
  },
  '/auth/sign-up': {
    post: {
      description: 'Registers a new user in the system.',
      requestBody: {
        content: {
          'application/json': {
            schema: SignUpRequestDto,
          },
        },
      },
      responses: {
        [HttpStatus.CREATED]: {
          description: 'User successfully registered.',
        },
        [HttpStatus.CONFLICT]: {
          content: {
            'application/json': {
              schema: ConflictResponseDto('User already exists'),
            },
          },
          description: 'Conflict. The email provided is already registered.',
        },
        [HttpStatus.UNPROCESSABLE_ENTITY]: {
          content: {
            'application/json': {
              schema: UnprocessableEntityResponseDto('Validation error'),
            },
          },
          description:
            'Unprocessable Entity. The data provided is not valid or doesn’t meet the required validation.',
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
            'Internal Server Error. An unexpected error occurred during the process.',
        },
      },
      summary: 'User registration.',
      tags: ['auth'],
    },
  },
}
