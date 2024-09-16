<?php
/**
 *------
 * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
 * distilled implementation : © JB Feldman <wigginender520@gmail.com>
 * 
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 *
 * material.inc.php
 *
 * distilled game material description
 *
 * Here, you can describe the material of your game with PHP variables.
 *   
 * This file is loaded in your game logic class constructor, ie these variables
 * are available everywhere in your game logic code.
 *
 */




// Did not know this file existed, seems like it would have been nice to use in the tutorials
$this->card_text = array(
   0 => clienttranslate("Can be used as either a <span class='icon-water-em'></span> or <span class='icon-yeast-em'></span> in your washback. Cannot be traded with the basic market."),
   1 => clienttranslate("If removed from spirit stack during the Distill Phase, you may return it to the spirit you just distilled. Cannot be traded with the basic market."),
   2 => clienttranslate("If removed from spirit stack during the Distill Phase, you may return it to the spirit you just distilled. Cannot be traded with the basic market."),
   3 => clienttranslate("If removed from spirit stack during the Distill Phase, you may return it to the spirit you just distilled. Cannot be traded with the basic market."),
   4 => clienttranslate("If removed from spirit stack during the Distill Phase, you may return it to the spirit you just distilled. Cannot be traded with the basic market."),
   5 => clienttranslate("If removed from spirit stack during the Distill Phase, you may return it to the spirit you just distilled. Cannot be traded with the basic market."),
   6 => clienttranslate("If removed from spirit stack during the Distill Phase, you may return it to the spirit you just distilled. Cannot be traded with the basic market."),
   7 => clienttranslate("If removed from spirit stack during the Distill Phase, you may return it to the spirit you just distilled. Cannot be traded with the basic market."),
   8 => clienttranslate("If removed from spirit stack during the Distill Phase, you may return it to the spirit you just distilled. Cannot be traded with the basic market."),
   9 => clienttranslate("If removed from spirit stack during the Distill Phase, you may return it to the spirit you just distilled. Cannot be traded with the basic market."),
  10 => clienttranslate("If removed from spirit stack during the Distill Phase, you may return it to the spirit you just distilled. Cannot be traded with the basic market."),
  11 => clienttranslate("If removed from spirit stack during the Distill Phase, you may return it to the spirit you just distilled. Cannot be traded with the basic market."),
  12 => clienttranslate("If removed from spirit stack during the Distill Phase, you may return it to the spirit you just distilled. Cannot be traded with the basic market."),
  13 => clienttranslate("If removed from spirit stack during the Distill Phase, you may return it to the spirit you just distilled. Cannot be traded with the basic market."),
  14 => clienttranslate("If removed from spirit stack during the Distill Phase, you may return it to the spirit you just distilled. Cannot be traded with the basic market."),
  15 => clienttranslate("If removed from spirit stack during the Distill Phase, you may return it to the spirit you just distilled. Cannot be traded with the basic market."),
  16 => clienttranslate("If removed from spirit stack during the Distill Phase, you may return it to the spirit you just distilled. Cannot be traded with the basic market."),
  17 => clienttranslate("If removed from spirit stack during the Distill Phase, you may return it to the spirit you just distilled. Cannot be traded with the basic market."),
  18 => clienttranslate("If removed from spirit stack during the Distill Phase, you may return it to the spirit you just distilled. Cannot be traded with the basic market."),
  19 => clienttranslate("After selling, return this card to your storeroom. Cannot be traded."),
  20 => clienttranslate("After selling, return this card to your storeroom. Cannot be traded."),
  21 => clienttranslate("When selling, gain 2  <span class='icon-sp-em'></span> . If selling <span class='icon-americas-em'></span> spirit, gain 3  <span class='icon-sp-em'></span>  instead."),
  22 => clienttranslate("When selling, gain 1  <span class='icon-sp-em'></span> . If selling <span class='icon-americas-em'></span> spirit, gain 2  <span class='icon-sp-em'></span>  instead."),
  //23 => clienttranslate(""),
  //24 => clienttranslate(""),
  // Wax Sealed?
  25 => clienttranslate("When selling, gain 2 <span class='icon-sp-em'></span>. If selling <span class='icon-americas-em'></span> spirit, gain 4  <span class='icon-sp-em'></span>  instead."),
  26 => clienttranslate("When selling, gain 2 <span class='icon-sp-em'></span>. If selling <span class='icon-europe-em'></span> spirit, gain 3  <span class='icon-sp-em'></span>  instead."),
  27 => clienttranslate("When selling, gain 2 <span class='icon-sp-em'></span>. If selling <span class='icon-americas-em'></span> spirit, gain 3  <span class='icon-sp-em'></span>  instead."),
  //28 => clienttranslate(""),
  29 => clienttranslate("When selling, gain 2 <span class='icon-sp-em'></span>. If selling <span class='icon-europe-em'></span> spirit, gain 3  <span class='icon-sp-em'></span>  instead."),
  //30 => clienttranslate(""),
  31 => clienttranslate("When selling, gain 2 <span class='icon-coin-em'></span>. If selling Moonshine, gain <span>4 <span class='icon-coin-em'></span></span> instead."),
  32 => clienttranslate("When selling, gain 2 <span class='icon-sp-em'></span>. If selling <span class='icon-asia-em'></span> spirit, gain <span>3  <span class='icon-sp-em'></span></span>  instead."),
  33 => clienttranslate("When selling, gain 1 <span class='icon-sp-em'></span>. If selling <span class='icon-europe-em'></span> spirit, gain <span>2  <span class='icon-sp-em'></span></span>  instead."),
  34 => clienttranslate("When selling, gain 2 <span class='icon-sp-em'></span>. If selling <span class='icon-asia-em'></span> spirit, gain <span>3  <span class='icon-sp-em'></span></span>  instead."),
  35 => clienttranslate("When selling, gain 2 <span class='icon-sp-em'></span>. If selling <span class='icon-europe-em'></span> spirit, gain <span>4  <span class='icon-sp-em'></span></span>  instead."),
  36 => clienttranslate("When selling, gain 1 <span class='icon-sp-em'></span>. If selling <span class='icon-asia-em'></span> spirit, gain <span>2  <span class='icon-sp-em'></span></span>  instead."),
  // Frosted glass bottle
  37 => clienttranslate("When selling, gain 1 <span class='icon-sp-em'></span>. If selling <span class='icon-unaged-em'></span> spirit, gain <span>2  <span class='icon-sp-em'></span></span>  instead."),
  38 => clienttranslate("When selling, gain 2 <span class='icon-sp-em'></span>. If selling <span class='icon-asia-em'></span> spirit, gain 4  <span><span class='icon-sp-em'></span></span>  instead."),
  39 => clienttranslate("When selling, gain 1 <span class='icon-sp-em'></span>. If selling Moonshine, gain <span>2  <span class='icon-sp-em'></span></span>  instead."),
  40 => clienttranslate("After selling, you may return this card to your storeroom."),
  41 => clienttranslate("1 <span class='icon-sp-em'></span>  for each flavor <span class='icon-flavor-em'></span> card."),
  42 => clienttranslate("When selling, earn 1 <span class='icon-coin-em'></span> for each flavor <span class='icon-flavor-em'></span> card."),
  43 => clienttranslate("When aging for the first time, add an additional flavor <span class='icon-flavor-em'></span> card."),
  44 => clienttranslate("Once per Age Phase, gain 1 <span class='icon-coin-em'></span> if this barrel is aging in your warehouse."),
  45 => clienttranslate("During the Distill Phase, add 1 additional <span class='icon-alcohol-em'></span>"),
  //46 => clienttranslate(""),
  47 => clienttranslate("If removed from spirit stack during the Distill Phase, add a basic <span class='icon-water-em'></span> card to the spirit you just distilled."),
  103 => clienttranslate("During the Distill Phase, may choose to return one of the removed cards back to the spirit."),
  104 => clienttranslate("During the Distill Phase, may add two additional <span class='icon-alcohol-em'></span>"),
  105 => clienttranslate("<span class='icon-start-em'> </span> add a basic <span class='icon-fruit-em'></span> card to your pantry.<br/>Endgame: 1 <span class='icon-sp-em'></span>  for every two of your Europe spirit labels"),
  106 => clienttranslate("During the Sell Phase, this counts as one additional flavor <span class='icon-flavor-em'></span> card when adding aged spirit flavor bonus."),
  107 => clienttranslate("<span class='icon-start-em'> </span> add a basic <span class='icon-water-em'></span> card to your pantry.<br/>Endgame: 1  <span class='icon-sp-em'></span>  for each of your equipment distillery upgrades"),
  108 => clienttranslate("When aging a spirit in your warehouse, add one additional flavor <span class='icon-flavor-em'></span> card if it is the first time that spirit is aged."),
  109 => clienttranslate("Once per Market Phase, may discount one item by 1 <span class='icon-coin-em'></span>. <br/>Endgame: 2  <span class='icon-sp-em'></span>  if this is your only eqipment distillery upgrade"),
  110 => clienttranslate("Drone camera"),
  111 => clienttranslate("At the end of the Distill Phase, add one flavor <span class='icon-flavor-em'></span> card to the spirit you just distilled."),
  112 => clienttranslate("<span class='icon-start-em'> </span> add a basic <span class='icon-plant-em'></span> card to your pantry. <br/><br/>Endgame: 1  <span class='icon-sp-em'></span>  for every two of your Americas spirit labels"),
  113 => clienttranslate("At the end of the Distill Phase draw two flavor <span class='icon-flavor-em'></span> cards. Add one to the spirit you just distilled and discard the other. <br/> This action is automated."), 
  114 => clienttranslate("Once per Market Phase, may discount one ingredient by 2 <span class='icon-coin-em'></span>"),
  115 => clienttranslate("Once per Market Phase, may discount one bottle by 2 <span class='icon-coin-em'></span>"),
  116 => clienttranslate("During the Distill Phase, may remove only the top card (must declare if using before revealing card)."),
  117 => clienttranslate("Once per Distill Phase, may return all removed cards, reshuffle and remove the top and bottom cards again."),
  118 => clienttranslate("<span class='icon-start-em'> </span> gain 2 <span class='icon-coin-em'></span> if you have at least one spirit in your warehouse."),
  119 => clienttranslate("Once per Market Phase, may discount one recipe cube by 2 <span class='icon-coin-em'></span><br/>1  <span class='icon-sp-em'></span>  for each of your silver and gold recipe cubes"),
  120 => clienttranslate("During the Sell Phase, may double the <span class='icon-coin-em'></span> received from a single flavor <span class='icon-flavor-em'></span> card in each <aged icon> spirit sold.<br/>Endgame: 1  <span class='icon-sp-em'></span>  for each of your aged spirit labels"),
  // Master blender
  121 => clienttranslate("During the Sell phase, gain 1 <span class='icon-sp-em'></span> when selling a spirit if you already have a spirit label from the same region.<br/>2  <span class='icon-sp-em'></span>  for every two identical spirit labels"),
  122 => clienttranslate("Once per Market phase, may discount one bottle by 1 <span class='icon-coin-em'></span><br/>Endgame: 1  <span class='icon-sp-em'></span>  for each region represented in your displayed bottle collection"),
  123 => clienttranslate("<span class='icon-start-em'> </span> may purchase 1 card from the truck.<br/>Endgame: Reveal top card from ingredient draw deck, gain  <span class='icon-sp-em'></span>  equal to <span class='icon-coin-em'></span>"),
  124 => clienttranslate("<span class='icon-start-em'> </span> may reveal top 3 cards of a market deck and buy up to 1 of them. Return cards not bought to bottom of deck."),
  125 => clienttranslate("<span class='icon-start-em'> </span> add a basic <span class='icon-grain-em'></span> card to your pantry. <br /> Endgame: 1  <span class='icon-sp-em'></span>  for every two of your Asia & Oceania spirit labels"),
  126 => clienttranslate("<span class='icon-start-em'> </span> gain 1 <span class='icon-coin-em'></span><br/>Endgame: At end of game, convert <span class='icon-coin-em'></span> to  <span class='icon-sp-em'></span>  at a 3:1 ratio instead of 5:1"),
  127 => clienttranslate("<span class='icon-start-em'> </span> add any one basic ingredient to your pantry.<br/>Endgame: 1  <span class='icon-sp-em'></span>  for each of your Vodka and Moonshine spirit labels"),
  128 => clienttranslate("Once per Market Phase, may discount one distillery upgrade by 2 <span class='icon-coin-em'></span> <br /> Endgame: 1  <span class='icon-sp-em'></span>  for each of your distillery upgrades"),
  129 => clienttranslate("During the Distill Phase, may add one additional <span class='icon-alcohol-em'></span><br/>Endgame: 2  <span class='icon-sp-em'></span>  if this is your only specialist distillery upgrade"),
  130 => clienttranslate("During the Sell Phase, add 2 <span class='icon-coin-em'></span> to the sell value of each spirit you sell."),
  131 => clienttranslate("Once per Market Phase, may discount one barrel by 2 <span class='icon-coin-em'></span><br/>Endgame: 1  <span class='icon-sp-em'></span>  for each barrel type represented in your spirit labels"),
  132 => clienttranslate("<span class='icon-start-em'> </span> add a basic <span class='icon-yeast-em'></span> card to your pantry.<br/>Endgame: 1  <span class='icon-sp-em'></span>  for each of your specialist distillery upgrades"),
  138 => clienttranslate("When purchased, you may reveal the top card of any market deck to all players. Purchase it or return it to the bottom of the deck."),
  139 => clienttranslate("When purchased, immediately gain 1 <span class='icon-coin-em'></span> <br/> <br/> Cannot be traded with the basic market."),
);

