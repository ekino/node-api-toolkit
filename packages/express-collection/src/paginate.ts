import defaultsDeep from 'lodash.defaultsDeep'
import * as Joi from 'joi'
import { Request, Response, NextFunction } from 'express'
import { validate } from '@ekino/api-toolkit-validation'
// const log = require('@ekino/logger')('api:paginate')
// const dto = require('../../dto')

export interface PaginationOptions {
    pageKey: string
    perPageKey: string
    perPageMax: number
}

export interface PaginationState {
    page: number
    offset: number
    perPage: number
}

const defaultPaginationOptions: PaginationOptions = {
    pageKey: 'page',
    perPageKey: 'perPage',
    perPageMax: 10000
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
export const paginate = (partialOptions: Partial<PaginationOptions> = {}) => {
    const options: PaginationOptions = defaultsDeep(partialOptions, defaultPaginationOptions)

    return (req: Request & { state?: any }, res: Response, next: NextFunction) => {
        req.state = req.state || {}
        req.state.pagination = req.state.pagination || defaultState()

        const pagination = {
            page: req.query[options.pageKey],
            perPage: req.query[options.perPageKey]
        }

        const paginationSchema = Joi.object().keys({
            page: Joi.number()
                .integer()
                .min(1),
            perPage: Joi.number()
                .integer()
                .min(1)
                .max(options.perPageMax)
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
            return res.status(400).json({ failed: true })
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
}
