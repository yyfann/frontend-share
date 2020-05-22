const config = {
  before: function (app) {
    const child_process = require("child_process");

    // 打开源码
    app.get("/code", function (req, res) {
      child_process.exec(`code ${req.query.filePath}`);
      res.send("文件打开成功!");
    });

  }
};




module.exports = config