$this->sa_text = array(
   0 => clienttranslate("Sell a spirit with 6 alcohol <span class='icon-alcohol-em'></span> or more."),
   1 => clienttranslate("Sell 2 spirits in one round."),
   2 => clienttranslate("Collect spirit labels from 2 different regions."),
   3 => clienttranslate("Have 3 equipment distillery upgrades end of round."),
   4 => clienttranslate("Collect spirit labels from 3 different regions."),
   5 => clienttranslate("Sell a spirit with 4 flavor <span class='icon-flavor-em'></span> cards."),
   6 => clienttranslate("Display 4 bottles <span class='icon-bottles-em'></span>."),
   7 => clienttranslate("Sell a spirit worth 12 <span class='icon-sp-em'></span> or more."),
   8 => clienttranslate("Collect 3 spirit labels: one bronze tier, one silver tier, and one gold tier."),
   9 => clienttranslate("Collect 3 Americas (not Home) spirit labels. <div style='display: flex; justify-content: center; justify-items: center;'><div class='icon-americas'></div></div>"),
  10 => clienttranslate("Sell a non-vodka spirit using a bottle from the same region."),
  11 => clienttranslate("Sell an aged spirit <span class='icon-aged-em'></span>."),
  12 => clienttranslate("Age 2 spirits in a single round."),
  13 => clienttranslate("Collect 4 recipe cubes."),
  14 => clienttranslate("Sell a spirit with 5 sugar cards or more."),
  15 => clienttranslate("Have 25 <span class='icon-coin-em'></span> or more at end of round."),
  16 => clienttranslate("Have 3 specialist distillery upgrades at end of round."),
  17 => clienttranslate("Collect 3 Europe (not Home) spirit labels. <div style='display: flex; justify-content: center; justify-items: center;'><div class='icon-europe'></div></div>"),
  18 => clienttranslate("Sell a spirit worth 15 <span class='icon-coin-em'></span> or more."),
  19 => clienttranslate("Collect 3 silver tier spirit labels."),
  20 => clienttranslate("Collect 3 Asia and Oceania (not Home) spirit labels. <div style='display: flex; justify-content: center; justify-items: center;'><div class='icon-asia'></div></div>"),
  21 => clienttranslate("Collect 2 gold tier spirit labels."),
  22 => clienttranslate("Collect 3 bronze tier spirit labels."),
);

