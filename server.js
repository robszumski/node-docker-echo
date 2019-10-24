const http = require('http');
const url = require('url');
const fs = require('fs');

const hostname = '0.0.0.0';
const port = 3000;

const server = http.createServer((req, res) => {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    var cpu;
    var ram;

    // Write parameters if set, else read
    if(query.cpu) {
        console.log(`Writing CPU as ${query.cpu}`);
        cpu = query.cpu;

        //Clear file
        fs.unlink('./cpu', (err) => {
          if (err) {
            console.error(err)
            return
          }
        })

        fs.createWriteStream('./cpu').write(query.cpu);
    } else if(fs.existsSync('./cpu')) {
        cpu = fs.readFileSync('./cpu', 'utf8');
        //console.log(`Read CPU as ${cpu}`);
    }

    if(query.ram) {
        console.log(`Writing RAM as ${query.ram}`);
        ram = query.ram;

        //Clear file
        fs.unlink('./ram', (err) => {
          if (err) {
            console.error(err)
            return
          }
        })

        fs.createWriteStream('./ram').write(query.ram);
    } else if (fs.existsSync('./ram')) {
        ram = fs.readFileSync('./ram', 'utf8');
        //console.log(`Read RAM as ${ram}`);
    }

    // Return parameters
    var obj = {
        'cpu': cpu,
        'ram': ram
        //'env': process.env
    };

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(obj));
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
