import { Request, Response, NextFunction } from 'express'
import { Schema, ValidationOptions } from 'joi'
import { validate } from '@ekino/api-toolkit-validation'

export interface LoggerInterface {
    trace: (...args: any[]) => void
    debug: (...args: any[]) => void
    info: (...args: any[]) => void
    warn: (...args: any[]) => void
    error: (...args: any[]) => void
}

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

export type RequestValidationOptions = {
    errorStatusCode?: number
    options?: ValidationOptions
    errorOverride?: any
    logger?: LoggerInterface
}

export type DynamicSchema = (req: Request) => Schema

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
export const withValidation = (
    source: RequestValidationSource,
    schema: Schema | DynamicSchema,
    {
        errorStatusCode = 400,
        options = {},
        errorOverride,
        logger = noopLogger
    }: RequestValidationOptions = {}
) => {
    const requestAccessor = sources[source]
    const getSchema = typeof schema === 'function' ? schema : (req: Request) => schema

    return (req: Request, res: Response, next: NextFunction) => {
        const _schema = getSchema(req)

        const { error: validationError, data } = validate((req as any)[requestAccessor], _schema, options)

        if (validationError) {
            /*
            logger.debug(req.state.context.id, `request ${source} validation failed`, {
                error: validationError//.data,
            })
            */
            const error = errorOverride ? errorOverride : validationError //.data // dto.error.validationError(`${source} validation failed`, validationError.data)

            return res.status(errorStatusCode).json(error)
        }

        // replace original data with transformed one
        (req as any)[requestAccessor] = data

        next()
    }
}

/**
 * Check request body against a given Joi schema,
 * update request with transformed / casted values
 * or respond with error if validation fails.
 */
export const withBodyValidation = (schema: any, options?: RequestValidationOptions) =>
    withValidation('body', schema, options)

/**
 * Check request path against a given Joi schema,
 * update request with transformed / casted values
 * or respond with error if validation fails.
 */
export const withPathValidation = (schema: any, options?: RequestValidationOptions) =>
    withValidation('path', schema, options)

/**
 * Check request query against a given Joi schema,
 * update request with transformed / casted values
 * or respond with error if validation fails.
 */
export const withQueryValidation = (schema: any, options?: RequestValidationOptions) =>
    withValidation('query', schema, options)

/**
 * Check request headers against a given Joi schema,
 * update request with transformed / casted values
 * or respond with error if validation fails.
 *
 * Default `options` are different from other validation,
 * otherwise, all extra headers will be removed from the request.
 */
export const withHeadersValidation = (
    schema: any,
    {
        errorStatusCode,
        options = {
            stripUnknown: false,
            allowUnknown: true
        },
        errorOverride
    }: RequestValidationOptions = {}
) =>
    withValidation('headers', schema, {
        errorStatusCode,
        options,
        errorOverride
    })
