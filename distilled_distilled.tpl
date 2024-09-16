{OVERALL_GAME_HEADER}

<!-- 
--------
-- BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
-- distilled implementation : © JB Feldman <wigginender520@gmail.com>
-- 
-- This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
-- See http://en.boardgamearena.com/#!doc/Studio for more information.
-->

<script>
require(["dojo/parser", "dijit/Dialog", "dijit/form/Button", "dijit/form/TextBox", "dijit/form/DateTextBox", "dijit/form/TimeTextBox"]);
</script>


<div data-dojo-type="dijit/Dialog" data-dojo-id="myDialog" title="Name and Address" style="width: 80%; height: 80%;">
    Contents!
    <div id="modalContents"> HI </div>

    <div class="dijitDialogPaneActionBar">
        <button data-dojo-type="dijit/form/Button" type="submit" id="ok">OK</button>
        <button data-dojo-type="dijit/form/Button" type="button" data-dojo-props="onClick:function(){myDialog.hide();}"
                id="cancel">Cancel</button>
    </div>
</div>

<div id="distillerChoice" class="distillerChoice invisible" >
    <div class='distillerChoice2'>
        <div class="distillerChoiceInner"><div id="distiller1"> </div> <div id="label1choice" class="dlabel"></div></div>
        <div class="distillerChoiceInner"><div id="distiller2"> </div> <div id="label2choice" class="dlabel"></div></div>
    </div>
    <div class="minimizeDistillerChoice"> - </div>
    <div class='maximizeDistillerChoice'> <div> + </div> </div>
</div>

<div class="centerScreen invisible" style="position: absolute; justify-content: center; align-items: center; width: 100%; height: auto; display: flex; z-index: 100; gap: 10px">
    <div id="centerScreen" class="centerScreen" style="position: absolute; top: 5vw; justify-content: center; align-items: top; width: 100%; height: unset; display: flex; z-index: 100;">
        <div id="game-scoring" class="invisible" style="background-color: rgba(255, 255, 255, 0.95); height: auto; border-radius: 1vw;">
            <table class="scoringTable">
                <tr id="scoring-row-players" class="line-below">
                    <td class="first-column translateme">Players</td>
                </tr>
                <tr id="scoring-row-ingame">
                    <td class="first-column translateme">In-Game</td>
                </tr>
                <tr id="scoring-row-warehouses">
                    <td class="first-column translateme">Warehouses</td>
                </tr>
                <tr id="scoring-row-bottles">
                    <td class="first-column translateme">Bottles</td>
                </tr>
                <tr id="scoring-row-dus">
                    <td class="first-column translateme">Distillery Upgrades</td>
                </tr>
                <tr id="scoring-row-goals">
                    <td class="first-column translateme">Goals</td>
                </tr>
                <tr id="scoring-row-money">
                    <td class="first-column translateme">Money</td>
                </tr>
                <tr id="scoring-row-total" class="line-above">
                    <td id="text-total" class="first-column translateme">Total</td>
                </tr>
                <tr id="scoring-row-target" class="invisible">
                    <td class="first-column translateme">Target</td>
                </tr>
            </table>
        </div>
    </div>
</div>



<div id="modalSpot"> </div>

<div style="align-items: center; jutify-content: center;">
    <div id="voidIng" style="height: 0px; align-items: center;"> </div>
    <div id="voidItem" style="height: 0px; align-items: center;"> </div>
</div>

<div id="revealedCards" class="invisible"> </div>
<div id="mainShared" class="mainShared">
<!-- BEGIN solo_goals -->
    <div id="mainTabs" class="mainTabsContainer invisible">
        <div id="mainTabMarket" class="mainTab selectedTab translateme">Market</div>
        <div id="mainTabSoloGoals" class="mainTab translateme">Solo Goals</div>
    </div>
    <div id="soloGoals" class="dwhiteblock soloGoals invisible" style="margin-top: 0">
        <div id="soloGoalsTarget">
            <div id="soloGoalsTargetLabel" class="translateme">Solo Target</div>
            <div id="soloGoalsTargetValue"> </div>
        </div>
        <div id="soloGoalsSwap"> </div>
        <div id="soloGoals5" class="soloGoalsRow"> </div>
        <div id="soloGoals4" class="soloGoalsRow"> </div>
        <div id="soloGoals3" class="soloGoalsRow"> </div>
        <div id="soloGoals2" class="soloGoalsRow"> </div>
        <div id="soloGoals1" class="soloGoalsRow"> </div>
    </div>
