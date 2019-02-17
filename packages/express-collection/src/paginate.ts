import * as Joi from 'joi'
import { Request, Response, NextFunction } from 'express'
import { validate } from '@ekino/api-toolkit-validation'
// const log = require('@ekino/logger')('api:paginate')
// const dto = require('../../dto')

export interface PaginationOptions {
    pageKey: string
    perPageKey: string
    perPageMax: number
    errorStatusCode: number
}

export interface PaginationState {
    page: number
    offset: number
    perPage: number
}

const defaultState = (): PaginationState => ({
    page: 1,
    offset: 0,
    perPage: 10
})

/**
 * This middleware computes limit and offset from request query parameters.
 *
 * /api/posts?page=1&perPage=10
 *
 * will translate to:
 *
 * { pagination: {
 *     perPage: 10,
 *     page:    1,
 *     offset:  0,
 * } }
 *
 * @param {Object} [partialOptions = {}] - Middleware options, see defaultPaginationOptions
 *
 * @returns {Function} The middleware
 */
export const paginate = ({
    pageKey = 'page',
    perPageKey = 'perPage',
    perPageMax = 10000,
    errorStatusCode = 400
}: Partial<PaginationOptions> = {}) => (
    req: Request & { state?: any },
    res: Response,
    next: NextFunction
) => {
    req.state = req.state || {}
    req.state.pagination = req.state.pagination || defaultState()

    const pagination = {
        page: req.query[pageKey],
        perPage: req.query[perPageKey]
    }

    const paginationSchema = Joi.object().keys({
        page: Joi.number()
            .integer()
            .min(1),
        perPage: Joi.number()
            .integer()
            .min(1)
            .max(perPageMax)
    })

    const { error: validationError, data } = validate(pagination, paginationSchema)
    if (validationError) {
        /*
            const { contextId } = req.state
            log.debug(contextId, 'An error occurred during pagination validation', {
                error: validationError.data,
            })
            const error = dto.error.validationError(
                'Pagination validation failed',
                validationError.data
            )

            return res.status(400).json(error)
            */
        return res.status(errorStatusCode).json({ failed: true })
    }

    if (data.perPage) {
        req.state.pagination.perPage = data.perPage
    }

    if (data.page) {
        req.state.pagination.page = data.page
        if (data.page > 1) {
            req.state.pagination.offset = (data.page - 1) * req.state.pagination.perPage
        }
    }

    next()
}
