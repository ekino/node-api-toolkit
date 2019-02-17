export interface PaginationOptions {
    page: {
        key: string
        startAtZero: boolean
    }
    perPage: {
        key: string
        max: number
    }
}

export interface PaginationState {
    page: number
    perPage: number
    offset: number
}

// export const withPagination = () => {}

/*
'use strict'

const defaultsDeep = require('lodash.defaultsdeep')
const Joi = require('joi')
const log = require('@ekino/logger')('api:paginate')
const validator = require('../../core/validator')
const dto = require('../../dto')

const defaultPaginationOptions = {
    page: { key: 'page' },
    perPage: { key: 'perPage', max: 10000 },
}

const defaultState = () => ({
    page: 1,
    offset: 0,
    limit: 10,
})

/**
 * This middleware computes limit and offset from request query parameters.
 *
 * /api/posts?page=1&perPage=10
 *
 * will translate to:
 *
 * { pagination: {
 *     page:   1,
 *     offset: 0,
 *     limit:  10,
 * } }
 *
 * @param {Object} [partialOptions = {}] - Middleware options, see defaultPaginationOptions
 *
 * @returns {Function} The middleware
 *
module.exports = (partialOptions = {}) => {
    const options = defaultsDeep(partialOptions, defaultPaginationOptions)

    return (req, res, next) => {
        req.state = req.state || {}
        req.state.pagination = req.state.pagination || defaultState()

        const pagination = {
            page: req.query[options.page.key],
            perPage: req.query[options.perPage.key],
        }

        const paginationSchema = Joi.object().keys({
            page: Joi.number()
                .integer()
                .min(1),
            perPage: Joi.number()
                .integer()
                .min(1)
                .max(options.perPage.max),
        })

        const { error: validationError, data } = validator.validate(pagination, paginationSchema)
        if (validationError) {
            const { contextId } = req.state
            log.debug(contextId, 'An error occurred during pagination validation', {
                error: validationError.data,
            })
            const error = dto.error.validationError(
                'Pagination validation failed',
                validationError.data
            )

            return res.status(400).json(error)
        }

        if (data.perPage) {
            req.state.pagination.limit = data.perPage
        }

        if (data.page) {
            req.state.pagination.page = data.page
            if (data.page > 1) {
                req.state.pagination.offset = (data.page - 1) * req.state.pagination.limit
            }
        }

        next()
    }
}
*/
