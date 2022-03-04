const http = require('http');
const { v4: uuidv4 } = require('uuid');
const headers = require('./baseHeaders');
const { successHandle, errorHandle} = require('./responseHandle');
const todos = [];
const getTitle = (body) => {
    return JSON.parse(body).title;
};

const getIndex = (url) => {
    const id = url.split('/').pop();
    return todos.findIndex(item => item.id === id);
};

const requestListener = (req, res) => {
    let body = '';
    req.on('data', (chuuk) => {
        body += chuuk;
    });

    if(req.url === '/todos' && req.method === 'GET'){
        successHandle(res, todos);
    }else if(req.url === '/todos' && req.method === 'POST'){
        req.on('end', () => {
            try{
                const title = getTitle(body);
                if(title){
                    todos.push({
                        'title':title,
                        'id': uuidv4()
                    });
                    successHandle(res, todos);
                }else{
                    errorHandle(400, res, 'data');
                }
            }catch(err){
                errorHandle(400, res, 'format');
            }
        });
    }else if(req.url === '/todos' && req.method === 'DELETE'){
        todos.length = 0;
        successHandle(res, todos);
    }else if(req.url.startsWith('/todos/') && req.method === 'DELETE'){
        const index = getIndex(req.url);
        if(index !== -1){
            todos.splice(index, 1);
            successHandle(res, todos);
        }else{
            errorHandle(400, res, 'todoid');
        }
    }else if(req.url.startsWith('/todos/') && req.method === 'PATCH'){
        req.on('end', () => {
            try{
                const title = getTitle(body);
                const index = getIndex(req.url);
                if(title && index !== -1){
                    todos[index].title = title;
                    successHandle(res, todos);
                }else if(index === -1){
                    errorHandle(400, res, 'todoid');
                }else{
                    errorHandle(400, res, 'data');
                }
            }catch(err){
                errorHandle(400, res, 'format');
            }
        });
    }else if(req.method === 'OPTIONS'){
        res.writeHead(200, headers);
        res.end();
    }else{
        errorHandle(403, res, 'routing');
    }

};

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3005)