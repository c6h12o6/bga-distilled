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

<div id="distillerChoice" class="distillerChoice invisible" style="position: absolute; justify-content: center; align-items: center; width: 100%; height: 30vw; display: flex; z-index: 1; background-color: rgba(230, 230, 230, 0.0); gap: 10px;">
    <div style="position: absolute; top: 5vw; justify-content: center; align-items: top; width: 100%; height: auto; display: flex; z-index: 20; background-color: rgba(230, 230, 230, 0.5); gap: 10px; padding: 10px;">
        <div id="distiller1"> </div>
        <div id="distiller2"> </div>
    </div>
</div>

<div class="centerScreen invisible" style="position: absolute; justify-content: center; align-items: center; width: 100%; height: 100%; display: flex; z-index: 100; gap: 10px">
    <div id="centerScreen" class="centerScreen" style="position: absolute; top: 5vw; justify-content: center; align-items: top; width: 100%; height: unset; display: flex; z-index: 100;">
        <div id="game-scoring" class="invisible" style="background-color: rgba(255, 255, 255, 0.95); height: auto; border-radius: 1vw;">
            <table class="scoringTable">
                <tr id="scoring-row-players" class="line-below">
                    <td class="first-column">Players</td>
                </tr>
                <tr id="scoring-row-ingame">
                    <td class="first-column">In-Game</td>
                </tr>
                <tr id="scoring-row-warehouses">
                    <td class="first-column">Warehouses</td>
                </tr>
                <tr id="scoring-row-bottles">
                    <td class="first-column">Bottles</td>
                </tr>
                <tr id="scoring-row-dus">
                    <td class="first-column">Distillery Upgrades</td>
                </tr>
                <tr id="scoring-row-goals">
                    <td class="first-column">Goals</td>
                </tr>
                <tr id="scoring-row-money">
                    <td class="first-column">Money</td>
                </tr>
                <tr id="scoring-row-total" class="line-above">
                    <td id="text-total" class="first-column">Total</td>
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
<!--
<Button id="collapseMarketButton"> Hide Market </Button>
<Button id="expandMarketButton" class="invisible"> Show Market </Button>
-->
<div id="mainShared" class="mainShared">
    <div id="market" class="dwhiteblock market">
        <div id="remainingDiv" class="invisible"></div>
        <div id="basicMarket2" class="basicMarket">
        </div>
        <div id="advancedMarket" class="advancedMarketWrap">
            <div style="width: 100%; position:relative;">
                <div id="markettitles" style="height: 20px">
                    <div id="deckTitle" style="position: absolute; width: 122px; left: 0px;"> Deck </div>
                    <div style="position: absolute; width: 122px; right: 0px;"> Truck </div>
                    <div> Market </div>
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
        <!--
        <div id="myPlayerRecipeCard" class="playerRecipeCard"> 
            <div id="myPlayerFlight" class="playerFlight"> </div>
            <!-- BEGIN recipeCubes -->
                <div id="recipeCubeSlot_{CUBE_SLOT}" 
                    class="recipeCubeSlot" 
                    style="top: {TOP}px; left: {LEFT}px;"
                    title="{TITLE}">
                </div>
            <!-- END recipeCubes -->
        </div>
        -->
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
            <!--
            <Button id="floatingPantryButton" class="bgabutton bgabutton_blue pantryButton"> Pantry </Button>
            <Button id="floatingStoreroomButton" class="bgabutton bgabutton_blue pantryButton"> Store Room </Button>
            <Button id="floatingGoalsButton" class="bgabutton bgabutton_blue pantryButton"> Distillery Goals </Button>
            -->
            <Button id="floatingCloseButton" class="bgabutton bgabutton_blue pantryButton"> Close </Button>
        </div>
        <!-- <div style="position: absolute; right: 300px; top: 1px; display:flex; flex-direction: row; font-size: x-large; color: lightgrey">  -->
    </div>
        
        <div id='pantryWrap2'> </div>
        <!--
            <div id="floatingStoreRoom" class="pantry invisible"> </div>
            <div id="floatingWashback" class="pantry invisible"> </div>
        -->
</div>

<div id="radioButtons" class="radioButtons whiteblock">
    Dashboard Location: 
    <input type="radio" class="radioPref" id="floatingRadio" name="hud_choice" value="floating" checked="checked"> Floating </input>
    <input type="radio" class="radioPref" id="topRadio" name="hud_choice" value="top" "> Top </input>
    <input type="radio" class="radioPref" id="expandedRadio" name="hud_choice" value="expanded" > Expanded </input>
</div>
<div id="radioButtonsWrap" class="radioButtons whiteblock">
    Wrap Dashboard Contents: 
    <input type="radio" class="radioPref" id="nowrapRadio" name="wrap_choice" value="nowrap" checked="checked"> Overlap </input>
    <input type="radio" class="radioPref" id="wrapRadio" name="wrap_choice" value="wrap"> Wrap </input>
    <input type="radio" class="radioPref" id="scrollRadio" name="wrap_choice" value="scroll"> Scroll </input>
