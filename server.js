const http = require('http');
const url = require('url');
const fs = require('fs');

const hostname = '0.0.0.0';
const port = 3000;

const server = http.createServer((req, res) => {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    var cache_dir = './cache/';

    var debug = true;

    var cpu;
    var ram;
    var today_ram;
    var yesterday_ram;
    var change;

    // Set Timezone
    var tz = new Date().toLocaleString("en-US", {
        timeZone: "America/New_York"
    });

    // Date logic
    var today = new Date(tz).getDay();
    var yesterday = new Date(tz);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday = yesterday.getDay();
    if (yesterday == 0 || yesterday == 7) yesterday = 6; //if weekend, set to friday
    if(debug) console.log("Today is " + today + ", yesterday is " + yesterday);

    // Write parameters if set, else read
    if(query.cpu && query.cpu >= -25) {
        console.log(`Writing CPU as ${query.cpu}`);
        cpu = query.cpu;

        //Clear file
        fs.unlink(cache_dir + today + '-cpu', (err) => {
          if (err) {
            console.error(err)
            return
          }
        })

        fs.createWriteStream(cache_dir + today + '-cpu').on('error', function (err) {console.log(err);}).write(query.cpu);
    } else if(fs.existsSync(cache_dir + today + '-cpu')) {
        cpu = fs.readFileSync(cache_dir + today + '-cpu', 'utf8');
        if(debug) console.log(`Read CPU as ${cpu}`);
    }

    if(query.ram && query.ram >= -1000) {
        console.log(`Writing RAM as ${query.ram}`);
        ram = query.ram;

        //Clear file
        fs.unlink(cache_dir + today + '-ram', (err) => {
          if (err) {
            console.error(err)
            return
          }
        })

        fs.createWriteStream(cache_dir + today + '-ram').on('error', function (err) {console.log(err);}).write(query.ram);
    } else if (fs.existsSync(cache_dir + today + '-ram')) {
        ram = fs.readFileSync(cache_dir + today + '-ram', 'utf8');
        if(debug) console.log(`Read RAM as ${ram}`);
    }

    // Calculate change
    if (fs.existsSync(cache_dir + today + '-ram') && fs.existsSync(cache_dir + yesterday + '-ram')) {
        today_ram = fs.readFileSync(cache_dir + today + '-ram', 'utf8');
        yesterday_ram = fs.readFileSync(cache_dir + yesterday + '-ram', 'utf8');
        change = today_ram - yesterday_ram;
        change = change.toFixed(3).toString();
        if(debug) console.log(`Read RAM change as ${today_ram} (day ${today}) minus ${yesterday_ram} (day ${yesterday})= ${change}`);
    } else {
        if(debug) console.log(`Can't read RAM change, no history`);
    }

    // Return parameters
    var obj = {
        'cpu': cpu,
        'ram': ram,
        'change': change
        //'env': process.env
    };

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(obj));
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
