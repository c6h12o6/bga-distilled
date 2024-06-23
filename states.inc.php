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
 * states.inc.php
 *
 * distilled game states description
 *
 */

/*
   Game state machine is a tool used to facilitate game developpement by doing common stuff that can be set up
   in a very easy way from this configuration file.

   Please check the BGA Studio presentation about game state to understand this, and associated documentation.

   Summary:

   States types:
   _ activeplayer: in this type of state, we expect some action from the active player.
   _ multipleactiveplayer: in this type of state, we expect some action from multiple players (the active players)
   _ game: this is an intermediary state where we don't expect any actions from players. Your game logic must decide what is the next game state.
   _ manager: special type for initial and final state

   Arguments of game states:
   _ name: the name of the GameState, in order you can recognize it on your own code.
   _ description: the description of the current game state is always displayed in the action status bar on
                  the top of the game. Most of the time this is useless for game state with "game" type.
   _ descriptionmyturn: the description of the current game state when it's your turn.
   _ type: defines the type of game states (activeplayer / multipleactiveplayer / game / manager)
   _ action: name of the method to call when this game state become the current game state. Usually, the
             action method is prefixed by "st" (ex: "stMyGameStateName").
   _ possibleactions: array that specify possible player actions on this step. It allows you to use "checkAction"
                      method on both client side (Javacript: this.checkAction) and server side (PHP: self::checkAction).
   _ transitions: the transitions are the possible paths to go from a game state to another. You must name
                  transitions in order to use transition names in "nextState" PHP method, and use IDs to
                  specify the next game state for each transition.
   _ args: name of the method to call to retrieve arguments for this gamestate. Arguments are sent to the
           client side to be used on "onEnteringState" or to set arguments in the gamestate description.
   _ updateGameProgression: when specified, the game progression is updated (=> call to your getGameProgression
                            method).
*/

