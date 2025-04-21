// src/docs/security-schemes.ts

import { z } from 'zod'
import { extendZodWithOpenApi } from 'zod-openapi'

extendZodWithOpenApi(z)

export const accessTokenSchema = z.object({
  accessToken: z
    .string()
    .jwt()
    .openapi({
      description: `
          The 'accessToken' is an HTTP-only cookie used for authentication.
          It contains a signed JWT that verifies the identity of the user and grants access to protected resources.
          The token should be sent with every request requiring authentication.
          This token should be included in the 'Set-Cookie' header in the response from login or authentication endpoints.
        `,
      example:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    })
    .openapi({
      description:
        'JWT access token used for authentication, sent via HTTP-only cookie.',
      title: 'Access Token',
    }),
})
