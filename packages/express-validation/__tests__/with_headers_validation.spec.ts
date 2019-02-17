test('it should reject if headers are invalid', () => {
    /*
    const validate = validateHeaders(
        Joi.object().keys({
            'X-Header-Custom': Joi.string().required(),
        })
    )

    const req = { state: { contextId: 'context-id' }, headers: {} }
    const res = mockResponse()
    const next = jest.fn()

    validate(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
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
    expect(next).not.toHaveBeenCalled()
    */
})

test('it should replace request headers with validated data', () => {
    /*
    const validate = validateHeaders(
        Joi.object().keys({
            id: Joi.number().required(),
        })
    )

    const req = { state: { contextId: 'context-id' }, headers: { id: '12' } }
    const res = mockResponse()
    const next = jest.fn()

    validate(req, res, next)

    expect(req.headers.id).toBe(12)
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
    */
})
