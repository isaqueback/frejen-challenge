// src/dtos/user/request/update-user-request.dto.ts

import { z } from 'zod'
import { extendZodWithOpenApi } from 'zod-openapi'

extendZodWithOpenApi(z)

export const UpdateUserRequestDto = z
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
    paramUserId: z.coerce.number().int().positive().openapi({
      description: 'User id in the request parameters',
      example: 3,
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
      message: 'If newPassword is provided, password must also be provided',
    },
  )

export type UpdateUserRequestDtoType = z.infer<typeof UpdateUserRequestDto>