</div>


<script type="text/javascript">

// Javascript HTML templates

var jstpl_player_supplement = '\
    <div id="money_board_${ID}" class="player_board">\
        <div class="player_board">\
            <span id="money_counter_${ID}" class="money_board"></span>\
            <span class="icon-coin-em"></span>\
        </div>\
        <div class="player_board">\
            <span id="score_counter_${ID}" class="money_board"></span>\
            <span class="icon-sp-em"></span>\
        </div>\
        <br />\
        <span id="first_player_${ID}" class="firstPlayer"> 1st </span>\
    </div>\
';

var jstpl_player_section = '\
<div id="playerSection_${ID}" class="dwhiteblock" style="padding: 3px">\
    <div class="dwhiteblock" style="width: fit-content; background-color: rgb(0, 0, 0, 1)">\
        <div style="color: #${COLOR}"> \
            <span class="clickable" id="prevPlayer_${ID}" > <  </span>\
            <span style="font-weight: bold"> ${NAME} </span>\
            <span class="clickable" id="nextPlayer_${ID}"> > </span>\
        </div>\
    </div>\
    <div id="myPlayerContainer_${ID}" class="playerContainer">\
        <div id="myPlayerDistillery_${ID}" class="playerDistillery">\
            <div id="relativity_${ID}" style="width: 100%; height: 100%; position: relative">\
                <div id="du1_${ID}" class="duCardSlot" style="position: absolute; top: 14.75%; left: 41%; width: 13.5%;"> </div>\
                <div id="du2_${ID}" class="duCardSlot" style="position: absolute; top: 14.75%; left: 60%; width: 13.5%;"> </div>\
                <div id="du3_${ID}" class="duCardSlot" style="position: absolute; top: 14.75%; left: 79%; width: 13.5%;"> </div>\
                <div id="label0_${ID}" class="labelSlot" style="position: absolute; top: 3.2%; left: 22%; "> </div>\
                <div id="label1_${ID}" class="labelSlot" style="position: absolute; top: 3.2%; left: 32.7%; "> </div>\
                <div id="label2_${ID}" class="labelSlot" style="position: absolute; top: 3.2%; left: 43.6%; "> </div>\
                <div id="label3_${ID}" class="labelSlot" style="position: absolute; top: 3.2%; left: 54.6%; "> </div>\
                <div id="label4_${ID}" class="labelSlot" style="position: absolute; top: 3.2%; left: 65.7%; "> </div>\
                <div id="label5_${ID}" class="labelSlot" style="position: absolute; top: 3.2%; left: 76.5%; "> </div>\
                <div id="label6_${ID}" class="labelSlot" style="position: absolute; top: 3.2%; left: 87.5%; "> </div>\
                <!-- <div id="pantryDeck_${ID}" class="duCardSlot" style="position: absolute; top: 62%; left: 13.5%; width: 13.5%; max-width: 13.5%"> </div> -->\
                <div id="pantry_${ID}_canvas" class="canvas" style="position: absolute; top: 62%; left: 22.5%;"> </div>\
                <div id="storeroom_${ID}_canvas" class="canvas" style="position: absolute; top: 62%; left: 42%;"> </div>\
                <div id="warehouse1_${ID}_canvas" class="canvas" style="position: absolute; top: 62%; left: 61.5%;"> </div>\
                <div id="warehouse2_${ID}_canvas" class="canvas" style="position: absolute; top: 62%; left: 80.5%;"> </div>\
                <div id="washback_${ID}_canvas" class="canvas" style="position: absolute; top: 62%; left: 2.25%;"> </div>\
                <div id="distiller_${ID}" style="position: absolute; top: 14.75%; left: 21.5%; width: 19%; max-width: 19%; height: 32%;"> </div>\
                <div id="signature_${ID}" class="fade" style="position: absolute; top: 14.75%; left: 2.25%; width: 19%; max-width: 19%; height: 32%;"> </div>\
            </div>\
        </div>\
        <div id="myPlayerRecipeCard_${ID}" class="playerRecipeCard"> \
            <div id="jumboCard_${ID}" class="recipeCardGrow"> +/- </div> \
            <div id="myPlayerFlight_${ID}" class="playerFlight"> </div>\
            <div id="recipeCubeSlot_0_${ID}" class="recipeCubeSlot" style="top: 35%; left: 6%;"> </div> \
            <div id="recipeCubeSlot_1_${ID}" class="recipeCubeSlot" style="top: 43%; left: 6%;"> </div> \
            <div id="recipeCubeSlot_2_${ID}" class="recipeCubeSlot" style="top: 50.5%; left: 6%;"> </div> \
            <div id="recipeCubeSlot_3_${ID}" class="recipeCubeSlot" style="top: 58%; left: 6%;"> </div> \
            <div id="recipeCubeSlot_4_${ID}" class="recipeCubeSlot" style="top: 66%; left: 6%;"> </div> \
            <div id="recipeCubeSlot_5_${ID}" class="recipeCubeSlot" style="top: 73.5%; left: 6%;"> </div> \
            <div id="recipeCubeSlot_6_${ID}" class="recipeCubeSlot" style="top: 81%; left: 6%;"> </div> \
            <div id="recipeSignatureSlot_${ID}" class="signatureRecipeSlot" style="top: 88.7%; left: 49%"> </div> \
        </div>\
    </div>\
    <div style="display: flex; flex-direction: column; align: center; justify-content: space-between;"> \
        <div id="display_${ID}_wrapper" class="dwhiteblock" style="display: inline-block;" > \
            <div id="fiddlesticks"> </div> \
            <div id="display_${ID}_title" > Display Case 1234 \
                <div class="bottleRules"> \
                    <span style="font-weight: bold"> Endgame Scoring </span> <br/> \
                    2 from same region = 2    <span class="icon-sp-em"></span> <br/> \
                    3 from same region = 4    <span class="icon-sp-em"></span> <br/> \
                    4 from same region = 7    <span class="icon-sp-em"></span> <br/> \
                    5 from same region = 10   <span class="icon-sp-em"></span> <br/> \
                    6+ from same region = 15  <span class="icon-sp-em"></span> <br/> \
                    3 different regions = 5   <span class="icon-sp-em"></span> <br/> \
                </div> \
            </div> \
            <div class="pantry"> \
                <div id="display_${ID}" class="warehouseCards" > </div> \
            </div> \
        </div> \
    </div>\
</div>'; 

