/*
Navicat MySQL Data Transfer

Source Server         : localhost_3307
Source Server Version : 50505
Source Host           : localhost:3307
Source Database       : erpfix

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2020-10-23 19:32:34
*/

SET FOREIGN_KEY_CHECKS=0;
-- ----------------------------
-- Table structure for `tbl_tasks`
-- ----------------------------
DROP TABLE IF EXISTS `tbl_tasks`;
CREATE TABLE `tbl_tasks` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `id_user` int(10) DEFAULT NULL,
  `task` text DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tbl_tasks
-- ----------------------------
INSERT INTO tbl_tasks VALUES ('1', '1', 'Develop master data');
INSERT INTO tbl_tasks VALUES ('2', '1', 'Develop Form Login');
INSERT INTO tbl_tasks VALUES ('3', '2', 'Desain UX dashboard');

-- ----------------------------
-- Table structure for `tbl_user`
-- ----------------------------
DROP TABLE IF EXISTS `tbl_user`;
CREATE TABLE `tbl_user` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `user` varchar(100) NOT NULL,
  PRIMARY KEY (`id`,`user`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tbl_user
-- ----------------------------
INSERT INTO tbl_user VALUES ('1', 'example1@gmail.com');
INSERT INTO tbl_user VALUES ('2', 'example2@gmail.com');
