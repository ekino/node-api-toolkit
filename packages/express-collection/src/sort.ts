import { Request, Response, NextFunction } from 'express'
// const log = require('@ekino/logger')('api:sort')
// const dto = require('../../dto')

export type SortingDirective = [string, 'asc' | 'desc']

/**
 * This middleware extracts sort directives from request query string.
 *
 * /api/posts?sort=-createdAt,title
 *
 * will translate to:
 *
 * { sort: [ ['createdAt', 'desc'], ['title', 'asc'] ] }
 *
 * If there is not sorting query parameter defined, we sort by using defaults
 * if available or by the first defined field in ascending order.
 *
 * @param {Array<string>} fields                            - List of allowed fields
 * @param {string}        [key = 'sort']                    - The name of query parameter to use for sorting
 * @param {string}        [separator = ',']                 - Separator to use to split sort directives
 * @param {string}        [defaults = [[fields[0], 'asc']]] - Default sorting
 *
 * @returns {Function} The middleware
 */
export const sort = (
    fields: string[],
    {
        key = 'sort',
        separator = ',',
        defaults = [[fields[0], 'asc']]
    }: {
        key?: string
        separator?: string
        defaults?: SortingDirective[]
    } = {}
) => {
    if (!Array.isArray(fields) || fields.length === 0) {
        throw new Error(
            'You should define at least one field in order to use the collection.sort middleware'
        )
    }

    return (req: Request & { state?: any }, res: Response, next: NextFunction) => {
        req.state = req.state || {}
        req.state.sort = req.state.sort || []

        let directives: SortingDirective[] = []

        if (req.query[key]) {
            const rawDirectives = req.query[key].split(separator)
            for (const directive of rawDirectives) {
                let sortField
                let sortDir: 'asc' | 'desc'
                if (directive.startsWith('-')) {
                    sortField = directive.slice(1)
                    sortDir = 'desc'
                } else {
                    sortField = directive
                    sortDir = 'asc'
                }

                if (!fields.includes(sortField)) {
                    /*
                    const { contextId } = req.state
                    const errorMessage = `Invalid sort field: '${
                        sortField
                    }', must be one of: '${fields.join(`', '`)}'`
                    log.debug(contextId, errorMessage)
                    const error = dto.error.validationError(errorMessage)
                    */

                    return res.status(400).json({ failed: true })
                }

                directives.push([sortField, sortDir])
            }
        }

        if (directives.length === 0) directives = defaults

        req.state.sort = directives

        next()
    }
}
