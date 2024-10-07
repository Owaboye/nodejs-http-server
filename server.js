const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises')
const http = require('http')

const PORT = process.env.PORT || 3000;

async function serveFile(filepath, contentType, response){
    try {
        let data = await fsPromises.readFile(
            filepath, 
            !contentType.includes('image') ? 'utf8' : ''
        );
        response.writeHead(200, {'Content-Type': contentType})
        response.end(data)
    } catch (error) {
        console.log(err)
        response.statusCode = 500;
        res.end()
    }
}

const server = http.createServer((req, res) => {
    console.log(req.url, req.method)

    let filePath;

    const extension = path.extname(req.url);

    let contentType;
    

    switch (extension) {
        case '.css':
            contentType = 'text/css';
            break;
        
        case '.js':
            contentType = 'text/javascript';
            break;

        case '.json':
            contentType = 'application/json';
            break;

        case '.jpg':
            contentType = 'image/jpeg';
            break;
        case '.jpeg':
            contentType = 'image/jpeg';
            break;
        
        case '.png':
            contentType = 'image/png';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;     
        default:
            contentType = 'text/html';
            break;
    }

    filePath = contentType === 'text/html' && req.url === '/' 
              ? path.join(__dirname, 'view', 'index.html') 
              : contentType === 'text/html' && req.url.slice(-1) === '/' 
              ? path.join(__dirname, 'view', req.url, 'index.html')
              : contentType === 'text/html' 
              ? path.join(__dirname, 'view', req.url) 
              : path.join(__dirname, req.url);

    // filePath = contentType === 'text/html' && req.url === '/'
    //         ? path.join(__dirname, 'view', 'index.html')
    //         : contentType === 'text/html' && req.url.slice(-1) === '/'
    //             ? path.join(__dirname, 'view', req.url, 'index.html')
    //             : contentType === 'text/html'
    //                 ? path.join(__dirname, 'view', req.url)
    //                 : path.join(__dirname, req.url);

    if(!extension && req.url.slice(-1) !== '/') filePath += '.html'
    

    const fileExists = fs.existsSync(filePath)

    if(fileExists){
        serveFile(filePath, contentType, res)
        // fs.readFile(filePath, 'utf8', (err, data) =>{
        //     res.statusCode = 200
        //     res.setHeader('Content-Type', contentType)
        //     res.end(data)
        // })
    }else{
        // 404
        // 301 redirect
        // console.log(path.parse(req.url.slice(-1)))
        // console.log(req.url.slice(-1))
        console.log(contentType.includes('image/jpeg'))
        serveFile(path.join(__dirname, 'view', '404.html'), 'text/html', res)
    }
})

server.listen(PORT, ()=>{
    console.log('server running on port http://localhost:'+PORT)
})