<!-- END solo_goals -->
    <div id="market" class="dwhiteblock market" style="margin-top: 0">
        <div id="whatCanIMake" class="whatCanIMake"> </div>
        <div id="remainingDiv" class="invisible"></div>
        <div id="basicMarket2" class="basicMarket">
        </div>
        <div id="advancedMarket" class="advancedMarketWrap">
            <div style="width: 100%; position:relative;">
                <div id="markettitles" style="height: 20px">
                    <div id="deckTitle" class="translateme" style="position: absolute; width: 122px; left: 0px;"> Deck </div>
                    <div class="translateme" style="position: absolute; width: 122px; right: 0px;"> Truck </div>
                    <div class="translateme"> Market </div>
                </div>
            </div>
            <div id="distilleryUpgrades" class="premiumMarket "> 
                <div id="distilleryUpgradeDeck" class="marketDeck marketDeckRtl"> </div>
                <div id="distilleryUpgradeStock" class="premiumMarket"> </div>
                <div id="distilleryUpgradeTruck" class="fade marketDeck"> </div>
            </div>
            <div id="premiumIngredients" class="premiumMarket "> 
                <div id="premiumIngredientsDeck" class="marketDeck marketDeckRtl"> </div>
                <div id="premiumIngredientsStock" class="premiumMarket"> </div>
                <div id="premiumIngredientsTruck" class="fade marketDeck"> </div>
            </div>
            <div id="premiumItems" class="premiumMarket "> 
                <div id="premiumItemsDeck" class="marketDeck marketDeckRtl"> </div>
                <div id="premiumItemsStock" class="premiumMarket"> </div>
                <div id="premiumItemsTruck" class="fade marketDeck"> </div>
            </div>
        </div>
    </div>
</div>
<div id="labelDisplay" class="dwhiteblock labelDisplay"> 
    <div id='label_0' class='labelSlot'> </div>
    <div id='label_1' class='labelSlot'> </div>
    <div id='label_2' class='labelSlot'> </div>
    <div id='label_3' class='labelSlot'> </div>
    <div id='label_4' class='labelSlot'> </div>
    <div id='label_5' class='labelSlot'> </div>
    <div id='label_6' class='labelSlot'> </div>
    <div id='label_7' class='labelSlot'> </div>
    <div id='label_8' class='labelSlot'> </div>
</div>

<div class="turnsAndSA"  >
    <div id="turnTrack"  class="turnTrack">
        <div id="turn1" class="turnHighlight turnHighlight1 invisible"> </div>
        <div id="turn2" class="turnHighlight turnHighlight2 invisible"> </div>
        <div id="turn3" class="turnHighlight turnHighlight3 invisible"> </div>
        <div id="turn4" class="turnHighlight turnHighlight4 invisible"> </div>
        <div id="turn5" class="turnHighlight turnHighlight5 invisible"> </div>
        <div id="turn6" class="turnHighlight turnHighlight6 invisible"> </div>
        <div id="turn7" class="turnHighlight turnHighlight7 invisible"> </div>
    </div>
    <div id="spiritAwardDisplay"  class="dwhiteblock spiritAwards"></div>
</div>

<div id="myPlayerBoard" class="invisible">
    <div id="myPlayerContainer" class="playerContainer">
        <div id="myPlayerDistillery" class="playerDistillery">
            <div id="relativity" style="width: 100%; height: 100%; position: relative">
                <div id="du1" class="duCardSlot" style="position: absolute; top: 160px; left: 330px; width: 122px;"> </div>
                <div id="du2" class="duCardSlot" style="position: absolute; top: 160px; left: 520px; width: 122px;"> </div>
                <div id="du3" class="duCardSlot" style="position: absolute; top: 160px; left: 710px; width: 122px;"> </div>
            </div>
        </div>
    </div>
</div>



