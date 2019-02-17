import * as Joi from 'joi'
import { Request } from 'express'
import { validateRequestQuery } from '../src/index'
import mockResponse from './mock_express_response'

test('it should reject if query parameters are invalid', () => {
    const validate = validateRequestQuery(
        Joi.object().keys({
            page: Joi.number().required()
        })
    )

    const req = { query: {} } as Request
    const res = mockResponse()
    const next = jest.fn()

    validate(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(next).not.toHaveBeenCalled()
    /*
    expect(res.json).toHaveBeenCalledWith({
        type: 'validation_error',
        message: 'query validation failed',
        errors: [
            {
                message: '"page" is required',
                path: 'page',
                type: 'any.required',
            },
        ],
    })
    */
})

test('it should replace request query with validated data', () => {
    const validate = validateRequestQuery(
        Joi.object().keys({
            id: Joi.number().required()
        })
    )

    const req = { query: { id: '12' } } as Request
    const res = mockResponse()
    const next = jest.fn()

    validate(req, res, next)

    expect(req.query.id).toBe(12)
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
})
