// src/errors/index.ts

import { ZodError } from 'zod'

export class BaseError extends Error {
  statusCode: number
  message: string
  error: string

  constructor(statusCode: number, message: string, error: string) {
    super(message)
    this.statusCode = statusCode
    this.message = message
    this.error = error

    Object.setPrototypeOf(this, new.target.prototype)
  }

  toJSON() {
    return {
      error: this.error,
      message: this.message,
      statusCode: this.statusCode,
    }
  }
}

export class BadRequestError extends BaseError {
  constructor(message = 'Bad Request') {
    super(400, message, 'Bad Request')
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message = 'Unauthorized') {
    super(401, message, 'Unauthorized')
  }
}

export class ForbiddenError extends BaseError {
  constructor(message = 'Forbidden') {
    super(403, message, 'Forbidden')
  }
}

export class NotFoundError extends BaseError {
  constructor(message = 'Not Found') {
    super(404, message, 'Not Found')
  }
}

export class MethodNotAllowedError extends BaseError {
  constructor(message = 'Method Not Allowed') {
    super(405, message, 'Method Not Allowed')
  }
}

export class NotAcceptableError extends BaseError {
  constructor(message = 'Not Acceptable') {
    super(406, message, 'Not Acceptable')
  }
}

export class RequestTimeoutError extends BaseError {
  constructor(message = 'Request Timeout') {
    super(408, message, 'Request Timeout')
  }
}

export class ConflictError extends BaseError {
  constructor(message = 'Conflict') {
    super(409, message, 'Conflict')
  }
}

export class GoneError extends BaseError {
  constructor(message = 'Gone') {
    super(410, message, 'Gone')
  }
}

export class PayloadTooLargeError extends BaseError {
  constructor(message = 'Payload Too Large') {
    super(413, message, 'Payload Too Large')
  }
}

export class UnsupportedMediaTypeError extends BaseError {
  constructor(message = 'Unsupported Media Type') {
    super(415, message, 'Unsupported Media Type')
  }
}

export class UnprocessableEntityError extends BaseError {
  constructor(message: string | ZodError) {
    if (typeof message === 'string') {
      // Se for uma string simples, usamos diretamente
      super(422, message, 'Unprocessable Entity')
    } else {
      // Se for um ZodError, mapeamos os issues para o formato esperado
      const errorMessages = message.issues.map((issue) => {
        // Garantir que o path seja convertido para string
        const formattedPath = issue.path.map((p) => String(p)).join('.')
        return `${formattedPath}: ${issue.message}`
      })
      const formattedMessage = errorMessages.join(', ')
      super(422, formattedMessage, 'Unprocessable Entity')
    }
  }
}

export class InternalServerError extends BaseError {
  constructor(message = 'Internal Server Error') {
    super(500, message, 'Internal Server Error')
  }
}

export class NotImplementedError extends BaseError {
  constructor(message = 'Not Implemented') {
    super(501, message, 'Not Implemented')
  }
}

export class BadGatewayError extends BaseError {
  constructor(message = 'Bad Gateway') {
    super(502, message, 'Bad Gateway')
  }
}

export class ServiceUnavailableError extends BaseError {
  constructor(message = 'Service Unavailable') {
    super(503, message, 'Service Unavailable')
  }
}

export class GatewayTimeoutError extends BaseError {
  constructor(message = 'Gateway Timeout') {
    super(504, message, 'Gateway Timeout')
  }
}

export class HttpVersionNotSupportedError extends BaseError {
  constructor(message = 'HTTP Version Not Supported') {
    super(505, message, 'HTTP Version Not Supported')
  }
}

export class PreconditionFailedError extends BaseError {
  constructor(message = 'Precondition Failed') {
    super(412, message, 'Precondition Failed')
  }
}

export class ImATeapotError extends BaseError {
  constructor(message = "I'm a teapot") {
    super(418, message, "I'm a teapot")
  }
}

// CustomError permanece como está
export class CustomError extends BaseError {
  constructor(statusCode: number, message: string, error: string) {
    super(statusCode, message, error)
  }
}
