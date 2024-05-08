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
   0 => "Can be used as either a <span class='icon-water-em'></span> or <span class='icon-yeast-em'></span> in your washback. Cannot be traded with the basic market.",
   1 => "If removed from spirit stack during the Distill Phase, you many return it to the spirit you just distilled. Cannot be traded with the basic market.",
   2 => "If removed from spirit stack during the Distill Phase, you many return it to the spirit you just distilled. Cannot be traded with the basic market.",
   3 => "If removed from spirit stack during the Distill Phase, you many return it to the spirit you just distilled. Cannot be traded with the basic market.",
   4 => "If removed from spirit stack during the Distill Phase, you many return it to the spirit you just distilled. Cannot be traded with the basic market.",
   5 => "If removed from spirit stack during the Distill Phase, you many return it to the spirit you just distilled. Cannot be traded with the basic market.",
   6 => "If removed from spirit stack during the Distill Phase, you many return it to the spirit you just distilled. Cannot be traded with the basic market.",
   7 => "If removed from spirit stack during the Distill Phase, you many return it to the spirit you just distilled. Cannot be traded with the basic market.",
   8 => "If removed from spirit stack during the Distill Phase, you many return it to the spirit you just distilled. Cannot be traded with the basic market.",
   9 => "If removed from spirit stack during the Distill Phase, you many return it to the spirit you just distilled. Cannot be traded with the basic market.",
  10 => "If removed from spirit stack during the Distill Phase, you many return it to the spirit you just distilled. Cannot be traded with the basic market.",
  11 => "If removed from spirit stack during the Distill Phase, you many return it to the spirit you just distilled. Cannot be traded with the basic market.",
  12 => "If removed from spirit stack during the Distill Phase, you many return it to the spirit you just distilled. Cannot be traded with the basic market.",
  13 => "If removed from spirit stack during the Distill Phase, you many return it to the spirit you just distilled. Cannot be traded with the basic market.",
  14 => "If removed from spirit stack during the Distill Phase, you many return it to the spirit you just distilled. Cannot be traded with the basic market.",
  15 => "If removed from spirit stack during the Distill Phase, you many return it to the spirit you just distilled. Cannot be traded with the basic market.",
  16 => "If removed from spirit stack during the Distill Phase, you many return it to the spirit you just distilled. Cannot be traded with the basic market.",
  17 => "If removed from spirit stack during the Distill Phase, you many return it to the spirit you just distilled. Cannot be traded with the basic market.",
  18 => "If removed from spirit stack during the Distill Phase, you many return it to the spirit you just distilled. Cannot be traded with the basic market.",
  19 => "After selling, return this card to your storeroom. Cannot be traded.",
  20 => "After selling, return this card to your storeroom. Cannot be traded.",
  21 => "When selling, gain 2  <span class='icon-sp-em'></span> . If selling <span class='icon-americas-em'></span> spirit, gain 3  <span class='icon-sp-em'></span>  instead.",
  22 => "When selling, gain 1  <span class='icon-sp-em'></span> . If selling <span class='icon-americas-em'></span> spirit, gain 2  <span class='icon-sp-em'></span>  instead.",
  23 => "",
  24 => "",
  // Wax Sealed?
  25 => "When selling, gain 2  <span class='icon-sp-em'></span> . If selling <span class='icon-americas-em'></span> spirit, gain 4  <span class='icon-sp-em'></span>  instead.",
  26 => "When selling, gain 2  <span class='icon-sp-em'></span> . If selling <span class='icon-europe-em'></span> spirit, gain 3  <span class='icon-sp-em'></span>  instead.",
  27 => "When selling, gain 2  <span class='icon-sp-em'></span> . If selling <span class='icon-americas-em'></span> spirit, gain 3  <span class='icon-sp-em'></span>  instead.",
  28 => "",
  29 => "When selling, gain 2  <span class='icon-sp-em'></span> . If selling <span class='icon-europe-em'></span> spirit, gain 3  <span class='icon-sp-em'></span>  instead.",
  30 => "",
  31 => "When selling, gain 2 <span class='icon-coin-em'></span>. If selling Moonshine, gain 4 <span class='icon-coin-em'></span> instead.",
  32 => "When selling, gain 2  <span class='icon-sp-em'></span> . If selling <span class='icon-asia-em'></span> spirit, gain 3  <span class='icon-sp-em'></span>  instead.",
  33 => "When selling, gain 1  <span class='icon-sp-em'></span> . If selling <span class='icon-europe-em'></span> spirit, gain 2  <span class='icon-sp-em'></span>  instead.",
  34 => "When selling, gain 2  <span class='icon-sp-em'></span> . If selling <span class='icon-asia-em'></span> spirit, gain 3  <span class='icon-sp-em'></span>  instead.",
  35 => "When selling, gain 2  <span class='icon-sp-em'></span> . If selling <span class='icon-europe-em'></span> spirit, gain 4  <span class='icon-sp-em'></span>  instead.",
  36 => "When selling, gain 1  <span class='icon-sp-em'></span> . If selling <span class='icon-asia-em'></span> spirit, gain 2  <span class='icon-sp-em'></span>  instead.",
  // Frosted glass bottle
  37 => "When selling, gain 1  <span class='icon-sp-em'></span> . If selling <non-aged icon> spirit, gain 2  <span class='icon-sp-em'></span>  instead.",
  38 => "When selling, gain 2  <span class='icon-sp-em'></span> . If selling <span class='icon-asia-em'></span> spirit, gain 4  <span class='icon-sp-em'></span>  instead.",
  39 => "When selling, gain 1  <span class='icon-sp-em'></span> . If selling Moonshine, gain 2  <span class='icon-sp-em'></span>  instead.",
  40 => "After selling, you may return this card to your storeroom.",
  41 => "1 <span class='icon-sp-em'></span>  for each flavor <span class='icon-flavor-em'></span> card.",
  42 => "When selling, earn 1 <span class='icon-coin-em'></span> for each flavor <span class='icon-flavor-em'></span> card.",
  43 => "When aging for the first time, add an additional flavor <span class='icon-flavor-em'></span> card.",
  44 => "Once per Age Phase, gain 1 <span class='icon-coin-em'></span> if this barrel is aging in your warehouse.",
  45 => "During the Distill Phase, add 1 additional <span class='icon-alcohol-em'></span>",
  46 => "",
  47 => "If removed from spirit stack during the Distill Phase, add a basic <span class='icon-water-em'></span> card to the spirit you just distilled.",
  103 => "During the Distill Phase, may choose to return one of the removed cards back to the spirit.",
  104 => "During the Distill Phase, may add two additional <span class='icon-alcohol-em'></span>",
  105 => "<span class='icon-start-em'> </span> add a basic <span class='icon-fruit-em'></span> card to your pantry.<br/>Endgame: 1 <span class='icon-sp-em'></span>  for every two of your Europe spirit labels",
  106 => "During the Sell Phase, this counts as one additional flavor <span class='icon-flavor-em'></span> card when adding aged spirit flavor bonus.",
  107 => "<span class='icon-start-em'> </span> add a basic <span class='icon-water-em'></span> card to your pantry.<br/>Endgame: 1  <span class='icon-sp-em'></span>  for each of your equipment distillery upgrades",
  108 => "When aging a spirit in your warehouse, add one additional flavor <span class='icon-flavor-em'></span> card if it is the first time that spirit is aged.",
  109 => "Once per Market Phase, may discount one item by 1 <span class='icon-coin-em'></span>. <br/>Endgame: 2  <span class='icon-sp-em'></span>  if this is your only eqipment distillery upgrade",
  110 => "Drone camera",
  111 => "At the end of the Distill Phase, add one flavor <span class='icon-flavor-em'></span> card to the spirit you just distilled.",
  112 => "<span class='icon-start-em'> </span> add a basic <span class='icon-plant-em'></span> card to your pantry. <br/>Endgame: 1  <span class='icon-sp-em'></span>  for every two of your Americas spirit labels",
  113 => "At the end of the Distill Phase draw two flavor <span class='icon-flavor-em'></span> cards. Add one to the spirit you just distilled and discard the other. <br/> This action is automated.", 
  114 => "Once per Market Phase, may discount one ingredient by 2 <span class='icon-coin-em'></span>",
  115 => "Once per Market Phase, may discount one bottle by 2 <span class='icon-coin-em'></span>",
  116 => "During the Distill Phase, may remove only the top card (must declare if using before revealing card).",
  117 => "Once per Distill Phase, may return all removed cards, reshuffle and remove the top and bottom cards again.",
  118 => "<span class='icon-start-em'> </span> gain 2 <span class='icon-coin-em'></span> if you have at least one spirit in your warehouse.",
  119 => "Once per Market Phase, may discount one recipe cube by 2 <span class='icon-coin-em'></span><br/>1  <span class='icon-sp-em'></span>  for each of your silver and gold recipe cubes",
  120 => "During the Sell Phase, may double the <span class='icon-coin-em'></span> received from a single flavor <span class='icon-flavor-em'></span> card in each <aged icon> spirit sold.<br/>Endgame: 1  <span class='icon-sp-em'></span>  for each of your aged spirit labels",
  // Master blender
  121 => "During the Sell phase, gain 1  <span class='icon-sp-em'></span>  when selling a spirit if you already have a spirit label from the same region.<br/>2  <span class='icon-sp-em'></span>  for every two identical spirit labels",
  122 => "Once per Market phase, may discount one bottle by 1 <span class='icon-coin-em'></span><br/>Endgame: 1  <span class='icon-sp-em'></span>  for each region represented in your displayed bottle collection",
  123 => "<span class='icon-start-em'> </span> may purchase 1 card from the truck.<br/>Endgame: Reveal top card from ingredient draw deck, gain  <span class='icon-sp-em'></span>  equal to <span class='icon-coin-em'></span>",
  124 => "<span class='icon-start-em'> </span> may reveal top 3 cards of a market deck and buy up to 1 of them. Return cards not bought to bottom of deck.",
  125 => "<span class='icon-start-em'> </span> add a basic <span class='icon-grain-em'></span> card to your pantry. <br /> Endgame: 1  <span class='icon-sp-em'></span>  for every two of your Asia & Oceania spirit labels",
  126 => "<span class='icon-start-em'> </span> gain 1 <span class='icon-coin-em'></span><br/>Endgame: At end of game, convert <span class='icon-coin-em'></span> to  <span class='icon-sp-em'></span>  at a 3:1 ratio instead of 5:1",
  127 => "<span class='icon-start-em'> </span> add any one basic ingredient to your pantry.<br/>Endgame: 1  <span class='icon-sp-em'></span>  for each of your Vodka and Moonshine spirit labels",
  128 => "Once per Market Phase, may discount one distillery upgrade by 2 <span class='icon-coin-em'></span> <br /> Endgame: 1  <span class='icon-sp-em'></span>  for each of your distillery upgrades",
  129 => "During the Distill Phase, may add one additional <span class='icon-alcohol-em'></span><br/>Endgame: 2  <span class='icon-sp-em'></span>  if this is your only specialist distillery upgrade",
  130 => "During the Sell Phase, add 2 <span class='icon-coin-em'></span> to the sell value of each spirit you sell.",
  131 => "Once per Market Phase, may discount one barrel by 2 <span class='icon-coin-em'></span><br/>Endgame: 1  <span class='icon-sp-em'></span>  for each barrel type represented in your spirit labels",
  132 => "<span class='icon-start-em'> </span> add a basic <span class='icon-yeast-em'></span> card to your pantry.<br/>Endgame: 1  <span class='icon-sp-em'></span>  for each of your specialist distillery upgrades",
  138 => "When purchased, you may reveal the top card of any market deck to all players. Purchase it or return it to the bottom of the deck.",
  139 => "When purchased, immediately gain 1 <span class='icon-coin-em'></span> <br/> <br/> Cannot be traded with the basic market.",
);

