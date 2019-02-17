import { Request, Response, RequestHandler, NextFunction } from 'express'
import { Logger } from '@ekino/logger'
import onFinished from 'on-finished'
import uuid from 'uuid'

export interface RequestLogInfo {
    requestMethod: string
    requestUrl: string
    requestOriginalUrl: string
    requestQuery: { [name: string]: string | string[] }
    responseStatusCode: number
    responseTime: number
}

export default (
    logger: Logger,
    {
        extractInfo = (req, info) => info
    }: {
        extractInfo?: (req: Request, info: RequestLogInfo, res: Response) => object
    } = {}
): RequestHandler => (
    // req: Request & { state: any; user?: User },
    req: Request & { state: any },
    res: Response,
    next: NextFunction
) => {
    req.state = req.state || {}
    req.state.requestTime = Date.now()

    const logRequest = () => {
        const responseTime: number = req.state.requestTime ? Date.now() - req.state.requestTime : 0

        const requestInfo = extractInfo(
            req,
            {
                requestMethod: req.method,
                requestUrl: req.url,
                requestOriginalUrl: req.originalUrl,
                requestQuery: req.query,
                responseStatusCode: res.statusCode,
                responseTime
            },
            res
        )

        const loggerArgs = [`HTTP ${req.method} ${req.originalUrl || req.url}`, requestInfo]
        if (req.state.context && req.state.context.id) {
            loggerArgs.unshift(req.state.context.id)
        }

        ;(logger as any).info(...loggerArgs)
    }

    onFinished(res, logRequest)

    next()
}
