export function responseHelpers(req, res, next) {
    res.ok = (data) => res.json({ success: true, data });
    res.created = (data) => res.status(201).json({ success: true, data });
    res.list = (items, meta) => res.json({ success: true, data: items, meta });
    res.noContent = () => res.status(204).send();
    res.error = (error) => {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            success: false,
            error: error.code || 'INTERNAL_ERROR',
            message: error.message,
            details: error.details || []
        });
    };
    next();
}