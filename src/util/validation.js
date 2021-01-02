const parseError = (error) => {
    if (error.includes('Path')) {
        return {
            error: 'Required field missing',
            field: error.match(/`(.*?)`/)[1]
        };
    } else if (error.includes('Cast')) {
        return {
            error: 'Cannot cast to Number',
            field: error.includes('cost') ? 'cost' : 'unknown'
        };
    }
    return error;
};

module.exports = {
    parseError
};