$this->sa_text = array(
   0 => "Sell a spirit with 6 alcohol <span class='icon-alcohol-em'></span> or more.",
   1 => "Sell 2 spirits in one round.",
   2 => "Collect spirit labels from 2 different regions.",
   3 => "Have 3 equipment distillery upgrades end of round.",
   4 => "Collect spirit labels from 3 different regions.",
   5 => "Sell a spirit with 4 flavor <span class='icon-flavor-em'></span> cards.",
   6 => "Display 4 bottles <span class='icon-bottles-em'></span>.",
   7 => "Sell a spirit worth 12 <span class='icon-sp-em'></span> or more.",
   8 => "Collect 3 spirit labels: one bronze tier, one silver tier, and one gold tier.",
   9 => "Collect 3 Americas spirit labels. <div style='display: flex; justify-content: center; justify-items: center;'><div class='icon-americas'></div></div>",
  10 => "Sell a non-vodka spirit using a bottle from the same region.",
  11 => "Sell an aged spirit <span class='icon-aged-em'></span>.",
  12 => "Age 2 spirits in a single round.",
  13 => "Collect 4 recipe cubes.",
  14 => "Sell a spirit with 5 sugar cards or more.",
  15 => "Have 25 <span class='icon-coin-em'></span> or more at end of round.",
  16 => "Have 3 specialist distillery upgrades at end of round.",
  17 => "Collect 3 Europe spirit labels. <div style='display: flex; justify-content: center; justify-items: center;'><div class='icon-europe'></div></div> ",
  18 => "Sell a spirit worth 15 <span class='icon-coin-em'></span> or more.",
  19 => "Collect 3 silver tier spirit labels.",
  20 => "Collect 3 Asia and Oceania spirit labels. <div style='display: flex; justify-content: center; justify-items: center;'><div class='icon-asia'></div></div>",
  21 => "Collect 2 gold tier spirit labels.",
  22 => "Collect 3 bronze tier spirit labels.",
);