$this->goal_text = array(
   0 => clienttranslate("Have or be tied for the most Europe <span class='icon-europe-em'></span> <br/> <br/> Home <span class='icon-home-em'></span> labels do not count towards this goal."),
   1 => clienttranslate("Have or be tied for the most non-Vodka spirit labels that require plant sugars. <div class='icon-plant'></div>"),
   2 => clienttranslate("Have or be tied for the most displayed Asia and Oceania <span class='icon-asia-em'></span> and/or Home <span class='icon-home-em'></span> bottles. <div class='icon-bottle'></div>"),
   3 => clienttranslate("Have or be tied for the highest combined total of bronze, silver, and gold tier spirit labels."),
   4 => clienttranslate("Have or be tied for the most recipe cubes."),
   5 => clienttranslate("Have or be tied for the most money at the end of the game. <div class='icon-coin'></div>"),
   6 => clienttranslate("Have or be tied for the most spirit labels that require a clay barrel. <div class='icon-clay'></div>"),
   7 => clienttranslate("Score or be tied for the most <span class='icon-sp-em'></span> from <b> equipment </b> distillery upgrades."),
   8 => clienttranslate("Have or be tied for the most aged spirit labels. <div class='icon-aged'></div>"),
   9 => clienttranslate("Have or be tied for the most displayed Americas <span class='icon-americas-em'></span> and/or Home <span class='icon-home-em'></span> bottles. <div class='icon-bottle'></div>"),
  10 => clienttranslate("Have or be tied for the most non-Vodka spirit labels that require fruit sugars. <div class='icon-fruit-em'></div>"),
  11 => clienttranslate("Have or be tied for the most non-aged spirit labels. <div class='icon-unaged'></div>."),
  12 => clienttranslate("Have or be tied for the most displayed Europe <span class='icon-europe-em'></span> and/or Home <span class='icon-home-em'></span> bottles. <div class='icon-bottle'></div>"),
  13 => clienttranslate("Have or be tied for the most spirit labels from the same region."),
  14 => clienttranslate("Score or be tied for the most <span class='icon-sp-em'></span> from <b> specialist </b> distillery upgrades."),
  15 => clienttranslate("Have or be tied or the most variety in spirit labels. <br/> Signature labels count as their own unique label."),
  16 => clienttranslate("Have or be tied for the most Asia and Oceania <span class='icon-asia-em'></span> spirit labels.  <br/> <br/> Home <span class='icon-home-em'></span> labels do not count towards this goal"),
  17 => clienttranslate("Have or be tied for the most non-Vodka spirit labels that require grain sugars. <div class='icon-grain'></div>."),
  18 => clienttranslate("Have or be tied for the most Americas <span class='icon-americas-em'></span> spirit labels.  <br/> <br/> Home <span class='icon-home-em'></span> labels do not count towards this goal"),
  19 => clienttranslate("Have or be tied for the most spirit labels that require a wood barrel. <div class='icon-wood'></div>"),
);

