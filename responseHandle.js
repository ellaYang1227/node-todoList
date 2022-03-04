const headers = require('./baseHeaders');
const errMsg = {
    data:'沒有資料',
    format: '格式錯誤',
    todoid: '沒有該筆 todo id',
    routing: '沒有該網頁路由'
};

const successHandle = (res, data) => {
    res.writeHead(200, headers);
    res.write(JSON.stringify({
        'status': 'success',
        'data': data
    }));
    res.end();
}; 

const errorHandle = (status, res, errMsgKey) => {
    res.writeHead(status, headers);
    res.write(JSON.stringify({
        'status': false,
        'message': errMsg[errMsgKey]
    }));
    res.end();
};

module.exports = {
    successHandle,
    errorHandle
};