$this->goal_text = array(
   0 => "Have or be tied for the most Europe <span class='icon-europe-em'></span> <br/> <br/> Home <span class='icon-home-em'></span> labels do not count towards this goal.",
   1 => "Have or be tied for the most non-Vodka spirit labels that require plant sugars. <div class='icon-plant'></div>",
   2 => "Have or be tied for the most displayed Asia and Oceania <span class='icon-asia-em'></span> and/or Home <span class='icon-home-em'></span> bottles. <div class='icon-bottle'></div>",
   3 => "Have or be tied for the highest combined total of bronze, silver, and gold tier spirit labels.",
   4 => "Have or be tied for the most recipe cubes.",
   5 => "Have or be tied for the most money at the end of the game. <div class='icon-coin'></div>",
   6 => "Have or be tied for the most spirit labels that require a clay barrel. <div class='icon-clay'></div>",
   7 => "Score or be tied for the most <span class='icon-sp-em' from <b> equipment </b> distillery upgrades.",
   8 => "Have or be tied for the most aged spirit labels. <div class='icon-aged'></div>",
   9 => "Have or be tied for the most displayed Americas <span class='icon-americas-em'></span> and/or Home <span class='icon-home-em'></span> bottles. <div class='icon-bottle'></div>",
  10 => "Have or be tied for the most non-Vodka spirit labels that require fruit sugars. <div class='icon-fruit-em'></div>",
  11 => "Have or be tied for the most non-aged spirit labels. <div class='icon-unaged'></div>.",
  12 => "Have or be tied for the most displayed Europe <span class='icon-europe-em'></span> and/or Home <span class='icon-home-em'></span> bottles. <div class='icon-bottle'></div>",
  13 => "Have or be tied for the most spirit labels from the same region.",
  14 => "Score or be tied for the most <span class='icon-sp-em' from <b> specialist </b> distillery upgrades.",
  15 => "Have or be tied or the most variety in spirit labels. <br/> Signature labels count as their own unique label.",
  16 => "Have or be tied for the most Asia and Oceania <span class='icon-asia-em'></span> spirit labels.  <br/> <br/> Home <span class='icon-home-em'></span> labels do not count towards this goal",
  17 => "Have or be tied for th emost non-Vodka spirit labels that require grain sugars. <div class='icon-grain'></div>.",
  18 => "Have or be tied for the most Americas <span class='icon-americas-em'></span> spirit labels.  <br/> <br/> Home <span class='icon-home-em'></span> labels do not count towards this goal",
  19 => "Have or be tied for the most spirit labels that require a wood barrel. <div class='icon-wood'></div>",
);






