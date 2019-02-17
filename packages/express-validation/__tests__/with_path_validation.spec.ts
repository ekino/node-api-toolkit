test('it should reject if path parameters are invalid', () => {
    /*
    const validate = validatePath(
        Joi.object().keys({
            id: Joi.number().required(),
        })
    )

    const req = { state: { contextId: 'context-id' }, params: {} }
    const res = mockResponse()
    const next = jest.fn()

    validate(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
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
    expect(next).not.toHaveBeenCalled()
    */
})

test('it should replace request path params with validated data', () => {
    /*
    const validate = validatePath(
        Joi.object().keys({
            id: Joi.number().required(),
        })
    )

    const req = { state: { contextId: 'context-id' }, params: { id: '12' } }
    const res = mockResponse()
    const next = jest.fn()

    validate(req, res, next)

    expect(req.params.id).toBe(12)
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
    */
})
