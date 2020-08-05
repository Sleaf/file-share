export enum HttpStatus {
  OK = 200,
  Created = 201,
  Accepted = 202,
  NoContent = 204,
  MovedPermanently = 301,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  Conflict = 409,
  Gone = 410,
  UnprocessableEntity = 410,
  InternalServerError = 500,
  ServiceUnavailable = 503,
}

export enum SortOrder {
  DESC = 'desc',
  ASC = 'asc',
}
