import { validate as joiValidate, ValidationOptions, Schema } from 'joi'
import defaultsDeep from 'lodash.defaultsdeep'
// const { INTERNAL_ERROR, VALIDATION_ERROR } = require('../constants')
// const { typedError } = require('./errors')

const defaultOptions: ValidationOptions = {
    stripUnknown: { objects: true },
    abortEarly: false
}

export const validate = (data: any, schema: Schema, opts: ValidationOptions = {}) => {
    const joiOptions = defaultsDeep(opts, defaultOptions)
    const result = joiValidate(data, schema, joiOptions)

    if (!result.error) return { data: result.value }

    if (result.error.name !== 'ValidationError') {
        return {
            error: result.error
            /*
            error: typedError(INTERNAL_ERROR, 'An unexpected error occurred during validation', {
                error: result.error,
            }),
            */
        }
    }

    const message = result.error.details ? result.error.details.join(', ') : ''
    const error = result.error.details // typedError(VALIDATION_ERROR, message, result.error.details)

    return { error }
}
