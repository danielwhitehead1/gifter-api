var mysql = require("mysql");
import config from './../rdsconfig.json';

let mysqlPool = mysql.createPool({
  connectionLimit : 10,
  host            : config.host,
  user            : config.user,
  password        : config.password,
  database        : config.database
});
export default mysqlPool;
