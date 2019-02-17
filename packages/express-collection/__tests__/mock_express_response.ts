export default () => {
    const res = {
        status: jest.fn(),
        send: jest.fn(),
        json: jest.fn()
    }

    res.status.mockReturnValue(res)
    res.send.mockReturnValue(res)
    res.json.mockReturnValue(res)

    return res as any
}
