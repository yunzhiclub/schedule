mysqldump: [Warning] Using a password on the command line interface can be insecure.
-- MySQL dump 10.13  Distrib 5.7.41, for Linux (x86_64)
--
-- Host: localhost    Database: schedule
-- ------------------------------------------------------
-- Server version	5.7.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `clazz`
--

DROP TABLE IF EXISTS `clazz`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clazz` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `deleted` bit(1) DEFAULT NULL,
  `entrance_date` bigint(20) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `student_number` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clazz`
--

LOCK TABLES `clazz` WRITE;
/*!40000 ALTER TABLE `clazz` DISABLE KEYS */;
INSERT INTO `clazz` VALUES (1,_binary '\0',1672502400,'计科221',30),(2,_binary '\0',1672502400,'软件221',30),(3,_binary '\0',1672502400,'物联网221',30);
/*!40000 ALTER TABLE `clazz` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course`
--

DROP TABLE IF EXISTS `course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `course` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `deleted` bit(1) DEFAULT NULL,
  `hours` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course`
--

LOCK TABLES `course` WRITE;
/*!40000 ALTER TABLE `course` DISABLE KEYS */;
INSERT INTO `course` VALUES (1,_binary '\0','6','计算机组成原理'),(2,_binary '\0','6','汇编');
/*!40000 ALTER TABLE `course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dispatch`
--

DROP TABLE IF EXISTS `dispatch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dispatch` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `day` bigint(20) DEFAULT NULL,
  `deleted` bit(1) DEFAULT NULL,
  `lesson` bigint(20) DEFAULT NULL,
  `week` bigint(20) DEFAULT NULL,
  `schedule_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKmrhr7ox29sgxychnecbrvt7pa` (`schedule_id`),
  CONSTRAINT `FKmrhr7ox29sgxychnecbrvt7pa` FOREIGN KEY (`schedule_id`) REFERENCES `schedule` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dispatch`
--

LOCK TABLES `dispatch` WRITE;
/*!40000 ALTER TABLE `dispatch` DISABLE KEYS */;
INSERT INTO `dispatch` VALUES (1,1,_binary '\0',2,7,1),(2,1,_binary '\0',2,8,1),(3,1,_binary '\0',2,9,1),(4,1,_binary '\0',2,4,2),(5,1,_binary '\0',2,5,2),(6,1,_binary '\0',2,6,2),(7,1,_binary '\0',2,7,3),(8,1,_binary '\0',2,8,3),(9,1,_binary '\0',2,9,3);
/*!40000 ALTER TABLE `dispatch` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dispatch_rooms`
--

DROP TABLE IF EXISTS `dispatch_rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dispatch_rooms` (
  `dispatches_id` bigint(20) NOT NULL,
  `rooms_id` bigint(20) NOT NULL,
  KEY `FKdi2ak74w7eg0l3qbiu67bu5pv` (`rooms_id`),
  KEY `FKjoexfh9wa4rak4ghnd3o81sh0` (`dispatches_id`),
  CONSTRAINT `FKdi2ak74w7eg0l3qbiu67bu5pv` FOREIGN KEY (`rooms_id`) REFERENCES `room` (`id`),
  CONSTRAINT `FKjoexfh9wa4rak4ghnd3o81sh0` FOREIGN KEY (`dispatches_id`) REFERENCES `dispatch` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dispatch_rooms`
--

LOCK TABLES `dispatch_rooms` WRITE;
/*!40000 ALTER TABLE `dispatch_rooms` DISABLE KEYS */;
INSERT INTO `dispatch_rooms` VALUES (1,1),(2,1),(3,1),(4,1),(5,1),(6,1),(7,2),(8,2),(9,2);
/*!40000 ALTER TABLE `dispatch_rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room`
--

DROP TABLE IF EXISTS `room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `room` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `capacity` varchar(255) DEFAULT NULL,
  `deleted` bit(1) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room`
--

LOCK TABLES `room` WRITE;
/*!40000 ALTER TABLE `room` DISABLE KEYS */;
INSERT INTO `room` VALUES (1,'3904169421307329765',_binary '\0','A1'),(2,'7796746537806837926',_binary '\0','A2');
/*!40000 ALTER TABLE `room` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedule`
--

DROP TABLE IF EXISTS `schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `schedule` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `deleted` bit(1) DEFAULT NULL,
  `course_id` bigint(20) DEFAULT NULL,
  `teacher1_id` bigint(20) DEFAULT NULL,
  `teacher2_id` bigint(20) DEFAULT NULL,
  `term_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK1psrumo7fgkd16p438etda0i6` (`course_id`),
  KEY `FKhg23o57fe93wvpebib9rqj6gt` (`teacher1_id`),
  KEY `FKrhb22higc28x2qaxr155m0g88` (`teacher2_id`),
  KEY `FKqsbed9cx34ehlo63oucgar2jl` (`term_id`),
  CONSTRAINT `FK1psrumo7fgkd16p438etda0i6` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`),
  CONSTRAINT `FKhg23o57fe93wvpebib9rqj6gt` FOREIGN KEY (`teacher1_id`) REFERENCES `teacher` (`id`),
  CONSTRAINT `FKqsbed9cx34ehlo63oucgar2jl` FOREIGN KEY (`term_id`) REFERENCES `term` (`id`),
  CONSTRAINT `FKrhb22higc28x2qaxr155m0g88` FOREIGN KEY (`teacher2_id`) REFERENCES `teacher` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedule`
--

LOCK TABLES `schedule` WRITE;
/*!40000 ALTER TABLE `schedule` DISABLE KEYS */;
INSERT INTO `schedule` VALUES (1,_binary '\0',2,1,2,1),(2,_binary '\0',1,2,3,1),(3,_binary '\0',2,3,4,1);
/*!40000 ALTER TABLE `schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedule_clazzes`
--

DROP TABLE IF EXISTS `schedule_clazzes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `schedule_clazzes` (
  `schedule_id` bigint(20) NOT NULL,
  `clazzes_id` bigint(20) NOT NULL,
  KEY `FK9fcvkjbw27cpewms3wgxhgwas` (`clazzes_id`),
  KEY `FKktpphiu6erl3kh2njui6s72f2` (`schedule_id`),
  CONSTRAINT `FK9fcvkjbw27cpewms3wgxhgwas` FOREIGN KEY (`clazzes_id`) REFERENCES `clazz` (`id`),
  CONSTRAINT `FKktpphiu6erl3kh2njui6s72f2` FOREIGN KEY (`schedule_id`) REFERENCES `schedule` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedule_clazzes`
--

LOCK TABLES `schedule_clazzes` WRITE;
/*!40000 ALTER TABLE `schedule_clazzes` DISABLE KEYS */;
INSERT INTO `schedule_clazzes` VALUES (1,1),(2,2),(3,2);
/*!40000 ALTER TABLE `schedule_clazzes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `student` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `deleted` bit(1) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `sex` bit(1) NOT NULL,
  `sno` varchar(255) DEFAULT NULL,
  `clazz_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKr6vhwx3i4blsfj07c5ttqwj9p` (`clazz_id`),
  CONSTRAINT `FKr6vhwx3i4blsfj07c5ttqwj9p` FOREIGN KEY (`clazz_id`) REFERENCES `clazz` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student`
--

LOCK TABLES `student` WRITE;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
INSERT INTO `student` VALUES (1,_binary '\0','学生1',_binary '','123123',1);
/*!40000 ALTER TABLE `student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teacher`
--

DROP TABLE IF EXISTS `teacher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `teacher` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `deleted` bit(1) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `sex` bit(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teacher`
--

LOCK TABLES `teacher` WRITE;
/*!40000 ALTER TABLE `teacher` DISABLE KEYS */;
INSERT INTO `teacher` VALUES (1,_binary '\0','张三','13100000000',_binary ''),(2,_binary '\0','李四','13100000001',_binary '\0'),(3,_binary '\0','王五','13100000002',_binary '\0'),(4,_binary '\0','赵六','13100000003',_binary '\0');
/*!40000 ALTER TABLE `teacher` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `term`
--

DROP TABLE IF EXISTS `term`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `term` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `deleted` bit(1) DEFAULT NULL,
  `end_time` bigint(20) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `start_time` bigint(20) DEFAULT NULL,
  `state` bit(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `term`
--

LOCK TABLES `term` WRITE;
/*!40000 ALTER TABLE `term` DISABLE KEYS */;
INSERT INTO `term` VALUES (1,_binary '\0',1688140800,'已激活学期',1672502400,_binary ''),(2,_binary '\0',1688140800,'未激活学期',1672502400,_binary '\0');
/*!40000 ALTER TABLE `term` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `deleted` bit(1) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,_binary '\0','张三','66b7d0d1aec30c327bb58e7990683dcf','13920618851');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-13 13:03:45