//    !! It is not a good idea to modify this file when a game is running !!

 
$machinestates = array(

    // The initial state. Please do not modify.
    1 => array(
        "name" => "gameSetup",
        "description" => "",
        "type" => "manager",
        "action" => "stGameSetup",
        "transitions" => array( "" => 2 )
    ),
    2 => array(
        "name" => "chooseDistiller",
        "type" => "multipleactiveplayer",
        //"type" => "activeplayer",
        "description" => clienttranslate('Waiting for other players to select a distiller'),
        "descriptionmyturn" => clienttranslate('${you} must select a distiller'),
        "args" => "argChooseDistiller",
        "possibleactions" => array("selectDistiller"),
        "transitions" => array("selectDistiller" => 3),
    ),
    3 => array(
        'name' => "chooseDistillerGame",
        "type" => "game",
        "action" => "stChooseDistiller",
        "transitions" => array("" => 4),
    ),
    
    // Note: ID=2 => your first state
    // Market Phases
    4 => array(
    		"name" => "roundStartOnce",
            "type" => "game",
            "action" => "stRoundStartOnce",
            "transitions" => array('' => 5),
    ),
    5 => array(
    		"name" => "roundStart",
            "type" => "game",
            "action" => "stRoundStart",
            "updateGameProgression" => true,        
            "transitions" => array('' => 6),
    ),
    6 => array(
        "name" => "nextPlayerRoundStart",
        "type" => "game",
        "action" => "stNextPlayerRoundStart",
        "transitions" => array('startAction' => 7, 'nextPlayer' => 6, 'fangXin' => 8, 'startActionSelect' => 9, 'market' => 10),
    ),
    7 => array(
        "name" => "roundStartAction", 
        "type" => "activeplayer",
        "description" => clienttranslate('${actplayer} must take an action at round start'),
        "descriptionmyturn" => clienttranslate('${you} must take a card at round start'),
        "args" => "argRoundStartAction",
        "possibleactions" => array("buyCard", "roundStartPass"),
        "transitions" => array(/*'' => 4, */'buyCard' => 5, 'pass' => 6, 'zombiePass'=>6),
    ),
    9 => array(
        "name" => "roundStartActionSelect",
        "type" => "activeplayer",
        "description" => clienttranslate('${actplayer} must select a round start action to take'),
        "descriptionmyturn" => clienttranslate('${you} must select a round start action to take'),
        "args" => "argRoundStartActionSelect",
        "possibleactions" => array("selectRoundStartAction"),
        "transitions" => array('select' => 7, 'fangXin' => 8, 'zombiePass'=>6),
    ),

    8 => array(
        "name" => "fangXinRevealSelect",
        "type" => "activeplayer",
        "description" => clienttranslate('${actplayer} may select a deck to reveal cards from'),
        "descriptionmyturn" => clienttranslate('${you} may select a deck to reveal cards from'),
        "args" => "argFangXin",
        "possibleactions" => array("reveal"),
        "transitions" => array('reveal' => 7, 'pass' => 6)
    ),
    10 => array(
        // Add args to highlight things the player can do
    		"name" => "playerBuyTurn",
            "args" => "argPlayerBuyTurn",
    		"description" => clienttranslate('${actplayer} must buy a card, buy a recipe, or pass'),
    		"descriptionmyturn" => clienttranslate('${you} must buy a card, buy a recipe, or pass'),
    		"type" => "activeplayer",
    		"possibleactions" => array( "buyCard", "buyRecipe", "pass"),
    		"transitions" => array( "buyCard" => 11, "buyWater" => 14, /*"buyDuCard" => 12, */ "buyRecipe"=>11, "pass" => 12)
    ),
    12 => array(
        "name" => "marketPass",
        "type" => "game",
        "action" => "stMarketPass",
        "transitions" => array('' => 11),
    ),
    14 => array(
    		"name" => "playerBuyTurnRevealSelect",
    		"description" => clienttranslate('${actplayer} may choose a market deck to reveal a card from or pass'),
    		"descriptionmyturn" => clienttranslate('${you} may choose a market deck to reveal a card from or pass'), 
    		"type" => "activeplayer",
            "possibleactions" => array( "reveal" /*, "pass"*/),
    		"transitions" => array( "reveal" => 15, "pass" => 11)
    ),
    15 => array(
    		"name" => "playerBuyTurnReveal",
    		"description" => clienttranslate('${actplayer} may buy the revealed card or pass.'),
    		"descriptionmyturn" => clienttranslate('${you} may buy the revealed card or pass.'),
    		"type" => "activeplayer",
    		"possibleactions" => array( "buyCard", "pass"),
            "args" => "argPlayerBuyTurnReveal",
    		"transitions" => array( "buyCard" => 16, "pass" => 16)
    ),
    16 => array(
        "name" => "playerBuyTurnRevealCleanup",
        "type" => "game",
        "action" => "stPlayerBuyTurnRevealCleanup",
        "transitions" => array('' => 11),
    ),
    11 => array(
        "name" => "nextPlayer",
        "type" => "game",
        "action" => "stNextPlayer",
        "updateGameProgression" => true,        
        "args" => "argNextPlayer",
        "transitions" => array( "nextPlayerBuyTurn" => 10, "cantPlay" => 11, "distillPhase" => 13)
    ),
    13 => array(
        "name" => "marketEnd",
        "type" => "game",
        "action" => "stMarketEnd",
        "updateGameProgression" => true,        
        "transitions" => array('' => 20),
    ),
    18 => array(
        "name" => "nextPlayerDistill",
        "type" => "game",
        "action" => "stNextPlayerDistill",
        "transitions" => array('nextPlayer' => 20, "sellPhase" => 31)
    ),
    20 => array(
        "name" => "distill",
        "type" => "activeplayer",
        "args" => "argDistill",
        "description" => clienttranslate('${actplayer} must distill a spirit or pass'),
        "descriptionmyturn" => clienttranslate('${you} must distill a spirit or pass'),
        "possibleactions" => array("distill", "skipDistill", "trade", "restartDistill"),
        "transitions" => array("distillPowers" => 24, "distillReact"=>21, "trade"=>20, "exitDistill" => 23, "restart"=>20, "skip" => 18),
    ),
    24 => array(
        'name' => 'distillPowers',
        "type" => "activeplayer",
        "description" => clienttranslate('${actplayer} must distill a spirit or pass'),
        "descriptionmyturn" => clienttranslate('${you} may activate Distillery Upgrades and/or player powers'),
        "args" => "argDistillPowers",
        "possibleactions" => array("distillPostPowers", "restartDistill"),
        "transitions" => array('distillReact' => 21, 'restart'=>20, 'exitDistill'=>23),
    ),
    21 => array(
        "name" => "distillReact",
        "type" => "activeplayer",
        "description" => clienttranslate('${actplayer} must distill a spirit or pass'),
        "descriptionmyturn" => clienttranslate('${you} may react to the cards removed from the washback'),
        "args" => "argDistillReact",
        "possibleactions" => array("addBack", "distillAgain", "useDistillPower", "distillReactPass", "restartDistill"),
        // pointing restart at 21 because i dont want to be able to restart and then completely restart distill
        //"transitions" => array("distillReact" => 21, "addback" => 21, "distillAgain"=>24, "restart"=>20, "exitDistill" => 23) 
        "transitions" => array("distillReact" => 21, "addback" => 21, "distillAgain"=>24, "restart"=>21, "exitDistill" => 23)
    ),
    23 => array(
        "name" => "distillFinalize",
        "type" => "game",
        "action" => 'stDistillFinalize',
        "transitions" => array('' => 22),
        "updateGameProgression" => true,        
    ),

    // Make this an active player so that each recipe is selected in turn
    22 => array(
        "name" => "selectRecipe",
        "type" => "activeplayer",
        "descriptionmyturn" => clienttranslate('${you} must select a recipe'),
        "description" => clienttranslate('${actplayer} must select a recipe'),
        "args" => "argSelectRecipe",
        "possibleactions" => array("selectRecipe"),
        "transitions" => array('' => 18),
    ),

    29 => array (
        "name" => "nextPlayerSellHack",
        "type" => "game",
        "action" => "stNextPlayerSellHack",
        "transitions" => array('' => 31)
    ),
    31 => array(
        "name" => "nextPlayerSell",
        "type" => "game",
        "action" => "stNextPlayerSell",
        "transitions" => array("nextPlayerSell" => 30, "cantPlay" => 31, "agePhase" => 48)
    ),

    30 => array(
        "name" => "sell",
        "descriptionmyturn" => clienttranslate('${you} must choose a drink to sell'),
        "description" => clienttranslate('${actplayer} must choose a drink to sell'),
        "type" => "activeplayer",
        "args" => "argSell",
        "possibleactions" => array("sellDrink", "skipSale", "pass"),
        "transitions" => array(
            'label0' => 29,
            'label1' => 29,
            'label2' => 29,
            'label3' => 29,
            'label4' => 29,
            'label5' => 29,
            'label6' => 29,
            "skipSale" => 29, 
            "sellDrinkNoLabel" => 29, 
            "placeLabelForSP" => 29,
            'zombiePass' => 29),
    ),

    48 => array(
        "name" => "moveToWarehouse",
        "type" => "game",
        "action" => "stMoveToWarehouse",
        "transitions" => array('' => 49),
    ),
    49 => array( 
        "name" => "nextPlayerAgePhase",
        "type" => "game",
        "action" => "stNextPlayerAge",
        "transitions" => array("age" => 50 , 'nextPlayer' => 49, "selectFlavor" => 52, 'roundEnd' => 53),
    ),
    50 => array(
        "name" => "agePhase",
        "type" => "game",
        "action" => "stAge",
        "transitions" => array("aged" => 49),
    ),
    
    52 => array(
        "name" => "selectFlavor",
        "type" => "activeplayer",
        "args" => "argPlayerSelectFlavor",
        "descriptionmyturn" => clienttranslate('Age Phase: ${you} must select a flavor card'),
        "description" => clienttranslate('${actplayer} must select a flavor card'),
        "possibleactions" => array("selectFlavor"),
        "transitions" => array('next' => 49, 'zombiePass' => 49),
    ),
    53 => array(
        "name" => "enterTasting",
        "type" => "game",
        "action" => "stEnterTasting",
        "transitions" => array('tasting' => 51, 'notasting' => 60),
    ),
    51 => array(
        'name' => 'tasting',
        "type" => "multipleactiveplayer",
        "description" => clienttranslate('Tasting: Waiting for other players to exchange up to 4 <span class="icon-sp-em"></span> for <span class="icon-coin-em"></span>'),
        "descriptionmyturn" => clienttranslate('Tasting: ${you} may exchange up to 4 <span class="icon-sp-em"></span> for <span class="icon-coin-em"></span>'),
        "possibleactions" => array("tasting"),
        "transitions" => array('' => 60), // go to round end
    ),
    // Distill Phases
   
    60 => array(
        "name" => "stRoundEnd",
        "type" => "game",
        "action" => "stRoundEnd",
        "transitions" => array("nextRound" => 4, "discardGoals"=> 61, "endGame" => 98),
    ),

        
    61 => array(
        "name" => "discardGoals",
        "type" => "multipleactiveplayer",
        "description" => clienttranslate('Waiting for other players to discard distillery goals'),
        "descriptionmyturn" => clienttranslate('${you} must discard one distillery goal'),
        "possibleactions" => array("discardGoal"),
        "transitions" => array("" => 4),
    ),

    98 => array(
        "name" => "endGameScoring",
        "type" => "game",
        "action" => "stEndGameScoring",
        "transitions" => array('' => 99)

    ),

    97 => array(
        "name" => "wait",
        "type" => "activeplayer",
        "descriptionmyturn" => "waiting for the endgame",
        "description" => "waiting for the endgame",
        "transitions" => array('' => 99),
    ),
   
    // Final state.
    // Please do not modify (and do not overload action/args methods).
    99 => array(
        "name" => "gameEnd",
        "description" => clienttranslate("End of game"),
        "type" => "manager",
        "action" => "stGameEnd",
        "args" => "argGameEnd"
    )
);