$miscTranslate = array(
  clienttranslate("Pantry"),
  clienttranslate("Goals"),
  clienttranslate("Solo Goals"),
  clienttranslate("Storeroom"),
  clienttranslate("Washback"),
  clienttranslate("Warehouse 1"),
  clienttranslate("Warehouse 2"),
  clienttranslate("Endgame Scoring"),
  clienttranslate("2 from same region = 2 *sp*"),
  clienttranslate("3 from same region = 4 *sp*"),
  clienttranslate("4 from same region = 7 *sp*"),
  clienttranslate("5 from same region = 10 *sp*"),
  clienttranslate("6+ from same region = 15 *sp*"),
  clienttranslate("3 different regions = 5 *sp*"),
  clienttranslate("Display Case"),
  clienttranslate("Flavor Bonus:"),
  clienttranslate("Aged Flavor Bonus:"),
  clienttranslate("Bottle"),
  clienttranslate("SUGAR"),
  clienttranslate("Water"),
  clienttranslate("Yeast"),
  clienttranslate("Alcohol"),
  clienttranslate("Flavor"),
  clienttranslate("Goal"),
  clienttranslate("Grain"),
  clienttranslate("Plant"),
  clienttranslate("Fruit"),
  clienttranslate("Metal"),
  clienttranslate("Wood"),
  clienttranslate("Clay"),
  clienttranslate("Equipment"),
  clienttranslate("Specialist"),
  clienttranslate("Home"),
  clienttranslate("Europe"),
  clienttranslate("Asia"),
  clienttranslate("Americas"),
  clienttranslate("Close"),
  clienttranslate("Dashboard Location:"),
  clienttranslate("Wrap Dashboard Contents:"),
  clienttranslate("Floating"),
  clienttranslate("Wrap"),
  clienttranslate("Scroll"),
  clienttranslate("Overlap"),
  clienttranslate("Top"),
  clienttranslate("Expanded"),
  clienttranslate("Players"),
  clienttranslate("In-Game"),
  clienttranslate("Warehouses"),
  clienttranslate("Bottles"),
  clienttranslate("Distillery Upgrades"),
  clienttranslate("Distillery Upgrade"),
  clienttranslate("Distiller Ability"),
  clienttranslate("Premium Item"),
  clienttranslate("Premium Ingredient"),
  clienttranslate("Goals"),
  clienttranslate("Money"),
  clienttranslate("washback"),
  clienttranslate("market"),
  clienttranslate("reveal"),
  clienttranslate("tasting"),
  clienttranslate("Total"),
  clienttranslate("First Player"),
  clienttranslate("Asia and Oceania bottles"),
  clienttranslate("Americas bottles"),
  clienttranslate("Europe bottles"),
);

