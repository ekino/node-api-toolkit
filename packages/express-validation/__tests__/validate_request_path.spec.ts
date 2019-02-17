import * as Joi from 'joi'
import { Request } from 'express'
import { validateRequestPath } from '../src/index'
import mockResponse from './mock_express_response'

test('it should reject if path parameters are invalid', () => {
    const validate = validateRequestPath(
        Joi.object().keys({
            id: Joi.number().required()
        })
    )

    const req = { params: {} } as Request
    const res = mockResponse()
    const next = jest.fn()

    validate(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(next).not.toHaveBeenCalled()
    /*
    expect(res.json).toHaveBeenCalledWith({
        type: 'validation_error',
        message: 'path validation failed',
        errors: [
            {
                message: '"id" is required',
                path: 'id',
                type: 'any.required',
            },
        ],
    })
    */
})

test('it should replace request path params with validated data', () => {
    const validate = validateRequestPath(
        Joi.object().keys({
            id: Joi.number().required()
        })
    )

    const req = { params: { id: '12' } } as Request
    const res = mockResponse()
    const next = jest.fn()

    validate(req, res, next)

    expect(req.params.id).toBe(12)
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
})
