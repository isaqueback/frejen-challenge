// src/docs/swagger.ts

import { createDocument } from 'zod-openapi'

import { authPaths } from './auth.doc'
import { departmentPaths } from './department.doc'
import { statePaths } from './state.doc'
import { ticketPaths } from './ticket.doc'
import { userPaths } from './user.doc'

const document = createDocument({
  info: {
    contact: {
      email: 'isa.quecosta00@gmail.com',
      name: 'Isaque da Costa Delfino',
    },
    description: `This API serves as the backend for a web-based Ticket Management Platform designed to allow users to manage tickets across different departments. The platform supports user authentication, ticket creation, management, and an administrative panel for monitoring and handling all tickets.`,
    title: 'Ticket Management Platform API',
    version: '1.0.0',
  },
  openapi: '3.1.0',
  paths: {
    ...authPaths,
    ...userPaths,
    ...statePaths,
    ...departmentPaths,
    ...ticketPaths,
  },
})

export const openApiDoc = document