$this->distiller_text = array(
  0 => clienttranslate("Once per Market Phase, discount one bottle by 1 <span class='icon-coin-em'></span>"),
  2 => clienttranslate("<span class='icon-start-em'></span> add a basic <span class='icon-water-em'></span> or <span class='icon-yeast-em'></span> to your pantry"),
  4 => clienttranslate("During the Sell Phase, gain 2 <span class='icon-sp-em'></span> when selling a spirit from a region you have no other spirit labels from."),
  6 => clienttranslate("Once per Market Phase, discount one <span class='icon-du-em'></span> by 2 <span class='icon-coin-em'></span>"),
  8 => clienttranslate("Once per Distill Phase, gain <span class='icon-coin-em'></span> stated on a card removed from the distilled spirit"),
  10 => clienttranslate("When aging a spirit in your warehouse, draw 3 <span class='icon-flavor-em'></span> cards instead of 1. Pick 1 to add to the spirit and discard the other 2."),
  12 => clienttranslate("Once per Market Phase, discount one barrel by 2 <span class='icon-coin-em'></span>"),
  14 => clienttranslate("Once per Market Phase, discount one basic card by 1 <span class='icon-coin-em'></span>"),
  16 => clienttranslate("During the Market Phase, gain 1 <span class='icon-coin-em'></span> when purchasing a basic <span class='icon-water-em'></span> card."),
  18 => clienttranslate("Once per Market Phase discount one ingredient by 2 <span class='icon-coin-em'></span>."),
  20 => clienttranslate("During the Sell Phase, gain 2 <span class='icon-sp-em'></span> when selling a spirit containing 3 <span class='icon-flavor-em'></span> cards or more"),
  22 => clienttranslate("Start the game with a free silver recipe cube on Whiskey. Sell each <span class='icon-aged-em'></span> for 1 <span class='icon-coin-em'></span>"),
  24 => clienttranslate("During the Sell Phase gain 1 <span class='icon-sp-em'></span> when selling a spirit containing 3 sugar cards or more"),
  26 => clienttranslate("During the Market Phase, you may buy up to 3 cards fom the basic market instead of 2."),
  28 => clienttranslate("<span class='icon-start-em'></span> gain 1 <span class='icon-coin-em'></span>"),
  30 => clienttranslate("Sell each <span class='icon-unaged-em'></span> for 1 <span class='icon-coin-em'></span> more."),
  32 => clienttranslate("During the Sell Phase, sell each spirit for 2 <span class='icon-coin-em'></span> more if using a bottle from the matching region."),
  34 => clienttranslate("<span class='icon-start-em'></span> you may reveal 2 cards from a market deck and buy up to 1 of them. Return cards not bought to the bottom of the deck."),
);