<div id="activeBoard"> </div>
<div id="floatingPantryWrap" class="pantryWrap" >
    <div style="justify-content: space-between; display: flex;">
        <div id="pantryButtons" class="pantryButtons" > 
            <div class="dashboardMoney"> 
                <div id="floating_money_counter"> </div> <div class="icon-coin-em"></div>
            </div>
            <Button id="floatingCloseButton" class="bgabutton bgabutton_blue pantryButton translateme"> Close </Button>
        </div>
    </div>
        
        <div id='pantryWrap2'> 
            <div id="pantry_wcim" class="wcim"></div>
        </div>
</div>

<div id="radioButtons" class="radioButtons whiteblock">
    <span class="translateme"> Dashboard Location:  </span>
    <input type="radio" class="radioPref translateme" id="floatingRadio" name="hud_choice" value="floating" checked="checked"><span class="translateme">  Floating </span></input>
    <input type="radio" class="radioPref translateme" id="topRadio" name="hud_choice" value="top" "><span class="translateme">  Top </span></input>
    <input type="radio" class="radioPref translateme" id="expandedRadio" name="hud_choice" value="expanded" ><span class="translateme">  Expanded</span> </input>
</div>
<div id="radioButtonsWrap" class="radioButtons whiteblock">
    <span class="translateme"> Wrap Dashboard Contents:  </span>
    <input type="radio" class="radioPref translateme" id="nowrapRadio" name="wrap_choice" value="nowrap" checked="checked"> <span class="translateme"> Overlap </span> </input>
    <input type="radio" class="radioPref translateme" id="wrapRadio" name="wrap_choice" value="wrap"> <span class="translateme"> Wrap</span> </input>
    <input type="radio" class="radioPref translateme" id="scrollRadio" name="wrap_choice" value="scroll"><span class="translateme">  Scroll</span> </input>
</div>


<script type="text/javascript">

// Javascript HTML templates

var jstpl_player_supplement = '\
    <div id="money_board_${PID}_wrapper" class="player_board_wrapper">\
        <div id="money_board_${PID}" class="player_board">\
            <div class="player_board">\
                <span id="money_counter_${PID}" class="money_board"></span>\
                <span class="icon-coin-em"></span>\
            </div>\
            <div></div>\
            <div class="player_board">\
                <span id="score_counter_${PID}" class="money_board"></span>\
                <span id="solo_goal_target_container" class="invisible"> / <span id="solo_goal_target"></span></span>\
                <span class="icon-sp-em"></span>\
            </div>\
            <div></div>\
            <div class="translatetitle" style="display: flex" title="First Player">\
                <span id="first_player_${PID}" class="firstPlayer"> </span>\
            </div>\
        </div>\
        <div id="bottles_board_${PID}" class="player_board">\
            <div class="player_board translatetitle" title="Americas bottles in display case">\
                <span id="americas_counter_${PID}"></span>\
                <span class="icon-americas-em"></span>\
            </div>\
            <div class="player_board translatetitle" title="Europe bottles in display case">\
                <span id="europe_counter_${PID}" ></span>\
                <span class="icon-europe-em"></span>\
            </div>\
            <div class="player_board translatetitle" title="Asia & Oceania bottles in display case">\
                <span id="asia_counter_${PID}" ></span>\
                <span class="icon-asia-em"></span>\
            </div>\
            <div class="player_board translatetitle" title="Home bottles in display case">\
                <span id="home_counter_${PID}" ></span>\
                <span class="icon-home"></span>\
            </div>\
            <div class="player_board translatetitle" title="Bottles without region in display case">\
                <span id="bottle_counter_${PID}" ></span>\
                <span class="icon-bottle"></span>\
            </div>\
        </div>\
        <div id="player_label_board_${PID}" class="player_label_supplement">\
        </div>\
        <div id="player_board_soloGoals" class="soloGoals_pb invisible">\
            <div id="soloGoals5_pb" class="soloGoalsRow_pb"> </div>\
            <div id="soloGoals4_pb" class="soloGoalsRow_pb"> </div>\
            <div id="soloGoals3_pb" class="soloGoalsRow_pb"> </div>\
            <div id="soloGoals2_pb" class="soloGoalsRow_pb"> </div>\
            <div id="soloGoals1_pb" class="soloGoalsRow_pb"> </div>\
        </div>\
    </div>\
';

