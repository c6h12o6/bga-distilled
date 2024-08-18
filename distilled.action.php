<?php
/**
 *------
 * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
 * distilled implementation : © JB Feldman <wigginender520@gmail.com>
 *
 * This code has been produced on the BGA studio platform for use on https://boardgamearena.com.
 * See http://en.doc.boardgamearena.com/Studio for more information.
 * -----
 * 
 * distilled.action.php
 *
 * distilled main action entry point
 *
 *
 * In this file, you are describing all the methods that can be called from your
 * user interface logic (javascript).
 *       
 * If you define a method "myAction" here, then you can call it from your javascript code with:
 * this.ajaxcall( "/distilled/distilled/myAction.html", ...)
 *
 */
  
  
  class action_distilled extends APP_GameAction
  { 
    // Constructor: please do not modify
    public function __default()
    {
        if( self::isArg( 'notifwindow') )
        {
            $this->view = "common_notifwindow";
            $this->viewArgs['table'] = self::getArg( "table", AT_posint, true );
        }
        else
        {
            $this->view = "distilled_distilled";
            self::trace( "Complete reinitialization of board game" );
      }
    } 
    
    public function buyCard() {
      self::setAjaxMode();
      $cardName = self::getArg("cardName", AT_alphanum, true );
      $marketName = self::getArg("marketName", AT_alphanum, true );
      $slotId = self::getArg("slotId", AT_posint, false );
      $duSlot = self::getArg("duSlot", AT_posint, false );
      $powers = self::getArg("powers", AT_numberlist, false );
      $powersArray = null;
      if ($powers != null)
        $powersArray = explode(",", $powers);

      $result = $this->game->buyCard($cardName, $marketName, $slotId, $duSlot, $powersArray);
      self::ajaxResponse();
    }

    public function selectFlavor() {
      self::setAjaxMode();
      $flavor = self::getArg("flavor", AT_posint, true );
      $drink = self::getArg("drink", AT_posint, true );
      $result = $this->game->selectFlavor($flavor, $drink);
      self::ajaxResponse();
    }

    public function restartDistill() {
      self::setAjaxMode();
      $this->game->restartDistill();
      self::ajaxResponse();
    }


    public function trade() {
      self::setAjaxMode();
      $in = self::getArg("in", AT_posint, true );
      $out = self::getArg("out", AT_posint, true );
      $result = $this->game->trade($in, $out);
      self::ajaxResponse();
    }

    public function buyRecipe() {
      self::setAjaxMode();
      $recipeSlot = self::getArg("recipeSlot", AT_posint, true );
      $pc = self::getArg("powers", AT_numberlist, true );
      $powers = explode(",", $pc);
      $result = $this->game->buyRecipe($recipeSlot, $powers);
      self::ajaxResponse();
    }

    public function pass() {
      self::setAjaxMode();
      $result = $this->game->marketPass();
      self::ajaxResponse();
    }

    public function roundStartPass() {
      self::setAjaxMode();
      $power = self::getArg("power", AT_posint, true );
      $result = $this->game->roundStartPass($power);
      self::ajaxResponse();
    }

    public function discardGoal() {
      self::setAjaxMode();
      $cardName = self::getArg("discard", AT_alphanum, true );
      $result = $this->game->discardGoal($cardName);
      self::ajaxResponse();
    }

    public function skipDistill() {
        self::setAjaxMode();
        $result = $this->game->skipDistill();
        self::ajaxResponse();
    }

    public function skipSale() {
      self::setAjaxMode();
      $result = $this->game->skipSale();
      self::ajaxResponse();
    }

    public function distill() {
      self::setAjaxMode();
      $wbCards = self::getArg("washbackCards", AT_numberlist, true );
      $wbCardsArray = explode(",", $wbCards);
      $cardIn = self::getArg("tradeIn", AT_posint, false );
      $cardOut = self::getArg("tradeOut", AT_posint, false );
      $this->game->distill($wbCardsArray, $cardOut, $cardIn);
      self::ajaxResponse();
    }

    /*
    public function placeDuCard() {
      self::setAjaxMode();
      $slot = self::getArg("slot", AT_posint, true );
      $this->game->placeDuCard($slot);
      self::ajaxResponse();
    }*/

    public function selectRecipe() {
      self::setAjaxMode();
      //$recipe = self::getArg("recipe", AT_alphanum, true );
      $recipeSlot = self::getArg("recipeSlot", AT_int, true );
      $drinkId = self::getArg("drinkId", AT_posint, true );
      $barrelUid = self::getArg("barrel", AT_posint, true );
      $this->game->selectRecipe($recipeSlot, $drinkId, $barrelUid);
      self::ajaxResponse();
    }

    public function sellDrink() {
      self::setAjaxMode();
      $drinkId = self::getArg("drinkId", AT_posint, true );
      $bottle = self::getArg("bottle", AT_posint, true );
      $labelSlot = self::getArg("labelSlot", AT_int, true);
      $optForSp = self::getArg("optForSp", AT_bool, true );

      $collectCard = self::getArg("collectCard", AT_int, false);
      $collectCardSlot = self::getArg("collectCardSlot", AT_int, false);
      $collectRecipeSlot = self::getArg("collectRecipeSlot", AT_int, false);
      $tradeCardIn = self::getArg("tradeCardIn", AT_int, false);
      $tradeCardOut = self::getArg("tradeCardOut", AT_int, false);
      $tradeTruck = self::getArg("tradeTruck", AT_alphanum, false);
      $duSlot = self::getArg("duSlot", AT_int, false);
      $args = array(
        'labelSlot' => $labelSlot,
        'bottle' => $bottle,
        'drinkId' => $drinkId,
        'collectCard' => $collectCard,
        'collectCardSlot' => $collectCardSlot,
        'collectRecipeSlot' => $collectRecipeSlot,
        'tradeCardIn' => $tradeCardIn,
        'tradeCardOut' => $tradeCardOut,
        'tradeTruck' => $tradeTruck,
        'duSlot' => $duSlot,
      );



      $this->game->sellDrink($drinkId, $bottle, $labelSlot, $optForSp, $args);
      self::ajaxResponse();
    }

    public function passPreDistill() {
      self::setAjaxMode();
      $this->game->passPreDistill();
      self::ajaxResponse();
    }

    public function addBack() {
      self::setAjaxMode();
      $trigger = self::getArg("triggerCard", AT_int, false );
      $return = self::getArg("returnCard", AT_int, true );
      $this->game->addBack($trigger, $return);
      self::ajaxResponse();
    }

    public function distillAgain() {
      self::setAjaxMode();
      $trigger = self::getArg("triggerCard", AT_int, true );
      $this->game->distillAgain($trigger);
      self::ajaxResponse();
    }

    public function distillReactPass() {
      self::setAjaxMode();
      $this->game->distillReactPass();
      self::ajaxResponse();
    }

    public function distillPostPowers() {
        self::setAjaxMode();
        $pc = self::getArg("powers", AT_numberlist, true );
        $powers = explode(",", $pc);
        $this->game->distillPostPowers($powers);
        self::ajaxResponse();
    }

    public function reveal() {
      self::setAjaxMode();
      $deck = self::getArg("deck", AT_alphanum, true );
      $this->game->waterReveal($deck);
      self::ajaxResponse();
    }

    public function selectDistiller() {
      self::setAjaxMode();
      $distiller = self::getArg("card", AT_int, true );
      $player_id = self::getArg("player_id", AT_int, true );
      $this->game->selectDistillerAction($distiller, $player_id);
      self::ajaxResponse();
    }

    public function selectRoundStartAction() {
      self::setAjaxMode();
      $card_id = self::getArg("card_id", AT_int, true );
      $this->game->selectRoundStartAction($card_id);
      self::ajaxResponse();
    }

    public function tasting() {
      self::setAjaxMode();
      $exchange = self::getArg("exchange", AT_int, true);
      $this->game->exchangeTasting($exchange);
      self::ajaxResponse();
    }

    public function useDistillPower() {
      self::setAjaxMode();
      $trigger = self::getArg("triggerCard", AT_int, false );
      $this->game->useDistillPower($trigger);
      self::ajaxResponse();
    }

    public function completeSoloGoal() {
      self::setAjaxMode();
      $card_id = self::getArg("card_id", AT_int, true );
      $this->game->completeSoloGoal($card_id);
      self::ajaxResponse();
    }
    public function skipSoloGoal() {
      self::setAjaxMode();
      $this->game->skipSoloGoal();
      self::ajaxResponse();
    }
    public function soloGoalSwapUse() {
      self::setAjaxMode();
      $row = self::getArg("row", AT_int, true );
      $pos = self::getArg("pos", AT_alphanum, true );
      $this->game->soloGoalSwapUse($row, $pos);
      self::ajaxResponse();
    }
    /*
    
    Example:
    
    public function myAction()
    {
        self::setAjaxMode();     

        // Retrieve arguments
        // Note: these arguments correspond to what has been sent through the javascript "ajaxcall" method
        $arg1 = self::getArg( "myArgument1", AT_posint, true );
        $arg2 = self::getArg( "myArgument2", AT_posint, true );

        // Then, call the appropriate method in your game logic, like "playCard" or "myAction"
        $this->game->myAction( $arg1, $arg2 );

        self::ajaxResponse( );
    }
    
    */

  }
  

