運行時直接 node index.js 即可
以下是網站執行前要調整的參數:
blog/node/mySQL.js:8~10　MySQL database user/password
blog/node/server.js:10　Listening port
以及資料庫的初始化：

CREATE SCHEMA `data` DEFAULT CHARACTER SET utf8 ;
CREATE TABLE `data`.`posts` (
`id` INT(11) NOT NULL AUTO_INCREMENT,
`creator` VARCHAR(40) NOT NULL,
`creatorcode` VARCHAR(45) NOT NULL,
`content` LONGTEXT NULL,
`liked` JSON NOT NULL,
`date` DATETIME NOT NULL,
`editdate` DATETIME NULL,
`deleted` TINYINT NOT NULL DEFAULT 0,
PRIMARY KEY (`id`),
UNIQUE INDEX `id_UNIQUE` (`id` ASC));
CREATE TABLE `data`.`users` (
`uid` VARCHAR(45) NOT NULL,
`psw` VARCHAR(64) NOT NULL,
`code` VARCHAR(40) NOT NULL,
PRIMARY KEY (`uid`),
UNIQUE INDEX `uid_UNIQUE` (`uid` ASC));