var jstpl_player_section = '\
<div id="playerSection_${PID}" class="dwhiteblock" style="padding: 3px; border: 2px solid #${COLOR}">\
    <div id="myPlayerContainer_${PID}" class="playerContainer">\
        <div id="myPlayerDistillery_${PID}_wrapper" class="playerDistilleryWrapper" style="margin-bottom: 20px">\
            <div class="playerBlock" data-pid="${PID}"></div>\
            <div id="myPlayerDistillery_${PID}" class="playerDistillery">\
                <div id="relativity_${PID}" style="width: 100%; height: 100%; position: relative">\
                    <div id="du1_${PID}" class="duCardSlot" style="position: absolute; top: 14.75%; left: 41%; width: 13.5%;"> </div>\
                    <div id="du2_${PID}" class="duCardSlot" style="position: absolute; top: 14.75%; left: 60%; width: 13.5%;"> </div>\
                    <div id="du3_${PID}" class="duCardSlot" style="position: absolute; top: 14.75%; left: 79%; width: 13.5%;"> </div>\
                    <div id="label0_${PID}" class="labelSlot" style="position: absolute; top: 3.2%; left: 22%; "> </div>\
                    <div id="label1_${PID}" class="labelSlot" style="position: absolute; top: 3.2%; left: 32.7%; "> </div>\
                    <div id="label2_${PID}" class="labelSlot" style="position: absolute; top: 3.2%; left: 43.6%; "> </div>\
                    <div id="label3_${PID}" class="labelSlot" style="position: absolute; top: 3.2%; left: 54.6%; "> </div>\
                    <div id="label4_${PID}" class="labelSlot" style="position: absolute; top: 3.2%; left: 65.7%; "> </div>\
                    <div id="label5_${PID}" class="labelSlot" style="position: absolute; top: 3.2%; left: 76.5%; "> </div>\
                    <div id="label6_${PID}" class="labelSlot" style="position: absolute; top: 3.2%; left: 87.5%; "> </div>\
                    <div id="pantry_${PID}_canvas" class="canvas" style="position: absolute; top: 62%; left: 22.5%;"> </div>\
                    <div id="storeroom_${PID}_canvas" class="canvas" style="position: absolute; top: 62%; left: 42%;"> </div>\
                    <div id="warehouse1_${PID}_canvas" class="canvas" style="position: absolute; top: 62%; left: 61.5%;"> </div>\
                    <div id="warehouse2_${PID}_canvas" class="canvas" style="position: absolute; top: 62%; left: 80.5%;"> </div>\
                    <div id="washback_${PID}_canvas" class="canvas" style="position: absolute; top: 62%; left: 2.25%;"> </div>\
                    <div id="distiller_${PID}" style="position: absolute; top: 14.75%; left: 21.5%; width: 19%; max-width: 19%; height: 32%;"> </div>\
                    <div id="signature_${PID}" class="fade" style="position: absolute; top: 14.75%; left: 2.25%; width: 19%; max-width: 19%; height: 32%;"> </div>\
                </div>\
            </div>\
            <div style="text-align: center; display: flex; flex-direction: row; justify-content: space-around;">\
                <div class="translateme"> Aged Flavor Bonus: </div>\
                <div> 1 <span class="icon-flavor-em"></span> = 1 <span class="icon-sp-em"></span> </div>\
                <div> 2 <span class="icon-flavor-em"></span> = 3 <span class="icon-sp-em"></span> </div>\
                <div> 3 <span class="icon-flavor-em"></span> = 6 <span class="icon-sp-em"></span> </div>\
                <div> 4 <span class="icon-flavor-em"></span> = 10 <span class="icon-sp-em"></span> </div>\
                <div> 5+ <span class="icon-flavor-em"></span> = 15 <span class="icon-sp-em"></span> </div>\
            </div>\
        </div>\
        <div id="myPlayerRecipeCard_${PID}" class="playerRecipeCard"> \
            <div id="jumboCard_${PID}" class="recipeCardGrow" title="Zoom in / out"> +/- </div> \
            <div id="myPlayerFlight_${PID}" class="playerFlight"> \
                <div id="stuff_${PID}"></div>\
                <div id="flightRecipe0_${PID}" class="flightRecipe0" data-recipe="0" style="height: 14.28%;width: 100%;top:     0%;position:absolute; "></div>\
                <div id="flightRecipe1_${PID}" class="flightRecipe1" data-recipe="1" style="height: 14.28%;width: 100%;top: 14.28%;position:absolute; "></div>\
                <div id="flightRecipe2_${PID}" class="flightRecipe2" data-recipe="2" style="height: 14.28%;width: 100%;top: 28.57%;position:absolute; "></div>\
                <div id="flightRecipe3_${PID}" class="flightRecipe3" data-recipe="3" style="height: 14.28%;width: 100%;top: 42.85%;position:absolute; "></div>\
                <div id="flightRecipe4_${PID}" class="flightRecipe4" data-recipe="4" style="height: 14.28%;width: 100%;top: 57.14%;position:absolute; "></div>\
                <div id="flightRecipe5_${PID}" class="flightRecipe5" data-recipe="5" style="height: 14.28%;width: 100%;top: 71.42%;position:absolute; "></div>\
                <div id="flightRecipe6_${PID}" class="flightRecipe6" data-recipe="6" style="height: 14.28%;width: 100%;top: 85.71%;position:absolute; "></div>\
            </div>\
            <div id="recipeCubeSlot_0_${PID}" class="recipeCubeSlot" style="top: 35%; left: 6%;"> </div> \
            <div id="recipeCubeSlot_1_${PID}" class="recipeCubeSlot" style="top: 43%; left: 6%;"> </div> \
            <div id="recipeCubeSlot_2_${PID}" class="recipeCubeSlot" style="top: 50.5%; left: 6%;"> </div> \
            <div id="recipeCubeSlot_3_${PID}" class="recipeCubeSlot" style="top: 58%; left: 6%;"> </div> \
            <div id="recipeCubeSlot_4_${PID}" class="recipeCubeSlot" style="top: 66%; left: 6%;"> </div> \
            <div id="recipeCubeSlot_5_${PID}" class="recipeCubeSlot" style="top: 73.5%; left: 6%;"> </div> \
            <div id="recipeCubeSlot_6_${PID}" class="recipeCubeSlot" style="top: 81%; left: 6%;"> </div> \
            <div id="recipeSignatureSlot_${PID}" class="signatureRecipeSlot" style="top: 88.7%; left: 49%"> </div> \
        </div>\
    </div>\
    <div style="display: flex; flex-direction: column; align: center; justify-content: space-between;"> \
        <div id="display_${PID}_wrapper" class="dwhiteblock" style="display: inline-block;" > \
            <div id="display_${PID}_title" > <span class="translateme"> Display Case  </span>\
                <div class="bottleRules"> \
                    <div class="translateme" style="font-weight: bold;"> Endgame Scoring </div> \
                    <div class="translateme"> 2 from same region = 2 *sp* </div>\
                    <div class="translateme"> 3 from same region = 4 *sp* </div> \
                    <div class="translateme"> 4 from same region = 7 *sp* </div> \
                    <div class="translateme"> 5 from same region = 10 *sp* </div> \
                    <div class="translateme"> 6+ from same region = 15 *sp* </div>\
                    <div class="translateme"> 3 different regions = 5 *sp* </div>\
                </div> \
            </div> \
            <div class="pantry"> \
                <div id="display_${PID}" class="warehouseCards" > </div> \
            </div> \
        </div> \
    </div>\
</div>'; 

