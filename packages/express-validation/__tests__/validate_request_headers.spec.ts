import * as Joi from 'joi'
import { Request } from 'express'
import { validateRequestHeaders } from '../src/index'
import mockResponse from './mock_express_response'

test('it should reject if headers are invalid', () => {
    const validate = validateRequestHeaders(
        Joi.object().keys({
            'X-Header-Custom': Joi.string().required()
        })
    )

    const req = { headers: {} } as Request
    const res = mockResponse()
    const next = jest.fn()

    validate(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(next).not.toHaveBeenCalled()
    /*
    expect(res.json).toHaveBeenCalledWith({
        type: 'validation_error',
        message: 'headers validation failed',
        errors: [
            {
                message: '"X-Header-Custom" is required',
                path: 'X-Header-Custom',
                type: 'any.required',
            },
        ],
    })
    */
})

test('it should replace request headers with validated data', () => {
    const validate = validateRequestHeaders(
        Joi.object().keys({
            id: Joi.number().required()
        })
    )

    const req = { headers: { id: '12' } as any } as Request
    const res = mockResponse()
    const next = jest.fn()

    validate(req, res, next)

    expect(req.headers.id).toBe(12)
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
})
