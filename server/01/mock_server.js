var mocky = require('mocky');
var fs = require('fs');
var url = require('url');
var querystring = require('querystring');

var CONST = {
  PORT: {
    API: 8888,
  },
  PATH: {
    APIS: [''],
    FILE_ROOT: './response',
  },
  STATUS: {
    HTTP: 200
  }
};

var priv = {

  doRes: function (req, res, callback) {

    var method = req.method;
    var urlPath = priv.getUrlPath(req.url);

    // OPTIONS
    if (method === 'OPTIONS') {
      callback(null, {
        status: CONST.STATUS.HTTP,
        headers: {
          'Access-Control-Allow-Headers': 'Accept, Content-Type, If-Modified-Since, Origin, X-Authorization, X-INVOKE, X-LANG, X-Requested-With, X-SID, X-TIMEZONE, X-TOKEN',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE',
          'Cache-Control': 'no-cache',
          'Cache-Control': 'no-store',
        }
      });
      return;
    }

    // POST, GET, PUT, DELETE
    var headers = {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache',
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json;charset=UTF-8'
    };

    var filePath = CONST.PATH.FILE_ROOT + urlPath + method + '.json';
    var filename = filePath.replace(/^.*[\\\/]/, '');

    if (method === 'GET') {
      var param = priv.getUrlQueryParams(req.url);
      console.log(param);
    } else {
      console.log(req.body);
    }

    if (fs.existsSync(filePath)) {
      fs.readFile(filePath, 'utf-8', function (err, fileData) {
        callback(null, {
          status: CONST.STATUS.HTTP,
          headers: headers,
          body: fileData
        });
      });
    } else {
      callback(null, {
        status: 404,
        headers: headers
      });
    }
  },
  getRegExpOrStrings: function (strArr) {
    var strings = strArr.join('|');
    return '(' + strings + ')';
  },
  getUrlPath: function (reqUrl) {
    return url.parse(reqUrl).pathname;
  },
  getUrlQueryParams: function (reqUrl) {
    return querystring.parse(url.parse(reqUrl).query);
  },
  getReqBody: function (body) {
    return JSON.parse(body);
  }
};

mocky.createServer([{
  url: new RegExp('\\/' + priv.getRegExpOrStrings(CONST.PATH.APIS) + '\\/*'),
  method: 'options',
  res: priv.doRes
}, {
  url: new RegExp('\\/' + priv.getRegExpOrStrings(CONST.PATH.APIS) + '\\/*'),
  method: 'get',
  res: priv.doRes
}, {
  url: new RegExp('\\/' + priv.getRegExpOrStrings(CONST.PATH.APIS) + '\\/*'),
  method: 'post',
  res: priv.doRes
}, {
  url: new RegExp('\\/' + priv.getRegExpOrStrings(CONST.PATH.APIS) + '\\/*'),
  method: 'put',
  res: priv.doRes
}, {
  url: new RegExp('\\/' + priv.getRegExpOrStrings(CONST.PATH.APIS) + '\\/*'),
  method: 'delete',
  res: priv.doRes
}]).listen(CONST.PORT.API);