var jstpl_flight_card='<div id="myFlightCard" class="flightCard"> </div>';

var jstpl_card='<div id="bm-card-${UID}-front" class="marketCard dcard2" style="background-position-x: -${X_OFF}px; background-position-y: -${Y_OFF}px"> </div>';

var jstpl_solo_goal='<div id="soloGoal-card-${UID}" class="card soloGoalCard ${STATE}" style="background-position-x: -${X_OFF}px; background-position-y: -${Y_OFF}px"> </div>';

var jstpl_cube='<div id="recipe-cube" class="${COLOR}Cube"> </div>';


var jstpl_icon_canvas = '\
    <div id="icon_canvas_${DIVBASE}_${PID}" class="iconCanvas">\
        <div class="iconCanvas" >\
            <div style="width: 31%; display: flex; position: absolute; left: 0px; ">\
                <div id="coin_counter_${DIVBASE}${PID}"> </div>\
                <div class="icon-coin-em"> </div>\
            </div>\
            <div style="width: 31%; position: absolute; justify-content: flex-end; display: flex; right: 0px;">\
                <div id="sp_counter_${DIVBASE}${PID}"> </div>\
                <div class="icon-sp-em"> </div>\
            </div>\
        </div>\
        <div style="width: 100%; justity-content: center; align-items: center; grid-column-start: 1; grid-column-end: 5;"> \
            <div id="card_counter_${DIVBASE}${PID}" class="invisible"> </div>\
        </div>\
        <div id="canvas_label_${DIVBASE}${PID}" class="invisible" style="grid-column-start: 1; grid-column-end: 5; align-items: center; justify-content: center; display: flex;">\
            <div id="canvas_label_${DIVBASE}${PID}_inner" class="dlabel" > </div>\
        </div>\
    </div> \
';

