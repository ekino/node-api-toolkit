import { Request, Response, NextFunction } from 'express'
import { default as Joi, ValidationOptions, ObjectSchema, ValidationError } from 'joi'
import { validate } from '@ekino/api-toolkit-validation'

export interface LoggerInterface {
    trace: (...args: any[]) => void
    debug: (...args: any[]) => void
    info: (...args: any[]) => void
    warn: (...args: any[]) => void
    error: (...args: any[]) => void
}

// tslint:disable-next-line
const noop = () => {}

const noopLogger: LoggerInterface = {
    trace: noop,
    debug: noop,
    info: noop,
    warn: noop,
    error: noop
}

const sources = {
    body: 'body',
    path: 'params',
    query: 'query',
    headers: 'headers'
}

export type RequestValidationSource = 'body' | 'path' | 'query' | 'headers'

export type DynamicSchema = (req: Request) => ObjectSchema

export type ValidationErrorStatusResolver = (
    req: Request,
    res: Response,
    error: ValidationError
) => number

export type ValidationErrorContentResolver = (
    req: Request,
    res: Response,
    error: ValidationError
) => object

export type ValidationErrorHandler = (req: Request, res: Response, error: ValidationError) => void

export type RequestValidationOptions = {
    joiOptions?: ValidationOptions
    logger?: LoggerInterface
    errorStatusCode?: number | ValidationErrorStatusResolver
    errorBody?: object | ValidationErrorContentResolver
    errorHandler?: ValidationErrorHandler
}

/**
 * Check request against a given Joi schema, update request with transformed / casted values
 * or respond with error if validation fails.
 *
 * When using `headers` source, you should use the following `options`:
 *   {
 *       stripUnknown: false,
 *       allowUnknown: true
 *   }
 * otherwise, all extra headers will be removed from the request.
 */
export const validateRequest = (
    source: RequestValidationSource,
    schema: ObjectSchema | DynamicSchema,
    {
        joiOptions = {},
        logger = noopLogger,
        errorStatusCode = 400,
        errorBody,
        errorHandler
    }: RequestValidationOptions = {}
) => {
    const requestAccessor = sources[source]
    const getSchema = typeof schema === 'function' ? schema : (req: Request) => schema

    return (req: Request, res: Response, next: NextFunction) => {
        const resolvedSchema = getSchema(req)

        const { error: validationError, data } = validate(
            (req as any)[requestAccessor],
            resolvedSchema,
            joiOptions
        )

        if (validationError) {
            /*
            if (!(validationError instanceof ValidationError)) {
                throw validationError
                //return res.status(500).send(errorDto.internalError(endpoint))
            }
            */

            /*
            logger.debug(req.state.context.id, `request ${source} validation failed`, {
                error: validationError//.data,
            })
            */

            if (errorHandler !== undefined) {
                return errorHandler(req, res, validationError as ValidationError)
            }

            const statusCode: number =
                typeof errorStatusCode === 'function'
                    ? errorStatusCode(req, res, validationError as ValidationError)
                    : errorStatusCode

            // .data // dto.error.validationError(`${source} validation failed`, validationError.data)
            const body: object =
                typeof errorBody === 'function'
                    ? errorBody(req, res, validationError as ValidationError)
                    : errorBody

            return res.status(statusCode).json(body)
        }

        // replace original data with transformed one
        ;(req as any)[requestAccessor] = data

        next()
    }
}

/**
 * Check request body against a given Joi schema,
 * update request with transformed / casted values
 * or respond with error if validation fails.
 */
export const validateRequestBody = (schema: any, options?: RequestValidationOptions) =>
    validateRequest('body', schema, options)

/**
 * Check request path against a given Joi schema,
 * update request with transformed / casted values
 * or respond with error if validation fails.
 */
export const validateRequestPath = (schema: any, options?: RequestValidationOptions) =>
    validateRequest('path', schema, options)

/**
 * Check request query against a given Joi schema,
 * update request with transformed / casted values
 * or respond with error if validation fails.
 */
export const validateRequestQuery = (schema: any, options?: RequestValidationOptions) =>
    validateRequest('query', schema, options)

/**
 * Check request headers against a given Joi schema,
 * update request with transformed / casted values
 * or respond with error if validation fails.
 *
 * Default `options` are different from other validation,
 * otherwise, all extra headers will be removed from the request.
 */
export const validateRequestHeaders = (
    schema: any,
    {
        joiOptions = {
            stripUnknown: false,
            allowUnknown: true
        },
        logger = noopLogger,
        errorStatusCode = 400,
        errorBody,
        errorHandler
    }: RequestValidationOptions = {}
) =>
    validateRequest('headers', schema, {
        joiOptions,
        logger,
        errorStatusCode,
        errorBody,
        errorHandler
    })
