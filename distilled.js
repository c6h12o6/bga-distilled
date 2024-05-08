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
                        //console.log("invisible because it's in the truck")
                        //console.log(card)
                        return false;
                    }
                    if (card.location == 'signature') {
                        //console.log(card)
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

                    if (card.count <= 0) {
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
                case 'ASIA': subtype = 'Asia & Oceania'; break;
                case 'warehouse1': subtype = "Warehouse 1"; break;
                case 'warehouse2': subtype = "Warehouse 2"; break;
                case 'distillerygoals': subtype = "Distillery Goals"; break;
            }
            subtype = subtype.replace(/(\w)(\w*)/g,
                function(g0,g1,g2){return g1.toUpperCase() + g2.toLowerCase();});
            return subtype;
        },
        
        getTooltipForCard(card) {
            var tt = document.createElement("tooltip_" + card.uid);
            var xBack = (card.card_id %  14) * 183;
            var yBack = Math.floor(card.card_id / 14) * 285;

            let text = this.card_text[card.card_id];
            if (text == undefined) 
                text = ""

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
                        ${card.name}
                        </div>
                        <div style="text-align: center">
                        ${subtype}
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

            let text = this.distiller_text?.[card.card_id];
            if (text == undefined) 
                text = ""

            let imageClass = "distillerCard"
            var formatHTML = `

                <div class="tooltipContainer">
                    <div class="${imageClass}" 
                        style="--width: 250px; --height: 360px; background-position-x: calc(-${xBack} * var(--width)); background-position-y: calc(-${yBack} * var(--height));"> 
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
            formatHTML = this.getTooltipForDistiller(card)
            this.addTooltipHtml(div.id, formatHTML, 1000)
        },
        addTooltipForGoal( card , div) {
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
                            ${card.name}
                        </div>
                        <br/>
                        <div style="text-align: left">
                            ${text}
                        </div>
                    </div>
                </div>
            `
            tt.appendChild(image);

            // Create the tooltip
            var tooltip = new dijit.Tooltip({
                connectId: [div.id], // Replace with the ID of your target element
                label: tt.innerHTML, // Set the image as the tooltip content
                showDelay: 1000 // Set a delay before showing the tooltip (optional)
            });
        },
        addTooltipForSA(card, div) {
            var tt = document.createElement("tooltip_sa_" + card.uid);
            const xBack = (card.uid %  8);
            const yBack = Math.floor(card.uid / 8);
            text = this.sa_text[card.uid];
            var image = document.createElement("image_" + card.uid);

            console.log(xBack)
            console.log(yBack)
            image.innerHTML = `
                <div class="tooltipContainer">
                    <div class="spiritAward" 
                         style="background-position-x: calc(-${xBack} * var(--width)); background-position-y: calc(-${yBack} * var(--height));"> 
                    </div>
                    <div>
                        <div> 
                            ${card.name}
                        </div>
                        <div>
                            ${card.sp} <div class='icon-sp-em'></div>
                        </div>
                        <br/>
                        <div style="text-align: left">
                            ${text}
                        </div>
                    </div>
                </div>
            `
            tt.appendChild(image);

            // Create the tooltip
            var tooltip = new dijit.Tooltip({
                connectId: [div.id], // Replace with the ID of your target element
                label: tt.innerHTML, // Set the image as the tooltip content
                showDelay: 1000 // Set a delay before showing the tooltip (optional)
            });
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
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            this._registeredCustomTooltips = {}
            this._attachedTooltips = {}

            // Setting up player boards
            this.player_list = [];
            this.player_names = {};
            this.player_data = {};


            for( var player_id in gamedatas.players )
            {


                document.getElementById("player_score_" + player_id).classList.add("invisible")
                document.getElementById("icon_point_" + player_id).classList.add("invisible")
                this.player_list.push(player_id)
                this.player_names[player_id] = gamedatas.players[player_id].name
                var player = gamedatas.players[player_id];
                this.player_data[player_id] = player;

                dojo.place(this.format_block('jstpl_player_supplement', {
                    ID: player_id, 
                    MONEY: player.money,
                }), 'player_board_' + player_id, 'last');

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

                // TODO: Setting up players boards if needed
                let section = dojo.place(this.format_block('jstpl_player_section', {
                    ID: player_id, 
                    NAME: player.name,
                    COLOR: player.color,
                }), 'activeBoard' , 'last');
                // Only create the pantries if this is my user
                // TODO this might cause problems, maybe we just need to make them and hide them
                console.log("Adding buttons")
                if (player_id == this.player_id) {
                    let revealedCardsButton = dojo.place(this.format_block('jstpl_floating_button', {
                        LOCATION: "Revealed Cards",
                        LOCATION_SHORT: "Revealed",
                    }), 'pantryButtons', 'last');
                    let pantryButton = dojo.place(this.format_block('jstpl_floating_button', {
                        LOCATION: "Pantry",
                        LOCATION_SHORT: "Pantry",
                    }), 'pantryButtons', 'last');
                    let srButton = dojo.place(this.format_block('jstpl_floating_button', {
                        LOCATION: "Storeroom",
                        LOCATION_SHORT: "Storeroom",
                    }), 'pantryButtons', 'last');
                    let finalButton = dojo.place(this.format_block('jstpl_floating_button', {
                        LOCATION: "Goals",
                        LOCATION_SHORT: "DistilleryGoals",
                    }), 'pantryButtons', 'last');
                    let washbackButton = dojo.place(this.format_block('jstpl_floating_button', {
                        LOCATION: "Washback",
                        LOCATION_SHORT: "Washback",
                    }), 'pantryButtons', 'last');
                    let warehouse1Button = dojo.place(this.format_block('jstpl_floating_button', {
                        LOCATION: "Warehouse 1",
                        LOCATION_SHORT: "Warehouse1",
                    }), 'pantryButtons', 'last');
                    let warehouse2Button = dojo.place(this.format_block('jstpl_floating_button', {
                        LOCATION: "Warehouse 2",
                        LOCATION_SHORT: "Warehouse2",
                    }), 'pantryButtons', 'last');
                    dojo.addClass(revealedCardsButton, 'invisible');
                    dojo.removeClass(revealedCardsButton, 'bgabutton_blue');
                    dojo.addClass(revealedCardsButton, 'bgabutton_red');
                }
                
                divbases = ['pantry', 'storeroom', 'reveal', 'distillerygoals', 'washback', 'warehouse1', 'warehouse2']
                divbases.forEach(db => {
                    dojo.place(this.format_block('jstpl_player_floater', {
                        ID: player_id, 
                        NAME: player.name,
                        COLOR: player.color,
                        DIVBASE: db,
                        DISPLAYBASE: this.getProperSubtype(db),
                    }), 'pantryWrap2' , 'last');

                    if (db == 'reveal')
                        return;

                    floater = document.getElementById(`${db}_wrapper_${player_id}`)
                    console.log(floater)
                    if (player_id == this.player_id)
                        floater.classList.add('currentPlayer')
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
                let div = document.getElementById('nextPlayer_' + player_id)
                dojo.connect(div, "onclick", this, 'nextPlayerVisible')
                div = document.getElementById('prevPlayer_' + player_id)
                dojo.connect(div, "onclick", this, 'prevPlayerVisible')
                dojo.connect(document.getElementById('du1_' + player_id), 'onclick', this, 'shuffle');

                // 1 indexed
                flightIdx = parseInt(gamedatas.flightCard) - 1;
                console.log("flightIdx is " + flightIdx);
                let elem = document.getElementById("myPlayerFlight_" + player_id);
                let xPos = (flightIdx % 4) * 33.3;
                let yPos = Math.floor(flightIdx / 4) * 50;
                elem.style.backgroundPositionX = xPos + '%';
                elem.style.backgroundPositionY =  + yPos + '%';

                console.log(this.activeCards)

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
                console.log(this.activeCards)


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

                if (gamedatas.distillers[player_id]?.length != 1) {
                    if (player_id == this.player_id) {
                        dojo.query('.distillerChoice').removeClass('invisible')
                    }
                }
                if (gamedatas.distillers[player_id]?.length == 1) {
                    console.log("placing chosen distiller")
                    if (player_id == this.player_id) {
                        dojo.query('.distillerChoice').addClass('invisible')
                    }
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
                console.log(id)
                elem = document.getElementById(id)
                console.log(elem)
                dojo.connect(elem, 'onclick', this, "onPrefClick")
            })
            btns = ['nowrapRadio', 'wrapRadio', 'scrollRadio']
            btns.forEach(id => {
                elem = document.getElementById(id)
                console.log(elem)
                dojo.connect(elem, 'onclick', this, 'onWrapClick')
            })

            // Place the distiller choice bar
            if (gamedatas.distillersSelected == 0 && gamedatas.distillers[this.player_id]?.length == 2) {
                console.log("placing distillers for choice")
                card1 = this.placeFlippyCard(this.player_id, 'distiller1', 'distiller', 
                    gamedatas.distillers[this.player_id][1].id);
                card2 = this.placeFlippyCard(this.player_id, 'distiller2', 'distiller', 
                    gamedatas.distillers[this.player_id][0].id);
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
                    this.decks.duTruck.addCard(X)
                else
                    this.duMarketStock.addCards([X]);
            })
            this.decks["du"].setCardNumber(parseInt(gamedatas.distillery_upgrade_market_count));

            gamedatas.premium_ingredient_market.forEach(X => {
                this.activeCards[X.uid] = X
                if (X.location == 'truck') 
                    this.decks.ingTruck.addCard(X);
                else
                    this.ingMarketStock.addCards([X]);
            })
            this.decks["ing"].setCardNumber(parseInt(gamedatas.premium_ingredient_market_count))

            gamedatas.premium_item_market.forEach(X => {
                this.activeCards[X.uid] = X;
                if (X.location == 'truck') {
                    this.decks.itemTruck.addCard(X);
                    //console.log("add to truck")
                    //console.log(X);
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
            })

            console.log(function () { return this.activeCards}())
            this.labels = {}
            for (var i = 0; i < gamedatas.flight.length; i++) {
                let X = gamedatas.flight[i]
                this.labels[X.name] = X;
                
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
                    console.log(this.sa_text[SA.uid])
                    console.log(strip_spans(this.sa_text[SA.uid]))
                    dojo.place(this.format_block('jstpl_spirit_award_blank', {
                        UID: SA.uid,
                        SA_NAME: SA.name,
                        X_OFF: (SA.uid % 8) * 5,
                        Y_OFF: Math.floor(SA.uid / 8) * 6,
                        SA_TEXT: strip_spans(this.sa_text[SA.uid]),
                        SA_TITLE: SA.name.toUpperCase(),
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

            //dojo.query('div[id^="du-card"]').connect('onclick', this, 'onDuCardClick');
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
            dojo.connect(div, "onclick", this, () => this.showDeckModal("ingTruck"))
            div = document.getElementById('premiumItemsTruck')
            dojo.connect(div, "onclick", this, () => this.showDeckModal("itemTruck"))

            div = document.getElementById('distilleryUpgradeTruck')
            dojo.connect(div, "onclick", this, () => this.showDeckModal("duTruck"))
            
            div = document.getElementById("floatingStoreroomButton");
            dojo.connect(div, "onclick", this, "showFloatingStoreRoom");


            dojo.query('.recipeCardGrow').connect("onclick", this, "toggleRecipeCardSize");




            this.closeFloaters()
            //this.showFloatingPantry();

            // Setup game notifications to handle (see "setupNotifications" method below)
            this.setupNotifications();
            addEventListener("resize", () => this.onResize());
            console.log( "Ending game setup" );

        },
       

        ///////////////////////////////////////////////////
        //// Game & client states
        
        // onEnteringState: this method is called each time we are entering into a new game state.
        //                  You can use this method to perform some user interface changes at this moment.
        //
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
        },

        onEnteringState: function( stateName, args )
        {
            console.log( 'Entering state: '+stateName );
            console.log(args);
            this.stateArgs = args
            this.stateName = stateName
            
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
                    if( this.isCurrentPlayerActive() )
                        this.connectAllCardsInComboStock(this.playerRevealStock[this.player_id])
                    break;
                case 'distill':
                case 'distill_post_trade': 
                    this.distillStartArgs = Object.assign({}, args);
                    console.log(args)
                    this.disconnectAllMarketCards();
                    this.collapseMarket(null);
                    if( this.isCurrentPlayerActive() )
                        this.connectCardsForDistill()

                    break;
                case 'selectRecipe':
                    console.log(args)
                    break;
                case 'sell':
                    this.savedPlayerCards = args.args.playerCards;
                    break;
                case 'selectFlavor': 
                    console.log("select flavor");
                    // add location to message
                    document.getElementById("pagemaintitletext").innerText += ' to ' + args.args.location;
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

            dojo.query('.dijitTooltip').removeClass('dijitTooltip')
            dojo.query('.dijitTooltipConnector').removeClass('dijitTooltipConnector')
            //tts.forEach( X => dojo.removeClass( );

            //dijit.Tooltip._masterTT.containerNode.innerHTML='';
            //dojo.removeClass(dijit.Tooltip._masterTT.id, "dijitTooltip");
            
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
                            remaining.innerText = _(`${args.basicRemaining} Basic Purchase Remaining`)
                        else 
                            remaining.innerText = _(`${args.basicRemaining} Basic Purchases Remaining`)

                        dojo.removeClass(remaining, "invisible")
                        args.discounts.forEach(D => {
                            console.log(D);

                            var type = D.subtype ? D.subtype : D.type;
                            type = type.toLowerCase();
                            typename = D.typename
                            // TODO consider passing through the distiller name
                            var cardName = (D.triggerCard.market == 'du') ? this.activeCards[D.triggerCard.uid].name : "Distiller Ability";
                            var coinSpan = ' <span class="icon-coin-em"> </span> ';
                            var s = '' + D.amount + coinSpan + ' off ' + typename + ' (' + cardName + ')';
                            var btn = this.addActionButton('discount' + D.triggerCard.uid, s,
                                (evt)=>{
                                    var elem = document.getElementById('discount' + D.triggerCard.uid);
                                    this.togglePowerButton(elem);
                                }
                            );
                            var elem = document.getElementById('discount' + D.triggerCard.uid);
                            elem.dataset["uid"] = (D.triggerCard.market == 'du') ? D.triggerCard.uid : 0; // 0 indicates a distiller ability
                            elem.classList.add('powerCard')
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
                                suffix = _(" (No labels remaining)")
                            }
                            this.addActionButton('select' + recipe + barrel,  _(recipe + " (" + barrel + ")") + suffix, ()=>{
                                this.ajaxcall( "/distilled/distilled/selectRecipe.html", {
                                    //recipe: recipe,
                                    recipeSlot: X.recipeSlot,
                                    barrel: X.barrelUid,
                                    drinkId: args.drinkId,
                                    lock: true,
                                }, this, function(result) {})});
                        })
                        break;
                    case 'sell':
                        var onlyAged = true;
                        args.drinks.forEach(D => {
                            console.log(D)
                            if (!D.aged) {
                                onlyAged = false;
                            }
                            this.addActionButton('select' + D.id, _(`${D.name} (${this.getProperSubtype(D.location)})`), () => {
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
                                    this.ajaxcall( "/distilled/distilled/skipSale.html", {lock: true},
                                        this, function(result) {})
                                })
                            }
                        }
                        break;
                    case 'distillReact':
                        console.log("distill react");
                        var any = false;
                        if (args.returnCard) {
                            console.log("Can return a card");
                            this.addActionButton('reactReturnButton', 
                                _("Return removed card to spirit ") + '(' + args.returnCard.triggerCard.name + ')',
                                () => {
                                    this.clientStateArgs = {returnCard: args.returnCard}
                                    this.setClientState('client_distillReactReturnCard', {
                                        descriptionmyturn: _('${you} must select a card to return to the spirit')
                                    })
                                })
                        }
                        if (args.signatureCard?.length) {
                            this.addActionButton("reactReturnSignature", 
                                _("Return ") + args.signatureCard[0].name + _(" to spirit"),
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
                                _("Distill spirit again ") + '(' + args.distillAgain.triggerCard.name + ')',
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
                    case 'client_distillReactReturnCard':
                        console.log("Distill react")
                        this.clientStateArgs.returnCard.returnableCards.forEach ((C) => {
                            this.addActionButton('reactReturnButton' + C.uid,
                                C.name,
                                () => {
                                    this.ajaxcall( "/distilled/distilled/addBack.html", {
                                        triggerCard: this.clientStateArgs.returnCard.triggerCard.uid,
                                        returnCard: C.uid,
                                        lock: true,
                                    }, this, function(result) {})
                                })
                            })
                        break;
                    case 'playerBuyTurnRevealSelect':
                    case 'fangXinRevealSelect':
                        console.log("water reveal");
                        // TODO make the decks clickable
                        var decks = ["Distillery Upgrade", "Premium Ingredient", "Premium Item", "Skip Reveal"]
                        var ii = 0;
                        decks.forEach(D => {
                            this.addActionButton('reveal' + ii++, D, () => {
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
                        var uid = Object.keys(args.allowedCards)[0];
                        var card = this.activeCards[Object.keys(args.allowedCards)[0]];
                        // TODO handle not enough money
                        this.addActionButton('buyButton', _('Buy ' ) + card.name, () => {
                            var powerNodes = dojo.query(".activePower");
                            var powers = [];
                            powerNodes.forEach(e => {
                                powers.push(e.dataset.uid);
                            });
                            cost = this.getEffectiveCost(card.uid) 
                            let money = this['money_counter_' + this.player_id].getValue();
                            if (args.allowedCards[uid].market == 'du') {
                                this.placeDuPrompt(card, powers.join(','))
                            } else {
                                button = _(`Confirm buy ${card.name} for ${cost}`) + '<span class="icon-coin-em"> </span>';
                                buttonDom = this.confirmButton( button, "buyCard", {
                                    cardName: card.uid,
                                    marketName: args.allowedCards[uid].market,
                                    slotId: 0,
                                    lock: true,
                                    powers: powers.join(','),
                                })

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
                        buyButton.innerHTML = _(`Buy ${card.name} for ${cost} <span class='icon-coin-em'></span>`);
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
                            var coinSpan = ' <span class="icon-coin-em"> </span> ';
                            var s = '' + D.amount + coinSpan + ' off ' + typename + ' (' + cardName + ')';
                            var btn = this.addActionButton('discount' + D.triggerCard.uid, s,
                                (evt)=>{
                                    var elem = document.getElementById('discount' + D.triggerCard.uid);
                                    this.togglePowerButton(elem);
                                }
                            );
                            var elem = document.getElementById('discount' + D.triggerCard.uid);
                            elem.dataset["uid"] = (D.triggerCard.market == 'du') ? D.triggerCard.uid : 0; // 0 indicates a distiller ability
                            elem.classList.add("powerButton")
                            elem.classList.add("powerCard")
                        })
                        this.addActionButton('returnButton', 'Pass', () => {
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
                        let cb = function(prototype, market) {
                            console.log(this)
                            prototype.replaceActionBar("Choose a card to buy") 
                            args.options.forEach(O => {
                                O.allowedCards.forEach(C => {
                                    if (C.market != market)
                                        return;

                                    let money = prototype['money_counter_' + prototype.player_id].getValue();
                                    let cost = prototype.getEffectiveCost(C.uid)
                                    let btn = prototype.addReplacementActionButton(`btn_${C.card_id}`, C.name, () => {
                                        console.log(prototype)
                                        button = _(`Buy ${C.name} for ${cost} <span class='icon-coin-em'></span>`)

                                        // Handle DU here
                                        if (market == 'du') {
                                            prototype.placeDuPrompt(C, O.triggerUid)
                                        } else {
                                            conf = prototype.confirmButton(button, "buyCard", {
                                                cardName: C.uid,
                                                marketName: C.market,
                                                powers: O.triggerUid,
                                                lock: true,
                                            })
                                            if (cost > money)
                                                dojo.addClass(conf, "disabled")
                                        }
                                    })
                                    if (cost > money)
                                        dojo.addClass(document.getElementById(`btn_${C.card_id}`), "disabled")
                                    prototype.addTooltipForCard(C, document.getElementById(`btn_${C.card_id}`))
                                })
                            })
                        }
                        if (args.powercard == 123) {
                            console.log("123")
                            this.addActionButton("showDu", _("Distillery Upgrade Truck"), () => cb(this, "du"))
                            this.addActionButton("showItem", _("Premium Item Truck"), () => cb(this, "item"))
                            this.addActionButton("showIng", _("Premium Ingredient Truck"), () => cb(this, "ing"))
                            this.addActionButton("passBtn", _("Skip Trucker"), () => {
                                this.ajaxcall( "/distilled/distilled/roundStartPass.html", {
                                    power: args.options[0].triggerUid,
                                    lock: true,
                                }, this, function(r) {})
                            })
                            return;
                        }
                        args.options.forEach(O => {
                            
                            O.allowedCards.forEach(C => {
                                console.log(O)
                                console.log(C)
                                let action = "Collect "

                                if (O.trigger == 124 || O.trigger == 34)
                                    action = "Buy "

                                // TODO replace this with buy if it's a buy
                                iconType = C.subtype ? C.subtype : C.type 
                                this.addActionButton('buyButton' + C.uid, 
                                    `${action} ${C.name} <span class="icon-${iconType.toLowerCase()}-em"></span> (${O.triggerName})`, () => {
                                    if (C.market == 'du') {
                                        this.clientStateArgs = {
                                            slotId: 0,
                                            cardName: C.uid,
                                            marketName: 'du',
                                            powers: O.triggerUid,
                                            lock: true,
                                        }
                                        this.setClientState("client_chooseDuSlot", {
                                            descriptionmyturn : _("${you} must select an upgrade slot for " + C.name)
                                        })
                                    } else {
                                        this.ajaxcall( "/distilled/distilled/buyCard.html", {
                                            cardName: C.uid,
                                            marketName: C.market,
                                            slotId: 0,
                                            powers: O.triggerUid,
                                            lock: true,
                                        }, this, function(result) {});
                                    }
                                })

                                console.log(C)
                                if (O.trigger == 34) {
                                    console.log("Inside")
                                    buyButton = document.getElementById("buyButton" + C.uid)
                                    buyButton.dataset.uid = C.uid
                                    cost = this.getEffectiveCost(C.uid) 
                                    let money = this['money_counter_' + this.player_id].getValue();
                                    buyButton.innerHTML = _(`Buy ${C.name} for ${cost} <span class='icon-coin-em'></span>`);
                                    if (cost > money) {
                                        dojo.addClass(buyButton, "disabled")
                                    }
                                }

                                this.addTooltipForCard(C, document.getElementById('buyButton' + C.uid))
                            })
                            if (O.pass) {
                                this.addActionButton('pass_button', _(`End Ability (${O.triggerName})`), ()=>{
                                    this.ajaxcall( "/distilled/distilled/roundStartPass.html", {
                                        power: O.triggerUid,
                                        lock: true,
                                    },
                                    this, function(result) {})})
                                }
                        })
                       break;
                    case 'selectFlavor':
                        Object.keys(args.allowedCards).forEach(C => {
                            let card = this.activeCards[C];
                            this.addActionButton('buyButton' + card.uid, _('Select ' ) + card.name, () => {
                                    this.ajaxcall( "/distilled/distilled/selectFlavor.html", {
                                        flavor: C,
                                        drink: args.drink,
                                        lock: true,
                                    }, this, function(result) {});
                                })
                        })
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
                                    // TODO show something useful
                                    console.log("you can only trade with one card selected")
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
                                /*
                                this.setClientState("client_trade_card", {
                                    descriptionmyturn : _("${you} must pick a basic ingredient."),
                                });
                                */
                               this.beginTrade(`Trade ${this.activeCards[selected[0]].name} for: `, selected[0])
                            });
                        }

                        // falling through
                    case 'distill_post_trade':
                        console.log("connecting cards for distil")

                        this.addActionButton('distill_button', _(
                            `Distill Selected Cards 
                            <span id="yc_wrap"> <span id="yc"> </span> <span class="icon-yeast-em">   </span> </span>
                            <span id="wc_wrap"> <span id="wc"> </span> <span class="icon-water-em">   </span> </span>
                            <span id="ac_wrap"> <span id="ac"> </span> <span class="icon-alcohol-em"> </span> </span>
                            <span id="gc_wrap"> <span id="gc"> </span> <span class="icon-grain-em">   </span> </span>
                            <span id="pc_wrap"> <span id="pc"> </span> <span class="icon-plant-em">   </span> </span>
                            <span id="fc_wrap"> <span id="fc"> </span> <span class="icon-fruit-em">   </span> </span>
                             `), ()=>{
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

                            this.ajaxcall( "/distilled/distilled/distill.html", {
                                washbackCards: wbCards.join(","),
                                tradeIn: this.clientStateArgs?.trade?.in,
                                tradeOut: this.clientStateArgs?.trade?.out,
                                lock: true,

                            }, this, function(result) {})
                        });
                        this.addTooltip("distill_button", 
                            _("Click this button to distill"), 
                            _("Must select at least 1 yeast, 1 water, and 1 sugar"), 1000);

                        // Add counters to the button
                        var counter = new ebg.counter();
                        counter.create("yc");
                        counter.setValue(0);
                        this.yeastCounter = counter;
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
                                elem = this.playerPantryStock[this.player_id].ing.getCardElement(X);
                                if (dojo.hasClass(elem, 'selected')) {
                                    console.log(`${X.name} is already selected`)
                                    return;
                                } else {
                                    console.log(`${X.name} is not currently selected`);
                                }
                                console.log(this.pantrySelection[X.uid])

                                this.showFloatingPantry();
                                this.onPantryClickElem(elem)
                            });

                       })

                        dojo.addClass('distill_button', "disabled-looking");
                        this.addActionButton('skip_button', _('Skip Distill'), ()=>{
                            this.confirmButton(_(`End Distill Phase`), "skipDistill", {lock: true}, null, 
                                _(`<span style='color: red'> You are about to skip distilling for the round. Confirm? </span>`))
                        });
                        elem = document.getElementById('trade_card_button')
                        if (elem)
                            dojo.addClass('trade_card_button', "disabled");


                        this.addActionButton('restart_distill_button', _('Restart Distill'), ()=>{
                            this.confirmButton(_(`Restart Distill`), "restartDistill", {lock: true})
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
                            this.addActionButton('powerButton' + PC.uid, _(PC.description) + ' (' + PC.name + ')', ()=>{
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
                                this.confirmButton(_(`Restart Distill`), "restartDistill", {lock: true})
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
                        if (this.getActivePlayers().includes("" + this.player_id)) {
                            args.allowedCards.reverse().forEach(C => {
                                if (C.player_id != this.player_id)
                                    return;

                                let card = C
                                this.addActionButton('selectButton' + card.id, _('Select ' ) + card.name, () => {
                                        this.ajaxcall( "/distilled/distilled/selectDistiller.html", {
                                            player_id: this.player_id,
                                            card: card.id,
                                            lock: true,
                                        }, this, function(result) {});
                                    })
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
          Object.keys(this._registeredCustomTooltips).forEach((id) => {
            if ($(id)) {
                console.log("inside id")
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
                    this.replaceActionBar(`Place Label Bonus: Select card to collect`, 
                        'revertActionBarAndResetCards')
                    console.log('ing')
                    this.connectAllCardsWithClass('onMarketClickLabelReward', 'ing-card');
                    break;
                case 5:
                    this.replaceActionBar(`Place Label Bonus: Select card to collect`, 
                        'revertActionBarAndResetCards')
                    console.log('item')
                    this.connectAllCardsWithClass('onMarketClickLabelReward', 'item-card');
                    break;
                case 6: 
                    this.replaceActionBar(`Place Label Bonus: Select card to collect`, 
                        'revertActionBarAndResetCards')
                    console.log('du')
                    this.connectAllCardsWithClass('onMarketClickLabelReward', 'du-card');
                    break;
                case 4:
                    this.replaceActionBar(`Place Label Bonus: Select recipe to collect`, 
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

            this.replaceActionBar(_(`Place Label Bonus: Select a card to collect`),
                'revertActionBarAndResetCards')
            cards = truck.getCards();
            console.log(cards)
            // TODO figure out how to do tooltips here in this text
            cards.forEach(C => {
                console.log(C)
                this.addReplacementActionButton('trade' + C.uid + 'Button', 
                    _(C.name),
                    () => {
                        if (C.type == 'DU') {
                            args.cardIn = C.uid
                            if (C.uid < 1000) { // Not bottomless
                                this.decks.duTruck.addCard(C)
                            } else {
                                this.ingVoidStock.addCard(C)
                            }
                            this.placeDuPrompt(C, [], args)
                            return;
                        } else {
                            args.cardIn = C.uid
                            console.log(this.clientStateArgs);
                            discard = this.activeCards[args.discard].name
                            args.lock = true
                            this.confirmButton(`Discard ${discard} and collect ${C.name}`, 
                                "sellDrink", 
                                this.getAjaxArgsFromArgs(args),
                                'revertActionBarAndResetCards',
                            )
                        }
                    })
            })
        },
        tradeWithTruck(args) {
            var truckCount = 0;
            truckCount += this.decks.duTruck.getCards().length;
            truckCount += this.decks.ingTruck.getCards().length;
            truckCount += this.decks.itemTruck.getCards().length;

            this.replaceActionBar(_(`Place Label Bonus: Select a card from the pantry to discard`), 
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
                    C.name,
                    () => {
                        Ccopy = {}
                        Object.assign(Ccopy, C);

                        Ccopy.location = 'truck'
                        if (C.uid < 1000) { // not bottomless
                            switch (C.market) {
                                case 'du':
                                    this.decks.duTruck.addCard(Ccopy);
                                    break;
                                case 'ing':
                                    this.decks.ingTruck.addCard(Ccopy);
                                    break;
                                case 'item':
                                    this.decks.itemTruck.addCard(Ccopy);
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
        tradeWithTruck_SelectTruck(args) {
            console.log('trade with truck')
            console.log(args)

            let mapping = {
                'Item Truck': 'item',
                'Ingredient Truck': 'ing',
                'Distillery Upgrade Truck': 'du',
            }
            // TODO make the trucks selectable
            this.replaceActionBar(_(`Place Label Bonus: Select a truck`), 
                'revertActionBarAndResetCards')
            Object.keys(mapping).forEach(T => {
                switch (mapping[T]) {
                    case 'du': 
                        if (this.decks.duTruck.getCards().length == 0)
                            return;
                        break;
                    case 'ing': 
                        if (this.decks.ingTruck.getCards().length == 0)
                            return;
                        break;
                    case 'item':
                        if (this.decks.itemTruck.getCards().length == 0)
                            return;
                        break;
                }
                this.addReplacementActionButton('view' + (mapping[T]) + 'TruckButton', 
                    T,
                    () => {
                        console.log("Clicked on " + T + mapping[T])
                        args.tradeTruck = mapping[T]
                        this.tradeWithTruck_SelectCard(args)
                    }
                )
            })
        },
        rewardOrSp(args) {
            console.log("client select reward") 
            console.log(args)
            args.optForSp = false;
            this.replaceActionBar(_(`Selling ${args.drink.name}: Choose reward or 2 <span class='icon-sp-em'></span>`), 
                'revertActionBarAndResetCards')
            this.addReplacementActionButton('labelSpButton', 
                "2 <span class='icon-sp-em'></span>", () => {
                    args.optForSp = true
                    this.confirmButton(
//`Sell ${args.drink.name} in ${args.bottle.name}. Place label on ${args.labels[args.labelSlot]} for 2 <span class='icon-sp-em'></span>` , "sellDrink", {
`Place label on ${args.labels[args.labelSlot]} for 2 <span class='icon-sp-em'></span>` , "sellDrink",
                        this.getAjaxArgsFromArgs(args),
                        'revertActionBarAndResetCards')
                })
            this.addReplacementActionButton('labelRewardsButton', 
                _(args.labels[args.labelSlot]), () => {
                    switch (args.labelSlot) {
                        case 0:
                            this.confirmButton(
`Place label on ${args.labels[args.labelSlot]} for 5 <span class='icon-coin-em'></span>` , "sellDrink", 
//`Sell ${args.drink.name} in ${args.bottle.name}. Place label on ${args.labels[args.labelSlot]} for 5 <span class='icon-coin-em'></span>` , "sellDrink", {
                                this.getAjaxArgsFromArgs(args),
                                'revertActionBarAndResetCards')
                            break;
                        case 1:
                            this.confirmButton(
//`Sell ${args.drink.name} in ${args.bottle.name}. Place label on ${args.labels[args.labelSlot]} for Signature Ingredient` , "sellDrink", {
`Place label and collect Signature Ingredient` , "sellDrink", 
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

            this.replaceActionBar(_(`Place label for ${args.drink.name}: `), 'revertActionBarAndResetCards')
            this.getAvailableLabelSlots(this.player_id).reverse().forEach(S => {
                // TODO connect the slots too
                console.log(S);
                this.addReplacementActionButton('label' + S, _(`${args.labels[S]} or 2 <span class='icon-sp-em'></span>`), () => {
                    args.labelSlot = S
                    let loc = args.drink.location
                    console.log(args)
                    switch (loc) {
                        case 'washback':
                            labelCard = this.playerWashbackStock[this.player_id].label.getCards();
                            break;
                        case 'warehouse1':
                            labelCard = this.playerWarehouse1Stock[this.player_id].label.getCards();
                            break;
                        case 'warehouse2':
                            labelCard = this.playerWarehouse2Stock[this.player_id].label.getCards();
                            break;
                    }
                    this.playerLabelStock[this.player_id][S].addCard(labelCard[0]);
                    this.rewardOrSp(args)
                })
            })
        },
        chooseBottle(args) {
            console.log("choose bottle");
            console.log(args)

            this.replaceActionBar(_(`Choose a bottle for ${args.drink.name}: `), 'revertActionBarAndResetCards')
            args.bottles.forEach((B) => {
                // TODO connect the cards also
                this.addReplacementActionButton(`bottle${B.uid}`, B.name, () => {
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
                            `Sell ${args.drink.name}`, 
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
                        p.parentElement.style.overflow = 'unset';
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
                newSibling = document.getElementById(`display_${this.player_id}_wrapper`)
                newSibling.parentElement.insertBefore(pantry, newSibling.nextSibling)
                document.getElementById("pantryButtons").classList.add('invisible')
                pantry.classList.remove("pantryWrap")
                pantry.classList.remove("pantryWrapTop")
                pantry.classList.add("pantryExpanded")
                this.closeFloaters()
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
            let args = {
                cardName: C.uid,
                marketName: 'du',
                powers: power,
                slotId: slotId,
                lock: true,
            }

            if (placeLabelArgs) {
                args = placeLabelArgs
                this.replaceActionBar(_(`Place ${C.name} on: `), 'revertActionBarAndResetCards')
            } else {
                this.replaceActionBar(_(`Place ${C.name} on: `))
            }

            for (let ii = 3; ii > 0; ii--) {
                var divname = 'du' + ii + "_" + this.player_id + '-front';
                var elem = document.getElementById(divname);
                existing = _("Empty")
                if (elem) {
                    existing = this.activeCards[elem.dataset.uid].name
                } 

                this.addReplacementActionButton(`btn_slot`+ii, _(`Slot ${ii} (${existing})`), () => {
                    if (placeLabelArgs) { // Indicates place label stage
                        if (args.discard) {
                            discard = this.activeCards[args.discard].name
                            args.duSlot = function () { return ii }();
                            this.confirmButton(`Discard ${discard} and collect ${C.name} on slot ${ii}`, 
                                'sellDrink',
                                this.getAjaxArgsFromArgs(args),
                                'revertActionBarAndResetCards')
                        } else {
                            args.duSlot = function () { return ii }();
                            this.confirmButton(`Collect ${C.name} on slot ${ii}`, 
                                'sellDrink',
                                this.getAjaxArgsFromArgs(args),
                                'revertActionBarAndResetCards')
                        }
                    } else {
                        args.duSlot = function () { return ii }(),
                        this.confirmButton(`Place ${C.name} on slot ${ii}`, "buyCard", 
                            args)
                    }
                })
            }
        },
        beginTrade(prompt, tradeOut) {
            this.replaceActionBar()
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
                    cardIcon = this.activeCards[card_no].subtype;
                    let cardNameSave = function () {return cardName}()
                    this.addReplacementActionButton(`btn_${card_no}`, `${cardName} <span class='icon-${cardIcon}-em'></span>`, () => {
                        titleElement.innerHTML = ""
                        button = `Trade ${cardNameSave} for ${swap.name}`
                        this.confirmButton(button, "trade", {
                            playerId: this.player_id,
                            in: function() {return card_no}(),
                            out: tradeOut,
                            lock: true})
                    })
                }
            })
        },
        confirmButton(buttonText, url, args, cb, title) {
            if (title)
                this.replaceActionBar(title, cb);
            else 
                this.replaceActionBar('Confirm Action. This will end your turn.', cb);

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
        replaceActionBar(title, cancelCb) {
            actionBar = document.getElementById("generalactions")
            if (!this.actionBarParent)
                this.actionBarParent = actionBar.parentElement

            cb = cancelCb ? cancelCb : 'revertActionBar'
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
            this.addReplacementActionButton('cancel_button', 'Cancel', cb)
            //this.actionBarParent.appendChild(clone)
            this.actionBarParent.insertBefore(clone, actionBar)
        },
        revertActionBarAndResetCards() {
            console.log("revert action bar and reset cards")
            this.revertActionBar();
            this.disconnectAllMarketCards();
            console.log(this.savedPlayerCards)
            this.setupPlayerCards(this.player_id, this.savedPlayerCards)
        },
        revertActionBar() {
            console.log("Revert")
            console.log(this.actionBarReplacement)
            console.log(this)
            console.log(this.oldtitle)
            if (this.actionBarReplacement) {
                while (this.actionBarReplacement.hasChildNodes()) {
                    console.log("destroying")
                    console.log(this.actionBarReplacement.firstChild)
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
                if (card_id == 19 || card_id == 20)
                    return;

                let handle = dojo.connect(pc, 'onclick', this, 'onPantryClick');
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
            // remove some cards to ensure idempotency
            // Remove cards over 10,000 which are unknown flavor cards
            removeFlavor = function (C, stock) {
                if (C.uid > 10000)
                    stock[pid].ing.removeCard(C);
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
                    console.log(X.market)
                    console.log(X)
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
                            this.playerLabelStock[pid][X.location_idx].addCard(X);
                        } else { // TODO remove if this works. if (pid == this.player_id) { // regular card
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
                            this.playerWashbackStock[pid].label.addCard(X);
                        }
                        // TODO do something to mark the number in the washback
                    } else if (X.location == 'display') {
                        X.location_idx = 1;
                        this.playerDisplayStock[pid].item.addCard(X);
                        dojo.removeClass(this.playerDisplayStock[pid].item.getCardElement(X), 'marketCard')
                    } else if (X.location == 'warehouse1') {
                        X.location_idx = 1;
                        if (X.market == 'ing')
                            this.playerWarehouse1Stock[pid].ing.addCard(X);
                        if (X.market == 'item')
                            this.playerWarehouse1Stock[pid].item.addCard(X);
                        if (X.market == 'label')
                            this.playerWarehouse1Stock[pid].label.addCard(X);
                        if (X.market == 'flavor')  {
                            this.playerWarehouse1Stock[pid].ing.addCard(this.newFlavorBack());
                        }
                    } else if (X.location == 'warehouse2') {
                        X.location_idx = 1;
                        if (X.market == 'ing')
                            this.playerWarehouse2Stock[pid].ing.addCard(X);
                        if (X.market == 'item')
                            this.playerWarehouse2Stock[pid].item.addCard(X);
                        if (X.market == 'label')
                            this.playerWarehouse2Stock[pid].label.addCard(X);
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
                console.log(e)
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
                        console.log('ajani')
                        if (marketCard.type == 'BOTTLE') {
                            console.log("bottle")
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
            dojo.query('.firstPlayer').addClass('invisible')
            dojo.removeClass('first_player_' + player_id, 'invisible')
        },
        showTurn: function(turn) {
            //console.log("calling showturn")
            dojo.query('.turnHighlight').addClass('invisible')
            //console.log('.turnHighlight' + turn)
            //console.log(dojo.query('.turnHighlight' + turn))
            dojo.query('.turnHighlight' + turn).removeClass('invisible')
        },
        togglePowerButton: function(elem) {
            // updates button, adds check mark, and returns the new state
            if (dojo.hasClass(elem, 'activePower')) {
                //console.log(elem.innerHtml)
                elem.innerHTML = elem.innerHTML.substring(0, elem.innerHTML.length - 2)
                dojo.removeClass(elem, 'activePower');
                if (this.stateName == 'playerBuyTurnReveal') {
                    buyButton = document.getElementById("buyButton")
                    uid = buyButton.dataset.uid
                    cost = this.getEffectiveCost(uid) 
                    card = this.activeCards[uid]
                    let money = this['money_counter_' + this.player_id].getValue();
                    buyButton.innerHTML = _(`Buy ${card.name} for ${cost} <span class='icon-coin-em'></span>`);
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
                //console.log(elem.innerHtml)
                elem.innerHTML += ' \u2713' 
                dojo.addClass(elem, 'activePower');
                if (this.stateName == 'playerBuyTurnReveal') {
                    buyButton = document.getElementById("buyButton")
                    uid = buyButton.dataset.uid
                    cost = this.getEffectiveCost(uid) 
                    card = this.activeCards[uid]
                    let money = this['money_counter_' + this.player_id].getValue();
                    buyButton.innerHTML = _(`Buy ${card.name} for ${cost} <span class='icon-coin-em'></span>`);
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
        placeFlippyCard: function(player_id, divname, type, card_id) {
            card_id = parseInt(card_id)
            dojo.place(
                this.format_block('jstpl_distiller', {
                    ID: player_id,
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
                
                console.log("adding tooltip to flippy card" + card_id)
                this.addTooltipForCard(this.activeCards[card_id], card)
            }

            dojo.connect(card, 'onclick', this, () => {
                console.log("FLIP!")
                console.log(card)
                console.log(card.parentElement)
                console.log(this.activeCards)
                side = card.dataset.side;
                if (side == "front")
                    card.dataset.side = 'back';
                else
                    card.dataset.side = 'front'
            })

            return card;
        },
        showDeckModal: function(srcName) {
            if (!this.contentNode) {
                return;
            }
            let cards = [];
            let truck = null;
            if (srcName == 'itemTruck') {
                truck = this.decks.itemTruck;
                this.modal.title = _("Item Truck")
            } else if (srcName == 'ingTruck') {
                truck = this.decks.ingTruck
                this.modal.title = _("Ingredients Truck")
            } else if (srcName == 'duTruck') {
                truck = this.decks.duTruck
                this.modal.title = _("Distillery Upgrades Truck")
            }
            cards = truck.getCards()
            let money = this['money_counter_' + this.player_id].getValue();
            cards.forEach(c => {
                clone = truck.getCardElement(c).cloneNode(true);
                if (clone) {
                    clone.dataset["side"] = "front";
                    elem = document.getElementById(clone.id + "-front")
                    clone.id += "-clone"
                    //console.log(clone);
                    this.contentNode.appendChild(clone)
                    this.addTooltipForCard(c, clone)
                    if (this.stateName == 'roundStartAction' && this.stateArgs?.args?.powercard == 123) {
                        console.log("in")
                        cost = this.getEffectiveCost(c.uid)
                        if (cost <= money) {
                            dojo.connect(clone, 'onclick', this, () => {
                                    if (c.market == 'du') {
                                        this.placeDuPrompt(c, this.stateArgs?.args.options[0].triggerUid)
                                    }
                                    else {
                                        this.confirmButton(_(`Buy ${c.name} for ${cost} <span class='icon-coin-em'></span>`),
                                            "buyCard", {
                                                cardName: c.uid,
                                                marketName: c.market,
                                                slotId: 0,
                                                powers: this.stateArgs?.args.options[0].triggerUid,
                                                lock: true,
                                            })
                                    }
                                    this.modal.hide()
                                })
                        } else {
                            dojo.addClass(clone, 'disabledMarket')
                        }
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
            return {uid: this.nextFlavor++, location_idx: 0, name: "Unknown Flavor", flavor: true, type: "FLAVOR"}
        },
        makeComboStock: function(divbase, player_id, hideWhenEmpty=false) {
            console.log(`make combo stock for ${divbase} ${player_id}`)
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
                    ID: player_id,
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
                        {direction: "column", wrap: "nowrap"});
                ret.label.addCardCallback = addCardCallback;
                ret.label.removeCardCallback = removeCardCallback;
            }

            ret.item = new LineStock(
                    this.itemCardsManager,
                    document.getElementById(divbase + player_id),
                    {direction: "row", wrap: "nowrap", center: false}
            );
            ret.item.addCardCallback = addCardCallback;
            ret.item.removeCardCallback = removeCardCallback;

            ret.ing = new LineStock(
                this.ingCardsManager,
                document.getElementById(divbase + player_id),
                {direction: 'row', wrap: 'nowrap', center: false}
            );
            ret.ing.addCardCallback = addCardCallback;
            ret.ing.removeCardCallback = removeCardCallback;

            ret.du = new LineStock(
                this.duCardsManager,
                document.getElementById(divbase + player_id),
                {direction: 'row', wrap: 'nowrap', center: false}
            );
            ret.du.addCardCallback = addCardCallback;
            ret.du.removeCardCallback = removeCardCallback;



            ret.addLabel = (card) => {
                // Turn this into the label image
                //document.getElementById("canvas_name_"+divbase+player_id).innerHTML = card.name;

                // Just plop a label on there and move on
                size = this.cardSize(card);
                outer_div = document.getElementById(`canvas_label_${divbase}${player_id}`)
                dojo.removeClass(outer_div, "invisible")
                // TODO handle warehouse without label
                div = document.getElementById(`canvas_label_${divbase}${player_id}_inner`)
                div.style.width = `var(--width)`
                div.style.flexBasis = `var(--width)`
                div.style.height = `var(--height)`

                label = card.label
                if (card.location != 'flight' && card.signature == true) {
                    label += 18;
                }
                const xBack = (label %  6);
                const yBack = Math.floor(label / 6);
                div.style.backgroundPositionY = `calc(-${yBack} * var(--height))`
                div.style.backgroundPositionX = `calc(-${xBack} * var(--width))`

                if (card.count <= 0) {
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
                    // Delete another one first, this can fail and that's fine
                    // TODO update the costs
                    // Instead of destroying and recreating, consider animating
                    dojo.place(this.format_block('jstpl_icon', {
                        ID: player_id,
                        UID: card.uid,
                        TYPE: type.toLowerCase(),
                        TOOLTIP: card.name,
                        DIVBASE: divbase,
                    }), ret.canvas, 'last');
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
            for (i = 0; i < alcohols.length; i++) {
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
            let wbCards = notif.args.wb_cards;

            // Count the alcohols
            // TODO animate the alcohols being added
            // Now that we've called ajax, lets do some animations

            let player_id = notif.args.player_id;
            if (this.player_id == notif.args.player_id)
                dojo.removeClass('washback_' + this.player_id + '_deck', 'invisible');

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
                for (var i = 0; i < wbCards.length; i++) {
                    if (this.activeCards[wbCards[i]].type == "ALCOHOL") {
                        alcohols.push(this.activeCards[wbCards[i]]);
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
                let elem = document.getElementById("tempPantry" + this.player_id)
                console.log(elem)

                tmpStock = new CardStock(
                    this.ingCardsManager,
                    elem
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
            elem = this.ingCardsManager.getCardElement(this.activeCards[notif.args.card1_id])
            this.market2Pantry(elem, 'pantryCard');
            card1.location_idx = 1;

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
                elem = this.ingCardsManager.getCardElement(this.activeCards[notif.args.card2_id])
                this.market2Pantry(elem, 'pantryCard');
                card2.location_idx = 1;
            }

            // Add cards to washback stock
            let wbCardObjects = notif.args.wb_cards.map(X => this.activeCards[X])
            console.log(wbCardObjects);
            wbCardObjects.forEach(C => {
                C.location_idx = 1;
                // Adding ingredients card to washback
                console.log("setting zIndex to 0")
                let element = this.playerWashbackStock[player_id].ing.getCardElement(C);
                element.style.zIndex = 0;
                this.playerWashbackStock[player_id].ing.addCard(C);
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

       },
       shuffle: function(evt) {
            console.log('shuffle')
            /*
            console.log(this.decks[this.player_id])
            this.decks[this.player_id].setCardNumber(10);
            this.decks[this.player_id].shuffle();
            */
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
                dojo.removeClass('yc_wrap', 'invisible')
                this.yeastCounter.setValue(yeast);
            } else {
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
                this.confirmButton(
_(`Confirm sale and collect ${this.activeCards[cardName].name}`), 
                    'sellDrink',
                    this.getAjaxArgsFromArgs(args), 'revertActionBarAndResetCards')
            }
        },
        onMarketClick: function(evt) {
            dojo.stopEvent(evt);
            console.log("onMarketClick")
            console.log(evt);
            console.log(evt.currentTarget);

            if (!dojo.hasClass(evt.currentTarget, "marketCard")) {
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
            powerNodes.forEach(e => {
                powers.push(e.dataset.uid);
            });
            if (evt.currentTarget.classList.contains('du-card')) {
                // For distillery upgrade cards, we put you in a position to pick which slot you want.
                this.placeDuPrompt(this.activeCards[cardName], powers.join(','), null, slotId)
            } else {
                if (this.stateName == 'playerBuyTurn'  || this.stateName == 'playerBuyTurnReveal') {
                    let effectiveCost = this.getEffectiveCost(cardName);
                    let description = '';
                    if (effectiveCost < 0) {
                        effectiveCost = 0;
                        description +=  '<span style="color: red;">' + _('Warning: Discounted below 0.') + "</span>";
                    }
                    let c = this.activeCards[cardName];
                    let button = _(`Purchase ${c.name} for ${effectiveCost}`) +  "<span class='icon-coin-em'></span>";
                    confirmBtn = this.confirmButton(button,
                                            "buyCard", {
                                                cardName: cardName,
                                                marketName: match[1],
                                                slotId: slotId,
                                                lock: true,
                                                powers: powers.join(','),
                                            })
                    let money = this['money_counter_' + this.player_id].getValue();
                    if (effectiveCost > money) {
                        dojo.addClass(confirmBtn, "disabled")
                    }
                    /*
                    prevArgs = Object.assign({}, this.stateArgs);
                    delete prevArgs.reflexion
                    this.clientStateArgs = {
                        prevState: "playerBuyTurn",
                        prevArgs: prevArgs,
                        prevDescription: this.stateArgs.descriptionmyturn,
                        url: "/distilled/distilled/buyCard.html",
                        ajaxArgs: {
                            slotId: slotId,
                            cardName: cardName,
                            marketName: match[1],
                            powers: powers.join(','),
                            lock: true},
                        buttonText: button,
                    }
                    console.log(this.clientStateArgs);

                    this.setClientState("client_confirm", {
                        descriptionmyturn : description,
                    })
                    */
                } else {
                    this.ajaxcall( "/distilled/distilled/buyCard.html", {
                        slotId: slotId,
                        cardName: cardName,
                        marketName: match[1],
                        powers: powers.join(','),
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

            console.log(this.recipeFlight)
            if (this.stateName.startsWith("placeLabel"))
                button = _(`Collect ${recipeName} recipe`)
            else 
                button = _(`Confirm buy ${recipeName} for ${cost}`) + '<span class="icon-coin-em"> </span>';
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
            this.confirmButton(_(`Confirm sale and collect ${recipeName} recipe`), 
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
            let frontElement = document.getElementById(element.id+'-front')
            if (frontElement) {
                if (this.marketClickHandles) {
                    dojo.disconnect(this.marketClickHandles[frontElement.id])
                    delete this.marketClickHandles[frontElement.id];
                }
                frontElement.classList.remove('marketCard');
            }
            element.classList.remove('marketCard');
            element.classList.add(newClass);

            // TODO check to see if we're in the distill phase before we start setting this up
            //this.pantrySelection[card.uid] = false;
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
                    console.log("disabling market because")
                    console.log(canBuyBasic)
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
            dojo.query(".disabledMarket").removeClass("disabledMarket")
            dojo.query(".marketBuyable").removeClass("marketBuyable")
            dojo.query(".selected").removeClass("selected")
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
            this.notifqueue.setSynchronous('removeCards', 3000);

            dojo.subscribe('deleteCards', this, 'notif_deleteCards');
            this.notifqueue.setSynchronous('deleteCards', 500);

            dojo.subscribe('sellDrink', this, 'notif_sellDrink');
            this.notifqueue.setSynchronous('sellDrink', 500);
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
            this.notifqueue.setSynchronous('shuffleDeck', 500);

            dojo.subscribe('roundStart', this, 'notif_roundStart');
            this.notifqueue.setSynchronous('roundStart', 100);

            dojo.subscribe('revealDistiller', this, 'notif_revealDistiller');
            this.notifqueue.setSynchronous('revealDistiller', 100);

            dojo.subscribe('selectDistiller', this, 'notif_selectDistiller');
            this.notifqueue.setSynchronous('selectDistiller', 500);

            dojo.subscribe('sigIngredient', this, 'notif_sigIngredient');
            this.notifqueue.setSynchronous('sigIngredient', 500);

            dojo.subscribe('updateFirstPlayer', this, 'notif_updateFirstPlayer');
            this.notifqueue.setSynchronous('updateFirstPlayer', 100);

            dojo.subscribe('playerPointsEndgame', this, 'notif_playerPointsEndgame');
            this.notifqueue.setSynchronous('playerPointsEndgame', 1000);

            dojo.subscribe('playerPointsEndgameInit', this, 'notif_playerPointsEndgameInit');
            this.notifqueue.setSynchronous('playerPointsEndgameInit', 3000);

            dojo.subscribe('restartDistill', this, 'notif_restartDistill');
            this.notifqueue.setSynchronous('restartDistill', 1000);

            dojo.subscribe('playerPays', this, 'notif_playerPays');

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

        notif_restartDistill: function(notif) {
            //this.animateRestartDistill(notif)
            let pid = notif.args.player_id
            this.playerPantryStock[pid].ing.removeCards(this.playerPantryStock[pid].ing.getCards())
            this.playerWashbackStock[pid].ing.removeCards(this.playerWashbackStock[pid].ing.getCards())
            this.playerWashbackStock[pid].item.removeCards(this.playerWashbackStock[pid].item.getCards())
            this.playerWashbackStock[pid].label.removeCards(this.playerWashbackStock[pid].label.getCards())
            this.playerStoreStock[pid].item.removeCards(this.playerStoreStock[pid].item.getCards())

            console.log("Calling connect cards")
            this.setupPlayerCards(notif.args.player_id, notif.args.player_cards);
            this.revertActionBar();

            console.log("restoring game server state")
            console.log(this)
            console.log(this.distillStartArgs)
            //this.gamedatas.gamestate.args = this.distillStartArgs;
            //this.last_server_state.args = this.distillStartArgs;
            //this.setClientState("distill", this.distillStartArgs)
            //return this.restoreServerGameState();
            //this.ntf_newPrivateState({args: this.distillStateArgs})
            console.log("end of restart distill notification")
        },
        notif_playerPays: function(notif) {
            this.incMoney(notif.args.player_id, -1 * notif.args.cost);
        },
        notif_updateFirstPlayer: function(notif) {
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
            console.log("notif_selectDistiller")
            console.log(notif)
            console.log(this.player_id)

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

            this.placeFlippyCard(notif.args.player_id, 'distiller' + notif.args.slot, 'distiller', 
                notif.args.distiller_id);
                /*
            dojo.place(
                this.format_block('jstpl_distiller', {
                    ID: notif.args.player_id,
                    DIVBASE: 'distillerReveal',
                }),
                'distiller' + notif.args.slot, 'last');
                */
        },
        notif_roundStart: function (notif) {
            this.showTurn(notif.args.turn)
            this.expandMarket();
        },
        animateShuffleDeck: async function(notif) {
            let truckName = notif.args.deck_id + 'Truck'
            let deckName = notif.args.deck_id + 'Truck'
            let cards = this.decks[truckName].getCards();
            //this.decks[truckName].removeCards(cards);
            // TODO maybe have to do this in an async function
            await this.decks[notif.args.deck_id].addCards(cards, null, { autoUpdateCardNumber: false });
            this.decks[truckName].setCardNumber(0);
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

            /*
            var player_id = notif.args.player_id
            this['score_counter_' + player_id].incValue(notif.args.sp);

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

            cardIn.location_idx = 1;
            if (truck == 'ing') 
                this.playerPantryStock[playerId][truck].addCard(cardIn);
            else if (truck == 'item') 
                this.playerStoreStock[playerId][truck].addCard(cardIn);

            if (cardOut.uid > 1000 || cardOut.card_id <= 18)
                this.ingVoidStock.addCard(cardOut);
            else {
                cardOut.location = 'truck'
                this.decks.ingTruck.addCard(cardOut);
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
            console.log("player points");
            console.log(notif)

            this['score_counter_' + notif.args.player_id].incValue(notif.args.sp);
        },
        notif_playerPointsEndgameInit: function(notif) {
            console.log("endgame init")
            console.log(notif)
            // Initialize game scoring
            dojo.removeClass("game-scoring", "invisible")
            dojo.query(".centerScreen").removeClass("invisible")
            this.finalScoring = {}
            window.scrollTo(0, 0);

            var rows = ['players', 'ingame', 'warehouses', 'bottles', 'goals', 'dus', 'money', 'total']
            console.log(this.player_names)
            this.player_list.forEach(pid => {
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
            console.log("player points endgame");
            console.log(notif)

            this.finalScoring[notif.args.player_id][notif.args.row].incValue(notif.args.sp)
            this.finalScoring[notif.args.player_id]['total'].incValue(notif.args.sp)
            this['score_counter_' + notif.args.player_id].incValue(notif.args.sp);
        },
        notif_trade: function(notif) {
            console.log("notif_trade")
            console.log(notif)

            this.activeCards[notif.args.in_card.uid] = notif.args.in_card;
            this.activeCards[notif.args.in_card.uid].location_idx = 1;

            outElem = null
            notif.args.out_card.location = 'truck'
            if (notif.args.out_card.market == 'bm') {
                this.ingVoidStock.addCard(notif.args.out_card);
                outElem = this.playerPantryStock[notif.args.player_id].ing.getCardElement(notif.args.out_card)
            } else if (notif.args.out_card.market == 'ing') {
                this.decks.ingTruck.addCard(notif.args.out_card);
                outElem = this.playerPantryStock[notif.args.player_id].ing.getCardElement(notif.args.out_card)
            } else if (notif.args.out_card.market == 'item') {
                this.decks.itemTruck.addCard(notif.args.out_card);
                outElem = this.playerStoreStock[notif.args.player_id].item.getCardElement(notif.args.out_card)
            }
            console.log(outElem)
            dojo.disconnect(this.marketClickHandles[outElem.id])
            delete this.marketClickHandles[outElem.id];

            this.playerPantryStock[notif.args.player_id].ing.addCard(notif.args.in_card);
            element = this.playerPantryStock[notif.args.player_id].ing.getCardElement(notif.args.in_card)
            this.market2Pantry(element, 'pantryCard');

            /*
            console.log("Connected traded in card")
            console.log(element)
            handle = dojo.connect(element, 'onclick', this, 'onPantryClick');
            this.marketClickHandles[element.id] = handle;
            */

            // TODO is this a bad race?
            this.pantrySelection[notif.args.out_card.uid] = false;
        },
        // TODO: from this point and below, you can write your game notifications handling methods
        notif_moveToWashback: function(notif) {
            console.log('moveToWashback')
            console.log(notif)

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
            console.log('deleteCards')
            console.log(notif)
            notif.args.remove.forEach(C => {
                var deck = this.decks["wb" + notif.args.player_id];
                deck.removeCard(this.activeCards[C]);
            })
        },
        notif_moveToWarehouse: function(notif) {
            console.log("move to warehouse")
            console.log(notif);
            // Remove Pantry items
            let location = notif.args.location;
            let pid = notif.args.player_id;
            var dest;

            // TODO make this stuff private in other notifications
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
            })

            // Remove barrels
            remaining = this.playerWashbackStock[notif.args.player_id].item.getCards();
            remaining.forEach(C => {
                dest.item.addCard(C);
            })
        },
        notif_ageDrink: function(notif) {
            console.log("age drink");
            console.log(notif)

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

            // The current player has already animated this
            if (notif.args.player_id == this.player_id)
                return;

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
                if (labelCard) {
                    // TODO Check to make sure you got something back
                    this.playerLabelStock[notif.args.player_id][notif.args.slot].addCard(labelCard[0]);
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
            console.log("sell drink");
            console.log(notif);

            this.incMoney(notif.args.player_id, notif.args.value);
            this['score_counter_' + notif.args.player_id].incValue(notif.args.sp);

            notif.args.bottle.location_idx = 1;
            if (notif.args.bottle.name.toLowerCase() == "glass bottle") {
                this.playerStoreStock[notif.args.player_id].item.addCard(notif.args.bottle)
            } else {
                this.playerDisplayStock[notif.args.player_id].item.addCard(notif.args.bottle)
                dojo.removeClass(this.playerDisplayStock[notif.args.player_id].item.getCardElement(notif.args.bottle), 'marketCard')
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
            if (label && label.count <= 0) {
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
                if (C.type == 'BARREL' || C.type == 'BOTTLE') {
                    C.location = 'truck'
                    this.decks.itemTruck.addCard(C);
                } else {
                    C.location = 'truck'
                    this.decks.ingTruck.addCard(C)
                }
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
                    this.decks.itemTruck.addCard(C);
                }
            })

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
            console.log("buy cube");
            console.log(notif);

            this.addRecipeCube(notif.args.player_id, notif.args.slot, notif.args.color);
        },
        notif_playerGains: function( notif ) {
            console.log("playerGains");
            console.log(notif);

            this.incMoney(notif.args.player_id, notif.args.amount);
        },

        notif_placeDuCard: function( notif ) {
            console.log("placeDuCard");
            console.log(notif);


            var divbase = 'du' + notif.args.duSlot + "_" + notif.args.player_id;
            this.placeFlippyCard(notif.args.playerid, divbase, 'du', notif.args.uid);

            // TODO animate this
            this.duMarketStock.removeCard({uid: notif.args.uid})
            /*
            dojo.place(
                this.format_block('jstpl_distiller', {
                    ID: notif.args.player_id,
                    DIVBASE: 
                }),
                'du' + notif.args.slot + "_" + notif.args.player_id, 'last');
                */
            /*
            dojo.place(this.format_block('jstpl_card', {
                UID: notif.args.uid,
                CARD_ID: this.activeCards[notif.args.uid].card_id, 
                X_OFF: (this.activeCards[notif.args.uid].card_id % 14) * 122,
                Y_OFF: Math.floor(this.activeCards[notif.args.uid].card_id / 14) * 190
            }), 'du'+notif.args.slot + '_' + notif.args.player_id, 'only');
            */
        },

        notif_dbg: function(notif) {
            console.log("debug");
            console.log(notif);
        },

        notif_selectRecipe: function(notif) {
            console.log("selectRecipe");
            console.log(notif);

            let recipeName = notif.args.recipe_name;
            let recipeDeck = this.decks[recipeName];
            let recipe = notif.args.recipe;

            // This is a hack to give a unique id
            if (recipe.count == 0) {
                recipe.count = -notif.args.player_id
            }

            // Todo increment WB card count
            // Add barrel
            notif.args.barrel.location_idx = 1;
            this.playerWashbackStock[notif.args.player_id].item.addCard(notif.args.barrel)

            // Add Label
            // TODO fix copcard code
            if (recipeDeck)
                recipeDeck.setCardNumber(recipeDeck.getCardNumber(), recipe);

            recipe.location = 'washback';
            this.playerWashbackStock[notif.args.player_id].label.addCard(recipe);
            dojo.removeClass("washback_" + notif.args.player_id + "_label", "invisible")
            
            /*
            let newRecipe = { ...recipe }
            newRecipe.count = newRecipe.count - 1;
            */
            /*if (recipe.count >= 0)
                recipeDeck.setCardNumber(recipeDeck.getCardNumber()-1);*/


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
                    this.decks.duTruck.addCard(C, {autoUpdateCardNumber: true});
                else if (C.market == 'item')
                    this.decks.itemTruck.addCard(C, {autoUpdateCardNumber: true});
                else if (C.market == "ing") 
                    this.decks.ingTruck.addCard(C, {autoUpdateCardNumber: true})
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
                        if (args.card) {
                            card = args.card
                        } else if (args.card_id) {
                            card = this.activeCards[args.card_id]
                        }
                        if (card) {
                            uid = Date.now() 
                            args.card_name = `<span class="log-tooltip" id="log-${uid}">${_(args.card_name)}</span>`;
                            html = this.getTooltipForCard(card)
                            this.registerCustomTooltip(html, `log-${uid}`)
                        }
                    }
                    if (args.card1_name !== undefined) {
                        let card;
                        if (args.card1_id) {
                            card = this.activeCards[args.card1_id]
                        }
                        if (card) {
                            uid = Date.now() + '_1'
                            args.card1_name = `<span class="log-tooltip" id="log-${uid}">${_(args.card1_name)}</span>`;
                            html = this.getTooltipForCard(card)
                            this.registerCustomTooltip(html, `log-${uid}`)
                        }
                    }
                    if (args.card2_name !== undefined) {
                        let card;
                        if (args.card2_id) {
                            card = this.activeCards[args.card2_id]
                        }
                        if (card) {
                            uid = Date.now() + '_2'
                            args.card2_name = `<span class="log-tooltip" id="log-${uid}">${_(args.card2_name)}</span>`;
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
