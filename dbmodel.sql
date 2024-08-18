
-- ------
-- BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
-- distilled implementation : © JB Feldman wigginender520@gmail.com
-- 
-- This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
-- See http://en.boardgamearena.com/#!doc/Studio for more information.
-- -----

-- dbmodel.sql

-- This is the file where you are describing the database schema of your game
-- Basically, you just have to export from PhpMyAdmin your table structure and copy/paste
-- this export here.
-- Note that the database itself and the standard tables ("global", "stats", "gamelog" and "player") are
-- already created and must not be created here

-- Note: The database schema is created from this file when the game starts. If you modify this file,
--       you have to restart a game to see your changes in database.

-- Example 1: create a standard "card" table to be used with the "Deck" tools (see example game "hearts"):

-- CREATE TABLE IF NOT EXISTS `card` (
--   `uid` int(10) unsigned NOT NULL AUTO_INCREMENT,
--   `card_type` varchar(16) NOT NULL,
--   `card_type_arg` int(11) NOT NULL,
--   `card_location` varchar(16) NOT NULL,
--   `card_location_arg` int(11) NOT NULL,
--   PRIMARY KEY (`uid`)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;


-- Example 2: add a custom field to the standard "player" table
ALTER TABLE `player` ADD `distiller` INT UNSIGNED NOT NULL DEFAULT '0';
ALTER TABLE `player` ADD `money` INT UNSIGNED NOT NULL DEFAULT '0';
ALTER TABLE `player` ADD `first_player` BOOLEAN NOT NULL DEFAULT '0';

CREATE TABLE IF NOT EXISTS `recipe` (
    `id` int(2) unsigned not null AUTO_INCREMENT,
    `player_id` int(10) NOT NULL,
    `slot` int(10) NOT NULL,
    `purchased` boolean default '0',
    `color` varchar(20) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=0;

CREATE TABLE IF NOT EXISTS `distillery_upgrade` (
   `id` int(2) unsigned NOT NULL AUTO_INCREMENT,
   `uid` int(10) NOT NULL,
   `card_id` int(10) NOT NULL,
   `location` varchar(50) NOT NULL default 'market', 
   `location_idx` int(10) default NULL, 
   `player_id` int(10),

   `selected` boolean default 0,
   PRIMARY KEY (`id`)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=0 ;

 CREATE TABLE IF NOT EXISTS `premium_ingredient` (
   `id` int(2) unsigned NOT NULL AUTO_INCREMENT,
   `uid` int(10) NOT NULL,
   `card_id` int(10) NOT NULL,
   `location` varchar(50) NOT NULL default 'market', 
   `location_idx` int(10) default NULL, 
   `player_id` int(10),
   `selected` boolean default 0,
   PRIMARY KEY (`id`)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=0 ;

 CREATE TABLE IF NOT EXISTS `premium_item` (
   `id` int(2) unsigned NOT NULL AUTO_INCREMENT,
   `uid` int(10) NOT NULL,
   `card_id` int(10) NOT NULL,
   `location` varchar(50) NOT NULL default 'market', 
   `location_idx` int(10) default NULL, 
   `player_id` int(10),
   `selected` boolean default 0,
   `used` boolean default 0,
   PRIMARY KEY (`id`)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=0 ;

CREATE TABLE IF NOT EXISTS `flavor` (
   `id` int(2) unsigned NOT NULL AUTO_INCREMENT,
   `uid` int(10) NOT NULL,
   `card_id` int(10) NOT NULL,
   `location` varchar(50) NOT NULL default 'market', 
   `location_idx` int(10) default NULL, 
   `player_id` int(10),
   `selected` boolean default 0,
   `used` boolean default 0,
   PRIMARY KEY (`id`)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=0 ;

CREATE TABLE IF NOT EXISTS `market_purchase` (
    `id` int(2) unsigned NOT NULL AUTO_INCREMENT,
    `market_pass` boolean default 0,
    `sell_pass` boolean default 0,
    `uid` int(10) default null,
    `market` varchar(50) default null,
    `recipe_slot` int(10) default null,
    `turn` int(10) NOT NULL,
    `player_id` int(10) NOT NULL,
    `action` varchar(50),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=0 ;

CREATE TABLE IF NOT EXISTS `drink` (
    `id` int(2) unsigned NOT NULL AUTO_INCREMENT,
    `cards` varchar(200),
    `player_id` int(10) NOT NULL,
    `recipe_slot` int(10) default NULL,
    `sold` boolean default 0,
    `sold_turn` int(10),
    `bottle_uid` int(10),
    `barrel_uid` int(10),
    `label_uid` int(10),
    `flavor_cards` varchar(200) default '',
    `flavor_count` int(10) default 0,
    `location` varchar(50),
    `first_turn` int(10),
    `sale_sp` int(10),
    `sale_value` int(10),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=0 ;

CREATE TABLE IF NOT EXISTS `label` (
    `uid` int(2) unsigned NOT NULL AUTO_INCREMENT,
    `label` varchar(100) NOT NULL,
    `location` varchar(50) NOT NULL,
    `player_id` int(10),
    `location_idx` int(10),
    `signature` boolean default 0,
    `count` int(10) ,
    PRIMARY KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=0 ;

CREATE TABLE IF NOT EXISTS `bottomless_card` (
    `uid` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `card_id` int(10) NOT NULL,
    `location` varchar(50) not NULL,
    `player_id` int(10),
    `market` varchar(50) not NULL,
    `turn` int(10),
    `used` boolean default 0,
    PRIMARY KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=0 ;

CREATE TABLE IF NOT EXISTS `distillery_goal` (
    `uid` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `card_id` int(10) NOT NULL,
    `player_id` int(10) not NULL,
    `discarded` boolean default 0,
    PRIMARY KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=0 ;

CREATE TABLE IF NOT EXISTS `spirit_award` (
    `uid` int(10) unsigned,
    `player_id` int(10),
    `location` varchar(20),
    `sp_gained` int(10)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=0 ;

CREATE TABLE IF NOT EXISTS `solo_goal` (
    `id` int(2) unsigned NOT NULL AUTO_INCREMENT,
    `uid` int(3) NOT NULL,
    `type` int(1) NOT NULL,
    `tier` varchar(1),
    `row` int(1),
    `pos` int(1),
    `revealed` boolean default 0,
    `unlocked` boolean default 0,
    `completed` boolean default 0,
    `drink_ids` varchar(50),
    `achieved` boolean default 0,
    `turn_achieved` int(1),
    `used` boolean default 0,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=0 ;

CREATE TABLE IF NOT EXISTS `solo_drinks_used` (
    `id` int(2) unsigned NOT NULL AUTO_INCREMENT,
    `goal_uid` int(3),
    `goal_type` int(1) NOT NULL,
    `drink_id` int(2) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=0 ;

CREATE TABLE IF NOT EXISTS `distiller` (
    `uid` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `card_id` int(10) NOT NULL,
    `player_id` int(10) not NULL,
    `discarded` boolean default 0,
    PRIMARY KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=0 ;

ALTER TABLE bottomless_card AUTO_INCREMENT=1000;