var jstpl_icon = '\
    <div id="icon_${PID}_${DIVBASE}${UID}" title="${TOOLTIP}" class="icon-${TYPE}" data-uid="${UID}"> </div> \
';

var jstpl_floating_label = '\
   <div style="position: relative;">\
    <div id="player_${PID}_washback_label" class="dlabel" \
        style="background-position-x: -${X_OFF}px; background-position-y: -${Y_OFF}px"> \
    </div> \
   </div> \
';

var jstpl_player_floater = '\
    <div>\
        <div id="${DIVBASE}_wrapper_${PID}" class="pantry floatingPantry">\
            <div class="displaybase ${DIVBASE}_wrapper"> ${DISPLAYBASE} <br/> </div>\
            <div style="display: flex; flex-direction: row;">\
                <div class="pantry_inner_wrapper"> \
                    <div id="${DIVBASE}_${PID}_deck"> </div>\
                    <div id="${DIVBASE}_${PID}_label" class="label"> </div>\
                    <div id="${DIVBASE}_${PID}" class="pantry2"> </div> \
                </div>\
            </div>\
        </div>\
    </div>\
';

var jstpl_label_x = '<div class="icon-redx" title="No Label Available"></div>';
var jstpl_spirit_award_blank = '<div id="sa-${UID}-wrapper" class="sa-wrapper">\
  <div class="sa-title"> ${SA_TITLE} </div>\
  <div id="sa-${UID}" class="spiritAwardBlank"> \
    <div id="sa-${UID}-text" class="sa-overlay"> \
        <div class="text"> ${SA_TEXT} </div>\
        <div class="sa-reward"> ${SA_REWARD} <span class="icon-sp-em"></span> </div>\
    </div>\
    <div id="sa-${UID}-overlay" class="sa-overlay-nowrap"></div>\
  </div>\
</div>';

var jstpl_spirit_award = ' <div id="sa-${UID}" class="spiritAwardBlank"\
 style="background-position-x: -${X_OFF}vw; background-position-y: -${Y_OFF}vw"> <div id="sa-${UID}-text" class="sa-overlay"> ${SA_TEXT} <div id="sa-${UID}-overlay-nowrap" class="sa-overlay"></div></div></div>';

var jstpl_modal = '\
    <div class="modal modal-fade">\
        <div class="modal-dialog">\
            <div class="modal-content">\
            Stuff \
            </div>\
        </div>\
    </div>';

var jstpl_distiller = '\
    <div id="${DIVBASE}_card" data-side="front" class="card distiller" >\
            <div class="card-sides">\
                <div id="${DIVBASE}-front" class="card-side front"> </div>\
                <div id="${DIVBASE}-back" class="card-side back "></div>\
            </div>\
        </div>\
';

var jstpl_card_tooltip = '\
    <div id="tooltip_${UID}" class="cardTooltip"> </div>\
';

var jstpl_floating_button = '<Button id="floating${LOCATION_SHORT}Button" class="bgabutton bgabutton_blue pantryButton"> ${LOCATION} </Button>';

</script>  


{OVERALL_GAME_FOOTER}
