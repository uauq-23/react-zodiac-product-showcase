export function validate(schema, source = 'body') {
    return (req, res, next) => {
        const data = req[source];
        const { error, value } = schema.validate(data);
        
        if (error) {
            return res.status(400).json({
                error: 'Validation failed',
                message: error.details[0].message
            });
        }
        
        if (!req.validated) req.validated = {};
        req.validated[source] = value;
        next();
    };
}