$this->solo_goal_text = array(
  101 => clienttranslate("Collect 2 spirit labels from 3 different regions."),
  102 => clienttranslate("Collect 5 spirit labels from your Distiller's region."),
  103 => clienttranslate("Collect 5 non-Vodka spirit labels that require Grain <div class='icon-grain'></div>."),
  104 => clienttranslate("Collect 5 spirit labels from regions other than your Distiller's region."),
  105 => clienttranslate("Collect 6 different spirit labels."),
  106 => clienttranslate("Collect 4 <span class='icon-aged-em'></span> spirit labels."),
  107 => clienttranslate("Collect 6 <span class='icon-unaged-em'></span> spirit labels."),
  108 => clienttranslate("Collect 5 non-Vodka spirit labels that require Plant <div class='icon-plant'></div>."),
  109 => clienttranslate("Collect 5 non-Vodka spirit labels that require Fruit <div class='icon-fruit'></div>."),
  110 => clienttranslate("Collect 4 Silver and/or Gold tier spirit labels."),
  111 => clienttranslate("Collect 3 Gold tier spirit labels."),

  201 => clienttranslate("Collect 3 spirit labels of the same spirit type."),
  202 => clienttranslate("Sell a spirit worth at least 15 <span class='icon-coin-em'></span>."),
  203 => clienttranslate("Sell 2 spirits in a single round."),
  204 => clienttranslate("Collect 3 Equipment Distillery Upgrades <span class='icon-du-em'></span>."),
  205 => clienttranslate("Collect 3 Non-vodka spirit labels; 1 that requires Grain <div class='icon-grain'></div>, 1 that requires Plants <div class='icon-plant'></div>, and 1 that requires Fruit <div class='icon-fruit'></div>."),
  206 => clienttranslate("Sell a spirit containing 6 <span class='icon-alcohol-em'></span> or more."),
  207 => clienttranslate("Collect 3 bottles <div class='icon-bottle'></div> used for spirits of the matching region."),
  208 => clienttranslate("Sell a spirit worth 20 <span class='icon-sp-em'></span> or more."),
  209 => clienttranslate("Collect 3 Specialist Distillery Upgrades <span class='icon-du-em'></span>."),
  210 => clienttranslate("Collect 5 or more premium bottles <div class='icon-bottle'></div> (includes any in storeroom)."),
  211 => clienttranslate("Sell a spirit containing 4 <span class='icon-flavor-em'></span> or more."),
  212 => clienttranslate("Sell an <span class='icon-aged-em'></span> worth at least 5 <span class='icon-sp-em'></span> more than the recipe's base <span class='icon-sp-em'></span>."),
  213 => clienttranslate("Sell a Whiskey worth 16 <span class='icon-sp-em'></span> or more."),
  214 => clienttranslate("Sell a gold tier spirit worth 22 <span class='icon-sp-em'></span> or more."),
  215 => clienttranslate("Sell a silver tier spirit worth 18 <span class='icon-sp-em'></span> or more."),
  216 => clienttranslate("Earn 25 <span class='icon-sp-em'></span> or more in a round."),
  217 => clienttranslate("Collect spirit labels requiring all 3 barrel types <div class='icon-metal'></div> <div class='icon-wood'></div> <div class='icon-clay'></div>."),
  218 => clienttranslate("Sell a spirit containing 5 sugars or more."),

  301 => clienttranslate("Collect spirit labels from 2 different regions."),
  302 => clienttranslate("Sell a spirit worth at least 8 <span class='icon-coin-em'></span>."),
  303 => clienttranslate("Sell a Bronze/Silver tier spirit from your Distiller's Region <span class='icon-home-em'></span> worth at least 3 <span class='icon-sp-em'></span> more than the recipe <span class='icon-sp-em'></span>."),
  304 => clienttranslate("Sell a Bronze/Silver tier spirit from your Distiller's Region <span class='icon-home-em'></span> worth at least 6 <span class='icon-coin-em'></span>."),
  305 => clienttranslate("Collect 2 different spirit labels."),
  306 => clienttranslate("Sell a spirit containing at least 3 sugars."),
  307 => clienttranslate("Earn 8 <span class='icon-coin-em'></span> or more in a round."),
  308 => clienttranslate("Sell a spirit worth at least 8 <span class='icon-sp-em'></span>."),
  309 => clienttranslate("Earn 8 <span class='icon-sp-em'></span> or more in a round."),
  310 => clienttranslate("Distill an <span class='icon-aged-em'></span> spirit."),
  311 => clienttranslate("Collect a silver tier spirit label."),
  312 => clienttranslate("Distill your signature spirit."),
  313 => clienttranslate("Sell a spirit containing at least 3 <span class='icon-alcohol-em'></span>."),
  314 => clienttranslate("Sell a spirit containing at least 2 <span class='icon-water-em'></span>."),
  315 => clienttranslate("Sell a spirit containing no Basic Sugars."),
  316 => clienttranslate("Sell a Bronze tier spirit."),
  317 => clienttranslate("Collect 2 Bronze tier spirit labels."),
  318 => clienttranslate("Sell a spirit containing at least 2 sugars of the same type."),

  401 => clienttranslate("Swap any 2 solo goal cards within the same row.</br>May only be used once."),
);
