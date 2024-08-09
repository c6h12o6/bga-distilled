/**
 *------
 * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
 * distilled implementation : © JB Feldman <wigginender520@gmail.com>
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 *
 * distilled.js
 *
 * distilled user interface script
 * 
 * In this file, you are describing the logic of your user interface, in Javascript language.
 *
 */

define([
    "dojo","dojo/_base/declare","dojo/on",
    "dijit/Dialog",
    "ebg/core/gamegui",
    "ebg/counter",
    "dijit/Tooltip",
    g_gamethemeurl + "modules/bga-cards.js",
],
function (dojo, declare, on, bgacards) {
    return declare("bgagame.distilled", ebg.core.gamegui, {
        constructor: function(){
            // Some translation strings
            var x = [_("Market"),
                    _("Deck"),
                    _("Truck"),
                    _("Americas bottles in display case"),
                    _("Europe bottles in display case"),
                    _("Asia & Oceania bottles in display case"),
                    _("Home bottles in display case"),
                    _("Bottles without region in display case"),
            ];
            console.log('distilled constructor');
            this.cardsToCombos = {}

            this.modal = new dijit.Dialog({
                content: "",
                style: "width: auto",
            });
            var contentNode = document.getElementById("popin_dialog_dijit_Dialog_1_contents")
            console.log(contentNode)
            dojo.addClass(contentNode, "modalContent")
            dojo.connect(this.modal, 'hide', () => {
                console.log("hide")
                var contentNode = document.getElementById("popin_dialog_dijit_Dialog_1_contents")
                contentNode.innerHTML = ""
            })
            var closeButton = document.getElementById("popin_dialog_dijit_Dialog_1_close")
            dojo.connect(closeButton, "onclick", this, () => {
                console.log("on close button click")
                var contentNode = document.getElementById("popin_dialog_dijit_Dialog_1_contents")
                if (contentNode)
                    contentNode.innerHTML = ""
            })
            this.contentNode = contentNode

            console.log("CONNECTING DISTILLER CHOICES")
            dojo.query(".minimizeDistillerChoice").connect("onclick", this, () => {
                console.log("HELLLLO")
                dojo.query("#distillerChoice").addClass("minimized");
            })
            dojo.query(".maximizeDistillerChoice").connect("onclick", this, () => {
                console.log("GOODBYE")
                dojo.query("#distillerChoice").removeClass("minimized");
            })

            this.cardSize = (card) => {
                if (card.label < 20 || card.location != 'flight') {
                    return [6.25, 4.375];
                } else {
                   // return [5.5, 3.85];
                    return [6.25, 4.375];
                }
            }
              
            // Here, you can init the global variables of your user interface
            // Example:
            // this.myGlobalValue = 0;
            card_order = [
                'ALCOHOL', 'YEAST', 'WATER', 'GRAIN', 'PLANT', 'FRUIT', 'METAL', 'CLAY', 'WOOD', 'AMERICAS', 'EUROPE', 'ASIA', 'FLAVOR'
            ]
            sortFunction = function(a, b) {
                for (ii = 0; ii < card_order.length; ii++) {
                    TYPE = card_order[ii];
                    if (TYPE == a.subtype && TYPE == b.subtype) {
                        diff = a.cost - b.cost
                        //console.log('equal')
                        //console.log(a)
                        //console.log(b)
                        return diff
                    }
                    else if (TYPE == a.subtype || TYPE == a.type) {
                        //console.log('less')
                        //console.log(a)
                        //console.log(b)
                        return -1;
                    } else if (TYPE == b.subtype || TYPE == b.type) {
                        //console.log('greater')
                        //console.log(a)
                        //console.log(b)
                        return 1;
                    }
                }
                //console.log(`${a.name} and ${b.name} tied`)
                return 0;
            }
            this.sortFunction = sortFunction
            this.duCardsManager = new CardManager(this, {
                getId: (card) => {
                    return 'du-card-' + card.uid;
                },
                setupDiv: (card, div) => {
                    div.classList.add('du-card');
                    div.classList.add('marketCard');
                    /*div.style.width = '122px';
                    div.style.height = '190px';*/
                    div.key = card.uid;
                },
                setupFrontDiv: (card, div) => {
                    div.classList.add('dcard');
                    const xBack = (card.card_id %  14) * 122;
                    const yBack = Math.floor(card.card_id / 14) * 190;
                    div.style.backgroundPositionX = "-" + xBack + "px";
                    div.style.backgroundPositionY = "-" + yBack + "px";
                    this.addTooltipForCard( card , div)
                },
                setupBackDiv: (card, div) => {
                    div.classList.add('duCardBack');
                },
                isCardVisible: card => {
                    if (card.location == 'truck')
                        return false;
                    return (card.location_idx > 0);
                },
                cardWidth: 122,
                cardHeight: 190,
            });
            // TODO add a deck counter
            this.decks = {}
            this.newDeckOnDiv("distilleryUpgradeDeck", this.duCardsManager, "du");
            this.newDeckOnDiv("distilleryUpgradeTruck", this.duCardsManager, "duTruck");

            this.ingCardsManager = new CardManager(this, {
                getId: (card) => {
                    return 'ing-card-' + card.uid;
                },
                setupDiv: (card, div) => {
                    div.classList.add('ing-card');
                    if (card.location == 'market' || card.location == 'reveal')
                        div.classList.add('marketCard');
                    div.style.width = '122px';
                    div.style.height = '190px';
                    div.key = card.uid;
                },
                setupFrontDiv: (card, div) => {
                    div.classList.add('dcard');
                    const xBack = (card.card_id %  14) * 122;
                    const yBack = Math.floor(card.card_id / 14) * 190;
                    div.style.backgroundPositionX = "-" + xBack + "px";
                    div.style.backgroundPositionY = "-" + yBack + "px";
                    this.addTooltipForCard( card , div)
                },
                 setupBackDiv: (card, div) => {
                    if (card.type == "FLAVOR") {
                        div.classList.add('flavorCardBack');
                        return;
                    } 
                    div.classList.add('ingCardBack');
                },
                isCardVisible: card => {
                    if (card.location == 'truck') {
                        return false;
                    }
                    if (card.location == 'signature') {
                        return true;
                    }
                    return (card.location_idx > 0);
                },
                cardWidth: 122,
                cardHeight: 190,
            });
            this.newDeckOnDiv("premiumIngredientsDeck", this.ingCardsManager, "ing");
            this.newDeckOnDiv("premiumIngredientsTruck", this.ingCardsManager, "ingTruck");

            this.itemCardsManager = new CardManager(this, {
                getId: (card) => {
                    return 'item-card-' + card.uid;
                },
                setupDiv: (card, div) => {
                    div.classList.add('item-card');
                    div.classList.add('marketCard');
                    div.style.width = '122px';
                    div.style.height = '190px';
                    div.key = card.uid;
                    div.dataset.uid = card.uid;
                },
                setupFrontDiv: (card, div) => {
                    div.classList.add('dcard');
                    const xBack = (card.card_id %  14) * 122;
                    const yBack = Math.floor(card.card_id / 14) * 190;
                    div.style.backgroundPositionX = "-" + xBack + "px";
                    div.style.backgroundPositionY = "-" + yBack + "px";
                    this.addTooltipForCard( card , div)
                },
                 setupBackDiv: (card, div) => {
                    if (card.type == "FLAVOR") {
                        div.classList.add('flavorCardBack');
                        return;
                    } 
                    div.classList.add('itemCardBack');
                },
                isCardVisible: card => {
                    if (card.location == 'truck')
                        return false;
                    return (card.location_idx > 0);
                },
                cardWidth: 122,
                cardHeight: 190,
            });
            this.newDeckOnDiv("premiumItemsDeck", this.itemCardsManager, "item");
            this.newDeckOnDiv("premiumItemsTruck", this.itemCardsManager, "itemTruck");


            this.goalsCardsManager = new CardManager(this, {
                getId: (card) => {
                    return 'goals-card-' + card.uid;
                },
                setupDiv: (card, div) => {
                    div.classList.add('goalsCard');
                    div.style.width = '122px';
                    div.style.height = '190px';
                    div.key = card.uid;
                    this.addTooltipForGoal( card , div)
                },
                setupFrontDiv: (card, div) => {
                    div.classList.add('gcard2');
                    const xBack = ((card.card_id - 140) %  10) * 122;
                    const yBack = Math.floor((card.card_id-140) / 10) * 190;
                    div.style.backgroundPositionX = "-" + xBack + "px";
                    div.style.backgroundPositionY = "-" + yBack + "px";
                },
                setupBackDiv: (card, div) => {
                },
                isCardVisible: card => {
                    return true;
                },
                cardWidth: 122,
                cardHeight: 190,
            });

            

            this.labelCardsManager = new CardManager(this, {
                getId: (card) => {
                    if (card.count) {
                        return 'label-' + card.label + card.count;
                    } else {
                        return 'label-' + card.label + "1"
                    }
                },
                setupDiv: (card, div) => {
                    size = this.cardSize(card)
                    div.style.width = 'var(--width)'
                    div.style.flexBasis = 'var(--width)'
                    div.style.height = 'var(--height)'
                    div.classList.add('labelSlot');
                    div.key = card.name;

                    dojo.connect(div, 'onclick', this, () => this.flipLabel(card))
                },
                setupFrontDiv: (card, div) => {
                    div.classList.add('dlabel');
                    const xBack = (card.label %  6)
                    const yBack = Math.floor(card.label / 6)
                    div.style.backgroundPositionY = `calc(-${yBack} * var(--height))`
                    div.style.backgroundPositionX = `calc(-${xBack} * var(--width))`

                    if (card.count < 0) {
                        div.classList.add('fade');
                        if (div.children.length == 0)
                            dojo.place(this.format_block('jstpl_label_x', {}), div, 'last');
                    }
                },
                setupBackDiv: (card, div) => {
                    let label = card.label
                    let name = card.name
                    if (card.label == 15) {
                        label = 17
                        name = "Whisky"
                    }
                    if (card.signature) {
                        label = card.label + 18;
                    }
                    div.classList.add('dlabel');
                    const xBack = (label %  6)
                    const yBack = Math.floor(label / 6)
                    div.style.backgroundPositionY = `calc(-${yBack} * var(--height))`
                    div.style.backgroundPositionX = `calc(-${xBack} * var(--width))`
                },
                isCardVisible: (card) => {
                    if (card.location != "flight" && card.signature)
                        return false;

                    return true;
                },
                cardWidth: 100,
                cardHeight: 70,
            });

            this.duMarketStock = new SlotStock(
                    this.duCardsManager,
                    document.getElementById('distilleryUpgradeStock'), {
                slotsIds: ['1', '2', '3', '4'],
                slotClasses: ['duCardSlotFixed'],
                wrap: "nowrap",

                mapCardToSlot: (card) => (card.location_idx),
            });

            this.ingMarketStock = new SlotStock(
                    this.ingCardsManager,
                    document.getElementById('premiumIngredientsStock'), {
                slotsIds: ['1', '2', '3', '4'],
                slotClasses: ['duCardSlotFixed'],
                wrap: "nowrap",
                mapCardToSlot: (card) => (card.location_idx),
            });

            this.itemMarketStock = new SlotStock(
                    this.itemCardsManager,
                    document.getElementById('premiumItemsStock'), {
                slotsIds: ['1', '2', '3', '4'],
                slotClasses: ['duCardSlotFixed'],
                wrap: "nowrap",
                mapCardToSlot: (card) => (card.location_idx),
            });

            this.nextFlavor = 10000;
            this.tradeCardUid = 9999;
            this.ingVoidStock = new VoidStock(this.ingCardsManager, document.getElementById("voidIng"));
            this.itemVoidStock = new VoidStock(this.itemCardsManager, document.getElementById("voidItem"));
        },
        
        /*
        */
        getProperSubtype: function(subtype) {
            if (subtype == undefined) 
                return "";

            switch(subtype) {
                case 'ASIA': subtype = _('Asia & Oceania'); break;
                case 'warehouse1': subtype = _("Warehouse 1"); break;
                case 'warehouse2': subtype = _("Warehouse 2"); break;
                case 'distillerygoals': subtype = _("Distillery Goals"); break;
            }
            subtype = subtype.replace(/(\w)(\w*)/g,
                function(g0,g1,g2){return g1.toUpperCase() + g2.toLowerCase();});

            return _(subtype.trim())
        },
        
        getTooltipForCard(card) {
            var tt = document.createElement("tooltip_" + card.uid);
            var xBack = (card.card_id %  14) * 183;
            var yBack = Math.floor(card.card_id / 14) * 285;

            let text = this.card_text[card.card_id];
            if (text == undefined) 
                text = ""
            text = _(text);

            let subtype = this.getProperSubtype(card.subtype);
            let imageClass = "dcard";
            // Unknown flavors
            if (card.flavor && card.uid >= 10000) {
                imageClass = "flavorCardBack"
                xBack = 0;
                yBack = 0;
            }

            var image = document.createElement("image_" + card.uid);
            var formatHTML = `

                <div class="tooltipContainer">
                    <div class="${imageClass}" 
                        style="background-position-x: -${xBack}px; background-position-y: -${yBack}px;"> 
                    </div>
                    <div>
                        <div style="text-align: center">
                        ${_(card.name)}
                        </div>
                        <div style="text-align: center">
                        ${_(subtype)}
                        </div>
                        <br/>
                        <div style="text-align: left">
                        ${text}
                        </div>
                    </div>
                </div>
            `
            image.innerHTML = formatHTML
            tt.appendChild(image);
            return formatHTML
        },
        getTooltipForDistiller(card_id) {
            var xBack = (card_id %  9);
            var yBack = Math.floor(card_id / 9);

            let imageClass = "distillerCard"
            var formatHTML = `
                <div class="tooltipContainer">
                    <div class="${imageClass}" 
                        style="--width: 183px; --height: 285px; background-position-x: calc(-${xBack} * var(--width)); background-position-y: calc(-${yBack} * var(--height));"> 
                    </div>
                    <div>
                        ${_(this.distiller_text[card_id-1])}
                    </div>
                </div>
            `
            return formatHTML
        },

        addTooltipForCard( card , div) {
            formatHTML = this.getTooltipForCard(card)
            this.addTooltipHtml(div.id, formatHTML, 1000)
        },
        addTooltipForDistiller(card, div) {
            console.log(card)
            formatHTML = this.getTooltipForDistiller(card)
            this.addTooltipHtml(div.id, formatHTML, 1000)
        },
        getTooltipForGoal(card) {
            var tt = document.createElement("tooltip_goal_" + card.uid);
            const xBack = ((card.card_id - 140) %  10) * 183;
            const yBack = Math.floor((card.card_id-140) / 10) * 285;

            var image = document.createElement("image_" + card.uid);
            var text = this.goal_text[card.card_id - 140]

            image.innerHTML = `
                <div class="tooltipContainer">
                    <div class="gcard2" 
                         style="background-position-x: -${xBack}px; background-position-y: -${yBack}px;"> 
                    </div>
                    <div>
                        <div> 
                            ${_(card.name)}
                        </div>
                        <br/>
                        <div style="text-align: left">
                            ${_(text)}
                        </div>
                    </div>
                </div>
            `
            tt.appendChild(image);

            return tt.innerHTML;
        },
        addTooltipForGoal( card , div) {
            var html = this.getTooltipForGoal(card)
            this.addTooltipHtml(div.id, html, 1000)
        },
        addTooltipForSA(card, div) {
            var tt = document.createElement("tooltip_sa_" + card.uid);
            const xBack = (card.uid %  8);
            const yBack = Math.floor(card.uid / 8);
            text = this.sa_text[card.uid];
            var image = document.createElement("image_" + card.uid);

            image.innerHTML = `
                <div class="tooltipContainer">
                    <div class="spiritAward" 
                         style="background-position-x: calc(-${xBack} * var(--width)); background-position-y: calc(-${yBack} * var(--height));"> 
                    </div>
                    <div>
                        <div> 
                            ${_(card.name)}
                        </div>
                        <div>
                            ${card.sp} <div class='icon-sp-em'></div>
                        </div>
                        <br/>
                        <div style="text-align: left">
                            ${_(text)}
                        </div>
                    </div>
                </div>
            `
            tt.appendChild(image);

            this.addTooltipHtml(div.id, tt.innerHTML, 1000)
        },
        
        /*
            setup:
            
            This method must set up the game user interface according to current game situation specified
            in parameters.
            
            The method is called each time the game interface is displayed to a player, ie:
            _ when the game starts
            _ when a player refreshes the game page (F5)
            
            "gamedatas" argument contains all datas retrieved by your "getAllDatas" PHP method.
        */
        
        setup: function( gamedatas )
        {
            console.log( "Starting game setup" );
            console.log(gamedatas);
            this.card_text = gamedatas.card_text;
            this.sa_text = gamedatas.sa_text;
            this.goal_text = gamedatas.goal_text;
            this.distiller_text = gamedatas.distiller_text;
            this.flavor_map = gamedatas.flavor_map;

            this.playerSections = {}
            this.duPlayerStock = {}
            this.playerPantryStock = {}
            this.playerStoreStock = {}
            this.playerRevealStock = {}
            this.playerWashbackStock = {}
            this.playerWarehouse1Stock = {}
            this.playerWarehouse2Stock = {}
            this.playerLabelStock = {}
            this.playerDisplayStock = {}
            this.playerGoalsStock = {}
            this.cardsToCombos = {}
            this.playerSignatureStock = {}
            this.playerSignatureLabelStock = {}
            this._registeredCustomTooltips = {}
            this._attachedTooltips = {}

            // Setting up player boards
            this.player_list = [];
            this.player_names = {};
            this.player_data = {};


            // TODO remove this obviously terrible thing
            if (gamedatas.flight == 'ERROR') {
                this.showMessage("There has been an error during setup. This game cannot be recovered. Please report a bug and abandon the game", "error");
                return;
            }

            if (gamedatas.firstTaste && !gamedatas.recipeFlight) {
                return;
            }
            var thisPlayerSelected = false;
            if (gamedatas.distillersSelectedArray?.includes(''+this.player_id)) {
                thisPlayerSelected = true;
            }
            console.log("thisPlayerSelected", thisPlayerSelected);

            for( var player_id in gamedatas.players )
            {
                document.getElementById("player_score_" + player_id).classList.add("invisible")
                document.getElementById("icon_point_" + player_id).classList.add("invisible")
                this.player_list.push(player_id)
                this.player_names[player_id] = gamedatas.players[player_id].name
                var player = gamedatas.players[player_id];
                this.player_data[player_id] = player;

                let eye = `<svg id="eye_${player_id}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM432 256c0 79.5-64.5 144-144 144s-144-64.5-144-144s64.5-144 144-144s144 64.5 144 144zM288 192c0 35.3-28.7 64-64 64c-11.5 0-22.3-3-31.6-8.4c-.2 2.8-.4 5.5-.4 8.4c0 53 43 96 96 96s96-43 96-96s-43-96-96-96c-2.8 0-5.6 .1-8.4 .4c5.3 9.3 8.4 20.1 8.4 31.6z"></path></svg>`
                let eyeElem = document.createElement('div')
                eyeElem.innerHTML = eye;
                dojo.place(this.format_block('jstpl_player_supplement', {
                    PID: player_id, 
                    MONEY: player.money,
                }), 'player_board_' + player_id, 'last');
                player_name_board = document.getElementById(`player_name_${player_id}`)
                player_name_board.appendChild(eyeElem.firstChild)
                let savedPlayerId = function () {return player_id}();
                // For some reason I have to get the variable again, otherwise it connects both eyes to both
                let eyeElem2 = document.getElementById(`eye_${player_id}`)
                dojo.connect(eyeElem2, "onclick", this, () => this.setVisiblePlayer(savedPlayerId));


                var counter = new ebg.counter();
                if (this.player_id == player_id) {
                    var counter = new ebg.counter();
                    counter.create("floating_money_counter");
                    this.floating_money_counter = counter;
                }
                counter = new ebg.counter();
                counter.create("money_counter_"+player_id);
                this['money_counter_' + player_id] = counter;
                this.setMoney(player_id, player.money);


                var scoreCounter = new ebg.counter();
                scoreCounter.create("score_counter_"+player_id);
                scoreCounter.setValue(player.score);

                this['score_counter_' + player_id] = scoreCounter;


                var regions = ['americas', 'europe', 'asia', 'home', 'bottle']
                regions.forEach(R => {
                    var regionCounter = new ebg.counter();
                    var counterName = `${R}_counter_${player_id}`
                    regionCounter.create(counterName)
                    regionCounter.setValue(0)
                    this[counterName] = regionCounter;
                })
                

                // TODO: Setting up players boards if needed
                let section = dojo.place(this.format_block('jstpl_player_section', {
                   PID:player_id, 
                    NAME: player.name,
                    COLOR: player.color,
                }), 'activeBoard' , 'last');

                this.addLabelTooltipsForPlayer(player_id)

                // Only create the pantries if this is my user
                // TODO this might cause problems, maybe we just need to make them and hide them
                console.log("Adding buttons")
                if (player_id == this.player_id) {
                    let revealedCardsButton = dojo.place(this.format_block('jstpl_floating_button', {
                        LOCATION: _("Revealed Cards"),
                        LOCATION_SHORT: "Revealed",
                    }), 'pantryButtons', 'last');
                    let pantryButton = dojo.place(this.format_block('jstpl_floating_button', {
                        LOCATION: _("Pantry"),
                        LOCATION_SHORT: "Pantry",
                    }), 'pantryButtons', 'last');
                    let srButton = dojo.place(this.format_block('jstpl_floating_button', {
                        LOCATION: _("Storeroom"),
                        LOCATION_SHORT: "Storeroom",
                    }), 'pantryButtons', 'last');
                    let finalButton = dojo.place(this.format_block('jstpl_floating_button', {
                        LOCATION: _("Goals"),
                        LOCATION_SHORT: "DistilleryGoals",
                    }), 'pantryButtons', 'last');
                    let washbackButton = dojo.place(this.format_block('jstpl_floating_button', {
                        LOCATION: _("Washback"),
                        LOCATION_SHORT: "Washback",
                    }), 'pantryButtons', 'last');
                    let warehouse1Button = dojo.place(this.format_block('jstpl_floating_button', {
                        LOCATION: _("Warehouse 1"),
                        LOCATION_SHORT: "Warehouse1",
                    }), 'pantryButtons', 'last');
                    let warehouse2Button = dojo.place(this.format_block('jstpl_floating_button', {
                        LOCATION: _("Warehouse 2"),
                        LOCATION_SHORT: "Warehouse2",
                    }), 'pantryButtons', 'last');
                    dojo.addClass(revealedCardsButton, 'invisible');
                    dojo.removeClass(revealedCardsButton, 'bgabutton_blue');
                    dojo.addClass(revealedCardsButton, 'bgabutton_red');
                }
                
                divbases = ['reveal', 'pantry', 'storeroom', 'distillerygoals', 'washback', 'warehouse1', 'warehouse2']
                divbases.forEach(db => {
                    dojo.place(this.format_block('jstpl_player_floater', {
                        PID: player_id, 
                        NAME: player.name,
                        COLOR: player.color,
                        DIVBASE: db,
                        DISPLAYBASE: this.getProperSubtype(db),
                    }), 'pantryWrap2' , 'last');

                    if (db == 'reveal')
                        return;

                    floater = document.getElementById(`${db}_wrapper_${player_id}`)
                    if (player_id == this.player_id)  {
                        floater.classList.add('currentPlayer')
                    }
                })
                if (player_id != this.player_id) {
                    dojo.addClass(`pantry_wrapper_${player_id}`, 'invisible');
                }
                if (this.player_id != player_id) {
                    dojo.addClass('playerSection_' + player_id, "invisible")
                }

                if (this.isSpectator && player_id == this.player_list[0]) {
                    console.log("making visible?")
                    dojo.removeClass('playerSection_' + player_id, "invisible")
                }


                this.playerSections[player_id] = document.getElementById('playerSection_' + player_id)

                // 1 indexed
                flightIdx = parseInt(gamedatas.flightCard) - 1;
                console.log("flightIdx is " + flightIdx);
                let elem = document.getElementById("myPlayerFlight_" + player_id);
                let xPos = (flightIdx % 4) * 33.3;
                let yPos = Math.floor(flightIdx / 4) * 50;
                elem.style.backgroundPositionX = xPos + '%';
                elem.style.backgroundPositionY =  + yPos + '%';


                this.playerDisplayStock[player_id] = this.makeComboStock('display_', player_id);
                this.playerLabelStock[player_id] = {}
                for (var i = 0; i < 7; i++) {
                    this.playerLabelStock[player_id][i] = new CardStock(
                        this.labelCardsManager,
                        document.getElementById("label" + i + "_" + player_id));
                }
                
                this.playerSignatureStock[player_id] = new CardStock(
                        this.ingCardsManager,
                        document.getElementById("signature_" + player_id));


                // Place floating stocks
                this.playerRevealStock[player_id] = this.makeComboStock('reveal_', player_id, true);
                this.playerPantryStock[player_id] = this.makeComboStock('pantry_', player_id);
                this.playerStoreStock[player_id] = this.makeComboStock('storeroom_', player_id);
                this.playerWashbackStock[player_id] = this.makeComboStock("washback_", player_id)
                this.playerWarehouse1Stock[player_id] = this.makeComboStock("warehouse1_", player_id)
                this.playerWarehouse2Stock[player_id] = this.makeComboStock("warehouse2_", player_id)

                this.playerGoalsStock[player_id] = new LineStock(
                        this.goalsCardsManager,
                        document.getElementById("distillerygoals_" + player_id),
                        {direction: "row", center: false});

                if (gamedatas.distillers[player_id]?.length != 1 || (gamedatas.firstTaste && !thisPlayerSelected)) {
                    if (player_id == this.player_id) {
                        dojo.query('.distillerChoice').removeClass('invisible')
                    }
                }
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                console.log("distillersSelectedArray", gamedatas.distillersSelectedArray)
                if (gamedatas.distillers[player_id]?.length == 1 && (!gamedatas.firstTaste || thisPlayerSelected)) {
                    console.log("placing chosen distiller")
                    if (player_id == this.player_id) {
                        dojo.query('.distillerChoice').addClass('invisible')
                    }
                    // TODO log player home region here.
                    this.player_data[player_id].region = gamedatas.distillers[player_id][0].region
                    this.placeFlippyCard(player_id, 'distiller_' + player_id, 'distiller',
                        gamedatas.distillers[player_id][0].id);

                    if (player_id == this.player_id)
                        this.distiller_id = gamedatas.distillers[player_id][0].id

                    this.playerSignatureLabelStock[player_id] = new CardStock(
                        this.labelCardsManager,
                        document.getElementById('recipeSignatureSlot_' + player_id),
                    );
                    console.log(player_id)
                    console.log(gamedatas.signatureLabels)
                    if (player_id.toString() in gamedatas.signatureLabels && gamedatas.signatureLabels[player_id].length) {
                        var sigLabel = gamedatas.signatureLabels[player_id][0];
                        console.log(sigLabel.location)
                        if (sigLabel.location == 'flight') {
                            this.playerSignatureLabelStock[player_id].addCard(
                                gamedatas.signatureLabels[player_id][0]);
                        }
                    }
                }

            } // end of player loop

            console.log("Moving around pantry")
            let dashValue = localStorage.getItem(`${this.game_name}_dash`);
            if (dashValue)
                this.setDash(dashValue)
            let wrapValue = localStorage.getItem(`${this.game_name}_wrap`);
            if (wrapValue)
                this.setWrap(wrapValue)
            

            console.log("Connecting radio buttons")
            // connect radio buttons
            btns = ['floatingRadio', 'topRadio', 'expandedRadio']
            btns.forEach(id => {
                elem = document.getElementById(id)
                dojo.connect(elem, 'onclick', this, "onPrefClick")
            })
            btns = ['nowrapRadio', 'wrapRadio', 'scrollRadio']
            btns.forEach(id => {
                elem = document.getElementById(id)
                console.log(elem)
                dojo.connect(elem, 'onclick', this, 'onWrapClick')
            })

            // Place the distiller choice bar
            console.log("thisPlayerSelected", thisPlayerSelected)
            if ((gamedatas.firstTaste && !thisPlayerSelected) || (gamedatas.distillersSelected == 0 && gamedatas.distillers[this.player_id]?.length == 2)) {
                if (gamedatas.firstTaste) {
                    document.getElementById("label2choice").remove();
                }
                console.log("placing distillers for choice")
                
                console.log("distillers length", gamedatas.distillers[this.player_id], gamedatas.distillers[this.player_id].length)
                for (var ii = gamedatas.distillers[this.player_id].length; ii >= 1; ii--) {
                    console.log("loopdy freaking doo", ii)
                    this.placeFlippyCard(this.player_id, `distiller${ii}`, 'distiller', 
                        gamedatas.distillers[this.player_id][ii-1].id);

                    var lbldiv = document.getElementById(`label${ii}choice`)
                    var card = gamedatas.distillers[this.player_id][ii-1].label

                    lbldiv.style.width = `var(--width)`
                    lbldiv.style.height = `var(--height)`

                    var label = card.label
                    const xBack = (label %  6);
                    const yBack = Math.floor(label / 6);
                    lbldiv.style.backgroundPositionY = `calc(-${yBack} * var(--height))`
                    lbldiv.style.backgroundPositionX = `calc(-${xBack} * var(--width))`
                    lbldiv.style.border = "solid black 1px"
                }
            }


            if (!this.isSpectator) 
                this.setVisiblePlayer(this.player_id);
            else 
                this.setVisiblePlayer(this.player_list[0])

            this.activeCards = {}

            // Set this, but it will be reset every distill phase.
            this.pantrySelection = {};


            gamedatas.basic_market.forEach(X => {
                this.activeCards[X.uid] = X;

                dojo.place(this.format_block('jstpl_card', {
                    UID: X.uid,
                    CARD_ID: this.activeCards[X.uid].card_id, 
                    X_OFF: (X.card_id % 14) * 122,
                    Y_OFF: Math.floor(X.card_id / 14) * 190
                }), 'basicMarket2', 'last');
                this.addTooltipForCard(X, document.getElementById('bm-card-' + X.uid + '-front'))
            })

            gamedatas.distillery_upgrade_market.forEach(X => {
                this.activeCards[X.uid] = X

                if (X.location == 'truck') 
                    this.addCardToTruck(X, 'du', this.decks.duTruck)
                else
                    this.duMarketStock.addCards([X]);
            })
            this.decks["du"].setCardNumber(parseInt(gamedatas.distillery_upgrade_market_count));

            gamedatas.premium_ingredient_market.forEach(X => {
                this.activeCards[X.uid] = X
                if (X.location == 'truck') 
                    this.addCardToTruck(X, 'ing', this.decks.ingTruck)
                else
                    this.ingMarketStock.addCards([X]);
            })
            this.decks["ing"].setCardNumber(parseInt(gamedatas.premium_ingredient_market_count))

            gamedatas.premium_item_market.forEach(X => {
                this.activeCards[X.uid] = X;
                if (X.location == 'truck') {
                    this.addCardToTruck(X, 'item', this.decks.itemTruck)
                }
                else
                    this.itemMarketStock.addCards([X]);
            })
            this.decks["item"].setCardNumber(parseInt(gamedatas.premium_item_market_count));

            gamedatas.reveal.forEach(X => {
                X.location_idx = 1;
                X.location = 'reveal'
                console.log(X)
                console.log(this.playerRevealStock)
                this.activeCards[X.uid] = X;
                this.playerRevealStock[this.player_id][X.market].addCard(X);
                this.showFloatingReveal();
            })

            console.log(function () { return this.activeCards}())
            this.labels = {}
            this.labelOrder = {}
            for (var i = 0; i < gamedatas.flight.length; i++) {
                let X = gamedatas.flight[i]
                this.labels[X.name] = X;
                this.labelOrder[X.name] = i;
                
                var labeldiv = document.getElementById('label_' + i)
                let deck = this.newDeckOnDiv('label_' + i, this.labelCardsManager, X.name,
                    (uid) => { return {name: X.name, count: uid, label: X.label}});
                
                labeldiv.style.removeProperty('--width')
                labeldiv.style.removeProperty('--height');

                deck.setCardNumber(X.count)
            }

            let strip_spans = (s) => {
                return s.replace(/<\/?div[^>]*>/g,"");
            }

            gamedatas.spiritAwards.forEach(SA => {
                    dojo.place(this.format_block('jstpl_spirit_award_blank', {
                        UID: SA.uid,
                        SA_NAME: SA.name,
                        X_OFF: (SA.uid % 8) * 5,
                        Y_OFF: Math.floor(SA.uid / 8) * 6,
                        SA_TEXT: strip_spans(_(this.sa_text[SA.uid])),
                        SA_TITLE: _(SA.name).toUpperCase(),
                        SA_REWARD: SA.sp,
                    }), 'spiritAwardDisplay', 'last');
                this.addTooltipForSA(SA , document.getElementById("sa-" + SA.uid))
            })
            gamedatas.saAwarded?.forEach(SA => {
                this.awardAward(SA)
            });

            this.activeCards[0] = gamedatas.alcohol;

            for( var pid in gamedatas.players ) {
                if (!pid in gamedatas.playerCards)
                    continue;

                this.setupPlayerCards(pid, gamedatas.playerCards[pid])
            }

            this.showFirstPlayer(gamedatas.firstplayer)
            this.showTurn(gamedatas.turn);


            // TODO: Set up your game interface here, according to "gamedatas"
            this.marketClickHandles = {};

            this.recipeSlots = {}
            gamedatas.recipes?.forEach(R => {
                this.addRecipeCube(R.player_id, R.slot, R.color)
            })
            this.recipeFlight = gamedatas.recipeFlight;

            console.log(gamedatas.spirits)
            this.spiritContents = []
            gamedatas.spirits?.forEach(S => {
                this.addTinyLabel(S, S.player_id);
            })

            let div = document.getElementById("collapseMarketButton")
            dojo.connect(div, 'onclick', this, 'collapseMarket');
            div = document.getElementById("expandMarketButton");
            dojo.connect(div, 'onclick', this, 'expandMarket');
            div = document.getElementById("floatingPantryButton");
            dojo.connect(div, "onclick", this, "showFloatingPantry");

            div = document.getElementById("floatingDistilleryGoalsButton");
            dojo.connect(div, "onclick", this, "showFloatingGoals");

            div = document.getElementById("floatingWashbackButton");
            dojo.connect(div, "onclick", this, "showFloatingWashback");

            div = document.getElementById("floatingWarehouse1Button");
            dojo.connect(div, "onclick", this, "showFloatingWarehouse1");

            div = document.getElementById("floatingWarehouse2Button");
            dojo.connect(div, "onclick", this, "showFloatingWarehouse2");

            div = document.getElementById("floatingRevealedButton");
            dojo.connect(div, "onclick", this, "showFloatingReveal");

            div = document.getElementById("floatingCloseButton");
            dojo.connect(div, "onclick", this, "closeFloaters");

            div = document.getElementById('premiumIngredientsTruck')
            dojo.connect(div, "onclick", this, () => this.showDeckModal("ing"))
            div = document.getElementById('premiumItemsTruck')
            dojo.connect(div, "onclick", this, () => this.showDeckModal("item"))

            div = document.getElementById('distilleryUpgradeTruck')
            dojo.connect(div, "onclick", this, () => this.showDeckModal("du"))
            
            div = document.getElementById("floatingStoreroomButton");
            dojo.connect(div, "onclick", this, "showFloatingStoreRoom");


            dojo.query('.recipeCardGrow').connect("onclick", this, "toggleRecipeCardSize");

            this.addSectionTabsForPlayer()
            this.setVisiblePlayer(this.visiblePlayer)



            if (gamedatas.whatCanIMake)
                this.updateWhatCanIMake(gamedatas.whatCanIMake)
            this.closeFloaters()
            //this.showFloatingPantry();

            this.translatetpl();

            // Setup game notifications to handle (see "setupNotifications" method below)
            this.setupNotifications();
            addEventListener("resize", () => this.onResize());
            console.log( "Ending game setup" );
        },
       

        onResize() {
            width = document.getElementById("page-content").offsetWidth
            if (width < 800) {
                decks = dojo.query('.marketDeckRtl')
                decks.forEach(D => {
                    D.classList.add('miniDeck')
                });
                document.getElementById('deckTitle').style.width = '25px';
            } else {
                decks = dojo.query('.marketDeckRtl')
                decks.forEach(D => {
                    D.classList.remove('miniDeck')
                });
                document.getElementById('deckTitle').style.width = '122px';
            }

            // Adjust size of tinyLabels?
        },

        ///////////////////////////////////////////////////
        //// Game & client states
        
        // onEnteringState: this method is called each time we are entering into a new game state.
        //                  You can use this method to perform some user interface changes at this moment.
        //
        onEnteringState: function( stateName, args )
        {
            console.log( 'Entering state: '+stateName );
            console.log(args);
            this.stateArgs = args
            this.stateName = stateName

            console.log(args.args?.whatCanIMake)
            if (args.args?.whatCanIMake) {
                this.updateWhatCanIMake(args.args.whatCanIMake)
            }
            
            switch( stateName )
            {
                case 'nextPlayer':
                    for ( var player_id in args.args.players ) {
                        var player = args.args.players[player_id];
                        this.setMoney(player_id, player.money)
                    }
                    break;
                case 'playerBuyTurn':
                    this.canBuyBasic = args.args.canBuyBasic;
                    if (parseInt(args.active_player) == this.player_id) {
                        console.log("connecting market cards")
                        this.connectAllMarketCards(args.args.canBuyBasic, args.args.money);
                        this.connectAllRecipeSlots('onRecipeCubeClick');
                    }
                    break;
                case 'playerBuyTurnReveal':
                    if ( this.isCurrentPlayerActive() ) {
                        this.connectAllCardsInComboStock(this.playerRevealStock[this.player_id])
                        this.addTitleWarning(_("Warning: Discounted below 0"))
                    }
                    break;
                case 'distill':
                case 'distill_post_trade': 
                    this.distillStartArgs = Object.assign({}, args);
                    console.log(args)
                    this.disconnectAllMarketCards();
                    this.collapseMarket(null);
                    if( this.isCurrentPlayerActive() ) {
                        console.log("connecting cards from onEnteringState")
                        this.connectCardsForDistill()
                    }

                    break;
                case 'selectRecipe':
                    console.log(args)
                    break;
                case 'sell':
                    this.savedPlayerCards = args.args.playerCards;
                    break;
                case 'selectFlavor': 
                    // add location to message
                    document.getElementById("pagemaintitletext").innerText += " " + (
                        dojo.string.substitute(_('for ${location}'), {location: this.getProperSubtype(args.args.location)}));

                    if (this.isCurrentPlayerActive()) { // only connect for the active player
                        Object.keys(args.args.allowedCards).forEach(C => {
                                let card = this.activeCards[C];
                                var elem = document.getElementById(`ing-card-${card.uid}`)
                                elem.classList.add("marketBuyable")
                                dojo.connect(elem, "onclick", this, () => {
                                    this.confirmButton(_("Confirm"), "selectFlavor", {
                                        flavor: C,
                                        drink: args.args.drink,
                                        lock: true,
                                    }, null, dojo.string.substitute(_("Select ${flavor}"), {flavor: _(card.name)}))
                                })
                            })
                    }
                    break;

            case 'discardGoals':
                console.log("connect discard goals")
                //this.connectAllCardsWithClass("onGoalsCardClick", 'goalsCard');
                goals = dojo.query('.goalsCard')
                goals.forEach( G => { 
                    handle = dojo.connect(G, 'onclick', this, 'onGoalsCardClick') 
                    G.classList.add('marketBuyable')
                    this.marketClickHandles[G.uid] = handle
                })
                this.showFloatingGoals();
                console.log(this.marketClickHandles);
                console.log("done")
                break;
            case 'preDistill':
                console.log("predistill");
                console.log(args.args)
                if (args.args.skip) {
                    console.log("calling skipper")
                    this.ajaxcall( "/distilled/distilled/passPreDistill.html", {lock: true},
                                        this, function(result) {});
                }
                break;
            }
            this.attachRegisteredTooltips();
        },

        // onLeavingState: this method is called each time we are leaving a game state.
        //                 You can use this method to perform some user interface changes at this moment.
        //
        onLeavingState: function( stateName )
        {
            console.log( 'Leaving state: '+stateName );
            console.log("close all tooltips")
            remaining = document.getElementById("remainingDiv")
            dojo.addClass(remaining, "invisible")

            dojo.query(".selected").removeClass("selected")
            dojo.query(".deckSelect").removeClass("deckSelect")
            dojo.query('.dijitTooltip').removeClass('dijitTooltip')
            dojo.query('.dijitTooltipConnector').removeClass('dijitTooltipConnector')

            // never allow this to persist from state to state
            this.disconnectAllMarketCards();
            this.removeTitleWarning();
            
            switch( stateName )
            {
                case 'distill': 
                    dojo.query('.selected').removeClass('selected')
                    this.disconnectAllMarketCards();
                    break;

            /* Example:
            
            case 'myGameState':
            
                // Hide the HTML block we are displaying only during this game state
                dojo.style( 'my_html_block_id', 'display', 'none' );
                
                break;
           */
           
            case 'placeLabel2':
                break;
            case 'placeLabel3':
            case 'placeLabel5':
            case 'placeLabel6': 
                console.log("disconnect 5")
                this.collapseMarket(null);
                this.disconnectAllMarketCards();
                break;
            case 'placeLabel4':
                console.log("disconnect 5")
                this.disconnectAllMarketCards();
                break
            case 'playerBuyTurn': 
                this.disconnectAllMarketCards();
                break;
            }               
        }, 

        // onUpdateActionButtons: in this method you can manage "action buttons" that are displayed in the
        //                        action status bar (ie: the HTML links in the status bar).
        //        
        onUpdateActionButtons: function( stateName, args )
        {
            console.log( 'onUpdateActionButtons: '+stateName );
            console.log("isCurrentPlayerActive: " + this.isCurrentPlayerActive())
            console.log(args)
                      

            if( this.isCurrentPlayerActive() )
            {            
                switch( stateName )
                {
                    case 'tasting':
                        let score = this['score_counter_' + this.player_id].getValue();
                        for (var ii = 0; ii <= 4; ii++) {
                            let amount = ii;
                            this.addActionButton('tasting' + ii, '' + ii, ()=>{
                                this.ajaxcall( "/distilled/distilled/tasting.html", 
                                    {lock: true, exchange: function(){return amount}()},
                                this, function(result) {})});
                            // Disable the button if you dont have enough points
                            if (ii > score) {
                                dojo.addClass('tasting' + ii, 'disabled')
                            }
                        }
                        break;
                   case 'playerBuyTurn':
                        remaining = document.getElementById("remainingDiv")
                        if (parseInt(args.basicRemaining) == 1)
                            remaining.innerHTML = _("1 Basic Purchase Remaining")
                        else if (parseInt(args.basicRemaining) == 2)
                            remaining.innerHTML = _("2 Basic Purchases Remaining")
                        else if (parseInt(args.basicRemaining) == 3)
                            remaining.innerHTML = _("3 Basic Purchases Remaining")
                        else if (parseInt(args.basicRemaining) == 0)
                            remaining.innerHTML = _("0 Basic Purchases Remaining")
                        else 
                            this.showMessage("Invalid value for basic purchases remaining", "error");

                        dojo.removeClass(remaining, "invisible")
                        args.discounts.forEach(D => {
                            console.log(D);

                            var type = D.subtype ? D.subtype : D.type;
                            type = type.toLowerCase();
                            typename = D.typename
                            // TODO consider passing through the distiller name
                            var cardName = (D.triggerCard.market == 'du') ? this.activeCards[D.triggerCard.uid].name : "Distiller Ability";
                            var coinSpan = ' <span class="icon-coin-em"> </span> ';
                            var s = dojo.string.substitute(_('${amount} ${coinSpan} discount on ${typename} (${cardName})'),
                                {
                                    amount: D.amount,
                                    coinSpan: coinSpan,
                                    typename: _(typename),
                                    cardName: _(cardName),
                                });
                            console.log(D.triggerCard)
                            console.log(D.triggerCard.uid)
                            var btnName = 'discount' + D.triggerCard.uid + D.triggerCard.market
                            var btn = this.addActionButton(btnName, s,
                                (evt)=>{
                                    var elem = document.getElementById(btnName);
                                    this.togglePowerButton(elem);
                                }
                            );
                            var elem = document.getElementById(btnName);
                            elem.dataset["uid"] = (D.triggerCard.market == 'du') ? D.triggerCard.uid : 0; // 0 indicates a distiller ability
                            elem.classList.add('powerCard')
                            console.log("user pref", this.getGameUserPreference(100), elem)
                            if (this.getGameUserPreference(100) == 1)
                                this.togglePowerButton(elem, 'playerBuyTurn');
                        })

                        this.addActionButton('pass_button', _('End Market Phase'), ()=>{
                            if (args.canBuyBasic) {
                                this.confirmButton(_("End Market Phase"), "pass", {
                                    lock: true,
                                }, null, _("<span style='color: red'> You may still buy from the basic market. </span> Are you sure?"))

                            } else {
                                this.confirmButton(_("End Market Phase"), "pass", {
                                    lock: true,
                                })
                            }
                        });
                        break;
                    case 'selectRecipe':
                        // TODO breaks here when both players skip?
                        args.recipes.forEach(X => {
                            let recipe = X.recipe;
                            let barrel = X.barrel
                            let suffix = "";
                            if (X.labelCount == 0) {
                                suffix = _("(No labels remaining)")
                            }
                            this.addActionButton('select' + recipe + X.barrelUid,  dojo.string.substitute(_('${recipe} (${barrel}) ${suffix}'), {recipe: _(recipe), barrel: _(barrel), suffix: suffix}), ()=>{
                                if (args.recipes.length > 1) {
                                    this.confirmButton(_("Confirm"), 'selectRecipe', {
                                        recipeSlot: X.recipeSlot,
                                        barrel: X.barrelUid,
                                        drinkId: args.drinkId,
                                        lock: true,
                                    }, null, dojo.string.substitute(_("Select ${recipe} in ${barrel} ${suffix}"), {recipe: _(recipe), barrel: _(barrel), suffix: suffix}));
                                } else {
                                     this.ajaxcall( "/distilled/distilled/selectRecipe.html", {
                                        recipeSlot: X.recipeSlot,
                                        barrel: X.barrelUid,
                                        drinkId: args.drinkId,
                                        lock: true,
                                     }, this, function(result) {});
                                }
                            })
                        })
                        break;
                    case 'sell':
                        var onlyAged = true;
                        args.drinks.forEach(D => {
                            console.log(D)
                            if (!D.aged) {
                                onlyAged = false;
                            }
                            this.addActionButton('select' + D.id, dojo.string.substitute(_('${name} (${location})'), {
                                name: _(D.name),
                                location: this.getProperSubtype(D.location),
                             }), () => {
                                this.chooseBottle({
                                    drink: D,
                                    bottles: args.bottles,
                                    labels: args.labels,
                                })
                            })
                        })
                        if (!args.mustSellAged) {
                            console.log(onlyAged)
                            if (onlyAged) {
                                this.addActionButton("skipSaleButton", _("Skip Sale"), () => {
                                    // on round 7, prompt
                                    if (this.turn != 7) {
                                        this.ajaxcall( "/distilled/distilled/skipSale.html", {lock: true},
                                            this, function(result) {})
                                    }
                                })
                                if (this.turn == 7) {
                                    var elem = document.getElementById("skipSaleButton")
                                    dojo.addClass('skipSaleButton', "disabled-looking")

                                    this.addTooltip("skipSaleButton", 
                                        _("In round 7 you must sell all spirits"), '', 1000)
                                }
                            }
                        }
                        break;
                    case 'distillReact':
                        console.log("distill react");
                        var any = false;
                        if (args.returnCard) {
                            console.log("Can return a card");
                            this.addActionButton('reactReturnButton', 
                                dojo.string.substitute(_("Return removed card to spirit (${name})"), {name: _(args.returnCard.triggerCard.name)}),
                                () => {
                                    this.replaceActionBar("You may select a card to return to the spirit");

                                    args.returnCard.returnableCards.forEach ((C) => {
                                        this.addReplacementActionButton(`btn_${C.uid}`, C.name, () => {
                                            this.ajaxcall( "/distilled/distilled/addBack.html", {
                                                triggerCard: args.returnCard.triggerCard.uid,
                                                returnCard: C.uid,
                                                lock: true,
                                            }, this, function(result) {})
                                            this.revertActionBar()
                                        })
                                    })
                                })
                        }
                        if (args.signatureCard?.length) {
                            this.addActionButton("reactReturnSignature", 
                                dojo.string.substitute(_("Return ${name} to spirit"), {name: _(args.signatureCard[0].name)}),
                                () => {
                                    this.ajaxcall( "/distilled/distilled/addBack.html", {
                                        returnCard: args.signatureCard[0].uid,
                                        lock: true,
                                    }, this, function(result) {})
                                });
                        }
                        if (args.distillAgain) {
                            console.log('can distill again');
                            this.addActionButton('distillAgainButton', 
                                dojo.string.substitute(_("Distill spirit again ${name}"), {name:  _(args.distillAgain.triggerCard.name)}),
                                () => {
                                    this.ajaxcall( "/distilled/distilled/distillAgain.html", {
                                        triggerCard: args.distillAgain.triggerCard.uid,
                                        lock: true,
                                    }, this, function(result) {})
                                })
                        }
                        if (args.usePower) {
                            args.usePower.forEach(P => {
                                this.addActionButton("usePower" + P.triggerCard.uid, "Use " + P.triggerCard.name, 
                                () => {
                                    this.ajaxcall( "/distilled/distilled/useDistillPower.html", {
                                        triggerCard: P.triggerCard.uid,
                                        lock: true,
                                    }, this, function(result) {});
                                })
                            })
                        }
                        this.addActionButton('passButton', 
                                _("Skip"),
                                () => {
                                    this.ajaxcall( "/distilled/distilled/distillReactPass.html", { lock: true
                                    }, this, function(result) {})
                                })

                        
                        break;
                    case 'playerBuyTurnRevealSelect':
                    case 'fangXinRevealSelect':
                        console.log("water reveal");
                        // TODO make the decks clickable
                        var translate = [_("Distillery Upgrade"), _("Premium Ingredient"), _("Premium Item"), _("Skip Reveal")]
                        var decks = ["Distillery Upgrade", "Premium Ingredient", "Premium Item", "Skip Reveal"]
                        var ii = 0;
                        decks.forEach(D => {
                            this.addActionButton('reveal' + ii++, _(D), () => {
                                console.log("Button")
                                if (D == 'Skip Reveal')
                                    D = "Pass"

                                console.log(D)
                                console.log(decks)
                                console.log(ii)
                                this.ajaxcall( "/distilled/distilled/reveal.html", {
                                    deck: D,
                                    lock: true,
                                    trigger: args ? args.trigger : null,
                                }, this, function(result) {})
                            })
                        });
                        break;
                    case 'playerBuyTurnReveal':
                        console.log("buy revealed");
                        // Should only be one choice here.
                        if (args.allowedCards?.length == 0) {
                            this.showMessage(_("Please report this error as a bug in water reveal"), "error");
                            return;
                        }
                        var uid = Object.keys(args.allowedCards)[0];
                        var card = this.activeCards[Object.keys(args.allowedCards)[0]];
                        // TODO handle not enough money
                        this.addActionButton('buyButton', dojo.string.substitute(_('Buy ${name}'), {name: _(card.name)}), () => {
                            var powerNodes = dojo.query(".activePower");
                            var powers = [];
                            powerNodes.forEach(e => {
                                powers.push(e.dataset.uid);
                            });
                            cost = this.getEffectiveCost(card.uid) 
                            let description = null;
                            if (cost < 0) {
                                description =  _('This will end your turn.') + '<span style="color: red;">' + _('Warning: Discounted below 0.') + "</span>";
                                cost = 0
                            }

                            let money = this['money_counter_' + this.player_id].getValue();
                            if (args.allowedCards[uid].market == 'du') {
                                var C = this.activeCards[uid]
                                C.market = args.allowedCards.market
                                this.placeDuPrompt(C, powers.join(','))
                            } else {
                                button = dojo.string.substitute(_('Confirm buy ${name} for ${cost}'), {name: _(card.name), cost: cost}
                                )   + '<span class="icon-coin-em"> </span>';
                                buttonDom = this.confirmButton( button, "buyCard", {
                                    cardName: card.uid,
                                    marketName: args.allowedCards[uid].market,
                                    slotId: 0,
                                    debugId: 1, phase: this.stateName,
                                    lock: true,
                                    powers: powers.join(','),
                                }, null, description)

                                console.log(buttonDom)
                                if (cost > money) {
                                    dojo.addClass(buttonDom, 'disabled')
                                }
                            }
                        })
                        buyButton = document.getElementById("buyButton")
                        buyButton.dataset.uid = card.uid
                        cost = this.getEffectiveCost(card.uid) 
                        let money = this['money_counter_' + this.player_id].getValue();
                        buyButton.innerHTML = dojo.string.substitute(_('Buy ${name} for ${cost} <span class="icon-coin-em"></span>'), {name: card.name, cost: cost});
                        if (cost > money) {
                            dojo.addClass(buyButton, "disabled")
                        }

                        args.discounts.forEach(D => {
                            console.log(D);

                            var type = D.subtype ? D.subtype : D.type;
                            type = type.toLowerCase();
                            typename = D.typename
                            // TODO consider passing through the distiller name
                            var cardName = (D.triggerCard.market == 'du') ? this.activeCards[D.triggerCard.uid].name : "Distiller Ability";
                            var coinSpan = '<span class="icon-coin-em"> </span> ';
                            var s = dojo.string.substitute(_('${amount} ${coinSpan} off ${type} (${name})'), {
                                amount: D.amount,
                                coinSpan: coinSpan,
                                type: _(typename),
                                name: _(cardName),
                            });
                            console.log(D.triggerCard)
                            console.log(D.triggerCard.uid)
                            var btnName = 'discount' + D.triggerCard.uid + D.triggerCard.market;
                            var btn = this.addActionButton(btnName, s,
                                (evt)=>{
                                    var elem = document.getElementById(btnName)
                                    this.togglePowerButton(elem);
                                }
                            );
                            var elem = document.getElementById(btnName)
                            elem.dataset["uid"] = (D.triggerCard.market == 'du') ? D.triggerCard.uid : 0; // 0 indicates a distiller ability
                            elem.classList.add("powerButton")
                            elem.classList.add("powerCard")
                            if (this.getGameUserPreference(100) == 1)
                                this.togglePowerButton(elem, 'playerBuyTurnReveal');
                        })
                        this.addActionButton('returnButton', _('Pass'), () => {
                            this.ajaxcall( "/distilled/distilled/pass.html", {lock: true}, this, function(r) {})
                        })
                        break;
                    case 'roundStartActionSelect':
                        console.log("select round start action")
                        console.log(args.choices)
                        args.choices.forEach(C => 
                            this.addActionButton('selectAction' + C.uid, C.name, () => {
                                this.ajaxcall( "/distilled/distilled/selectRoundStartAction.html", {
                                    card_id: C.market == 'du' ? C.uid : 0,
                                    lock: true
                                }, this, function(result) {})
                            }))
                        break;
                    case 'roundStartAction':
                        console.log(args)
                        console.log(this)
                        
                        if (args.powercard == 123) {
                            this.connectTrucksWithCb((X) => this.truckerCallback(X), true);
                            return;
                        }
                        args.options.forEach(O => {
                            
                            O.allowedCards.forEach(C => {
                                console.log(O)
                                console.log(C)
                                let action = _("Collect")

                                if (O.trigger == 124 || O.trigger == 34) {
                                    action = _("Buy")
                                }

                                // TODO replace this with buy if it's a buy
                                iconType = C.subtype ? C.subtype : C.type 
                                this.addActionButton('buyButton' + C.uid, 
                                    dojo.string.substitute(_('${action} ${name} <span class="icon-${iconType}-em"></span> (${triggerName})'), {
                                        action: action,
                                        name: _(C.name),
                                        iconType: iconType.toLowerCase(),
                                        triggerName: _(O.triggerName),
                                        }), () => {
                                    if (C.market == 'du') {
                                        this.clientStateArgs = {
                                            slotId: 0,
                                            cardName: C.uid,
                                            marketName: 'du',
                                            powers: O.triggerUid,
                                            lock: true,
                                        }
                                        this.placeDuPrompt(C, O.triggerUid)
                                    } else {
                                        this.ajaxcall( "/distilled/distilled/buyCard.html", {
                                            cardName: C.uid,
                                            marketName: C.market,
                                            slotId: 0,
                                            powers: O.triggerUid,
                                            debugId: 3, phase: this.stateName,
                                            lock: true,
                                        }, this, function(result) {});
                                    }
                                })

                                console.log(C)
                                if (O.trigger == 34 || O.trigger == 124) {
                                    console.log("Inside")
                                    buyButton = document.getElementById("buyButton" + C.uid)
                                    buyButton.dataset.uid = C.uid
                                    cost = this.getEffectiveCost(C.uid) 
                                    let money = this['money_counter_' + this.player_id].getValue();
                                    buyButton.innerHTML = dojo.string.substitute(_('Buy ${name} for ${cost} <span class="icon-coin-em"></span>'), {name: _(C.name), cost: cost});
                                    if (cost > money) {
                                        dojo.addClass(buyButton, "disabled")
                                    }
                                }

                                this.addTooltipForCard(C, document.getElementById('buyButton' + C.uid))
                            })
                            if (O.pass) {
                                this.addActionButton('pass_button', dojo.string.substitute(_("End Ability (${triggerName})"), {triggerName: _(O.triggerName)}), ()=>{
                                    this.ajaxcall( "/distilled/distilled/roundStartPass.html", {
                                        power: O.triggerUid,
                                        lock: true,
                                    },
                                    this, function(result) {})})
                                }
                        })
                       break;
                    case 'selectFlavor':
                        
                            /*
                        Object.keys(args.allowedCards).forEach(C => {
                            let card = this.activeCards[C];
                            this.addActionButton('buyButton' + card.uid, dojo.string.substitute(_('Select ${name}'), {name: card.name}),  () => {
                                    this.ajaxcall( "/distilled/distilled/selectFlavor.html", {
                                        flavor: C,
                                        drink: args.drink,
                                        lock: true,
                                    }, this, function(result) {});
                                })
                        })
                        */
                        break;

                    case 'distill':
                        this.clientStateArgs = {};
                        console.log(args)
                        console.log(this.pantrySelection)
                        this.pantrySelection = {}
                        console.log(this.pantrySelection)

                        if (!(this.player_id in args.trades)) {
                            this.addActionButton('trade_card_button', _('Trade with Basic Market'), ()=>{
                                // cannot trade yeast or alcohol
                                let selected = Object.keys(this.pantrySelection).filter(C => this.pantrySelection[C]);
                                if (selected.length != 1) {
                                    return;
                                }
                                let c = selected[0];

                                if (this.activeCards[c].card_id == 0 || this.activeCards[c].card_id == 139 || this.activeCards[c].signature) {
                                    this.showMessage(_("Cannot trade yeast, alcohol, or signature ingredients"), "error");
                                    return
                                }

                                this.clientStateArgs = {
                                    selected: selected[0],
                                    args: this.stateArgs,
                                };
                               this.beginTrade(dojo.string.substitute(_('Distill Phase: Trade ${name} for '), {name: _(this.activeCards[c].name)}), selected[0])
                            });
                        }

                        // falling through
                    case 'distill_post_trade':
                        console.log("connecting cards for distil")

                        console.log("recreating action button")
                        this.addActionButton('distill_button', _('Distill Selected Cards') + `
                            <span id="yc_wrap"> <span id="yc"> </span> <span class="icon-yeast-em">   </span> </span>
                            <span id="wc_wrap"> <span id="wc"> </span> <span class="icon-water-em">   </span> </span>
                            <span id="ac_wrap"> <span id="ac"> </span> <span class="icon-alcohol-em"> </span> </span>
                            <span id="gc_wrap"> <span id="gc"> </span> <span class="icon-grain-em">   </span> </span>
                            <span id="pc_wrap"> <span id="pc"> </span> <span class="icon-plant-em">   </span> </span>
                            <span id="fc_wrap"> <span id="fc"> </span> <span class="icon-fruit-em">   </span> </span>`, ()=>{
                            if (!this.pantrySelection)  {
                                console.log("bad");
                                return;
                            }
                            if (dojo.hasClass("distill_button", "disabled-looking")) {
                                return;
                            }
                            this.disconnectAllMarketCards();

                            let wbCards = []
                            let cardElements = []
                            console.log(this.pantrySelection)
                            Object.keys(this.pantrySelection).forEach(X => {
                                let selected = this.pantrySelection[X];
                                if (selected) {
                                    wbCards.push(X)
                                    cardElements.push(this.ingCardsManager.getCardElement({uid: X}));
                                }
                            });

                            fn = function() {
                                this.pantrySelection = {}
                                this.playerPantryStock[this.player_id].ing.getCards().forEach( C => {
                                    this.pantrySelection[C.uid] = false
                                });
                                this.playerStoreStock[this.player_id].item.getCards().forEach( C => {
                                    this.pantrySelection[C.uid] = false
                                });
                                dojo.query(".selected").removeClass("selected")
                                this.revertActionBar();

                                console.log("hide yc_wrap")
                                this.yeastCounter.setValue(0);
                                dojo.addClass('yc_wrap', 'invisible')

                                this.waterCounter.setValue(0);
                                dojo.addClass('wc_wrap', 'invisible')

                                this.alcoholCounter.setValue(0);
                                dojo.addClass('ac_wrap', 'invisible')

                                this.grainCounter.setValue(0);
                                dojo.addClass('gc_wrap', 'invisible')

                                this.plantCounter.setValue(0);
                                dojo.addClass('pc_wrap', 'invisible')

                                this.fruitCounter.setValue(0);
                                dojo.addClass('fc_wrap', 'invisible')

                                dojo.addClass('distill_button', "disabled-looking");

                                console.log(this.playerPantryStock[this.player_id])
                                console.log("connecting cards for distill from restart")
                                this.connectCardsForDistill()
                                return;
                            }
                            distillButton = document.getElementById("distill_button")
                            this.confirmButton(distillButton.innerHTML, "distill", {
                                    washbackCards: wbCards.join(","),
                                    tradeIn: this.clientStateArgs?.trade?.in,
                                    tradeOut: this.clientStateArgs?.trade?.out,
                                    lock: true,
                                },
                                fn,
                                _("Confirm distill")); 
                            var warnElem = this.addTitleWarning(_("You are distilling multiple types of sugars."))
                            console.log(warnElem)

                            var sugarTypes = 0;
                            if (this.grainCounter.getValue())
                                sugarTypes++;
                            if (this.plantCounter.getValue())
                                sugarTypes++;
                            if (this.fruitCounter.getValue()) 
                                sugarTypes++;

                            if (sugarTypes > 1) {
                                //warnElem.classList.remove('invisible')
                            }
                        });
                        this.addTooltip("distill_button", 
                            _("Click this button to distill"), 
                            _("Must select at least 1 yeast, 1 water, and 1 sugar"), 1000);

                        // Add counters to the button
                        var counter = new ebg.counter();
                        counter.create("yc");
                        counter.setValue(0);
                        this.yeastCounter = counter;
                        console.log("setting to invisible in onUpdate")
                        dojo.addClass("yc_wrap", "invisible")

                        counter = new ebg.counter();
                        counter.create("wc");
                        counter.setValue(0);
                        this.waterCounter = counter;
                        dojo.addClass("wc_wrap", "invisible")

                        counter = new ebg.counter();
                        counter.create("ac");
                        counter.setValue(0);
                        this.alcoholCounter = counter;
                        dojo.addClass("ac_wrap", "invisible")

                        counter = new ebg.counter();
                        counter.create("gc");
                        counter.setValue(0);
                        this.grainCounter = counter;
                        dojo.addClass("gc_wrap", "invisible")

                        counter = new ebg.counter();
                        counter.create("pc");
                        counter.setValue(0);
                        this.plantCounter = counter;
                        dojo.addClass("pc_wrap", "invisible")

                        counter = new ebg.counter();
                        counter.create("fc");
                        counter.setValue(0);
                        this.fruitCounter = counter;
                        dojo.addClass("fc_wrap", "invisible")

                        console.log(this.clientStateArgs)
                        this.addActionButton("selectAllButton", _("Select All"), ()=> {
                            console.log("Select All")
                            this.playerPantryStock[this.player_id].ing.getCards().forEach(X => {
                                let elem = this.playerPantryStock[this.player_id].ing.getCardElement(X);
                                console.log(elem)
                                if (dojo.hasClass(elem, 'selected')) {
                                    console.log(`${X.name} is already selected`)
                                    return;
                                } else {
                                    console.log(`${X.name} is not currently selected`);
                                }
                                console.log(this.pantrySelection[X.uid])

                                this.showFloatingPantry();
                                console.log(elem)
                                this.onPantryClickElem(elem)
                            });

                       })

                        dojo.addClass('distill_button', "disabled-looking");
                        this.addActionButton('skip_button', _('Skip Distill'), ()=>{
                            this.confirmButton(_("End Distill Phase"), "skipDistill", {lock: true}, null, 
                                "<span style='color: red'>" + _(`You are about to skip distilling for the round. Confirm?`) + "</span>" )
                        });
                        elem = document.getElementById('trade_card_button')
                        if (elem)
                            dojo.addClass('trade_card_button', "disabled");


                        this.addActionButton('restart_distill_button', _('Restart Distill'), ()=>{
                            this.confirmButton(_('Confirm'), "restartDistill", {lock: true}, null, _("Restart Distill"))
                        })
                        break;
                    case 'distillPowers':
                        this.addActionButton('distillButton', _('Distill'), ()=>{
                            var powers = dojo.query('.activePower').map(X => X.dataset.uid);
                            console.log(powers);
                            this.ajaxcall( "/distilled/distilled/distillPostPowers.html", {
                                powers: powers.join(','),
                                lock: true,
                        }, this, function(result) {})});
                        args.powerCards.forEach(PC => {
                            this.addActionButton('powerButton' + PC.uid, dojo.string.substitute('${desc} (${name})', {desc: _(PC.description), name: _(PC.name)}), ()=>{
                                var elem = document.getElementById('powerButton' + PC.uid);
                                this.togglePowerButton(elem);
                            })
                            console.log(elem)
                            var elem = document.getElementById('powerButton' + PC.uid);
                            elem.classList.add('powerCard')
                            elem.dataset.uid = PC.uid;
                            this.togglePowerButton(elem);
                        })

                        if (args.canRestart) {
                            this.addActionButton('restart_distill_button', _('Restart Distill'), ()=>{
                                this.confirmButton(_("Confirm"), "restartDistill", {lock: true}, null, _("Restart Distill"))
                            })
                        }
                        break;
                }
            } 
            if ( (!this.isSpectator) ) {
                switch ( stateName ) {
                    case 'discardGoals':
                        if (this.getActivePlayers().includes("" + this.player_id)) {
                            this.addActionButton('discard_goal_button', _('Discard Distillery Goal'), ()=>{
                                this.disconnectAllMarketCards();
                                this.ajaxcall( "/distilled/distilled/discardGoal.html", {
                                    discard: this.selectedGoal,
                                    lock: true,
                                }, this, function(result) {})});
                            dojo.addClass('discard_goal_button', "disabled");
                        }
                        break;
                    
                    case 'chooseDistiller':
                        this.distillerChoice = {}
                        if (this.getActivePlayers().includes("" + this.player_id)) {
                            args.allowedCards.reverse().forEach(C => {
                                if (C.player_id != this.player_id)
                                    return;

                                this.distillerChoice[C.id] = C;
                                let card = C
                                this.connectDistillerCardsForChoice();
                            })
                            break;
                        }
                    }
            }
        },        

        ///////////////////////////////////////////////////
        //// Utility methods
        
        /*
       
            Here, you can defines some utility methods that you can use everywhere in your javascript
            script.
        
        */

        // <a href="#" class="action-button bgabutton bgabutton_blue" onclick="return false;" id="discount1" data-uid="0">2 <span class="icon-coin-em"> </span>  off ingredient (Distiller Ability)</a>

        // @override
        truckerCallback(market)  {
            args = this.stateArgs.args

            console.log(this)
            console.log(args)
            this.replaceActionBar(_("Choose a card to buy"), 
                () => {
                    console.log("cancel trucker");
                    this.connectTrucksWithCb((X) => this.truckerCallback(X), null, true);
                })
            args.options.forEach(O => {
                console.log(args, market)
                O.allowedCards.forEach(C => {
                    if (C.market != market) {
                        return;
                    }

                    let money = this['money_counter_' + this.player_id].getValue();
                    let cost = this.getEffectiveCost(C.uid)
                    let btn = this.addReplacementActionButton(`btn_${C.card_id}`, C.name, () => {
                        console.log(this)
                        button = dojo.string.substitute(_('Buy ${name} for ${cost} <span class="icon-coin-em"></span>'), {name: _(C.name), cost: cost})

                        // Handle DU here
                        if (market == 'du') {
                            this.placeDuPrompt(C, O.triggerUid, null)
                        } else {
                            // confirmButton(buttonText, url, args, cb, title) {
                            console.log("confirmation button for card")
                            conf = this.confirmButton(button, "buyCard", {
                                cardName: C.uid,
                                marketName: market,
                                powers: O.triggerUid,
                                debugId: 2, phase: this.stateName,
                                lock: true,
                            }, () => {console.log('confirm cancel'); this.connectTrucksWithCb((X) => this.truckerCallback(X), null, true)})
                            if (cost > money)
                                dojo.addClass(conf, "disabled")
                        }
                    })
                    if (cost > money)
                        dojo.addClass(document.getElementById(`btn_${C.card_id}`), "disabled")
                    this.addTooltipForCard(C, document.getElementById(`btn_${C.card_id}`))
                })
            })
            this.showDeckModal(market)
        },
        resetSpirits: function(spirits) {
            if (!spirits) 
                return;

            dojo.query('.tinyLabelOuter').remove()
            spirits.forEach(S => {
                console.log(S)
                this.addTinyLabel(S, S.player_id);
            })
        },
        addSectionTabsForPlayer: function() {
            console.log("addSectionTabs")
            dojo.query(".playerBlock").forEach(B => {
                Object.keys(this.player_data).forEach(K => {
                    var P = this.player_data[K]
                    console.log("adding section tabs for", K, P)
                    console.log(P)
                    var pid = P.id;
                    var name = P.name;
                    var color = "black"
                    var background = "darkgray";
                    var borderColor = "black";
                    var extraClass = "backgroundTab";

                    if (B.dataset.pid == pid) {
                        background = "white";
                        color = `#${P.color}`;
                        borderColor = `#${P.color}`;
                        extraClass = "visibleTab"
                    }

                    var tab = this.createElement(`
                        <div class="playerTab ${extraClass}" data-pid=${pid} style="color: ${color}; background: ${background}; border: solid ${borderColor} 2px; "> 
                            <span style="font-weight: bold"> ${name} </span>
                        </div>
                    `)
                    B.appendChild(tab)
                })
            })
            dojo.query(".playerTab").connect('onclick', (e) => { 
                dojo.stopEvent(e);
                this.setVisiblePlayer(e.currentTarget.dataset.pid);
            })
        },
        addTitleWarning: function(warnText) {
            title = document.getElementById("pagemaintitletext")
            var warnElem = document.createElement("span")
            warnElem.style.color = 'red'
            warnElem.innerHTML = warnText + '&nbsp'; 
            warnElem.classList.add('invisible')
            warnElem.id = "titleWarning"
            title.parentElement.insertBefore(warnElem, title)
            return warnElem;
        },
        removeTitleWarning: function() {
            document.getElementById("titleWarning")?.remove()
        },
        addCheckmark: function(div) {
          // Check if the div exists
          if (!div) {
            console.error("Div with ID", divId, "not found");
            return;
          }
        
          // Create a new element for the checkmark
          const checkmark = document.createElement("div");
        
          // Set the checkmark styles (you can customize these)
          checkmark.style.position = "absolute";
          checkmark.style.top = "-0.2em";
          checkmark.style.right = "0";
          checkmark.style.fontSize = "5em"; // Adjust font size as needed
          checkmark.style.fontWeight = "bold"; // Adjust font size as needed
          checkmark.style.color = "green";
          checkmark.style.textShadow = "1px 1px 2px black"; // Adjust font size as needed
        
          // Create the checkmark symbol using content property
          checkmark.textContent = "✓";  // Unicode checkmark character
        
          // Append the checkmark to the existing div
          div.appendChild(checkmark);
        },
        addEx: function(div) {
          // Check if the div exists
          if (!div) {
            console.error("Div with ID", divId, "not found");
            return;
          }
        
          // Create a new element for the checkmark
          const checkmark = document.createElement("div");
        
          // Set the checkmark styles (you can customize these)
          checkmark.style.position = "absolute";
          checkmark.style.top = "-0.2em";
          checkmark.style.right = "0";
          checkmark.style.fontSize = "5em"; // Adjust font size as needed
          checkmark.style.fontWeight = "bold"; // Adjust font size as needed
          checkmark.style.color = "red";
          checkmark.style.textShadow = "1px 1px 2px black"; // Adjust font size as needed
        
          // Create the checkmark symbol using content property
          checkmark.textContent = "X";  // Unicode checkmark character
        
          // Append the checkmark to the existing div
          div.appendChild(checkmark);
        },
        addSpOverlay: function(div, amount) {
          // Check if the div exists
          if (!div) {
            console.error("Div with ID", divId, "not found");
            return;
          }
        
          // Create a new element for the checkmark
          const checkmark = document.createElement("div");
        
          // Set the checkmark styles (you can customize these)
          checkmark.style.position = "absolute";
          checkmark.style.top = "0";
          checkmark.style.right = "0";
          checkmark.style.fontSize = "2em"; // Adjust font size as needed
          checkmark.style.fontWeight = "bold"; // Adjust font size as needed
          checkmark.style.color = "gold";
          checkmark.style.textShadow = "1px 1px 2px white"; // Adjust font size as needed
          checkmark.style.background = "rgba(0, 0, 0, 0.8)"
          checkmark.style.borderRadius = "5px"
          checkmark.style.display = "flex"
          checkmark.style.zIndex = 11;
        
          // Create the checkmark symbol using content property
          checkmark.innerHTML = `${amount} <span style="font-size: 1.3em" class='icon-sp-em'></span>`;  // Unicode checkmark character
        
          // Append the checkmark to the existing div
          div.appendChild(checkmark);
        },
        animateEndgamePoints: async function(notif) {
            console.log("animate endgame points", notif)
            if (this.finalScoring) {
                // Show the card
                var cardElem = this.showEndgameCard(notif.args.row, notif.args.card, notif.args.player_id, notif.args.sp)
                if (notif.args.row == 'goals') {
                    await new Promise(r => setTimeout(r, 1000));
                    if (cardElem && notif.args.sp) {
                        this.addCheckmark(cardElem)
                    } else if (cardElem) {
                        this.addEx(cardElem)
                    }
                }
                if (notif.args.row == 'dus' || notif.args.row == 'bottles') {
                    console.log("adding card for du or bottles", cardElem)
                    await new Promise(r => setTimeout(r, 1000));
                    if (cardElem) {
                        this.addSpOverlay(cardElem, notif.args.sp)
                    }
                }

                this.finalScoring[notif.args.player_id][notif.args.row].incValue(notif.args.sp)
                this.finalScoring[notif.args.player_id]['total'].incValue(notif.args.sp)
                this['score_counter_' + notif.args.player_id].incValue(notif.args.sp);
            }
        },
        showEndgameCard(type, card, player_id, points) {
            console.log("show endgame card", type, card)
            dojo.query(".endgameDisplay").remove()
            var clone = null;
            var color = this.player_data[player_id].color
            var playerName = this.player_data[player_id].name
            switch(type) {
                case 'bottles':
                    var cardElems = [];
                    var regions = {}
                    this.playerDisplayStock[player_id].item.getCards().forEach(C => {
                        if (!C.subtype)
                            return;

                        var effectiveRegion = C.subtype
                        if (C.subtype && C.subtype == "HOME") 
                            effectiveRegion = this.player_data[player_id].region

                        if (card == 'SET' && effectiveRegion) {
                            if (effectiveRegion in regions) {
                                return;
                            }
                            console.log("adding region", effectiveRegion)
                            regions[effectiveRegion] = true
                        }
                        if (effectiveRegion == card || card == 'SET') {
                            console.log(C)
                            e = this.itemCardsManager.getCardElement(C)
                            console.log(e)
                            var miniclone = e.cloneNode()
                            miniclone.innerHTML = e.innerHTML
                            cardElems.push(miniclone);
                        }
                    })
                    console.log(cardElems)
                    clone = this.createElement(`<div></div>`)
                    clone.style.display = "flex";
                    clone.style.gap = "10px";
                    clone.style.flexDirection = "row";
                    clone.style.position = "relative";

                    
                    cardElems.forEach(E => {
                        clone.appendChild(E)
                    })
                    break;

                case 'goals':
                    var e = this.goalsCardsManager.getCardElement(card)
                    if (!e) 
                        e = this.goalsCardsManager.createCardElement(card)

                    if (e) {
                        clone = e.cloneNode()
                        clone.innerHTML = e.innerHTML
                    }
                    console.log(clone)
                    break;
                case 'dus':
                    console.log("dus")
                    var e = this.duCardsManager.getCardElement(card)
                    if (!e) 
                        e = this.duCardsManager.createCardElement(card)
                    if (e) {
                        console.log("du eg card", e)
                        clone = e.cloneNode()
                        clone.innerHTML = e.innerHTML
                        clone.dataset.side = 'front'
                    }
                    break;
            }

            if (clone) {
                console.log("there is a clone!", clone)
                var parent = document.getElementById("centerScreen")

                var wrapper = this.createElement('<div class="dwhiteblock"></div>')
                wrapper.classList.add("endgameDisplay")

                var nameElem = this.createElement(`<div style="color: #${color}; text-align: center; font-weight: bold;"> ${playerName} </div>`)

                console.log("adding to parent", parent)
                wrapper.appendChild(nameElem)
                wrapper.appendChild(clone)
                wrapper.style.background = "rgba(255, 255, 255, 0.8)"

                parent.appendChild(wrapper)
                console.log(parent)
                return clone
            }
            return null;
        },
        addCardToTruck(card, truckName, truck) {
            console.log("adding card to truck", card, truckName)
            let manager = null;
            switch (truckName) {
                case 'du':
                    manager = this.duCardsManager;
                    break;
                case 'item':
                    manager = this.itemCardsManager;
                    break;
                case 'ing':
                    manager = this.ingCardsManager;
                    break;
            }
            if (manager == null) {
                this.showMessage("Please report this as a bug in addCardToTruck", "error")
                return;
            }
            let truckCount = truck.getCardNumber();
            var cardElem = manager.getCardElement(card);
            if (cardElem) {
                cardElem.classList.remove("storeCard")
                cardElem.classList.remove("pantryCard")
                cardElem.style.zIndex = 0;
            }

            truck.addCard(card, {autoUpdateCardNumber: false});
            truck.setCardNumber(truckCount + 1, null);
        },
        translatetpl() {
            console.log("Translating!!!!!")
            let divs = dojo.query('.translateme')
            divs.forEach(D => {
                console.log("translating ", D,  `"${D.innerText}"`)
                var translation = _(D.innerText.trim()) 
                translation = bga_format(translation, {
                    '*': (t) => {
                        switch (t) {
                            case 'sp': return '<span class="icon-sp-em"></span>';
                        }
                    }
                })
                D.innerHTML = translation;

            })
            divs = dojo.query('.translatetitle')
            divs.forEach( D => {
                if (D.title) {
                    D.title = _(D.title);
                }
            })
        },
        resetRegionCounters(player_id) {
                var regions = ['americas', 'europe', 'asia', 'home', 'bottle']
                regions.forEach(R => {
                    var counterName = `${R}_counter_${player_id}`
                    this[counterName].setValue(0)
                });
        },
        connectLabelSlot(slot, cb) {
            let slotName = `label${slot}_${this.player_id}`
            dojo.addClass(slotName, 'labelSelect')
            let div = document.getElementById(slotName)
            let h = dojo.connect(div, 'onclick', () => {cb(this, slot)})
            this.marketClickHandles[slotName] = h
        },
        addLabelTooltipsForPlayer(player_id) {
            for (var ii = 0; ii < 7; ii++) {
                var divid = `label${ii}_${player_id}`
                var help = "";
                switch (ii) {
                    case 0: 
                        help = _("5 <span class='icon-coin-em'></span>")
                        break;
                    case 1:
                        help = _("Move signature ingredient to pantry")
                        break;
                    case 2:
                        help = _("Discard 1 card from pantry to gain 1 card from truck")
                        break;
                    case 3:
                        help = _("1 free ingredient")
                        break;
                    case 4: 
                        help = _("1 free recipe")
                        break;
                    case 5: 
                        help = _("1 free item")
                        break;
                    case 6:
                        help = _("1 free distillery upgrade")
                        break;
                }
                info = _("When selling, place labels here for rewards")
                help += _(" or 2 <span><span class='icon-sp-em'></span></span>")
                this.addTooltip(divid, info, help, 1000)
            }
        },
        createElement(html) {
            let tmp = document.createElement("div")
            tmp.innerHTML = html
            return tmp.firstElementChild
        },
        addTinyLabel(label, playerId) {
            // Fake labels
            console.log("add tiny label for", label)

            label.signature = parseInt(label.signature)
            var labelIdx = label.labelId;
            if (label.signature)
                labelIdx += 18

            this.spiritContents[label.uid] = []
            // need to count flavors here
            label.card_ids.forEach( C => {
                this.spiritContents[label.uid].push(C)
            })
            var known_flavors = parseInt(label.known_flavors);
            var fc = parseInt(label.flavor_count)
            if (fc) {
                var ukf = fc - known_flavors;
                for (var ii = 0; ii < ukf; ii++) 
                    this.spiritContents[label.uid].push(10000)
            }

            // Deal with flavors
            const xBack = (labelIdx %  6)
            const yBack = Math.floor(labelIdx / 6)


            let existing = document.getElementById(id)
            if (existing) {
                console.log("returning because existing")
                return;
            }

            console.log("playerid for board is ", playerId)
            var boardDiv = document.getElementById(`player_label_board_${playerId}`)

            var order = label.first_turn
            // This is just a hack for old games that didnt set first_turn on unaged spirits
            if (!order)
                order = label.sold_turn
            if (!order) {
                // I think i'd be surprised to make it here
                order = boardDiv.children.length + 1
            }
            console.log("order ended up being", order)
            var id = `tinyLabel-${label.label}-${label.order}`

            var tinyLabel = `
            <div id="${id}" data-order=${order} data-name="${label.label}" data-side="front" class="card tinyLabelOuter" 
                style="width: var(--width); flex-basis: var(--width); height: var(--height); grid-column-start: ${order}" 
                title="${_(label.label)}">
                <div class="card-sides">
                    <div class="card-side front dlabel tinyLabel" style="background-position-y: calc(-${yBack} * var(--height)); background-position-x: calc(-${xBack} * var(--width));">
                    </div>
                </div>
            </div>`


            var tinyLabelElem = this.createElement(tinyLabel);
            dojo.connect(tinyLabelElem, 'onclick', this, () => this.showSpiritModal(label.uid))

            if (label.count == 0) {
                tinyLabelElem.classList.add('nolabel')
            }

            console.log("boardDiv is", boardDiv)
            if (boardDiv.children.length == 0) {
                boardDiv.appendChild(tinyLabelElem)
                return
            }
            if (label.signature) {
                // Signature always goes last
                boardDiv.appendChild(tinyLabelElem)
                return
            }

            placed = false;
            Array.from(boardDiv.children).forEach(child => {
                if (placed)
                    return;

                if (child.dataset.order <= order) {
                    return;
                }
                boardDiv.insertBefore(tinyLabelElem, child)
                placed = true;
            })
            if (!placed) {
                boardDiv.appendChild(tinyLabelElem)
            }
        },
        placeLabelOnWashback(label, playerId) {
            console.log("place label on washback")
            this.playerWashbackStock[playerId].label.addCard(label);
            dojo.removeClass("washback_" + playerId + "_label", "invisible")

            var id = `tinyLabel-${label.label}-${label.count}`
            if (document.getElementById(id)) 
                return;

            //this.addTinyLabel(label, playerId)
        
        },
        addLabelToBoard(label, playerId, slot) {
            console.log("add label to board")
            this.playerLabelStock[playerId][slot].addCard(label)
            var boardDiv = document.getElementById(`player_label_board_${playerId}`)

            var id = `tinyLabel-${label.label}-${label.count}`
            if (document.getElementById(id)) {
                return
            }

            //this.addTinyLabel(label, playerId)

        },
        addBottleToDisplay(bottleCard, playerId) {
            this.playerDisplayStock[playerId].item.addCard(bottleCard);
            dojo.removeClass(this.playerDisplayStock[playerId].item.getCardElement(bottleCard), 'marketCard')

            if (bottleCard.subtype) {
                var counterName = `${bottleCard.subtype.toLowerCase()}_counter_${playerId}`
                console.log(counterName)
                this[counterName].incValue(1);
            }
            else {
                var counterName = `${bottleCard.type.toLowerCase()}_counter_${playerId}`
                console.log(counterName)
                this[counterName].incValue(1);
            }
        },
        isExpanded() {
            let elem = document.getElementById('floatingPantryWrap')
            return dojo.hasClass(elem, 'pantryExpanded')
        },
        getTooltipForWhatCanIMake(spiritList) {
            let imageClass = "dlabel"
            var formatHTML = '<div> ' + _("Distillable Recipes") + '<br/><div class="wcimTooltipContainer">'
                
            spiritList.forEach(spirit => {
                label = spirit.label
                if (spirit.signature == true) {
                    label += 18;
                }

                const xBack = (label %  6);
                const yBack = Math.floor(label / 6);

                formatHTML += `
                    <div class="${imageClass}" 
                        style="--width: 124px; --height: 90px; background-position-x: calc(-${xBack} * var(--width)); background-position-y: calc(-${yBack} * var(--height));"> 
                    </div>
                    `
            })
            formatHTML += '</div></div>';
            return formatHTML
        },
        updateWhatCanIMake(args) {
            console.log("whatCanIMake")
            Object.keys(args).forEach(pid => {
                console.log(pid)
                data = args[pid]

                html = this.getTooltipForWhatCanIMake(data)
                console.log(html)
                if (pid == this.player_id)
                    this.addTooltipHtml(`whatCanIMake`, html, 1000)
            })
        },

        toggleRecipeCardSize() {
            console.log("toggleRecipeCardSize")
            divs = dojo.query(".playerRecipeCard")
            divs.forEach(D => {
                if (D.classList.contains('jumboCard'))
                    D.classList.remove("jumboCard")
                else
                    D.classList.add("jumboCard")
            })

        },
        setLoader: function(image_progress, logs_progress) {
			this.inherited(arguments); // required, this is "super()" call, do not remove
			//console.log("loader", image_progress, logs_progress)
			if (!this.isLoadingLogsComplete && logs_progress >= 100) {
				this.isLoadingLogsComplete = true; // this is to prevent from calling this more then once
				this.onLoadingLogsComplete();
			}
		},

		onLoadingLogsComplete: function() {
			console.log('Loading logs complete');
			// do something here
            this.attachRegisteredTooltips()
		},
        registerCustomTooltip(html, id = null) {
          this._registeredCustomTooltips[id] = html;
          return id;
        },
        attachRegisteredTooltips() {
          console.log("Attaching toolips")
          Object.keys(this._registeredCustomTooltips).forEach((id) => {
            if (id) {
                //console.log(`inside ${id}: ${this._registeredCustomTooltips[id]}`)
                this.addCustomTooltip(id, this._registeredCustomTooltips[id]);
                this._attachedTooltips[id] = this._registeredCustomTooltips[id];

            }
          });
          this._registeredCustomTooltips = {};
        },
        addCustomTooltip(id, html) {
            this.addTooltipHtml(id, html, 1000)
        },
        logCards () {
            tmp = {}
            Object.assign(tmp, this.activeCards)
        },
        getAjaxArgsFromArgs(args) {
            console.log(args)
            if (args.cardIn && typeof args.cardIn == 'string' && args.cardIn?.endsWith("Truck")) {
                this.showMessage(`Please report this error as a bug in tradeWithTruck`, "error");
                return
            }
            tmp = {
                labelSlot: args.labelSlot,
                bottle: args.bottle?.uid,
                drinkId: args.drink?.id,
                optForSp: args.optForSp,
                collectCard: args.collectCard,
                collectCardSlot: args.collectCardSlot,
                collectRecipeSlot: args.collectRecipeSlot,
                tradeCardIn: args.cardIn,
                tradeCardOut: args.discard,
                tradeTruck: args.tradeTruck,
                duSlot: args.duSlot,
                lock: true,
            }
            return tmp;
        },
        getStockForDrink(drink) {
            let loc = drink.location
            switch (loc) {
                case 'washback':
                    stock = this.playerWashbackStock[this.player_id]
                    break;
                case 'warehouse1':
                    stock = this.playerWarehouse1Stock[this.player_id]
                    break;
                case 'warehouse2':
                    stock = this.playerWarehouse2Stock[this.player_id]
                    break;
            }
            return stock
        },
        flipLabel(label) {
            this.labelCardsManager.flipCard(label)
        },
        rewardCard(args) {
            console.log("reward cards")
            console.log(args)
            this.clientStateArgs = args
            switch (args.labelSlot) {
                case 3:
                    this.replaceActionBar(_(`Place Label Bonus: Select card to collect`), 
                        'revertActionBarAndResetCards')
                    console.log('ing')
                    this.connectAllCardsWithClass('onMarketClickLabelReward', 'ing-card');
                    break;
                case 5:
                    this.replaceActionBar(_(`Place Label Bonus: Select card to collect`), 
                        'revertActionBarAndResetCards')
                    console.log('item')
                    this.connectAllCardsWithClass('onMarketClickLabelReward', 'item-card');
                    break;
                case 6: 
                    this.replaceActionBar(_(`Place Label Bonus: Select card to collect`), 
                        'revertActionBarAndResetCards')
                    console.log('du')
                    this.connectAllCardsWithClass('onMarketClickLabelReward', 'du-card');
                    break;
                case 4:
                    this.replaceActionBar(_(`Place Label Bonus: Select recipe to collect`), 
                        'revertActionBarAndResetCards')
                    console.log('recipe')
                    this.connectAllRecipeSlots('onRecipeCubeClickLabelReward', true);
                    break;
            }
                
        },
        tradeWithTruck_SelectCard(args) {
            let truck;
            var tradeTruck = args.tradeTruck;
            console.log(args);
            switch (args.tradeTruck) {
                case 'du': console.log(1); truck = this.decks.duTruck; break;
                case 'ing': console.log(2); truck = this.decks.ingTruck; break;
                case 'item': console.log(3); truck = this.decks.itemTruck; break;
            }
            console.log(truck);

            this.replaceActionBar(_("Place Label Bonus: Select a card to collect"),
                'revertActionBarAndResetCards')
            cards = truck.getCards();
            console.log(cards)
            // TODO figure out how to do tooltips here in this text
            cards.forEach(C => {
                console.log(C)
                this.addReplacementActionButton('trade' + C.uid + 'Button', 
                    _(C.name),
                    () => {
                        this.tradeWithTruck_SelectCard_onSelect(args, C)
                    })
            })
        },
        tradeWithTruck_SelectCard_onSelect(args, C) {
            console.log(args)
            let decks = dojo.query(".deckSelect")
            decks.forEach(D => {
                dojo.destroy(D)
            })
            var discardCard = this.activeCards[args.discard]
            if (C.type == 'DU') {
                args.cardIn = C.uid
                if (discardCard.uid < 1000 && !discardCard.signature) { // Not bottomless
                    console.log("adding discard card to truck", C.uid, C)
                    this.addCardToTruck(discardCard, 'du', this.decks.duTruck)
                } else {
                    console.log("adding card to void", discardCard.uid, discardCard)
                    this.ingVoidStock.addCard(discardCard)
                }
                this.placeDuPrompt(C, [], args)
                return;
            } else {
                args.cardIn = C.uid
                console.log(this.clientStateArgs);
                var discard = this.activeCards[args.discard].name
                args.lock = true
                this.confirmButton(dojo.string.substitute(_('Discard ${discard} and collect ${name}'), {discard: _(discard), name: _(C.name)}), 
                    "sellDrink", 
                    this.getAjaxArgsFromArgs(args),
                    'revertActionBarAndResetCards',
                )
            }
        },
        tradeWithTruck(args) {
            console.log("tradeWithTruck", this.decks.duTruck.getCards())
            var truckCount = 0;
            truckCount += this.decks.duTruck.getCards().length;
            truckCount += this.decks.ingTruck.getCards().length;
            truckCount += this.decks.itemTruck.getCards().length;

            this.replaceActionBar(_("Place Label Bonus: Select a card from the pantry to discard"), 
                'revertActionBarAndResetCards')
            if (truckCount == 0) {
                console.log("No cards to trade")
                this.showMessage("No cards to trade")
                this.addReplacementActionButton('passButton', _("Pass"), () =>
                    this.ajaxcall( "/distilled/distilled/placeLabel2Pass.html", { 
                        lock: true
                    })
                );
                return;
            }
            // Loop over all this players pantry cards
            var cards = this.playerPantryStock[this.player_id].ing.getCards();
            cards.forEach(C => {
                this.addReplacementActionButton('discard' + C.uid + "Button",
                    _(C.name),
                    () => {
                        Ccopy = {}
                        Object.assign(Ccopy, C);

                        Ccopy.location = 'truck'
                        if (C.uid < 1000) { // not bottomless
                            switch (C.market) {
                                case 'du':
                                    this.addCardToTruck(Ccopy, 'du', this.decks.duTruck)
                                    break;
                                case 'ing':
                                    this.addCardToTruck(Ccopy, 'ing', this.decks.ingTruck)
                                    break;
                                case 'item':
                                    this.addCardToTruck(Ccopy, 'item', this.decks.itemTruck);
                                    break;
                            }
                        } else {
                            switch (C.market) {
                                case 'ing':
                                    this.ingVoidStock.addCard(Ccopy);
                                    break;
                                case 'item':
                                    this.itemVoidStock.addCard(Ccopy);
                                    break;
                            }
                        }

                        args.discard = Ccopy.uid
                        this.tradeWithTruck_SelectTruck(args)
                    }
                )
            });

        },
        connectTrucksWithCb(cb, hideCancel) {
            console.log('connect Truck')

            dojo.query('.deckSelect').remove()
            let mapping = {
                'Item Truck': 'item',
                'Ingredient Truck': 'ing',
                'Distillery Upgrade Truck': 'du',
            }


            this.replaceActionBar(_("Select a truck"), 
                'revertActionBarAndResetCards', hideCancel)
            if (hideCancel) {
                // Trucker
                this.addReplacementActionButton("passBtn", _("Skip Trucker"), () => {
                    this.revertActionBar();
                    this.ajaxcall( "/distilled/distilled/roundStartPass.html", {
                        power: this.stateArgs.args.options[0].triggerUid,
                        lock: true,
                    }, this, () => {})
                })
            }
            Object.keys(mapping).forEach(T => {
                var truckElem;
                switch (mapping[T]) {
                    case 'du': 
                        if (this.decks.duTruck.getCards().length == 0)
                            return;
                        truckElem = document.getElementById("distilleryUpgradeTruck")
                        break;
                    case 'ing': 
                        if (this.decks.ingTruck.getCards().length == 0)
                            return;
                        truckElem = document.getElementById("premiumIngredientsTruck")
                        break;
                    case 'item':
                        if (this.decks.itemTruck.getCards().length == 0)
                            return;
                        truckElem = document.getElementById("premiumItemsTruck")
                        break;
                }
                if (truckElem) {
                    truckElem.appendChild(this.createElement('<div class="deckSelect"></div>'))
                }
                this.addReplacementActionButton('view' + (mapping[T]) + 'TruckButton', 
                    T, () => cb(mapping[T])
                )
            })
        },
        tradeWithTruck_SelectTruck(args) {
            console.log(args)

            this.tradeWithTruckArgs = args;

            var cb = (truck) => {
                console.log(truck, args)
                console.log("Clicked on " + truck)
                args.tradeTruck = truck
                this.showDeckModal(truck)
                this.tradeWithTruck_SelectCard(args)
            }
            this.connectTrucksWithCb((X) => {console.log(X); cb(X)}, false);
        },
        rewardOrSp(args) {
            console.log("client select reward") 
            console.log(args)
            args.optForSp = false;
            this.replaceActionBar(dojo.string.substitute(_("Selling ${name}: Choose reward or 2 <span class='icon-sp-em'></span>"), {name: args.drink.name}), 
                'revertActionBarAndResetCards')
            this.addReplacementActionButton('labelSpButton', 
                "2 <span class='icon-sp-em'></span>", () => {
                    args.optForSp = true
                    this.confirmButton(
dojo.string.substitute(_("Place label on ${slot} for 2 <span class='icon-sp-em'></span>"), {slot: args.labels[args.labelSlot]}), "sellDrink",
                        this.getAjaxArgsFromArgs(args),
                        'revertActionBarAndResetCards')
                })
            this.addReplacementActionButton('labelRewardsButton', 
                _(args.labels[args.labelSlot]), () => {
                    switch (args.labelSlot) {
                        case 0:
                            this.confirmButton(
dojo.string.substitute(_("Place label on ${slot} for 5 <span class='icon-coin-em'></span>"), {slot: args.labels[args.labelSlot]}), "sellDrink", 
                                this.getAjaxArgsFromArgs(args),
                                'revertActionBarAndResetCards')
                            break;
                        case 1:
                            this.confirmButton(_("Place label and collect Signature Ingredient") , "sellDrink", 
                                this.getAjaxArgsFromArgs(args),
                                'revertActionBarAndResetCards')
                            break;
                        case 2:
                            this.tradeWithTruck(args)
                            break;
                        case 3:
                        case 4:
                        case 5:
                        case 6:
                            this.rewardCard(args)
                            break;
                    }
                    /*
                    this.ajaxcall( "/distilled/distilled/sellDrink.html", {
                        labelSlot: this.clientStateArgs.labelSlot,
                        bottle: this.clientStateArgs.bottle,
                        drinkId: this.clientStateArgs.drink.id,
                        optForSp: false,
                        lock: true
                    }, this, function(result) {})
                    */
                })
            
        },
        chooseLabelRewards(args) {
            console.log("place label")
            console.log(args)
            console.log(args.labels)

            let cb = function (ths, S) {
                console.log("callback" + S)
                args.labelSlot = S
                let loc = args.drink.location
                console.log(args)
                switch (loc) {
                    case 'washback':
                        labelCard = ths.playerWashbackStock[ths.player_id].label.getCards();
                        break;
                    case 'warehouse1':
                        labelCard = ths.playerWarehouse1Stock[ths.player_id].label.getCards();
                        break;
                    case 'warehouse2':
                        labelCard = ths.playerWarehouse2Stock[ths.player_id].label.getCards();
                        break;
                }
                dojo.query('.labelSelect').removeClass('labelSelect')
                ths.disconnectAllMarketCards();

                ths.playerLabelStock[ths.player_id][S].addCard(labelCard[0]);
                ths.rewardOrSp(args)
            }

            this.replaceActionBar(dojo.string.substitute(_("Place label for ${name}: "), {name: args.drink.name}), 'revertActionBarAndResetCards')
            this.getAvailableLabelSlots(this.player_id).reverse().forEach(S => {
                this.addReplacementActionButton('label' + S, dojo.string.substitute(_("${s} or 2 <span class='icon-sp-em'></span>"), {s: _(args.labels[S])}), () => {
                    cb(this, S)
                })
                console.log("connecting label slot")
                this.connectLabelSlot(S, cb)
            })
        },
        chooseBottle(args) {
            console.log("choose bottle");
            console.log(args)

            this.replaceActionBar(dojo.string.substitute(_("Choose a bottle for ${name}: "), {name: _(args.drink.name)}), 'revertActionBarAndResetCards')
            args.bottles.forEach((B) => {
                // TODO connect the cards also
                var icon = ''
                if (B.subtype) {
                    icon = ` <span class='icon-${B.subtype.toLowerCase()}-em'></span>`
                } else {
                    icon = ` <span class='icon-bottle-em'></span>`
                }
                this.addReplacementActionButton(`bottle${B.uid}`, _(B.name) + icon, () => {
                    stock = this.getStockForDrink(args.drink)
                    B.location_idx = 1
                    // TODO add location code here
                    stock.item.addCard(B)
                    if (args.drink.label_count > 0 || 
                        args.drink.recipe_slot == 7) {
                            args['bottle'] = B
                            this.chooseLabelRewards(args);
                    } else {
                        args.labelSlot = -1;
                        args.bottle = B
                        args.optForSp = false
                        this.confirmButton(
                            dojo.string.substitute(_('Sell ${name}'), {name: args.drink.name}), 
                            'sellDrink',
                            this.getAjaxArgsFromArgs(args),
                            'revertActionBarAndResetCards')
                    }
                });
                this.addTooltipForCard(B, document.getElementById(`bottle${B.uid}`))
            })
        },
        setWrap(wraptype) {
            pantries = dojo.query('.pantry2')
            pantries.forEach(p => {
                switch (wraptype) {
                    case 'nowrap': 
                        p.style.overflow = 'hidden';
                        p.parentElement.style.overflow = 'hidden';
                        p.style.setProperty('--wrap', wraptype)
                        break;
                    case 'scroll': 
                        p.style.overflow = 'visible'; 
                        p.parentElement.style.overflow = 'scroll';
                        p.style.setProperty('--wrap', 'nowrap')
                        break;
                    case 'wrap':
                        p.style.setProperty('--wrap', wraptype)
                        break;
                }
            })
            dojo.query('.radioPref').forEach(D => {
                if (D.name != 'wrap_choice')
                    return;
                if (D.value == wraptype) {
                    D.checked = "checked";
                } else {
                    D.checked = false;
                }
            })
        },
        setDash(location) {
            pantry = document.getElementById("floatingPantryWrap")
            if (location == 'top') {
                newParent = document.getElementById("mainShared")
                pantry.classList.remove("pantryWrap")
                pantry.classList.remove("pantryExpanded")
                pantry.classList.add("pantryWrapTop")
                document.getElementById("pantryButtons").classList.remove('invisible')
                newParent.parentElement.insertBefore(pantry, newParent)
            } else if (location == 'floating') {
                newParent = document.getElementById("mainShared")
                pantry.classList.remove("pantryWrapTop")
                pantry.classList.remove("pantryExpanded")
                pantry.classList.add("pantryWrap")
                document.getElementById("pantryButtons").classList.remove('invisible')
                newParent.parentElement.insertBefore(pantry, newParent)
            } else if (location == 'expanded') {
                if (!this.isSpectator) {
                    newSibling = document.getElementById(`display_${this.player_id}_wrapper`)
                    newSibling.parentElement.insertBefore(pantry, newSibling.nextSibling)
                    document.getElementById("pantryButtons").classList.add('invisible')
                    pantry.classList.remove("pantryWrap")
                    pantry.classList.remove("pantryWrapTop")
                    pantry.classList.add("pantryExpanded")
                    this.closeFloaters()
                }
            }
            dojo.query('.radioPref').forEach(D => {
                if (D.name != 'hud_choice')
                    return;
                if (D.value == location) {
                    D.checked = "checked";
                } else {
                    D.checked = false;
                }
            })
        },
        awardAward(SA) {
            sa_wrapper = document.getElementById(`sa-${SA.uid}-overlay`)
            nameDiv = document.createElement("div")
            nameDiv.style.height = "auto"
            nameDiv.classList.add("sa-overlay-award")
            color = this.player_data[SA.player_id].color
            playerName = this.player_data[SA.player_id].name
            nameDiv.style.color = `#${color}`
            nameDiv.style.borderColor = `#${color}`
            nameDiv.innerHTML = `${playerName}`
            nameDiv.style.padding = '0.2vw'
            nameDiv.style.borderRadius = '0.2vw'

            sa_wrapper.appendChild(nameDiv)
        },
        placeDuPrompt(C, power, placeLabelArgs, slotId) {
            console.log("placeDuPrompt")
            console.log("placeDuPrompt", this.decks.duTruck.getCards())
            let args = {
                cardName: C.uid,
                marketName: 'du',
                powers: power,
                slotId: slotId,
                lock: true,
            }

            cost = this.getEffectiveCost(C.uid)


            if (placeLabelArgs) {
                args = placeLabelArgs
                this.replaceActionBar(dojo.string.substitute(_("Place ${name} on: "), {name: _(C.name)}), 'revertActionBarAndResetCards')
            } else {
                console.log(C, C.name, _(C.name))

                var cb = null;
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                if (this.stateName == 'roundStartAction' && this.stateArgs?.args?.powercard == 123) {
                    // trucker
                    console.log("Setting up cb")
                    cb = () => {console.log("trucker cb"); this.connectTrucksWithCb((X) => this.truckerCallback(X), true);}
                }
                this.replaceActionBar(
                    dojo.string.substitute(_('Buy ${name} for ${cost} <span class="icon-coin-em"></span>. Place on: '), 
                    {name: _(C.name), cost: cost}), cb)
            }

            for (let ii = 3; ii > 0; ii--) {
                var divname = 'du' + ii + "_" + this.player_id + '-front';
                var elem = document.getElementById(divname);
                existing = _("Empty")
                if (elem) {
                    existing = this.activeCards[elem.dataset.uid].name
                } 

                var btn = this.addReplacementActionButton(`btn_slot`+ii, dojo.string.substitute(_("Slot ${ii} (${existing})"), {ii: ii, existing: _(existing)}), () => {
                    if (placeLabelArgs) { // Indicates place label stage
                        console.log("placeDuPrompt2", this.decks.duTruck.getCards())
                        if (args.discard) {
                            discard = this.activeCards[args.discard].name
                            args.duSlot = function () { return ii }();
                            this.confirmButton(dojo.string.substitute(_("Discard ${discard} and collect ${name} on slot ${ii}"), {discard: _(discard), name: _(C.name), ii: ii}), 
                                'sellDrink',
                                this.getAjaxArgsFromArgs(args),
                                'revertActionBarAndResetCards')
                        } else {
                            console.log("placeDuPrompt3", this.decks.duTruck.getCards())
                            args.duSlot = function () { return ii }();
                            this.confirmButton(dojo.string.substitute(_("Collect ${name} on slot ${ii}"), {name: _(C.name), ii: ii}), 
                                'sellDrink',
                                this.getAjaxArgsFromArgs(args),
                                'revertActionBarAndResetCards')
                        }
                    } else {
                        args.duSlot = function () { return ii }(),
                        args.debugId = 4;
                        args.stateName = this.stateName;
                        this.confirmButton(dojo.string.substitute(_('Place ${name} on slot ${ii}'), {name: _(C.name), ii: ii}), "buyCard", 
                            args, cb)
                    }
                })
            }
        },
        beginTrade(prompt, tradeOut) {
            this.replaceActionBar(prompt)
            let bm = document.getElementById("basicMarket2");

            titleElement = document.getElementById("pagemaintitletext")
            titleElement.innerHTML = prompt
            basicCards = [];
            for (const child of bm.children) {
                const pattern = /\w+-\w+-(\w+)/
                const match = child.id.match(pattern);
                const card_no = match[1];
                basicCards.push(card_no);
            }
            basicCards.reverse().forEach(card_no => {
                // Check to see if it costs less than the trade in card
                let swap = this.activeCards[tradeOut]

                if (swap.cost >= this.activeCards[card_no].cost && card_no <= 102) {
                    console.log(this.activeCards[card_no].name)
                    cardName = this.activeCards[card_no].name;
                    cardIcon = this.activeCards[card_no].subtype.toLowerCase();
                    if (!cardIcon)
                        cardIcon = this.activeCards[card_no].type.toLowerCase();
                    let cardNameSave = function () {return cardName}()
                    this.addReplacementActionButton(`btn_${card_no}`, _(cardName) + ` <span class='icon-${cardIcon}-em'></span>`, () => {
                        titleElement.innerHTML = ""
                        button = dojo.string.substitute(_("Trade: Discard ${swap} and draw ${cardNameSave}"), {swap: _(swap.name), cardNameSave: _(cardNameSave)})
                        this.confirmButton(button, "trade", {
                            playerId: this.player_id,
                            in: function() {return card_no}(),
                            out: tradeOut,
                            lock: true})
                    })
                }
            })
        },
        // function confirmButton
        confirmButton(buttonText, url, args, cb, title) {
            console.log("Confirm button", this.decks.duTruck.getCards())
            console.log("confirm button cb", cb)
            if (title)
                this.replaceActionBar(title, cb);
            else 
                this.replaceActionBar(_('Confirm Action. This will end your turn.'), cb);

            let fn = function () {
                this.ajaxcall( `/distilled/distilled/${url}.html`, args, this, function(result) {});
                this.revertActionBar();
            }

            dojo.query('.dijitTooltip').removeClass('dijitTooltip')
            dojo.query('.dijitTooltipConnector').removeClass('dijitTooltipConnector')

            return this.addReplacementActionButton("confirmationButton",
                buttonText, 
                fn);
        },
        addReplacementActionButton(id, text, cb) {
            button = document.createElement('a')
            button.href = '#'
            button.classList.add("action-button")
            button.classList.add("bgabutton")
            button.classList.add("bgabutton_blue")
            button.classList.add("replacement-button")
            button.id = id
            button.innerHTML = text;

            console.log("attach callback to button")
            console.log(button)
            dojo.connect(button, 'onclick', this, cb)

            this.actionBarReplacement.insertAdjacentElement("afterbegin", button)
            return button
        },
        replaceActionBar(title, cancelCb, hideCancel) {
            actionBar = document.getElementById("generalactions")
            if (!this.actionBarParent)
                this.actionBarParent = actionBar.parentElement

            let cb = cancelCb ? cancelCb : 'revertActionBar'
            // Always revert first so we're only one prompt deep
            this.revertActionBar()

            clone = actionBar.cloneNode()
            clone.innerHTML = '';
            clone.id = "generalactions_replacement"
            clone.style.display = "inline"

            actionBar.classList.add("invisible")

            titleElement = document.getElementById("pagemaintitletext")
            console.log("should i set old title?")
            console.log(this.oldtitle)
            if (!this.oldtitle) {
                this.oldtitle = titleElement.innerHTML
                console.log(titleElement)
                console.log(titleElement.innerHTML)
                console.log(this.oldtitle)
            }
            if (title)
                titleElement.innerHTML = title;

            this.actionBarReplacement = clone
            if (!hideCancel)
                this.addReplacementActionButton('cancel_button', _('Cancel'), cb)
            //this.actionBarParent.appendChild(clone)
            this.actionBarParent.insertBefore(clone, actionBar)
        },
        revertActionBarAndResetCards() {
            console.log("revert action bar and reset cards")
            this.resetRegionCounters(this.player_id);
            this.revertActionBar();
            this.disconnectAllMarketCards();
            console.log(this.savedPlayerCards)
            this.setupPlayerCards(this.player_id, this.savedPlayerCards)
            this.tradeWithTruckArgs = false
        },
        revertActionBar() {
            if (this.actionBarReplacement) {
                while (this.actionBarReplacement.hasChildNodes()) {
                    dojo.destroy(this.actionBarReplacement.firstChild)
                }
                console.log("Destory replacement!")
                dojo.destroy(this.actionBarReplacement)
                this.actionBarReplacement = null;
            }

            titleElement = document.getElementById("pagemaintitletext")
            if (this.oldtitle) {
                titleElement.innerHTML = this.oldtitle
                this.oldtitle = null;
            }
            actionBar = document.getElementById("generalactions")

            if (this.stateName == 'playerBuyTurn') {
                this.reconnectAllMarketCards();
            }
            dojo.removeClass(actionBar, "invisible");
            this.removeTitleWarning();
        },
        connectCardsForDistill() {
            console.log("connect cards for distill")
            pantryCards = dojo.query('.pantryCard')
            pantryCards.forEach(pc => { 
                let handle = dojo.connect(pc, 'onclick', this, 'onPantryClick');
                this.marketClickHandles[pc.id] = handle
            })
            storeCards = dojo.query(".storeCard")
            storeCards.forEach(pc => {
                card_id = this.activeCards[pc.dataset.uid].card_id
                // Don't connect these
                if (card_id == 19 || card_id == 20)
                    return;

                let handle = dojo.connect(pc, 'onclick', this, 'onPantryClick');
                console.log("adding handle for store cards", pc.id, handle)
                this.marketClickHandles[pc.id] = handle
            })

            this.pantrySelection = {};
            this.playerPantryStock[this.player_id].ing.getCards().forEach( C => {
                this.pantrySelection[C.uid] = false
            });
            this.playerStoreStock[this.player_id].item.getCards().forEach( C => {
                this.pantrySelection[C.uid] = false
            });
            console.log(this.playerPantryStock[this.player_id])
        },
        setupPlayerCards(pid, playerCards) {
            console.log("setup player cards for " + pid)
            console.log(playerCards)
            // remove some cards to ensure idempotency
            // Remove cards over 10,000 which are unknown flavor cards
            removeFlavor = function (C, stock) {
                if (C.uid >= 10000) {
                    stock[pid].ing.removeCard(C);
                }
            }

            this.playerWashbackStock[pid].ing.getCards().forEach(C => {
                removeFlavor(C, this.playerWashbackStock)
            })
            this.playerWarehouse1Stock[pid].ing.getCards().forEach(C => {
                removeFlavor(C, this.playerWarehouse1Stock)
            })
            this.playerWarehouse2Stock[pid].ing.getCards().forEach(C => {
                removeFlavor(C, this.playerWarehouse2Stock)
            })

            playerCards.forEach(X => {
                    if (X.market != 'label')
                        this.activeCards[X.uid] = X;
                    var pantry = document.getElementById("floatingPantry");
                    if (X.market == 'du') {
                        var divbase = 'du' + X.location_idx + "_" + pid

                        // TODO don't place flippy card if it's alreayd there
                        this.placeFlippyCard(pid, divbase, 'du', X.uid);
                    } else if (X.market == 'goal') {
                        if (pid == this.player_id) {
                            this.playerGoalsStock[pid].addCard(X);
                        }
                    } else if (X.location == 'player' || X.location == 'removed' || X.location == 'tradeIn') {
                        if (X.market == 'label') {
                            //this.playerLabelStock[pid][X.location_idx].addCard(X);
                            this.addLabelToBoard(X, pid, X.location_idx)
                        } else { // regular card
                            X.location_idx = 1; // set it to non-zero to make it visible
                            if (X.market == 'ing') {
                                this.playerPantryStock[pid].ing.addCard(X);
                                let element = this.playerPantryStock[pid].ing.getCardElement(X);
                                this.market2Pantry(element, 'pantryCard');
                            } else if (X.market == 'item') {
                                this.playerStoreStock[pid].item.addCard(X);
                                let element = this.playerStoreStock[pid].item.getCardElement(X);
                                //dojo.connect(element, 'onclick', this, 'flippy');
                                this.market2Pantry(element, 'storeCard');
                            }
                        }
                    } else if (X.location == 'washback' || X.location == 'limbo' || X.location == 'selected') {
                        // TODO handle location selected
                        X.location_idx = 1; // set it to non-zero to make it visible
                        if (X.market == 'ing') {
                            this.playerWashbackStock[pid].ing.addCard(X);
                            let element = this.playerWashbackStock[pid].ing.getCardElement(X);
                            this.market2Pantry(element, 'wbCard');
                        } else if (X.market == 'item') {
                            this.playerWashbackStock[pid].item.addCard(X); 
                            element = this.playerWashbackStock[pid].item.getCardElement(X);
                            console.log(element)
                            this.market2Pantry(element, 'wbCard');
                        }
                        if (X.market == 'label') {
                            if (parseInt(X.count) == 0) {
                                console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
                                console.log(X)
                                X.count = -1 * X.uid
                            }
                            //this.playerWashbackStock[pid].label.addCard(X);
                            this.placeLabelOnWashback(X, pid)
                        }
                        // TODO do something to mark the number in the washback
                    } else if (X.location == 'display') {
                        X.location_idx = 1;
                        this.addBottleToDisplay(X, pid)
                    } else if (X.location == 'warehouse1') {
                        X.location_idx = 1;
                        if (X.market == 'ing')
                            this.playerWarehouse1Stock[pid].ing.addCard(X);
                        if (X.market == 'item')
                            this.playerWarehouse1Stock[pid].item.addCard(X);
                        if (X.market == 'label') {
                            this.playerWarehouse1Stock[pid].label.addCard(X);
                            //this.addTinyLabel(X, pid)
                        }
                        if (X.market == 'flavor')  {
                            this.playerWarehouse1Stock[pid].ing.addCard(this.newFlavorBack());
                        }
                    } else if (X.location == 'warehouse2') {
                        X.location_idx = 1;
                        if (X.market == 'ing')
                            this.playerWarehouse2Stock[pid].ing.addCard(X);
                        if (X.market == 'item')
                            this.playerWarehouse2Stock[pid].item.addCard(X);
                        if (X.market == 'label') {
                            this.playerWarehouse2Stock[pid].label.addCard(X);
                            //this.addTinyLabel(X, pid)
                        }
                        if (X.market == 'flavor') 
                            this.playerWarehouse2Stock[pid].ing.addCard(this.newFlavorBack());
                    } else if (X.location == 'signature') {
                        // don't place flippy card if it's already there
                        this.placeFlippyCard(pid, 'signature_' + pid, 'ing', X.uid)

                    } else if (X.location == 'player') {
                    }
                })



        },
        setMoney(player_id, value) {
            this['money_counter_'+player_id].setValue(value)
            if (player_id == this.player_id) {
                this.floating_money_counter.setValue(value)
            }
        },
        incMoney(player_id, inc) {
            this['money_counter_' + player_id].incValue(inc);
            if (player_id == this.player_id) {
                this.floating_money_counter.incValue(inc);
            }
        },
        getEffectiveRecipeCost(slot) {
            var startingCost = 0;
            switch(this.recipeFlight[slot].cube) {
                case 'bronze': startingCost = 2; break;
                case 'silver': startingCost = 4; break;
                case 'gold': startingCost = 6; break;
            }

            var powerNodes = dojo.query(".activePower");
            powerNodes.forEach(e => {
                let powerUid = e.dataset.uid;
                if (powerUid == 0) // this means it's your distiller
                    card_id = this.distiller_id
                else
                    card_id = this.activeCards[e.dataset.uid].card_id
                switch (card_id) {
                    case 119: 
                        startingCost -= 2;
                        break;
                }
            })
            return startingCost;
        },
        getEffectiveCost(uid) {
            var powerNodes = dojo.query(".activePower");
            let marketCard = this.activeCards[uid] 
            var startingCost = marketCard.cost;
            powerNodes.forEach(e => {
                let powerUid = e.dataset.uid;
                if (powerUid == 0) // this means it's your distiller
                    card_id = this.distiller_id
                else
                    card_id = this.activeCards[e.dataset.uid].card_id
                switch (card_id) {
                    case 109: // Large Storage
                        if (marketCard.type == 'BARREL' || marketCard.type == 'BOTTLE') {
                            startingCost -= 1;
                        }
                        break;
                    case 114:  // Malt Mill
                        if (marketCard.type == 'SUGAR' || marketCard.type == 'YEAST' || marketCard.type == 'WATER') {
                            startingCost -= 2;
                        }
                        break;
                    case 115: // Glassworks
                        if (marketCard.type == 'BOTTLE') 
                            startingCost -= 2;
                        break;
                    case 119: // 
                        // This affects recipe cubes, not market cards
                        break;
                    case 122:  // Glassblower
                        if (marketCard.type == 'BOTTLE') 
                            startingCost -= 1;
                        break;
                    case 128: // Architect
                        if (marketCard.type == 'DU')
                            startingCost -= 2;
                        break;
                    case 131:  // Cooper
                        if (marketCard.type == 'BARREL') 
                            startingCost -= 2;
                        break;
                    case 0: // Ajani
                        if (marketCard.type == 'BOTTLE') {
                            startingCost -= 1;
                        }
                        break;
                    case 6: // Etienne
                        if (marketCard.type == 'DU') 
                            startingCost -= 2;
                        break;
                    case 12: // Pilar
                        if (marketCard.type == 'BARREL')
                            startingCost -= 2;
                        break;
                    case 14: // Mother Mary
                        if (marketCard.market == 'bm')
                            startingCost -= 1;
                        break;
                    case 18: // Jeong
                        if (marketCard.type == 'SUGAR' || marketCard.type == 'WATER' || marketCard.type == 'YEAST') {
                            startingCost -= 2;
                        }
                        break;
                    
                }
            });

            return startingCost;
        },
        showFirstPlayer(player_id) {
            dojo.query('.firstPlayer').addClass('dhidden')
            try {
                dojo.removeClass('first_player_' + player_id, 'dhidden')
            } catch (err) {
                this.showMessage("Unable to set first player to " + player_id, "error")
            }
        },
        updateLastRoundBanner(enabled) {
            if (enabled) {
              $('page-title').insertAdjacentHTML('beforeend', `<div id="last-round">${_('This is the last round!')}</div>`);
            }
        },
        showTurn: function(turn) {
            //console.log("calling showturn")
            dojo.query('.turnHighlight').addClass('invisible')
            //console.log('.turnHighlight' + turn)
            //console.log(dojo.query('.turnHighlight' + turn))
            dojo.query('.turnHighlight' + turn).removeClass('invisible')
            this.turn = turn;
            if (turn >= 7) {
                try {
                    this.updateLastRoundBanner(true)
                } catch (e) {
                    console.error('Exception thrown', e.stack);
                }
            }

        },
        togglePowerButton: function(elem, stateName) {
            // updates button, adds check mark, and returns the new state
            warning = document.getElementById("titleWarning")
            if (dojo.hasClass(elem, 'activePower')) {
                // Removing activePower
                //console.log(elem.innerHtml)
                elem.innerHTML = elem.innerHTML.substring(0, elem.innerHTML.length - 2)
                dojo.removeClass(elem, 'activePower');
                if (this.stateName == 'playerBuyTurnReveal' || stateName == 'playerBuyTurnReveal') {
                    buyButton = document.getElementById("buyButton")
                    uid = buyButton.dataset.uid
                    cost = this.getEffectiveCost(uid) 
                    if (cost < 0) {
                        cost = 0
                        if (warning)
                            dojo.removeClass(warning, "invisible")
                    } else {
                        if (warning)
                            dojo.addClass(warning, "invisible")
                    }

                    title = document.getElementById("pagemaintitletext")

                    card = this.activeCards[uid]
                    let money = this['money_counter_' + this.player_id].getValue();
                    console.log("setting cost here?")

                    buyButton.innerHTML = dojo.string.substitute(_("Buy ${name} for ${cost} <span class='icon-coin-em'></span>"), {name: _(card.name), cost: cost});
                    if (cost > money) {
                        dojo.addClass(buyButton, "disabled")
                    } else {
                        dojo.removeClass(buyButton, "disabled")
                    }
                } else {
                    this.reconnectAllMarketCards();
                }
                return false;
            } else {
                // Adding Active Power
                elem.innerHTML += ' \u2713' 
                dojo.addClass(elem, 'activePower');
                if (this.stateName == 'playerBuyTurnReveal' || stateName == 'playerBuyTurnReveal') {
                    buyButton = document.getElementById("buyButton")
                    uid = buyButton.dataset.uid
                    cost = this.getEffectiveCost(uid) 
                    if (cost < 0) {
                        cost = 0
                        if (warning)
                            dojo.removeClass(warning, "invisible")
                    } else {
                        if (warning)
                            dojo.addClass(warning, "invisible")
                    }

                    card = this.activeCards[uid]
                    let money = this['money_counter_' + this.player_id].getValue();
                    buyButton.innerHTML = dojo.string.substitute(_("Buy ${name} for ${cost} <span class='icon-coin-em'></span>"), {name: _(card.name), cost: cost});
                    if (cost > money) {
                        dojo.addClass(buyButton, "disabled")
                    } else {
                        dojo.removeClass(buyButton, "disabled")
                    }
                } else {
                    this.reconnectAllMarketCards();
                }
                return true;
            }
        },
        getCardSize: function(cardType, card_id) {
            switch (cardType) {
                case 'ing':
                case 'item':
                case 'du':
                    break;
                case 'scaled':
                    if (this.isMobileVersion())  {
                        width = 13.3
                        height = 20.5
                    } else {
                        width = 10
                        height = 15.4
                    }

                    return {
                        x: (card_id % 14) * width,
                        y: Math.floor(card_id / 14) * height,
                    }
                    break;
                case 'distiller':
                    if (this.isMobileVersion())  {
                        width = 13.3
                        height = 20.5
                    } else {
                        width = 10
                        height = 15.4
                    }

                    return {
                        x: (card_id % 9) * width,
                        y: Math.floor(card_id / 9) * height,
                    }
                    break;
                case 'label':
                    break;
            }
        },
        isMobileVersion: function() {
            /*
            var cl = document.getElementById('ebd-body').classList;
            if (cl.contains('mobile_version')) {
                return true;
            }*/
            return false;
        },
        removeFlippyCard: function(player_id, divname) {
            divname.innerHTML = ""
        },
        placeFlippyCard: function(player_id, divname, type, card_id) {
            card_id = parseInt(card_id)
            dojo.place(
                this.format_block('jstpl_distiller', {
                   PID:player_id,
                    DIVBASE: divname,
                }),
                divname, 'last');
            let card = document.getElementById(divname + '_card')
            let front = document.getElementById(divname + "-front")
            let back = document.getElementById(divname + "-back")

            if (type == 'distiller') {
                let xBack = (card_id % 9);
                let yBack = Math.floor(card_id / 9);

                // TODO handle resize
                front.style.backgroundPositionX = `calc(-${xBack}*var(--width))`;
                front.style.backgroundPositionY = `calc(-${yBack}*var(--height))`;

                xBack = ((card_id+1) % 9);
                yBack = Math.floor((card_id+1) / 9);
                back.style.backgroundPositionX = `calc(-${xBack}*var(--width))`;
                back.style.backgroundPositionY = `calc(-${yBack}*var(--height))`;

                dojo.addClass(front, 'distillerCard')
                dojo.addClass(back, 'distillerCard')

                front.dataset.uid = card_id;
                back.dataset.uid = card_id+1;
                card.dataset.uid = card_id;

                this.addTooltipForDistiller(card_id+1, card)
            } else if (type == 'ing' || type == 'du') {
                var idx = this.activeCards[card_id].card_id;
                const xBack = (idx %  14);
                const yBack = Math.floor(idx / 14);
                front.style.backgroundPositionX = `calc(-${xBack}*var(--width))`;
                front.style.backgroundPositionY = `calc(-${yBack}*var(--height))`;
                back.style.backgroundPositionX = `calc(-${xBack}*var(--width))`;
                back.style.backgroundPositionY = `calc(-${yBack}*var(--height))`;

                dojo.addClass(front, 'scaledMarketCard')
                dojo.addClass(back, 'scaledMarketCard')

                front.dataset.uid = card_id;
                back.dataset.uid = card_id;
                
                this.addTooltipForCard(this.activeCards[card_id], card)
            }

            dojo.connect(card, 'onclick', this, () => {
                console.log("FLIP!")
                side = card.dataset.side
                if (side == "front")
                    card.dataset.side = 'back';
                else
                    card.dataset.side = 'front'
            })

            return card;
        },
        showSpiritModal: function(spiritUid) {
            if (!this.contentNode) {
                this.showMessage(`Please report this error as a bug in showSpiritModal`, "error");
                return;
            }
            console.log(spiritUid)
            var contents = this.spiritContents[spiritUid];
            console.log(contents)

            var dummy = this.ingCardsManager.getCardElement({uid: 0})
            if (dummy == null) 
                dummy = this.ingCardsManager.createCardElement(this.activeCards[0])
            console.log(dummy)
            
            contents.forEach(C => {
                var main = dummy.cloneNode(true)
                main.id = null;
                var div = main.firstElementChild.firstElementChild
                div.id = null;
                console.log(div)
                const xBack = (C %  14) * 122;
                const yBack = Math.floor(C / 14) * 190;
                div.style.backgroundPositionX = "-" + xBack + "px";
                div.style.backgroundPositionY = "-" + yBack + "px";
                console.log(div)

                if (C == 10000) { // unknown flavor
                    div.style.backgroundPositionX = "0";
                    div.style.backgroundPositionY = "0";
                    div.classList.add("flavorCardBack")
                    div.classList.remove("dcard")
                }

                this.contentNode.appendChild(main)
            })
            this.modal.show()
        },
        showDeckModal: function(srcName) {
            if (!this.contentNode) {
                return;
            }
            console.log("show deck modal")
            console.log(arguments.callee.caller.name)
            let cards = [];
            let truck = null;
            let market = null;
            if (srcName == 'item') {
                truck = this.decks.itemTruck;
                this.modal.title = _("Item Truck")
                market = 'item'
            } else if (srcName == 'ing') {
                truck = this.decks.ingTruck
                this.modal.title = _("Ingredients Truck")
                market = 'ing'
            } else if (srcName == 'du') {
                truck = this.decks.duTruck
                this.modal.title = _("Distillery Upgrades Truck")
                market = 'du'
            }
            cards = truck.getCards()

            cards.forEach(c => {
                // Don't show fake cards
                if (c.uid.toString().endsWith("Truck")) {
                    return
                }
                clone = truck.getCardElement(c).cloneNode(true);
                if (clone) {
                    clone.dataset["side"] = "front";
                    elem = document.getElementById(clone.id + "-front")
                    clone.id += "-clone"
                    this.contentNode.appendChild(clone)
                    this.addTooltipForCard(c, clone)
                    if (this.stateName == 'roundStartAction' && this.stateArgs?.args?.powercard == 123) {
                        let cost = this.getEffectiveCost(c.uid)
                        if (!this.isSpectator) {
                            let money = this['money_counter_' + this.player_id].getValue();
                            if (cost <= money) {
                                dojo.connect(clone, 'onclick', this, () => {
                                        if (c.market == 'du') {
                                            this.placeDuPrompt(c, this.stateArgs?.args.options[0].triggerUid)
                                        }
                                        else {
                                            // confirmButton(buttonText, url, args, cb, title) {
                                            console.log("Adding this confirm button")
                                            this.confirmButton(
                                                dojo.string.substitute(_("Buy ${name} for ${cost} <span class='icon-coin-em'></span>"), {name: _(c.name), cost:cost}),
                                                "buyCard", {
                                                    cardName: c.uid,
                                                    marketName: market,
                                                    slotId: 0,
                                                    powers: this.stateArgs?.args.options[0].triggerUid,
                                                    debugId: 5, phase: this.stateName,
                                                    lock: true,
                                                }, () => {
                                                    console.log("cancel trucker 2");
                                                    this.connectTrucksWithCb((X) => this.truckerCallback(X), null, true);
                                                }
                                            )
                                        }
                                        this.modal.hide()
                                    })
                            } else {
                                dojo.addClass(clone, 'disabledMarket')
                            }
                        }
                    } 
                    if (this.stateName == 'sell' && this.tradeWithTruckArgs) {
                        console.log("TRADE WITH TRUCK")
                        console.log(this.tradeWithTruckArgs)
                        console.log(`trade with truck card is ${this.activeCards[this.tradeWithTruckArgs.discard]}`)
                        console.log(c)
                        dojo.connect(clone, 'onclick', this, () => {
                            console.log(this.tradeWithTruckArgs)
                            console.log(c)
                            this.tradeWithTruckArgs.tradeTruck = market
                            this.tradeWithTruck_SelectCard_onSelect(this.tradeWithTruckArgs, c)
                            this.modal.hide()
                        })
                    }
                } 
            })
            this.modal.show()
        },
        getAvailableLabelSlots: function(player_id) {
            let slots = []
            for ( var ii = 0; ii < 7; ii++) {
                if (this.playerLabelStock[player_id][ii].getCards().length == 0) {
                    slots.push(ii);
                }
            }
            return slots
        },
        newFlavorBack: function() {
            return {uid: this.nextFlavor++, location_idx: 0, name: _("Unknown Flavor"), flavor: true, type: "FLAVOR"}
        },
        makeComboStock: function(divbase, player_id, hideWhenEmpty=false) {
            let topElement = document.getElementById(divbase + player_id);
            let ret = {
                coin: 0,
                sp: 0,
                cards: [],
                card_count: 0,
                player_id: player_id,
                divbase: divbase,
                flavors: 0,
            }

            // if there is a corresponding location for icons, put it there.
            let iconSurface = document.getElementById(divbase + player_id + '_canvas');
            if (iconSurface) {
                ret.canvas = dojo.place(this.format_block('jstpl_icon_canvas', {
                    PID:player_id,
                    DIVBASE: divbase,
                }), divbase + player_id + "_canvas", 'only');

                var counter = new ebg.counter();
                counter.create("coin_counter_"+divbase+player_id);
                counter.setValue(0);
                ret.coin_counter = counter;

                var counter2 = new ebg.counter();
                counter2.create("sp_counter_"+divbase+player_id);
                counter2.setValue(0);
                ret.sp_counter = counter2;

                var counter3 = new ebg.counter();
                counter3.create("card_counter_"+divbase+player_id);
                counter3.setValue(0);
                ret.card_counter = counter3;
            }

            let addCardCallback = (card) => {
                if (hideWhenEmpty) {
                    console.log("Unhide reveal button")
                    dojo.removeClass('floatingRevealedButton', 'invisible');
                    if (this.isExpanded())
                        dojo.removeClass(`reveal_wrapper_${this.player_id}`, 'invisible');
                }

                // TODO race
                if (ret.cards.filter(X => (X == card.uid)).length != 0) {
                    return;
                }
                // add card to collection
                ret.cards.push(card.uid)

                // TODO manager.getCardStock, check if it's this
                if ('sale' in card) {
                    if (card.sale != -1)
                        ret.coin += card.sale
                }
                if ('value' in card) {
                    ret.coin += card.value
                }
                if ('sp' in card) {
                    if (card.sp != -1)
                        ret.sp += card.sp
                }
                if ('type' in card) {
                    ret.addToken(card);
                }
                if ('label' in card) {
                    ret.addLabel(card)
                }

                ret.card_count += 1;
                
                if (ret.coin_counter)
                    ret.coin_counter.setValue(ret.coin);
                if (ret.sp_counter)
                    ret.sp_counter.setValue(ret.sp);
                if (ret.card_counter)
                    ret.card_counter.setValue(ret.card_count);
            }
            let removeCardCallback = (card) => {
                if (ret.cards.filter(X => (X == card.uid)).length == 0) {
                    return;
                }

                if ('sale' in card) {
                    if (card.sale != -1)
                        ret.coin -= card.sale
                }
                if ('value' in card) {
                    ret.coin -= card.value
                }
                if ('sp' in card) {
                    if (card.sp != -1)
                        ret.sp -= card.sp
                }
                if ('type' in card) {
                    console.log("trying to remove token")
                    ret.removeToken(card);
                }
                if ('label' in card) {
                    ret.removeLabel();
                }

                ret.card_count -= 1;

                if (ret.card_count == 0 && hideWhenEmpty) {
                    dojo.addClass('floatingRevealedButton', 'invisible');
                    if (this.isExpanded())
                        dojo.addClass(`reveal_wrapper_${this.player_id}`, 'invisible');
                    this.showFloatingPantry();
                }
                
                if (ret.coin_counter)
                    ret.coin_counter.setValue(ret.coin);
                if (ret.sp_counter)
                    ret.sp_counter.setValue(ret.sp);
                if (ret.card_counter)
                    ret.card_counter.setValue(ret.card_count);

                // Remove the cards from this thing
                ret.cards.splice(ret.cards.indexOf(card.uid), 1)
            }

            let elem = document.getElementById(divbase + player_id + '_label')
            if (elem) {
                ret.label = new LineStock(
                        this.labelCardsManager,
                        elem,
                        {direction: "column", wrap: "nowrap", sort: sortFunction});
                ret.label.addCardCallback = addCardCallback;
                ret.label.removeCardCallback = removeCardCallback;
            }

            ret.item = new LineStock(
                    this.itemCardsManager,
                    document.getElementById(divbase + player_id),
                    {direction: "row", wrap: "nowrap", center: false, sort: sortFunction}
            );
            ret.item.addCardCallback = addCardCallback;
            ret.item.removeCardCallback = removeCardCallback;

            ret.ing = new LineStock(
                this.ingCardsManager,
                document.getElementById(divbase + player_id),
                {direction: 'row', wrap: 'nowrap', center: false, sort: this.sortFunction}
            );
            ret.ing.addCardCallback = addCardCallback;
            ret.ing.removeCardCallback = removeCardCallback;

            ret.du = new LineStock(
                this.duCardsManager,
                document.getElementById(divbase + player_id),
                {direction: 'row', wrap: 'nowrap', center: false, sort: this.sortFunction}
            );
            ret.du.addCardCallback = addCardCallback;
            ret.du.removeCardCallback = removeCardCallback;



            ret.addLabel = (card) => {
                // Just plop a label on there and move on
                size = this.cardSize(card);
                outer_div = document.getElementById(`canvas_label_${divbase}${player_id}`)
                dojo.removeClass(outer_div, "invisible")
                // TODO handle warehouse without label
                div = document.getElementById(`canvas_label_${divbase}${player_id}_inner`)
                div.style.width = `var(--width)`
                div.style.flexBasis = `var(--width)`
                div.style.height = `var(--height)`
                div.classList.remove("fade")
                div.innerHTML = ""; // remove the red X if there is one

                label = card.label
                if (card.location != 'flight' && card.signature == true) {
                    label += 18;
                }
                const xBack = (label %  6);
                const yBack = Math.floor(label / 6);
                div.style.backgroundPositionY = `calc(-${yBack} * var(--height))`
                div.style.backgroundPositionX = `calc(-${xBack} * var(--width))`

                if (card.count < 0) {
                    div.classList.add('fade');
                    if (div.children.length == 0)
                        dojo.place(this.format_block('jstpl_label_x', {}), div, 'last');
                }
            }
            ret.removeLabel = (card) => {
                // Turn this into the label image
                dojo.addClass(`canvas_label_${divbase}${player_id}`, "invisible");
            }
            ret.addToken = (card) => {
                let type = card.type;
                if (card.subtype) 
                    type = card.subtype;

                if (ret.canvas) {
                    // Instead of destroying and recreating, consider animating
                    blockHTML = this.format_block('jstpl_icon', {
                       PID:player_id,
                        UID: card.uid,
                        TYPE: type.toLowerCase(),
                        TOOLTIP: _(card.name),
                        DIVBASE: divbase,
                    })
                    block = document.createElement("div")
                    block.innerHTML = blockHTML
                    block = block.firstChild

                    if (ret.canvas.children.length == 0) {
                        ret.canvas.appendChild(block)
                    } else {
                        placed = false;
                        for (var ii = 0; ii < ret.canvas.children.length; ii++) {
                            checkToken = ret.canvas.children[ii]
                            checkUid = checkToken.dataset.uid
                            if (!checkUid)
                                continue;
                            checkCard = this.activeCards[checkUid]
                            if (!checkCard)
                                continue;
                            sortResult = this.sortFunction(card, checkCard)
                            if (sortResult < 0 || sortResult == 0) {
                                ret.canvas.insertBefore(block, checkToken)
                                placed = true
                                break;
                            }
                        }
                        if (!placed) {
                            ret.canvas.appendChild(block)
                        }
                    }
                    let elem = document.getElementById("icon_" + player_id + "_" + divbase + card.uid)
                    this.addTooltipForCard(card, elem)
                }
            }
            ret.removeToken = (card) => {
                console.log("removingTokenInFunction")
                let elem = document.getElementById("icon_" + player_id + "_" + divbase + card.uid)
                console.log("DESTROY")
                console.log(elem)
                dojo.destroy(elem)
            }

            return ret;

       },
       animateRestartDistill: async function(notif) {
            
       },
 

       animateAddAlcohol: async function(deck, alcohols, player_id) {
            dojo.query(".pantry_inner_wrapper").style("overflow", "visible")
            for (i = 0; i < alcohols.length; i++) {
                await new Promise(r => setTimeout(r, 50));
                console.log("adding 1 alcohol");
                alcohols[i].location_idx = 1;
                await this.ingVoidStock.addCard(alcohols[i], null, {remove: false});
                /*
                let elem = this.ingVoidStock.getCardElement(alcohols[i]);
                elem.style.left = 0;
                elem.style.top = 0;*/
                await deck.addCard(alcohols[i]);
                deck.flipCard(alcohols[i]);
            }

            let wrapValue = localStorage.getItem(`${this.game_name}_wrap`);
            if (wrapValue)
                this.setWrap(wrapValue)
       },
       animateTrade: async function(trade, pid) {
            console.log("animateTrade")

            let card_in = this.activeCards[trade.in];
            let card_out = this.activeCards[trade.out];
            console.log(card_in)
            console.log(card_out)

            if (card_out.type == "BARREL" || card_out.type == "BOTTLE") {
                await this.itemVoidStock.addCard(card_out)
            } else {
                await this.ingVoidStock.addCard(card_out)
                // This is to make sure it comes out of the canvas
                this.playerPantryStock[pid].ing.removeCard(card_out);
            }

            let tradeCard = {...card_in}
            tradeCard.uid = this.tradeCardUid;
            tradeCard.location_idx = 1;
            console.log(tradeCard);

            // TODO is this horrible?
            this.activeCards[tradeCard.uid] = tradeCard;

            // TODO animate getting something from basic
            await this.playerPantryStock[pid].ing.addCard(tradeCard);
            let element = this.playerPantryStock[pid].ing.getCardElement(tradeCard);
            console.log(element);
            console.log("market2pantry")
            this.market2Pantry(element, 'pantryCard');

            console.log("connecting trade card in animate")
            handle = dojo.connect(element, 'onclick', this, 'onPantryClick');
            this.marketClickHandles[element.id] = handle;

            // TODO is this a bad race?
            this.pantrySelection[tradeCard.uid] = false;
            this.pantrySelection[trade.out] = false;
            this.collapseMarket();
       },
       animateDistill: async function(wbCards) {
       },
       animateDistillRemoval: async function(notif) {
        try {
            let wbCards = notif.args.wb_cards;

            // Count the alcohols
            // TODO animate the alcohols being added
            // Now that we've called ajax, lets do some animations

            let player_id = notif.args.player_id;
            if (this.player_id == notif.args.player_id) {
                dojo.removeClass('washback_' + this.player_id + '_deck', 'invisible');
                var tmp = document.getElementById('washback_' + this.player_id + '_deck');
                tmp.style.overflow = 'visible';
            }

            deck = this.decks["wb" + player_id];
            let alcohols = [];

            var cards = wbCards.map(X => { var c = this.activeCards[X]; c.location_idx = 1; return c;});
            var filteredCards = cards.filter((C) => (C.card_id != 0))

            // add the removed cards for the sake of animation
            cards.push(this.activeCards[notif.args.card1_id]);
            if (notif.args.card2_id)
                cards.push(this.activeCards[notif.args.card2_id]);

            console.log(filteredCards)
            console.log("add cards to washback deck")
            // get current washback cards
            existingWbCards = deck.getCards();
            existingUids = existingWbCards.map((X) => X.uid)
            console.log(existingWbCards)
            console.log(existingUids)
            // Turns out this has already happened in the moveToWashback step
            // TODO remove this
            await deck.addCards(filteredCards)


            if (!notif.args.skip_add_alcohol) {
                for (var i = 0; i < cards.length; i++) {
                    if (cards[i].type == "ALCOHOL") {
                        alcohols.push(cards[i]);
                    }
                }
                if (notif.args.card1_name == 'Alcohol') 
                    alcohols.push(this.activeCards[notif.args.card1_id]);
                if (notif.args.card2_id && notif.args.card2_name == 'Alcohol') 
                    alcohols.push(this.activeCards[notif.args.card2_id]);

                alcohols = alcohols.filter(X => !(existingUids.includes(X.uid))) 
                console.log(alcohols);
                console.log("add alcohol to washback deck")
                await this.animateAddAlcohol(deck, alcohols, notif.args.player_id)
            }
            parent = document.getElementById("game_play_area");
            tempPantry = document.createElement("div")
            tempPantry.id = "tempPantry" + this.player_id
            dojo.addClass(tempPantry, "tempPantry")

            console.log(parent)
            console.log(tempPantry)
            
            if (this.player_id == notif.args.player_id) {
                parent.appendChild(tempPantry);
                let pantryelem = document.getElementById("tempPantry" + this.player_id)
                console.log(pantryelem)

                tmpStock = new CardStock(
                    this.ingCardsManager,
                    pantryelem
                );
            }

            let card1 = this.activeCards[notif.args.card1_id]
            card1.location_idx = 1
            card1.location = 'player'
            if (this.player_id == notif.args.player_id) {
                let prom = tmpStock.addCard(
                    this.activeCards[notif.args.card1_id], 
                );
                await prom
            }

            // Update pantry deck
            //this.decks[notif.args.player_id].setCardNumber(this.decks[notif.args.player_id].getCardNumber() + 1);
            let elem = this.ingCardsManager.getCardElement(this.activeCards[notif.args.card1_id])
            if (!elem) {
                this.showMessage(`Please report this error as a bug in animateDistillRemoval: Card 1 not found. card1_id: ${notif.args.card1_id}`, "error");
            } else {
                this.market2Pantry(elem, 'pantryCard');
                card1.location_idx = 1;
            }

            if (notif.args.card2_id) {
                let card2 = this.activeCards[notif.args.card2_id]
                card2.location_idx = 1;
                card2.location = 'player'
                //deck.setCardNumber(deck.getCardNumber() - 1, card2)
                if (this.player_id == notif.args.player_id) {
                    prom =  tmpStock.addCard(
                        this.activeCards[notif.args.card2_id]
                    );
                    await prom
                }

                //this.decks[notif.args.player_id].setCardNumber(this.decks[notif.args.player_id].getCardNumber() + 1);
                elem = this.ingCardsManager.getCardElement(card2)
                if (!elem) {
                    this.showMessage(`Please report this error as a bug in animateDistillRemoval: Card 2 not found. card2_id: ${notif.args.card2_id}`, "error");
                } else {
                    this.market2Pantry(elem, 'pantryCard');
                }
                card2.location_idx = 1;
            }

            // Add cards to washback stock
            let wbCardObjects = notif.args.wb_cards.map(X => this.activeCards[X])
            console.log(wbCardObjects);
            wbCardObjects.forEach(C => {
                C.location_idx = 1;
                this.activeCards[C.uid] = C;
                // Adding ingredients card to washback
                console.log("setting zIndex to 0")
                let element = this.playerWashbackStock[player_id].ing.getCardElement(C);
                element.style.zIndex = 0;
                this.playerWashbackStock[player_id].ing.addCard(C);
                this.playerWashbackStock[player_id].ing.setCardVisible(C, true);
                this.market2Pantry(element, 'pantryCard');
            });
            await new Promise(r => setTimeout(r, 1000));
            console.log("hide deck")
            dojo.addClass('washback_' + player_id + '_deck', 'invisible');


            if (notif.args.card2_id) {
                this.playerPantryStock[player_id].ing.addCard(
                    this.activeCards[notif.args.card2_id]
                );
            }
            this.playerPantryStock[player_id].ing.addCard(
                this.activeCards[notif.args.card1_id], 
            );
            dojo.destroy(tempPantry);
        }
        catch (e) {
            console.log(e)
        }
        this.notifqueue.setSynchronousDuration(0);
       },
       flippy: function(evt) {
            console.log(evt)
            const pattern = /\w+-\w+-(\w*)/
            const match = evt.currentTarget.id.match(pattern);
            const card_no = match[1];
            console.log(card_no);
            this.itemCardsManager.flipCard({uid: card_no});
       },
       capitalize: function(s) {
            return s.charAt(0).toUpperCase() + s.slice(1);
        },
        showFloatingWashback: function(evt) {
            console.log("show floating washback")
            this.showFloater("washback");
        },
        showFloatingPantry: function(evt) {
            this.showFloater("pantry");
        },
        showFloatingStoreRoom: function(evt) {
            this.showFloater("storeroom");
        },
        showFloatingGoals: function(evt) {
            this.showFloater("distillerygoals");
        },
        showFloatingWarehouse1: function(evt) {
            this.showFloater("warehouse1");
        },
        showFloatingWarehouse2: function(evt) {
            this.showFloater("warehouse2");
        },
        showFloatingReveal: function(evt) {
            this.showFloater("reveal");
        },
        closeFloaters: function(evt) {
            this.showFloater("nothing!!!!!")
        },
        showFloater: function(name) {
            console.log("show floater " + name)
            let floaters = dojo.query('.floatingPantry');
            floaters.forEach(div => {
                if (div.id.toLowerCase().startsWith(name) && div.id.endsWith(this.player_id)) {
                    dojo.removeClass(div, "invisible")
                } else {
                    dojo.addClass(div, "invisible")
                }
            });

            // If it's expanded, allow yourself to see the reveal
            if (this.isExpanded()) {
                console.log("checking expanded")
                if (this.playerRevealStock[this.player_id].ing.getCards().length || 
                    this.playerRevealStock[this.player_id].item.getCards().length || 
                    this.playerRevealStock[this.player_id].du.getCards().length) {
                        console.log("remove invisible from class")
                        dojo.removeClass(`reveal_wrapper_${this.player_id}`, "invisible")
                }
            }

            let buttons = dojo.query(".pantryButton");
            buttons.forEach(div => {
                if (div.id.toLowerCase() == 'floating' + name + "button") {
                    dojo.addClass(div, "bgabutton_green")
                } else {
                    dojo.removeClass(div, "bgabutton_green")
                }
            });
        },
        newDeckOnDiv: function(divname, manager, name, fcg, counter) {
            let div = document.getElementById(divname);
            if (!this.decks[name]) {
                //console.log("new deck")
                this.decks[name] = new Deck(manager, div, {
                    counter: (counter == false) ? null : {
                        position: 'center',
                        extraClasses: 'text-shadow deckCounter',
                        selectable: false,
                    },
                    cardNumber: 0,
                    autoUpdateCardNumber: true,
                    autoRemovePreviousCards: false,
                    fakeCardGenerator: fcg ?? ((uid) => { return {uid: uid, location_idx: 0, name: name, count: 4}}),
                })
            } else {
                console.log('removing class')
                dojo.removeClass(divname, "invisible")
            }
            return this.decks[name];
        },
        nextPlayerVisible: function() {
            console.log("nextPlayerVisible")
            let pids = this.player_list.map(X => parseInt(X));
            let idx = pids.indexOf(this.visiblePlayer)
            console.log(pids)
            console.log(idx)
            idx += 1;
            if (idx == pids.length) {
                idx = 0;
            }
            this.setVisiblePlayer(pids[idx]);
        },
        prevPlayerVisible: function() {
            console.log("prevPlayerVisbile")
            let pids = this.gamedatas.playerorder;
            let idx = pids.indexOf(this.visiblePlayer)
            console.log(pids)
            console.log(idx)
            idx -= 1;
            if (idx < 0) {
                idx = pids.length - 1;
            }
            this.setVisiblePlayer(pids[idx]);
        },
        setVisiblePlayer: function(new_player_id) {
            console.log("set visible player to " + new_player_id)
            for( var pid in this.playerSections ) {
                let section = this.playerSections[pid];
                if (pid == new_player_id) {
                    dojo.removeClass(section, "invisible");
                } else {
                    dojo.addClass(section, "invisible");
                }
            }
            this.visiblePlayer = new_player_id;
        },
        collapseMarket: function(evt) {
            // Decided not to do this
            return;
            dojo.addClass('market', 'invisible')
            dojo.addClass('collapseMarketButton', 'invisible')
            dojo.removeClass('expandMarketButton', 'invisible')
        },
        expandMarket: function(evt) {
            // Decided not to do this
            return
            dojo.removeClass('market', 'invisible')
            dojo.removeClass('collapseMarketButton', 'invisible')
            dojo.addClass('expandMarketButton', 'invisible')
        },
        onGoalsCardClick: function(evt) {
            dojo.stopEvent(evt);
            console.log("onGoalsCardClick")
            const pattern = /\w+-\w+-(\w*)/
            const match = evt.currentTarget.id.match(pattern);
            const card_no = match[1];
            console.log("card_no " + card_no);
            this.selectedGoal = card_no;
            
            // remove all selected goals
            dojo.query('.goalsCard').removeClass('selected')
            dojo.addClass(evt.currentTarget, "selected")

            dojo.removeClass('discard_goal_button', 'disabled');
        },
        onPantryClick: function(evt) {
            dojo.stopEvent(evt);
            console.log("onPantryClick");
            this.onPantryClickElem(evt.currentTarget)
        },
        onPantryClickElem: function(elem) {
            console.log(elem.id)
            console.log(elem)
            const pattern = /\w+-\w+-(\w*)/
            const match = elem.id.match(pattern);

            const card_no = match[1];

            // TODO check to see if we're in the distill phase before we go selecting things

            this.pantrySelection[card_no] = !this.pantrySelection[card_no];

            if (this.pantrySelection[card_no]) {
                elem.classList.add('selected');
            } else {
                elem.classList.remove('selected');
            }

            let sugar = 0;
            let yeast = 0;
            let water = 0;
            let alcohol = 0;
            let plant = 0;
            let grain = 0;
            let fruit = 0;
            let invalid = 0;

            let selected = Object.keys(this.pantrySelection).filter(X => this.pantrySelection[X])
            if (document.getElementById("trade_card_button")) {
                if (selected.length == 1) {
                    dojo.removeClass('trade_card_button', 'disabled')
                } else {
                    dojo.addClass('trade_card_button', 'disabled')
                }
            }
            Object.keys(this.pantrySelection).forEach(card_no => {
                if (!this.pantrySelection[card_no])
                    return;

                switch (this.activeCards[card_no].type) {
                    case "SUGAR": 
                        sugar++;
                        break;
                    case "YEAST":
                        yeast++;
                        break;
                    case "WATER":
                        water++;
                        break;
                    case "ALCOHOL":
                        alcohol++;
                        break;
                    case "BARREL":
                    case "BOTTLE":
                        invalid++;
                        break;
                }
                switch (this.activeCards[card_no].subtype) {
                    case "PLANT": 
                        plant++;
                        break;
                    case "GRAIN":
                        grain++;
                        break;
                    case "FRUIT":
                        fruit++;
                        break;
                }
            });

            if (invalid) {
                dojo.addClass("distill_button", "disabled-looking");
                this.addTooltip("distill_button", 
                    _("Click this button to distill"), 
                    _("Invalid cards (items) selected"),
                    1000);

            } else {
                if ((sugar && yeast && water) || 
                    (sugar && yeast && alcohol) || 
                    (sugar && alcohol && water) ||
                    (sugar && alcohol >= 2)) {
                    dojo.removeClass("distill_button", "disabled-looking");
                    this.addTooltip("distill_button", 
                        _("Click this button to distill"), 
                        _("Distill these cards"), 1000
                    );
                } else {
                    dojo.addClass("distill_button", "disabled-looking");
                    this.addTooltip("distill_button", 
                        _("Click this button to distill"), 
                        _("Must select at least 1 yeast, 1 water, and 1 sugar"), 1000
                    );
                }
            }

            // Now update the distill button counters
            if (yeast) {
                console.log("showing yc_wrap")
                dojo.removeClass('yc_wrap', 'invisible')
                this.yeastCounter.setValue(yeast);
            } else {
                console.log("hiding yc wrap here")
                dojo.addClass('yc_wrap', 'invisible')
            }

            if (water) {
                dojo.removeClass('wc_wrap', 'invisible')
                this.waterCounter.setValue(water);
            } else {
                dojo.addClass('wc_wrap', 'invisible')
            }

            if (alcohol) {
                dojo.removeClass('ac_wrap', 'invisible')
                this.alcoholCounter.setValue(alcohol);
            } else {
                dojo.addClass('ac_wrap', 'invisible')
            }

            if (grain) {
                dojo.removeClass('gc_wrap', 'invisible')
                this.grainCounter.setValue(grain);
            } else {
                dojo.addClass('gc_wrap', 'invisible')
            }

            if (plant) {
                dojo.removeClass('pc_wrap', 'invisible')
                this.plantCounter.setValue(plant);
            } else {
                dojo.addClass('pc_wrap', 'invisible')
            }

            if (fruit) {
                dojo.removeClass('fc_wrap', 'invisible')
                this.fruitCounter.setValue(fruit);
            } else {
                dojo.addClass('fc_wrap', 'invisible')
            }

        },
        onPrefClick: function(evt) {
            console.log("onPrefClick");
            console.log(evt);
            console.log(evt.currentTarget);
            console.log(evt.currentTarget.value)

            value = evt.currentTarget.value;

            localStorage.setItem(`${this.game_name}_dash`, value);
            this.setDash(value)
        },
        onWrapClick: function(evt) {
            console.log(evt)
            console.log(evt.currentTarget.value)

            value = evt.currentTarget.value;
            localStorage.setItem(`${this.game_name}_wrap`, value);
            this.setWrap(value)
        },
        onMarketClickLabelReward: function(evt) {
            dojo.stopEvent(evt);
            console.log("onMarketClickLabelReward")

            if (!dojo.hasClass(evt.currentTarget, "marketBuyable")) {
                console.log("Not doing it!")
                return;
            }
            if (this.stateName != 'playerBuyTurnReveal')
                this.disconnectAllMarketCards();

            const pattern = /^(\w*)-\w*-(\w*)/
            const match = evt.currentTarget.id.match(pattern);
            const cardName = match[2];
            console.log(cardName);
            const slot = evt.currentTarget.parentElement;
            console.log(slot);
            const slotId = slot.getAttribute('data-slot-id');
            console.log(slotId);
            var powerNodes = dojo.query(".activePower");
            var powers = [];

            args = this.clientStateArgs
            args.collectCard = cardName
            args.collectCardSlot = slotId
            if (evt.currentTarget.classList.contains('du-card')) {
                // For distillery upgrade cards, we put you in a position to pick which slot you want.
                this.placeDuPrompt(this.activeCards[cardName], [], args)
                return
            } else {
                this.confirmButton(dojo.string.substitute(_("Confirm sale and collect ${name}"), {name: _(this.activeCards[cardName].name)}), 
                    'sellDrink',
                    this.getAjaxArgsFromArgs(args), 'revertActionBarAndResetCards')
            }
        },
        onMarketClick: function(evt) {
            dojo.stopEvent(evt);

            if (!dojo.hasClass(evt.currentTarget, "marketCard")) {
                console.log("Not doing it!")
                return;
            }
            if (this.stateName != 'playerBuyTurnReveal')
                this.disconnectAllMarketCards();

            const pattern = /^(\w*)-\w*-(\w*)/

            const match = evt.currentTarget.id.match(pattern);
            const cardName = match[2];
            const slot = evt.currentTarget.parentElement;
            const slotId = slot.getAttribute('data-slot-id');
            var powerNodes = dojo.query(".activePower");
            var powers = [];
            powerNodes.forEach(e => {
                powers.push(e.dataset.uid);
            });
            if (evt.currentTarget.classList.contains('du-card')) {
                // For distillery upgrade cards, we put you in a position to pick which slot you want.
                let effectiveCost = this.getEffectiveCost(cardName);
                let money = this['money_counter_' + this.player_id].getValue();
                if (effectiveCost > money) {
                    this.showMessage(_("Not enough money"), "error");
                    return;
                }
                this.placeDuPrompt(this.activeCards[cardName], powers.join(','), null, slotId)
            } else {
                if (this.stateName == 'playerBuyTurn'  || this.stateName == 'playerBuyTurnReveal') {
                    let effectiveCost = this.getEffectiveCost(cardName);
                    let description = '';
                    if (effectiveCost < 0) {
                        effectiveCost = 0;
                        description +=  _('This will end your turn.') + _('<span style="color: red;"> Warning: Discounted below 0. </span>');
                    }
                    let c = this.activeCards[cardName];
                    let button = dojo.string.substitute(_("Purchase ${name} for ${cost}"), {name: _(c.name), cost: effectiveCost}) + ' <span class="icon-coin-em"></span>'

                    //confirmButton(buttonText, url, args, cb, title) {
                    confirmBtn = this.confirmButton(button,
                                            "buyCard", {
                                                cardName: cardName,
                                                marketName: match[1],
                                                slotId: slotId,
                                                lock: true,
                                                powers: powers.join(','),
                                                debugId: 6, phase: this.stateName,
                                            }, null, description)
                    let money = this['money_counter_' + this.player_id].getValue();
                    if (effectiveCost > money) {
                        dojo.addClass(confirmBtn, "disabled")
                    }
                } else {
                    this.ajaxcall( "/distilled/distilled/buyCard.html", {
                        slotId: slotId,
                        cardName: cardName,
                        marketName: match[1],
                        powers: powers.join(','),
                        debugId: 7, phase: this.stateName,
                        lock: true,
                    }, this, function(result) {});
                }
            }
        },
        onRecipeCubeClick: function(evt) {
            dojo.stopEvent(evt);
            console.log(evt);
            console.log(evt.currentTarget);

            const slotNo = evt.currentTarget.id.split('_')[1];
            console.log(slotNo);

            var powerNodes = dojo.query(".activePower");
            var powers = [];
            powerNodes.forEach(e => {
                powers.push(e.dataset.uid);
            })

            cost = this.getEffectiveRecipeCost(slotNo)
            recipeName = this.recipeFlight[slotNo].name
            let button = null;

            console.log(this.recipeFlight)
            if (this.stateName.startsWith("placeLabel")) {
                button = dojo.string.substitute(_("Collect ${recipeName} recipe"), {recipeName: recipeName})
            }
            else  {
                button = dojo.string.substitute(_("Confirm buy ${name} for ${cost}"), {name: _(recipeName), cost: cost})
                button += ' <span class="icon-coin-em"> </span>';
            }
            this.confirmButton(button, "buyRecipe", {
                recipeSlot: slotNo,
                powers: powers.join(','),
                lock: true,
            })
        },
        onRecipeCubeClickLabelReward: function(evt) {
            dojo.stopEvent(evt);
            const slotNo = evt.currentTarget.id.split('_')[1];
            recipeName = this.recipeFlight[slotNo].name

            this.disconnectAllMarketCards();

            args = this.clientStateArgs
            args.collectRecipeSlot = slotNo
            console.log(this.recipeFlight)
            this.confirmButton(dojo.string.substitute(_('Confirm sale and collect ${recipeName} recipe'), {recipeName: _(recipeName)}), 
                'sellDrink',
                this.getAjaxArgsFromArgs(args) , 'revertActionBarAndResetCards')
        },
        addRecipeCube: function(player_id, slot, color) {
            if (!this.recipeSlots[player_id])
                this.recipeSlots[player_id] = {}
            this.recipeSlots[player_id][slot] = true
            dojo.place(this.format_block('jstpl_cube', {
                COLOR: color, 
            }), 'recipeCubeSlot_' + slot + '_' + player_id, 'only');
        },
        onDuCardClick: function(evt) {
            dojo.stopEvent(evt);

            const extractCardId = /du-card-(\d+)-.*/;
            const match = evt.currentTarget.id.match(extractCardId);
            console.log(match);
            this.duMarketStock.flipCard(this.activeCards[match[1]]);
        },
        getStock: function(marketShort) {
            var stock;
            switch (marketShort) {
                case 'du':
                    stock = this.duMarketStock;
                    break;
                case 'ing':
                    stock = this.ingMarketStock;
                    break;
                case 'item': 
                    stock = this.itemMarketStock;
                    break;
                default:
                    console.log("That should never happen. Stock not found");
                    stock = null;
            }
            return stock;
        },
        market2Pantry: function(element, newClass) {
            if (!element) {

            }
            let frontElement = document.getElementById(element.id+'-front')
            if (frontElement) {
                if (this.marketClickHandles && this.marketClickHandles[frontElement.id]) {
                    dojo.disconnect(this.marketClickHandles[frontElement.id])
                    delete this.marketClickHandles[frontElement.id];
                }
                frontElement.classList.remove('marketCard');
            }
            element.classList.remove('marketCard');
            element.classList.add(newClass);
            element.style.zIndex = null;

            // TODO check to see if we're in the distill phase before we start setting this up
            //this.pantrySelection[card.uid] = false;
        },
        onDistillerChoiceClick(e) {
            console.log("on distiller click")

            console.log(this.stateName);
            if (this.stateName != 'chooseDistiller') {
                return;
            }


            var id = e.currentTarget.dataset.uid
            var distillerCard = this.distillerChoice[id];

            this.confirmButton(_("Confirm"), "selectDistiller", {
                player_id: this.player_id,
                card: distillerCard.id,
                lock: true,
            }, null, dojo.string.substitute(_('Select ${name}'), {name: distillerCard.name}));
        },
        connectDistillerCardsForChoice: function() {
            console.log("choose distiller")

            dojo.query('.distiller').connect('onclick', this, 'onDistillerChoiceClick');
        },
        connectAllCardsInComboStock: function(comboStock) {
            console.log(comboStock)
            var stocks = ['du', 'item', 'ing'];
            stocks.forEach(S => {
                var cards = comboStock[S].getCards();
                var elements = cards.map(C => comboStock[S].getCardElement(C));
                elements.forEach(E => {
                    handle = dojo.connect(E, 'onclick', this, 'onMarketClick')
                    this.marketClickHandles[E.id] = handle
                })
            })
        },
        reconnectAllMarketCards: function() {
            this.disconnectAllMarketCards();
            let money = this['money_counter_' + this.player_id].getValue();
            this.connectAllMarketCards(this.canBuyBasic, money);
            this.connectAllRecipeSlots('onRecipeCubeClick');
        },
        connectAllMarketCards: function(canBuyBasic=true, money=10000) {
            let marketCards = dojo.query('.marketCard')
            console.log("in connect all market cards")
            console.log(canBuyBasic)
            marketCards.forEach(div => {
                // Decks Trucks should not be clickable market cards
                if (div.parentElement.id.endsWith("Truck") || div.parentElement.id.endsWith("Deck"))
                    return;

                // extract uid
                const pattern = /\w+-\w+-(\w+)/
                const match = div.id.match(pattern);
                const card_uid = match[1];

                if (this.getEffectiveCost(card_uid) > money) {
                    console.log("Costs too much yo")
                    dojo.addClass(div, 'disabledMarket')
                    return;
                }

                // Do not connect basic cards if the player cannot buy basic
                if (!canBuyBasic && div.parentElement.id.endsWith("basicMarket2")) {
                    dojo.addClass(div, "disabledMarket");
                    return;
                }

                dojo.addClass(div, "marketBuyable")
                if (!(div.id in this.marketClickHandles)) {
                    let handle = dojo.connect(div, 'onclick', this, 'onMarketClick')
                    this.marketClickHandles[div.id] = handle
                }
            })
        },
        connectAllRecipeSlots: function(callback, force=false) {
            console.log("connect all recipe slots")
            let money = this['money_counter_' + this.player_id].getValue();
            for (var ii = 0; ii < 7; ii++) {
                // Recipe slot is already taken
                if (this.recipeSlots[this.player_id] && this.recipeSlots[this.player_id][ii])
                    continue;

                if (money >= this.getEffectiveRecipeCost(ii) || force) {
                    elem = document.getElementById(`recipeCubeSlot_${ii}_${this.player_id}`)
                    if (!(elem.id in this.marketClickHandles)) {
                        let handle = dojo.connect(elem, "onclick", this, callback);
                        dojo.addClass(elem, "marketBuyable")
                        this.marketClickHandles[elem.id] = handle;
                    }
                }
            }
        },
        connectAllCardsWithClass: function(callback, classname) {
            let marketCards = dojo.query('.marketCard')
            marketCards.forEach(div => {
                // Decks Trucks should not be clickable market cards
                if (div.parentElement.id.endsWith("Truck") || div.parentElement.id.endsWith("Deck"))
                    return;

                console.log(classname)
                console.log(div.classList)
                console.log(classname in div.classList)
                console.log(div.classList.contains(classname))
                if (div.classList.contains(classname)) {
                    console.log("yes")
                    console.log(div)
                    dojo.addClass(div, "marketBuyable")
                    let cb = callback ?? 'onMarketClick';
                    if (!(div.id in this.marketClickHandles)) {
                        let handle = dojo.connect(div, 'onclick', this, cb)
                        this.marketClickHandles[div.id] = handle
                    }
                } else {
                    console.log('no')
                    console.log(div)
                    dojo.addClass(div, "disabledMarket");
                }

            })
        },
        disconnectAllMarketCards: function() {
            console.log("disconnect all market cards")

            dojo.query(".disabledMarket").removeClass("disabledMarket")
            dojo.query(".marketBuyable").removeClass("marketBuyable")
            Object.keys(this.marketClickHandles).forEach(divid => {
                dojo.disconnect(this.marketClickHandles[divid]);
                delete this.marketClickHandles[divid];
            })

        },

        ///////////////////////////////////////////////////
        //// Player's action
        
        /*
        
            Here, you are defining methods to handle player's action (ex: results of mouse click on 
            game objects).
            
            Most of the time, these methods:
            _ check the action is possible at this game state.
            _ make a call to the game server
        
        */
        
        /* Example:
        
        onMyMethodToCall1: function( evt )
        {
            console.log( 'onMyMethodToCall1' );
            
            // Preventing default browser reaction
            dojo.stopEvent( evt );

            // Check that this action is possible (see "possibleactions" in states.inc.php)
            if( ! this.checkAction( 'myAction' ) )
            {   return; }

            this.ajaxcall( "/distilled/distilled/myAction.html", { 
                                                                    lock: true, 
                                                                    myArgument1: arg1, 
                                                                    myArgument2: arg2,
                                                                    ...
                                                                 }, 
                         this, function( result ) {
                            
                            // What to do after the server call if it succeeded
                            // (most of the time: nothing)
                            
                         }, function( is_error) {

                            // What to do after the server call in anyway (success or failure)
                            // (most of the time: nothing)

                         } );        
        },        
        
        */

        
        ///////////////////////////////////////////////////
        //// Reaction to cometD notifications

        /*
            setupNotifications:
            
            In this method, you associate each of your game notifications with your local method to handle it.
            
            Note: game notification names correspond to "notifyAllPlayers" and "notifyPlayer" calls in
                  your distilled.game.php file.
        
        */
        setupNotifications: function()
        {
            console.log( 'notifications subscriptions setup' );
            dojo.subscribe('buyCard', this, 'notif_buyCard');
            this.notifqueue.setSynchronous( 'buyCard', 500);
            dojo.subscribe('buyRecipeCube', this, 'notif_buyRecipeCube');
            this.notifqueue.setSynchronous( 'buyRecipeCube', 500);
            dojo.subscribe('updateMarket', this, 'notif_updateMarket');
            this.notifqueue.setSynchronous( 'updateMarket', 500);
            dojo.subscribe('updateMarkets', this, 'notif_updateMarkets');
            this.notifqueue.setSynchronous( 'updateMarkets', 500);
            dojo.subscribe('playerGains', this, 'notif_playerGains');
            this.notifqueue.setSynchronous( 'playerGains', 100);
            dojo.subscribe('playerPoints', this, 'notif_playerPoints');
            this.notifqueue.setSynchronous( 'playerPoints', 100);
            dojo.subscribe('placeDuCard', this, 'notif_placeDuCard');
            this.notifqueue.setSynchronous( 'placeDuCard', 500);
            dojo.subscribe('selectRecipe', this, 'notif_selectRecipe');
            this.notifqueue.setSynchronous( 'selectRecipe', 500);
            dojo.subscribe('dbgdbg', this, 'notif_dbg');
            this.notifqueue.setSynchronous('dbgdbg', 1);
            dojo.subscribe('addAlcohols', this, 'notif_addAlcohols');
            this.notifqueue.setSynchronous('addAlcohols', 10);
            dojo.subscribe('moveToWashback', this, 'notif_moveToWashback');
            this.notifqueue.setSynchronous('moveToWashback', 500);

            dojo.subscribe('removeCards', this, 'notif_removeCards');
            this.notifqueue.setSynchronous('removeCards', null);

            dojo.subscribe('deleteCards', this, 'notif_deleteCards');
            this.notifqueue.setSynchronous('deleteCards', 500);

            dojo.subscribe('sellDrink', this, 'notif_sellDrink');
            this.notifqueue.setSynchronous('sellDrink', null);
            dojo.subscribe('placeLabel', this, 'notif_placeLabel');
            this.notifqueue.setSynchronous('placeLabel', 1000);
            dojo.subscribe('chooseBottle', this, 'notif_chooseBottle');
            this.notifqueue.setSynchronous('chooseBottle', 500);
            dojo.subscribe('ageDrink', this, 'notif_ageDrink');
            //this.notifqueue.setSynchronous('ageDrink', 500);
            dojo.subscribe('moveToWarehouse', this, 'notif_moveToWarehouse');
            this.notifqueue.setSynchronous('moveToWarehouse', 500);
            dojo.subscribe('trade', this, 'notif_trade');
            this.notifqueue.setSynchronous('trade', 500);
            dojo.subscribe('discardGoal', this, 'notif_discardGoal' );
            this.notifqueue.setSynchronous('discardGoal', 500);
            dojo.subscribe('moveSignature', this, 'notif_moveSignature');
            this.notifqueue.setSynchronous('moveSignature', 500);
            dojo.subscribe('placeLabel2Trade', this, 'notif_placeLabel2Trade');
            this.notifqueue.setSynchronous('placeLabel2Trade', 500);
            dojo.subscribe('spiritAward', this, 'notif_spiritAward');
            this.notifqueue.setSynchronous('spiritAward', 1000);
            dojo.subscribe('addBack', this, 'notif_addBack');
            this.notifqueue.setSynchronous('addBack', 500);
            
            dojo.subscribe('revealCards', this, 'notif_revealCards');
            this.notifqueue.setSynchronous('revealCards', 500);

            dojo.subscribe('endReveal', this, 'notif_endReveal');
            this.notifqueue.setSynchronous('endReveal', 500);

            dojo.subscribe('shuffleDeck', this, 'notif_shuffleDeck');
            this.notifqueue.setSynchronous('shuffleDeck', 1000);

            dojo.subscribe('roundStart', this, 'notif_roundStart');
            this.notifqueue.setSynchronous('roundStart', 100);

            dojo.subscribe('revealDistiller', this, 'notif_revealDistiller');
            this.notifqueue.setSynchronous('revealDistiller', 100);

            dojo.subscribe('selectDistiller', this, 'notif_selectDistiller');
            this.notifqueue.setSynchronous('selectDistiller', 500);
            dojo.subscribe('selectDistiller2', this, 'notif_selectDistiller');
            this.notifqueue.setSynchronous('selectDistiller2', 500);

            dojo.subscribe('sigIngredient', this, 'notif_sigIngredient');
            this.notifqueue.setSynchronous('sigIngredient', 500);

            dojo.subscribe('updateFirstPlayer', this, 'notif_updateFirstPlayer');
            this.notifqueue.setSynchronous('updateFirstPlayer', 100);

            dojo.subscribe('playerPointsEndgame', this, 'notif_playerPointsEndgame');
            this.notifqueue.setSynchronous('playerPointsEndgame', 2000);

            dojo.subscribe('playerPointsEndgameInit', this, 'notif_playerPointsEndgameInit');
            this.notifqueue.setSynchronous('playerPointsEndgameInit', 3000);

            dojo.subscribe('restartDistill', this, 'notif_restartDistill');
            this.notifqueue.setSynchronous('restartDistill', 1000);

            dojo.subscribe('playerPays', this, 'notif_playerPays');

            dojo.subscribe('removeDuCard', this, 'notif_removeDuCard');
            this.notifqueue.setSynchronous('removeDuCard', 50);


            this.notifqueue.setIgnoreNotificationCheck( 
                'selectDistiller2', 
                (notif) => { return notif.args.player_id == this.player_id} );

            // TODO: here, associate your game notifications with local methods
            
            // Example 1: standard notification handling
            // dojo.subscribe( 'cardPlayed', this, "notif_cardPlayed" );
            
            // Example 2: standard notification handling + tell the user interface to wait
            //            during 3 seconds after calling the method in order to let the players
            //            see what is happening in the game.
            // dojo.subscribe( 'cardPlayed', this, "notif_cardPlayed" );
            // this.notifqueue.setSynchronous( 'cardPlayed', 3000 );
            // 
        },  

        notif_removeDuCard: function(notif) {
            this.disableNextMoveSound();
            let card = notif.args.card
            card.location = 'truck'
            this.addCardToTruck(card, 'du', this.decks.duTruck);

            var divbase = 'du' + notif.args.duSlot + "_" + notif.args.player_id;
            this.removeFlippyCard(notif.args.player_id, divbase, 'du');
        },
        notif_restartDistill: function(notif) {
            let pid = notif.args.player_id
            this.playerPantryStock[pid].ing.removeCards(this.playerPantryStock[pid].ing.getCards())
            this.playerWashbackStock[pid].ing.removeCards(this.playerWashbackStock[pid].ing.getCards())
            this.playerWashbackStock[pid].item.removeCards(this.playerWashbackStock[pid].item.getCards())
            this.playerWashbackStock[pid].label.removeCards(this.playerWashbackStock[pid].label.getCards())
            this.playerStoreStock[pid].item.removeCards(this.playerStoreStock[pid].item.getCards())

            console.log("Calling connect cards")
            this.resetRegionCounters(pid)
            this.setupPlayerCards(notif.args.player_id, notif.args.player_cards);
            this.revertActionBar();

        },
        notif_playerPays: function(notif) {
            this.incMoney(notif.args.player_id, -1 * notif.args.cost);
        },
        notif_updateFirstPlayer: function(notif) {
            this.disableNextMoveSound();
            console.log("notif_updateFirstPlayer");
            console.log(notif)

            this.showFirstPlayer(notif.args.player_id)
        },
        notif_sigIngredient: function(notif) {
            console.log('notif_sigIngredient');
            console.log(notif);

            this.activeCards[notif.args.ing_uid] = notif.args.ing_card;
            this.placeFlippyCard(notif.args.player_id, 
                'signature_' + notif.args.player_id, 
                'ing', 
                notif.args.ing_uid);
            

            this.playerSignatureLabelStock[notif.args.player_id] = new CardStock(
                this.labelCardsManager,
                document.getElementById('recipeSignatureSlot_' + notif.args.player_id),
            );
            this.playerSignatureLabelStock[notif.args.player_id].addCard(
                notif.args.sig_label);
        },
        notif_selectDistiller: function(notif) {
            this.disableNextMoveSound();
            console.log("notif_selectDistiller")
            console.log(notif)
            console.log(this.player_id)

            dojo.query("#centerScreen_card").addClass("invisible")

            this.player_data[notif.args.player_id].region = notif.args.distiller_region
            this.placeFlippyCard(notif.args.player_id, 'distiller_' + notif.args.player_id, 'distiller', 
                notif.args.distiller_id);
            if (parseInt(notif.args.player_id) == this.player_id) {
                console.log(dojo.query('.distillerChoice'))
                dojo.query('.distillerChoice').addClass('invisible')

                console.log(dojo.query('.centerScreen'))
                dojo.query('.centerScreen').removeClass("invisible")

                var card = this.placeFlippyCard(notif.args.player_id, 'centerScreen', 'distiller', 
                    notif.args.distiller_id);
                var animation = this.slideToObject(card, $('player_board_' + notif.args.player_id), 1000);
                animation.onEnd = function () {
                    dojo.query('.centerScreen').addClass('invisible')
                }
                animation.play()

                this.distiller_id = parseInt(notif.args.distiller_id)
            }
        },
        notif_revealDistiller: function(notif) {
            console.log('revealDistiller');
            this.disableNextMoveSound();

            this.placeFlippyCard(notif.args.player_id, 'distiller' + notif.args.slot, 'distiller', 
                notif.args.distiller_id);
        },
        notif_roundStart: function (notif) {
            this.showTurn(notif.args.turn)
            this.expandMarket();
            this.resetSpirits(notif.args.spirits)
        },
        animateShuffleDeck: async function(notif) {
            let truckName = notif.args.deck_id + 'Truck'
            let deckName = notif.args.deck_id + 'Truck'
            let cards = this.decks[truckName].getCards();

            await this.decks[notif.args.deck_id].addCards(cards, null, { autoUpdateCardNumber: false });
            this.decks[truckName].removeCards(cards, {autoUpdateCardNumber: false})
            this.decks[truckName].setCardNumber(0);

            // Remove them so they get recreated in the future
            console.log("removing cards", cards)
            this.decks[notif.args.deck_id].removeCards(cards, {autoUpdateCardNumber: false})

            var manager = null;
            switch (notif.args.deck_id) {
                case 'du':
                    manager = this.duCardsManager;
                    break;
                case 'item':
                    manager = this.itemCardsManager;
                    break;
                case 'ing':
                    manager = this.ingCardsManager;
                    break;
            }
            /*
            if (manager) {
                cards.forEach(C => {
                    console.log("adding marketCard to ", C)
                    var elem = this.decks[truckName].getCardElement(C)
                    if (elem) {
                        elem.classList.add('marketCard')
                        elem.style.zIndex = 0;
                    } else {
                        this.showMessage(`An error has occurred. Please report a bug in shuffleDeck() on card ${C.name}`, "error");
                    }
                })
            }
            */

            this.decks[notif.args.deck_id].setCardNumber(notif.args.card_count);
        },
        notif_shuffleDeck: function(notif) {
            console.log("shuffle deck")
            console.log(notif)
            this.animateShuffleDeck(notif)
        },
        notif_endReveal: function(notif) {
            console.log("end Reveal");

            if (notif.args.player_id == this.player_id) {
                this.showFloatingPantry();
            }
            dojo.addClass('floatingRevealedButton', 'invisible');
            this.playerRevealStock[this.player_id].ing.removeCards(this.playerRevealStock[this.player_id].ing.getCards());
            this.playerRevealStock[this.player_id].item.removeCards(this.playerRevealStock[this.player_id].item.getCards());
            this.playerRevealStock[this.player_id].du.removeCards(this.playerRevealStock[this.player_id].du.getCards());
        },
        notif_revealCards: function(notif) {
            console.log("reveal cards");
            console.log(notif);
            var player_id = notif.args.player_id;

            var card = notif.args.card;
            card.location_idx = 1;
            this.activeCards[card.uid] = card;
            if (notif.args.player_id == this.player_id)
                this.showFloatingReveal();
            stock = this.playerRevealStock[this.player_id][notif.args.market_id].addCard(card);
        },
        notif_addBack: function(notif) {
            console.log("add back");
            console.log(notif);

            var player_id = notif.args.player_id;
            notif.args.return_card.location_idx = 1;
            this.playerWashbackStock[player_id].ing.addCard(notif.args.return_card);
        },
        notif_spiritAward: function(notif) {
            console.log("spirit award");
            console.log(notif);

            this.awardAward({
                uid: notif.args.sa_uid,
                player_id: notif.args.player_id,
            })

            var player_id = notif.args.player_id
            this['score_counter_' + player_id].incValue(notif.args.sp);

            /*
            // animate removing the spirit award
            elem = document.getElementById("sa-" + notif.args.sa_uid)
            if (elem) { // If two players get it in a round, we don't animate twice
                var animation = this.slideToObject(elem, $('player_board_' + player_id), 1000);
                animation.onEnd = function () {
                    dojo.destroy(elem);
                }
                animation.play();
            }
            */
        },
        notif_placeLabel2Trade: function(notif) {
            console.log("placeLabel2Trade")
            console.log(notif)

            var cardIn = notif.args.in_card;
            var cardOut = notif.args.out_card;
            var truck = notif.args.truck;
            var playerId = notif.args.player_id;

            // Ensure that the new card is face up
            cardIn.location_idx = 1;
            this.activeCards[cardIn.uid] = cardIn

            if (truck == 'ing')  {
                this.decks.ingTruck.removeCard(cardIn, {autoUpdateCardNumber: false})
                this.playerPantryStock[playerId][truck].addCard(cardIn, {autoUpdateCardNumber: false});
                this.decks.ingTruck.setCardNumber(this.decks.ingTruck.getCardNumber()-1, null)

                var e = this.ingCardsManager.getCardElement(cardIn)
                e.dataset.side = "front";
                this.market2Pantry(e, 'pantryCard');

            }
            else if (truck == 'item')  {
                this.decks.itemTruck.removeCard(cardIn, {autoUpdateCardNumber: false})
                this.playerStoreStock[playerId][truck].addCard(cardIn, {autoUpdateCardNumber: false});
                this.decks.itemTruck.setCardNumber(this.decks.itemTruck.getCardNumber()-1, null)

                var e = this.itemCardsManager.getCardElement(cardIn)
                e.dataset.side = "front";
                this.market2Pantry(e, 'storeCard');
            }
            else if (truck == 'du') {
                var tmp = this.duCardsManager.getCardElement(cardIn)
                tmp.dataset.side = "front";
                var currentCount = this.decks.duTruck.getCardNumber()
                this.decks.duTruck.removeCard(cardIn, {autoUpdateCardNumber: false});
                this.decks.duTruck.setCardNumber(currentCount - 1, null)
            }

            if (cardOut.uid > 1000 || cardOut.card_id <= 18) {
                console.log("adding card to thingy")
                this.ingVoidStock.addCard(cardOut);

                // TODO card number goes wrong here.
            }
            else {
                console.log("adding cardout to ing truck")
                cardOut.location = 'truck'
                this.addCardToTruck(cardOut, 'ing', this.decks.ingTruck);
            }
        },
        notif_moveSignature: function(notif) {
            console.log('moveSig')
            console.log(notif)

            let player_id = notif.args.player_id;
            let card = this.activeCards[notif.args.sig_card.uid];
            card.location_idx = 1;
            console.log(card);
            // Remove sig card flippy card
            // Add card to sig spot
            // move card to pantry

            var sigNode = document.getElementById('signature_' + player_id);
            console.log(sigNode)
            dojo.destroy(sigNode.children[0]);

            if (notif.args.player_id == this.player_id) 
                this.showFloatingPantry();
            this.playerSignatureStock[player_id] = new CardStock(
                    this.ingCardsManager,
                    document.getElementById("signature_" + player_id));
            this.playerSignatureStock[player_id].addCard(card);
            this.playerPantryStock[player_id].ing.addCard(card);
            let element = this.playerPantryStock[player_id].ing.getCardElement(card);
            this.market2Pantry(element, 'pantryCard');
        },
        notif_discardGoal: function(notif) {
            console.log("discardGoal");
            console.log(notif);
            if (notif.args.goal_uid) {
                let card = this.activeCards[notif.args.goal_uid];
                console.log(card)
                this.playerGoalsStock[notif.args.player_id].removeCard(card);
            }
        },
        notif_playerPoints: function(notif) {
            this.disableNextMoveSound();
            console.log("player points");
            console.log(notif)

            this['score_counter_' + notif.args.player_id].incValue(notif.args.sp);
        },
        notif_playerPointsEndgameInit: function(notif) {
            this.disableNextMoveSound();
            console.log("endgame init")
            console.log(notif)
            // Initialize game scoring
            this.finalScoring = {}
            window.scrollTo(0, 0);
            var cs = document.getElementById("centerScreen")
            cs.childNodes.forEach(E => E.classList?.add("invisible"))

            dojo.query(".centerScreen").removeClass("invisible")
            dojo.removeClass("game-scoring", "invisible")

            var rows = ['players', 'ingame', 'warehouses', 'bottles', 'goals', 'dus', 'money', 'total']
            console.log(this.player_names)
            this.player_list.sort().forEach(pid => {
                this.finalScoring[pid] = {}
                rows.forEach(row => {
                    cellName = "score_counter_" + row + "_" + pid
                    newCell = document.createElement("td")
                    newCell.id = cellName
                    var startingText = ""
                    if (row == "players")
                        startingText = "" + this.player_names[pid]

                    var formatHTML = `
                        ${startingText}
                    `
                    newCell.innerHTML = formatHTML

                    console.log(row)
                    var rowElem = document.getElementById('scoring-row-' + row)
                    rowElem.appendChild(newCell);

                    if (row != "players") {
                        var scoreCounter = new ebg.counter();
                        scoreCounter.create(cellName)
                        scoreCounter.setValue(0);
                        this.finalScoring[pid][row] = scoreCounter;
                    }

                    if (row == "ingame") {
                        var scoreCounter = new ebg.counter();
                        scoreCounter.create(cellName)
                        scoreCounter.setValue(notif.args.scores[pid].player_score);
                        this.finalScoring[pid][row] = scoreCounter;
                    }
                })
            })
            this.player_list.forEach(pid => {
                this.finalScoring[pid]['total'].incValue(notif.args.scores[pid].player_score)
            })
        },
        notif_playerPointsEndgame: function(notif) {
            this.disableNextMoveSound();
            console.log("player points endgame");
            console.log(notif)

            this.animateEndgamePoints(notif)
            this.attachRegisteredTooltips()
            
        },
        notif_trade: function(notif) {
            console.log("notif_trade")
            console.log(notif)

            this.activeCards[notif.args.in_card.uid] = notif.args.in_card;
            this.activeCards[notif.args.in_card.uid].location_idx = 1;

            outElem = null
            notif.args.out_card.location = 'truck'
            if (notif.args.out_card.market == 'bm') {
                if (notif.args.out_card.type == "BARREL") { // basic barrels trade oddly
                    this.itemVoidStock.addCard(notif.args.out_card)
                    outElem = this.playerStoreStock[notif.args.player_id].item.getCardElement(notif.args.out_card)
                }
                else {
                    this.ingVoidStock.addCard(notif.args.out_card);
                    outElem = this.playerPantryStock[notif.args.player_id].ing.getCardElement(notif.args.out_card)
                }

            } else if (notif.args.out_card.market == 'ing') {
                this.addCardToTruck(notif.args.out_card, 'ing', this.decks.ingTruck)
                outElem = this.playerPantryStock[notif.args.player_id].ing.getCardElement(notif.args.out_card)
            } else if (notif.args.out_card.market == 'item') {
                this.addCardToTruck(notif.args.out_card, 'item', this.decks.itemTruck)
                outElem = this.playerStoreStock[notif.args.player_id].item.getCardElement(notif.args.out_card)
            }
            console.log(outElem)
            dojo.disconnect(this.marketClickHandles[outElem.id])
            delete this.marketClickHandles[outElem.id];

            this.playerPantryStock[notif.args.player_id].ing.addCard(notif.args.in_card);
            element = this.playerPantryStock[notif.args.player_id].ing.getCardElement(notif.args.in_card)
            this.market2Pantry(element, 'pantryCard');

            // TODO is this a bad race?
            this.pantrySelection[notif.args.out_card.uid] = false;
        },
        // TODO: from this point and below, you can write your game notifications handling methods
        notif_moveToWashback: function(notif) {
            this.disableNextMoveSound();
            console.log('moveToWashback')
            console.log(notif)
            dojo.query(".selected").removeClass("selected")

            // Remove the old temporary trade out card
            this.playerPantryStock[notif.args.player_id].ing.removeCard({uid: 9999, type: "ing"})

            var pid = notif.args.player_id;
            console.log("creating new deck on div")
            let deck = this.newDeckOnDiv("washback_" + pid + '_deck', this.ingCardsManager, "wb" + pid, null, false);
            console.log(deck)
            deck.setCardNumber(1)
            first = true
            notif.args.cards.forEach(C => {
                var c = this.activeCards[C];
                c.location_idx = 1;
                deck.addCard(c, {autoUpdateCardNumber: !first});
                first = false
            })
            deck.setCardNumber(notif.args.cards.length)
        },
        notif_deleteCards: function(notif) {
            this.disableNextMoveSound();
            console.log('deleteCards')
            console.log(notif)
            notif.args.remove.forEach(C => {
                var deck = this.decks["wb" + notif.args.player_id];
                deck.removeCard(this.activeCards[C]);
            })
        },
        notif_moveToWarehouse: function(notif) {
            this.disableNextMoveSound();
            console.log("move to warehouse")
            console.log(notif);
            // Remove Pantry items
            let location = notif.args.location;
            let pid = notif.args.player_id;
            var dest;

            if (location == "warehouse1") {
                dest = this.playerWarehouse1Stock[pid];
            } else if (location == "warehouse2") {
                dest = this.playerWarehouse2Stock[pid];
            } 

            // move the label for everyone, but only move the cards for other players
            let remaining = this.playerWashbackStock[notif.args.player_id].label.getCards();
            remaining.forEach(C => {
                dest.label.addCard(C);
            })

            remaining = this.playerWashbackStock[notif.args.player_id].ing.getCards();
            remaining.forEach(C => {
                dest.ing.addCard(C)
                dest.ing.getCardElement(C).classList.remove('pantryCard')
            })

            // Remove barrels
            remaining = this.playerWashbackStock[notif.args.player_id].item.getCards();
            remaining.forEach(C => {
                dest.item.addCard(C);
                dest.item.getCardElement(C).classList.remove('storeCard')
            })
        },
        notif_ageDrink: function(notif) {
            this.disableNextMoveSound();
            console.log("age drink");
            console.log(notif)

            this.resetSpirits(notif.args.spirits)

            var dest;
            if (notif.args.location == "warehouse1") {
                dest = this.playerWarehouse1Stock[notif.args.player_id];
            } else if (notif.args.location == "warehouse2") {
                dest = this.playerWarehouse2Stock[notif.args.player_id];
            } else if (notif.args.location == 'washback') {
                dest = this.playerWashbackStock[notif.args.player_id];
            }

            if (notif.args.visible_card) {
                dest.ing.addCard(notif.args.visible_card)
            } else {
                card = this.newFlavorBack();
                dest.ing.addCard(card)
            }
        },
        notif_chooseBottle: function(notif) {
            this.disableNextMoveSound();
            console.log("choose bottle");
            console.log(notif);

            notif.args.bottle.location_idx = 1;
            var comboStock;
            switch (notif.args.location) {
            case 'washback':
                comboStock = this.playerWashbackStock[notif.args.player_id];
                break;
            case 'warehouse1':
                comboStock = this.playerWarehouse1Stock[notif.args.player_id];
                break;
            case 'warehouse2':
                comboStock = this.playerWarehouse2Stock[notif.args.player_id];
                break;
            }
            comboStock.item.addCard(notif.args.bottle);
        },
        notif_placeLabel: function(notif) {
            console.log("place label");
            console.log(notif);

            /*
            // The current player has already animated this
            if (notif.args.player_id == this.player_id)
                return;
            // This is necessary for replay and for users using multiple devices.
            */

            if (notif.args.hasLabel) {
                var labelCard;
                if (notif.args.location == 'washback') {
                    console.log('washback')
                    labelCard = this.playerWashbackStock[notif.args.player_id].label.getCards();
                }
                if (notif.args.location == 'warehouse1') {
                    console.log('warehouse1')
                    labelCard = this.playerWarehouse1Stock[notif.args.player_id].label.getCards();
                }
                if (notif.args.location == 'warehouse2') {
                    console.log('warehouse2')
                    labelCard = this.playerWarehouse2Stock[notif.args.player_id].label.getCards();
                }
                console.log(labelCard)
                if (labelCard && labelCard.length) {
                    // TODO Check to make sure you got something back
                    //this.playerLabelStock[notif.args.player_id][notif.args.slot].addCard(labelCard[0]);
                    this.addLabelToBoard(labelCard[0], notif.args.player_id, notif.args.slot)
                }
            } else {
                if (notif.args.location == 'washback') {
                    console.log('washback')
                    this.playerWashbackStock[notif.args.player_id].label.removeCards(
                        this.playerWashbackStock[notif.args.player_id].label.getCards()
                    );
                }
                if (notif.args.location == 'warehouse1') {
                    console.log('warehoues1')
                    this.playerWarehouse1Stock[notif.args.player_id].label.removeCards(
                        this.playerWarehouse1Stock[notif.args.player_id].label.getCards()
                    );
                }
                if (notif.args.location == 'warehouse2') {
                    console.log('warehouse2')
                    this.playerWarehouse2Stock[notif.args.player_id].label.removeCards(
                        this.playerWarehouse2Stock[notif.args.player_id].label.getCards()
                    );
                }

            }
        },
        notif_sellDrink: function(notif) {
          try {
            this.disableNextMoveSound();
            // TODO play ca-ching
            console.log("sell drink");
            console.log(notif);
            this.resetSpirits(notif.args.spirits)

            this.incMoney(notif.args.player_id, notif.args.value);
            this['score_counter_' + notif.args.player_id].incValue(notif.args.sp);

            notif.args.bottle.location_idx = 1;
            if (notif.args.bottle.name.toLowerCase() == "glass bottle") {
                this.playerStoreStock[notif.args.player_id].item.addCard(notif.args.bottle)
            } else {
                this.addBottleToDisplay(notif.args.bottle, notif.args.player_id)
            }

            var comboStock;
            switch (notif.args.location) {
            case 'washback':
                comboStock = this.playerWashbackStock[notif.args.player_id];
                break;
            case 'warehouse1':
                comboStock = this.playerWarehouse1Stock[notif.args.player_id];
                break;
            case 'warehouse2':
                comboStock = this.playerWarehouse2Stock[notif.args.player_id];
                break;
            }

            dojo.addClass(`canvas_label_${notif.args.location}_${notif.args.player_id}`, "invisible")
            label = comboStock.label.getCards()[0]
            // Note should this be < 0 or <= 0
            if (label && label.count < 0) {
                comboStock.label.removeCards(comboStock.label.getCards())
            }

            // Remove Pantry items
            let remaining = comboStock.ing.getCards();
            remaining.forEach(C => {
                console.log(C);
                
                // Bottomless cards and Signature cards and flavor cards and another way of catching bottomless cards
                if (C.uid > 1000 || C.card_id <= 18 || C.type == "FLAVOR" || C.market == "bm") {
                    this.ingVoidStock.addCard(C);
                    return;
                }

                // Skip Signature cards
                C.location = 'truck'
                this.addCardToTruck(C, 'ing', this.decks.ingTruck)
            })

            // Remove barrels
            remaining = comboStock.item.getCards();
            remaining.forEach(C => {
                console.log(C);
                if (C.type == "BARREL" && C.subtype == "METAL") {
                    this.playerStoreStock[notif.args.player_id].item.addCard(C);
                } else if (C.market == "bm") {
                    this.itemVoidStock.addCard(C)
                } else {
                    C.location = 'truck'
                    // ZZZ possible culprit
                    this.addCardToTruck(C, 'item', this.decks.itemTruck)
                }
            })
          } catch (e) {
            console.log(e)
          }
          this.notifqueue.setSynchronousDuration(0);

        },
        notif_addAlcohols: function(notif) {
            console.log("add alcohols")
            console.log(notif)

            notif.args.new_cards.forEach(C => {
                this.activeCards[C.uid] = C;
            })
            // TODO animate alcohol
            //this.animateAddAlcohol(notif.args.new_cards, notif.args.player_id);
            console.log("done adding alcohol");
        },
        notif_removeCards: function(notif) {
            console.log("remove cards")
            console.log(notif)
            if (notif.args.player_id == this.player_id) 
                this.showFloatingWashback();
            
            this.animateDistillRemoval(notif);
        },
        notif_buyCard: function( notif ) {
            console.log("buyCard");
            console.log(notif);

            stock = this.getStock(notif.args.market);
            var card = { uid: notif.args.uid, 
                         card_id: notif.args.card_id, 
                         name: notif.args.card_name, 
                         location_idx: 1,
                         location: 'player' }
            if (stock != null) {
                // Nothing
            } else {
                this.activeCards[notif.args.uid] = notif.args.card;
            }

            // Update everything about the card 
            card = this.activeCards[notif.args.uid];
            card.location_idx = 1;
            if (card.location == 'truck')
                card.location = 'player'

            let itemDst = this.itemVoidStock;
            let ingDst = this.ingVoidStock;

            let player_id = notif.args.player_id;
            // mountain spring water can do this
            if (notif.args.location && notif.args.location == 'washback') {
                ingDst = this.playerWashbackStock[player_id];
                itemDst = this.playerWashbackStock[player_id];
            } else {
                ingDst = this.playerPantryStock[player_id];
                itemDst = this.playerStoreStock[player_id];
            }
            if (notif.args.market == 'du') {
                stock.removeCards([card]);
            } else if (notif.args.market == 'item' || card.type == "BARREL") {
                if (player_id == this.player_id)
                    this.showFloatingStoreRoom();
                this.itemVoidStock.addCard(card, null, {remove: false})
                itemDst.item.addCards([card])
                let element = itemDst.item?.getCardElement(card);
                if (element) {
                    this.market2Pantry(element, 'storeCard');
                }
            } else if (notif.args.market == 'ing' || notif.args.market == 'bm') {
                if (notif.args.player_id == this.player_id) 
                    this.showFloatingPantry();
                this.ingVoidStock.addCard(card, null, {remove: false})
                ingDst.ing.addCard(card)
                let element = ingDst.ing?.getCardElement(card);
                let deck = this.decks[notif.args.player_id];
                if (deck) {
                    //deck.setCardNumber(deck.getCardNumber() + 1);
                }
                if (element)
                    this.market2Pantry(element, 'pantryCard');
            }

        },

        notif_buyRecipeCube: function( notif ) {
            this.disableNextMoveSound();
            console.log("buy cube");
            console.log(notif);

            this.addRecipeCube(notif.args.player_id, notif.args.slot, notif.args.color);
        },
        notif_playerGains: function( notif ) {
            this.disableNextMoveSound();
            console.log("playerGains");
            console.log(notif);

            this.incMoney(notif.args.player_id, notif.args.amount);
        },

        
        notif_placeDuCard: function( notif ) {
            console.log("placeDuCard");
            console.log(notif);

            var divbase = 'du' + notif.args.duSlot + "_" + notif.args.player_id;
            this.placeFlippyCard(notif.args.playerid, divbase, 'du', notif.args.uid);

            this.duMarketStock.removeCard({uid: notif.args.uid})
        },

        notif_dbg: function(notif) {
            console.log("debug");
            console.log(notif);
        },

        notif_selectRecipe: function(notif) {
            console.log("selectRecipe");
            console.log(notif);

            let recipeName = notif.args.recipe.name;
            let recipeDeck = this.decks[recipeName];
            let recipe = notif.args.recipe;

            // This is a hack to give a unique id
            if (recipe.count == 0) {
                recipe.count = -notif.args.player_id
            }

            // Redraw tiny labels
            this.resetSpirits(notif.args.spirits)

            // Add barrel
            notif.args.barrel.location_idx = 1;
            this.playerWashbackStock[notif.args.player_id].item.addCard(notif.args.barrel)

            // Add Label
            if (recipeDeck) {
                recipeDeck.setCardNumber(recipeDeck.getCardNumber(), recipe);
            }

            recipe.location = 'washback';
            //this.playerWashbackStock[notif.args.player_id].label.addCard(recipe);
            this.placeLabelOnWashback(recipe, notif.args.player_id)
            

        },
        notif_updateMarkets: function (notif) {
            console.log("update marketS");
            console.log(notif);

            // first move the old cards to the truck
            // TODO replace removal with move to truck
            this.expandMarket();

            notif.args.removed_cards.forEach (C => {
                console.log("Adding cards to truck")
                console.log(C)
                C.location = 'truck'
                if (C.market == 'du') 
                    this.addCardToTruck(C, 'du', this.decks.duTruck);
                else if (C.market == 'item')
                    this.addCardToTruck(C, 'item', this.decks.itemTruck);
                else if (C.market == "ing") 
                    this.addCardToTruck(C, 'ing', this.decks.ingTruck);
            });
            Object.keys(notif.args.new_markets).forEach(M => {
                this.notif_updateMarket({
                    args: {
                        market_id: M,
                        new_market: notif.args.new_markets[M],
                        removed_slot: notif.args.removed_slot,
                        deck_count: notif.args.deck_counts[M],
                    }
                })
            });
        },
        notif_updateMarket: function (notif) {
            console.log("update market");
            console.log(notif);

            deck = this.decks[notif.args.market_id];
            var stock = this.getStock(notif.args.market_id);

            notif.args.new_market.forEach( c => {
                this.activeCards[c.uid] = c;
                if (c.location_idx > notif.args.removed_slot) {
                    console.log("Don't need to update position: " + c.location_idx);
                    return;
                } 
                if (c.location_idx <= notif.args.removed_slot) {
                    deck.addCards([c]);
                }
                stock.addCards([c], null, {autoUpdateCardNumber: true});
                this.connectAllMarketCards();
                if (notif.args.deck_count) {
                    deck.setCardNumber(notif.args.deck_count);
                }
            });
        },
        /**
         * Format log strings
         *  @Override
         */
        format_string_recursive(log, args) {
            try {
                if (log && args && !args.processed) {
                    args.processed = true;

                    if (args.card_name !== undefined) {
                        let card;
                        let html = null;
                        if (args.row && args.row == "goals") {
                            card = args.card
                            html = this.getTooltipForGoal(args.card)
                        } else if (args.card) {
                            card = args.card
                        } else if (args.card_id) {
                            card = this.activeCards[args.card_id]
                        }
                        if (card) {
                            uid = Date.now() + args.card_name
                            args.card_name = `<span class="log-tooltip" id="log-${uid}">${_(args.card_name)}</span>`;
                            if (html == null) 
                                html = this.getTooltipForCard(card)
                            this.registerCustomTooltip(html, `log-${uid}`)
                        }
                    }
                    if (args.card1_name !== undefined) {
                        let card;
                        if (args.card1_id) {
                            card = this.activeCards[args.card1_id]
                        } else if (args.card1) {
                            this.activeCards[args.card1.uid] = args.card1
                            card = args.card1
                        }
                        if (card) {
                            uid = Date.now() + '_1'
                            args.card1_name = `<span class="log-tooltip" id="log-${uid}">${args.card1_name}</span>`;
                            html = this.getTooltipForCard(card)
                            this.registerCustomTooltip(html, `log-${uid}`)
                        }
                    }
                    if (args.card2_name !== undefined) {
                        let card;
                        if (args.card2_id) {
                            card = this.activeCards[args.card2_id]
                        } else if (args.card2) {
                            this.activeCards[args.card2.uid] = args.card2
                            card = args.card2
                        }
                        if (card) {
                            uid = Date.now() + '_2'
                            args.card2_name = `<span class="log-tooltip" id="log-${uid}">${args.card2_name}</span>`;
                            html = this.getTooltipForCard(card)
                            this.registerCustomTooltip(html, `log-${uid}`)
                        }
                    }
                }
            } catch (e) {
                console.error(log, args, 'Exception thrown', e.stack);
            }

            return this.inherited(arguments);
        }
        /*
        Example:
        
        notif_cardPlayed: function( notif )
        {
            console.log( 'notif_cardPlayed' );
            console.log( notif );
            
            // Note: notif.args contains the arguments specified during you "notifyAllPlayers" / "notifyPlayer" PHP call
            
            // TODO: play the card in the user interface.
        },    
        
        */
   });             
});