var jstpl_flight_card='<div id="myFlightCard" class="flightCard"> </div>';

var jstpl_card='<div id="bm-card-${UID}-front" class="marketCard dcard2" style="background-position-x: -${X_OFF}px; background-position-y: -${Y_OFF}px"> </div>';

var jstpl_cube='<div id="recipe-cube" class="${COLOR}Cube"> </div>';


var jstpl_icon_canvas = '\
    <div id="icon_canvas_${DIVBASE}_${ID}" class="iconCanvas">\
        <div class="iconCanvas" >\
            <div style="width: 31%; display: flex; position: absolute; left: 0px; ">\
                <div id="coin_counter_${DIVBASE}${ID}"> </div>\
                <div class="icon-coin-em"> </div>\
            </div>\
            <div style="width: 31%; position: absolute; justify-content: flex-end; display: flex; right: 0px;">\
                <div id="sp_counter_${DIVBASE}${ID}"> </div>\
                <div class="icon-sp-em"> </div>\
            </div>\
        </div>\
        <div style="width: 100%; justity-content: center; align-items: center; grid-column-start: 1; grid-column-end: 5;"> \
            <div id="card_counter_${DIVBASE}${ID}" class="invisible"> </div>\
            <!--<div id="canvas_name_${DIVBASE}${ID}" style="text-align: center; font-size: 1vw;" > </div>-->\
        </div>\
        <div id="canvas_label_${DIVBASE}${ID}" class="invisible" style="grid-column-start: 1; grid-column-end: 5; align-items: center; justify-content: center; display: flex;">\
            <div id="canvas_label_${DIVBASE}${ID}_inner" class="dlabel" > </div>\
        </div>\
    </div> \
';

var jstpl_icon = '\
    <div id="icon_${ID}_${DIVBASE}${UID}" title="${TOOLTIP}" class="icon-${TYPE}"> </div> \
';

var jstpl_floating_label = '\
   <div style="position: relative;">\
    <div id="player_${ID}_washback_label" class="dlabel" \
        style="background-position-x: -${X_OFF}px; background-position-y: -${Y_OFF}px"> \
    </div> \
   </div> \
';

var jstpl_player_floater = '\
    <div>\
        <div id="${DIVBASE}_wrapper_${ID}" class="pantry floatingPantry">\
            <div class="displaybase"> ${DISPLAYBASE} <br/> </div>\
            <div class="pantry_inner_wrapper"> \
                <div id="${DIVBASE}_${ID}_deck"> </div>\
                <div id="${DIVBASE}_${ID}_label" class="label"> </div>\
                <div id="${DIVBASE}_${ID}" class="pantry2"> </div> \
            </div>\
        </div>\
    </div>\
';

var jstpl_label_x = '<div class="icon-redx" title="No Label Available"></div>';
var jstpl_spirit_award_blank = '<div id="sa-${UID}-wrapper" class="sa-wrapper">\
  <div class="sa-title"> ${SA_TITLE} </div>\
  <div id="sa-${UID}" class="spiritAwardBlank"> \
    <div id="sa-${UID}-text" class="sa-overlay"> \
        <div class="text">${SA_TEXT}</div>\
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

var jstpl_floating_button = '<Button id="floating${LOCATION_SHORT}Button" class="bgabutton bgabutton_blue pantryButton"> ${LOCATION} </Button> \n';

</script>  


{OVERALL_GAME_FOOTER}
