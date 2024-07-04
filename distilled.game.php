<?php // Putting more stuff here for Jai
 /**
  *------
  * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
  * distilled implementation : © JB Feldman <wigginender520@gmail.com>
  * 
  * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
  * See http://en.boardgamearena.com/#!doc/Studio for more information.
  * -----
  * 
  * distilled.game.php
  *
  * This is the main file for your game logic.
  *
  * In this PHP file, you are going to defines the rules of the game.
  *
  */


require_once( APP_GAMEMODULE_PATH.'module/table/table.game.php' );

// Card Types
class CardType {
    const BARREL = "BARREL";
    const BOTTLE = "BOTTLE";
    const DU = "DU";
    const SUGAR = "SUGAR";
    const WATER = "WATER";
    const YEAST = "YEAST";
    const ALCOHOL = "ALCOHOL";
    const FLAVOR = "FLAVOR";
    const GOAL = "GOAL";
}

class Sugar {
    const GRAIN = "GRAIN";
    const PLANT = "PLANT";
    const FRUIT = "FRUIT";
}

class Barrel {
    const METAL = "METAL";
    const WOOD = "WOOD";
    const CLAY = "CLAY";
}

class DU {
    const EQUIPMENT="EQUIPMENT";
    const SPECIALIST="SPECIALIST";
}

class Region {
    const HOME = "HOME";
    const EUROPE = "EUROPE";
    const ASIA = "ASIA";
    const AMERICAS = "AMERICAS";
}

class Card {
    public int $uid;
    public int $card_id;
    public string $name;
    public int $cost;
    // DU, BARREL, BOTTLE, 
    public string $type;
    public int $sale;
    public int $sp;
    public string $subtype;
    public int $location_idx;


    function __construct($card_id, $name, $cost, $sale, $sp, $type, $subtype="", $uidOverride=-1) {
        static $cardIdx = 0;
        // 0 means reset
        if ($uidOverride == 0) {
            $cardIdx = 0;
            $this->uid = $cardIdx++;
        } else if ($uidOverride == -1) {
            // -1 means generate
            $this->uid = $cardIdx++;
        } else {
            $this->uid = $uidOverride;
        }
        $this->card_id = $card_id;
        $this->name = $name;
        $this->cost = $cost;
        $this->type = $type;
        $this->subtype = $subtype;
        $this->sale = $sale;
        $this->sp = $sp;
    }
}

class Deck {
    public string $name;
    public string $dbTable;
    public $cards = array();
    public $slots = 4;

    function __construct($name, $dbTable, $cards, $app) {
        $this->name = $name;
        $this->dbTable = $dbTable;
        $this->app = $app;

        foreach ($cards as $card) {
            $this->cards[] = $card;
        }
    }

    function init() {
        shuffle($this->cards);

        $sql = sprintf("INSERT INTO %s (uid, card_id, location, location_idx) VALUES ", $this->dbTable);
        $values = array();
        $order = 0;
        foreach ($this->cards as $card) {
            $order++;
            $values[] = sprintf("('%d', '%d', 'deck', '%d')", $card->uid, $card->card_id, $order);
        }
        $sql .= implode(',', $values);
        $this->app->DbQuery( $sql );
    }
}

class SpiritAward {
    public $uid;
    public $name;
    public $sp;

    function __construct($uid, $name, $sp) {
        $this->uid = $uid;
        $this->name = $name;
        $this->sp = $sp;
    }
}

class Cube {
    const BRONZE = 0;
    const SILVER = 1;
    const GOLD = 2;
}

class Distiller {
    public $id;
    public $name;
    public $region;
    public $sigIngCardId;
    public $sigRecipeId;
    public $startingMoney;
    public $startingWater;
    public $startingYeast;

    function __construct($id, $name, $region, $recipe, $ingredient, $money, $yeast, $water) {
        $this->id = $id;
        $this->name = $name;
        $this->region = $region;
        $this->sigIngCardId = $ingredient;
        $this->sigRecipeId = $recipe;
        $this->startingMoney = $money;
        $this->startingYeast = $yeast;
        $this->startingWater = $water;
    }
}


class distilled extends Table
{
    private $distillery_cards;

    private $premium_ingredient_cards;

    private $premium_item_cards;

    function initRecipeCard($flight) {
        $this->staticRecipe = array(
            array('name' => clienttranslate('Moonshine'),
                'sp' => 1,
                'sugars' => 0,
                'aged' => false,
                'label' => 8,
                'barrel' => Barrel::METAL,
                'cube' => 'none',
                'region' => Region::HOME,
                'value' => 2,
                'allowed' => array()),
            array('name' => clienttranslate('Vodka'),
                'sp' => 2,
                'sugars' => 1,
                'value' => 1,
                'aged' => false,
                'label' => 5,
                'barrel' => Barrel::METAL,
                'cube' => 'none',
                'region' => Region::HOME,
                'allowed' => array(Sugar::GRAIN, Sugar::FRUIT, Sugar::PLANT)),
        );

        $this->recipeMap = array(
                    'cachaca' => array('name' => clienttranslate('Cachaça'),
                        'sp' => 4,
                        'sugars' => 1,
                        'value' => 0,
                        'aged' => false,
                        'barrel' => Barrel::METAL,
                        'cube' => 'bronze',
                        'region' => Region::AMERICAS,
                        'label' => 11,
                        'allowed' => array(Sugar::PLANT)),
                    'soju' => array('name' => clienttranslate('Soju'),
                        'sp' => 5,
                        'sugars' => 2,
                        'value' => 0,
                        'aged' => false,
                        'barrel' => Barrel::METAL,
                        'cube' => 'bronze',
                        'region' => Region::ASIA,
                        'label' => 13,
                        'allowed' => array(Sugar::GRAIN)),
                    'gin' => array('name' => clienttranslate('Gin'),
                        'sp' => 7,
                        'sugars' => 2,
                        'value' => 0,
                        'aged' => false,
                        'barrel' => Barrel::METAL,
                        'cube' => 'silver',
                        'region' => Region::EUROPE,
                        'label' => 9,
                        'allowed' => array(Sugar::FRUIT)),
                    'whiskey' => array('name' => clienttranslate('Whiskey'),
                        'sp' => 10,
                        'sugars' => 2,
                        'value' => 0,
                        'aged' => true,
                        'barrel' => Barrel::WOOD,
                        'cube' => 'silver',
                        'region' => Region::HOME,
                        'label' => 15,
                        'allowed' => array(Sugar::GRAIN)),
                    'rum' => array('name' => clienttranslate('Rum'),
                        'sp' => 11,
                        'sugars' => 2,
                        'value' => 0,
                        'aged' => true,
                        'barrel' => Barrel::WOOD,
                        'cube' => 'silver',
                        'region' => Region::AMERICAS,
                        'label' => 6,
                        'allowed' => array(Sugar::PLANT)),
                    'baijiu' => array('name' => clienttranslate('Báijiŭ'),
                        'sp' => 12,
                        'sugars' => 3,
                        'value' => 0,
                        'aged' => true,
                        'barrel' => Barrel::CLAY,
                        'cube' => 'gold',
                        'region' => Region::ASIA,
                        'label' => 10,
                        'allowed' => array(Sugar::GRAIN)),
                    'brandy' => array('name' => clienttranslate('Brandy'),
                        'sp' => 13,
                        'sugars' => 2,
                        'value' => 0,
                        'aged' => true,
                        'barrel' => Barrel::WOOD,
                        'cube' => 'gold',
                        'label' => 14,
                        'region' => Region::EUROPE,
                        'allowed' => array(Sugar::FRUIT)),
                    'aquavit' => array('name' => clienttranslate('Aquavit'),
                        'sp' => 3,
                        'sugars' => 1,
                        'value' => 0,
                        'aged' => false,
                        'barrel' => Barrel::METAL,
                        'cube' => 'bronze',
                        'label' => 16,
                        'region' => Region::EUROPE,
                        'allowed' => array(Sugar::GRAIN, Sugar::PLANT)),
                    'shochu' => array('name' => clienttranslate('Shōchū'),
                        'sp' => 7,
                        'sugars' => 1,
                        'value' => 0,
                        'aged' => true,
                        'barrel' => Barrel::CLAY,
                        'cube' => 'bronze',
                        'label' => 12,
                        'region' => Region::ASIA,
                        'allowed' => array(Sugar::GRAIN)),
                    'lambanog' => array('name' => clienttranslate('Lambanog'),
                        'sp' => 6,
                        'sugars' => 2,
                        'value' => 0,
                        'aged' => false,
                        'barrel' => Barrel::METAL,
                        'cube' => 'silver',
                        'label' => 18,
                        'region' => Region::ASIA,
                        'allowed' => array(Sugar::PLANT)),
                    'grappa' => array('name' => clienttranslate('Grappa'),
                        'sp' => 9,
                        'sugars' => 1,
                        'value' => 0,
                        'aged' => true,
                        'barrel' => Barrel::CLAY,
                        'cube' => 'silver',
                        'label' => 20,
                        'region' => Region::EUROPE,
                        'allowed' => array(Sugar::FRUIT)),
                    'pisco' => array('name' => clienttranslate('Pisco'),
                        'sp' => 10,
                        'sugars' => 3,
                        'value' => 0,
                        'aged' => false,
                        'barrel' => Barrel::METAL,
                        'cube' => 'silver',
                        'label' => 19,
                        'region' => Region::AMERICAS,
                        'allowed' => array(Sugar::FRUIT)),
                    'tequila' => array('name' => clienttranslate('Tequila'),
                        'sp' => 14,
                        'sugars' => 3,
                        'value' => 0,
                        'aged' => true,
                        'barrel' => Barrel::WOOD,
                        'cube' => 'gold',
                        'label' => 7,
                        'region' => Region::AMERICAS,
                        'allowed' => array(Sugar::PLANT)),
        );

        switch ($flight) {
            case '1':
                $this->recipeFlight = array(
                    $this->recipeMap['cachaca'],
                    $this->recipeMap['soju'],
                    $this->recipeMap['gin'],
                    $this->recipeMap['whiskey'],
                    $this->recipeMap['rum'],
                    $this->recipeMap['baijiu'],
                    $this->recipeMap['brandy']
                );
                break;
            case '2':
                $this->recipeFlight = array(
                    $this->recipeMap['aquavit'],
                    $this->recipeMap['shochu'],
                    $this->recipeMap['lambanog'],
                    $this->recipeMap['grappa'],
                    $this->recipeMap['pisco'],
                    $this->recipeMap['whiskey'],
                    $this->recipeMap['tequila'],
                );
                break;
            case '3':
                $this->recipeFlight = array(
                    $this->recipeMap['aquavit'],
                    $this->recipeMap['soju'],
                    $this->recipeMap['shochu'],
                    $this->recipeMap['pisco'],
                    $this->recipeMap['whiskey'],
                    $this->recipeMap['rum'],
                    $this->recipeMap['brandy'],
                );
                break;
            case '4':
                $this->recipeFlight = array(
                    $this->recipeMap['aquavit'],
                    $this->recipeMap['lambanog'],
                    $this->recipeMap['gin'],
                    $this->recipeMap['grappa'],
                    $this->recipeMap['whiskey'],
                    $this->recipeMap['brandy'],
                    $this->recipeMap['tequila'],
                );
                break;
            case '5':
                $this->recipeFlight = array(
                    $this->recipeMap['cachaca'],
                    $this->recipeMap['gin'],
                    $this->recipeMap['pisco'],
                    $this->recipeMap['whiskey'],
                    $this->recipeMap['rum'],
                    $this->recipeMap['baijiu'],
                    $this->recipeMap['tequila'],
                );
                break;
            case '6':
                $this->recipeFlight = array(
                    $this->recipeMap['cachaca'],
                    $this->recipeMap['soju'],
                    $this->recipeMap['shochu'],
                    $this->recipeMap['lambanog'],
                    $this->recipeMap['grappa'],
                    $this->recipeMap['whiskey'],
                    $this->recipeMap['baijiu'],
                );
                break;
            case '7':
                $this->recipeFlight = array(
                    $this->recipeMap['aquavit'],
                    $this->recipeMap['cachaca'],
                    $this->recipeMap['soju'],
                    $this->recipeMap['lambanog'],
                    $this->recipeMap['gin'],
                    $this->recipeMap['pisco'],
                    $this->recipeMap['whiskey'],
                );
                break;
            case '8':
                $this->recipeFlight = array(
                    $this->recipeMap['shochu'],
                    $this->recipeMap['grappa'],
                    $this->recipeMap['whiskey'],
                    $this->recipeMap['rum'],
                    $this->recipeMap['baijiu'],
                    $this->recipeMap['brandy'],
                    $this->recipeMap['tequila'],
                );
                break;
            default:
                /*
                throw new BgaSystemException("Invalid flight");
                break;*/
        }
    }

    function getRecipes() {
        $flight = $this->getGameStateValue("flight");
        $this->initRecipeCard($flight);
        $recipes = array_merge($this->staticRecipe, $this->recipeFlight);
        return $recipes;
    }

    function getRecipeFlight() {
        $flight = $this->getGameStateValue("flight");
        $this->initRecipeCard($flight);
        return $this->recipeFlight;
    }


	function __construct( )
	{
        // Your global variables labels:
        //  Here, you can assign labels to global variables you are using for this game.
        //  You can use any number of global variables with IDs between 10 and 99.
        //  If your game has options (variants), you also have to associate here a label to
        //  the corresponding ID in gameoptions.inc.php.
        // Note: afterwards, you can get/set the global variables with getGameStateValue/setGameStateInitialValue/setGameStateValue
        parent::__construct();

        self::initGameStateLabels( array( 
            "turn" => 11,
            "exitDistill" => 12,
            "playerPassedSell" => 13,
            "powercard" => 14,
            "reactIdx" => 15,
            "distillersSelected" => 16,
            "flight" => 100,
            "pairings" => 101,
        ) );
        

        // Add Alcohol
        // TODO give this a real card number backed by something
        $alcohol = new Card(0, "Alcohol", 0, 1, 0, CardType::ALCOHOL, "", 0);
        $this->AllCards[$alcohol->uid] = $alcohol;

        $this->cardText = array(
            0 => `
Cost: 0
When purchased, you immediately gain 1 money. 

Cannot be traded with the basic market.`,
            1 => `
Cost: 0
When purchased, you may reveal the top card of any market deck to all players.
Purchase it or return it to the bottom of the deck.`
        );

        $this->distillery_cards = array(
            new Card(103, clienttranslate("Spirit Safe"), 7, 0, 1, CardType::DU, DU::EQUIPMENT),
            new Card(104, clienttranslate("Worm Tub"), 6, 0, 1, CardType::DU, DU::EQUIPMENT),
            new Card(105, clienttranslate("Orchard"), 5, 0, 0, CardType::DU, DU::EQUIPMENT),
            new Card(106, clienttranslate("Tropical Warehouse"), 6, 0, 1, CardType::DU, DU::EQUIPMENT),
            new Card(107, clienttranslate("Natural Spring"), 4, 0, 0, CardType::DU, DU::EQUIPMENT),
            new Card(108, clienttranslate("Metal Rickhouse"), 5, 0, 0, CardType::DU, DU::EQUIPMENT),
            new Card(109, clienttranslate("Large Storage"), 4, 0, 0, CardType::DU, DU::EQUIPMENT),
            //new Card(110, clienttranslate("Drone Camera"), 5, 0, 1, CardType::DU, DU::EQUIPMENT), // TODO Make this work
            new Card(111, clienttranslate("Malting Floor"), 6, 0, 0, CardType::DU, DU::EQUIPMENT),
            new Card(112, clienttranslate("Greenhouse"), 4, 0, 0, CardType::DU, DU::EQUIPMENT),
            new Card(113, clienttranslate("Doig Ventilator"), 7, 0, 0, CardType::DU, DU::EQUIPMENT),
            new Card(114, clienttranslate("Malt Mill"), 6, 0, 1, CardType::DU, DU::EQUIPMENT),
            new Card(115, clienttranslate("Glassworks"), 5, 0, 1, CardType::DU, DU::EQUIPMENT),
            new Card(116, clienttranslate("Column Still"), 5, 0, 1, CardType::DU, DU::EQUIPMENT),
            new Card(117, clienttranslate("Coffey Still"), 4, 0, 1, CardType::DU, DU::EQUIPMENT),
            new Card(118, clienttranslate("Private Investor"), 4, 0, 1, CardType::DU, DU::SPECIALIST),
            new Card(119, clienttranslate("Intern Researcher"), 4, 0, 0, CardType::DU, DU::SPECIALIST),
            new Card(120, clienttranslate("Warehouse Manager"), 5, 0, 0, CardType::DU, DU::SPECIALIST),
            new Card(121, clienttranslate("Master Blender"), 5, 0, 0, CardType::DU, DU::SPECIALIST),
            new Card(122, clienttranslate("Glassblower"), 3, 0, 0, CardType::DU, DU::SPECIALIST),
            new Card(123, clienttranslate("Trucker"), 4, 0, 0, CardType::DU, DU::SPECIALIST),
            new Card(124, clienttranslate("Market Buyer"), 3, 0, 1, CardType::DU, DU::SPECIALIST),
            new Card(125, clienttranslate("Farmer"), 4, 0, 0, CardType::DU, DU::SPECIALIST),
            new Card(126, clienttranslate("Tour Guide"), 4, 0, 0, CardType::DU, DU::SPECIALIST),
            new Card(127, clienttranslate("Co-op Manager"), 5, 0, 0, CardType::DU, DU::SPECIALIST),
            new Card(128, clienttranslate("Architect"), 3, 0, 0, CardType::DU, DU::SPECIALIST),
            new Card(129, clienttranslate("Coppersmith"), 4, 0, 0, CardType::DU, DU::SPECIALIST),
            new Card(130, clienttranslate("Celebrity Promoter"), 5, 0, 1, CardType::DU, DU::SPECIALIST),
            new Card(131, clienttranslate("Cooper"), 5, 0, 0, CardType::DU, DU::SPECIALIST),
            new Card(132, clienttranslate("Biochemist"), 3, 0, 0, CardType::DU, DU::SPECIALIST),
        );

        $this->premium_ingredient_cards = array(
            new Card(45, clienttranslate("Turbo Yeast"), 3, 1, 1, CardType::YEAST),
            new Card(45, clienttranslate("Turbo Yeast"), 3, 1, 1, CardType::YEAST),
            new Card(46, clienttranslate("Juniper Berries"), 5, 2, 3, CardType::SUGAR, Sugar::FRUIT),
            new Card(46, clienttranslate("Juniper Berries"), 5, 2, 3, CardType::SUGAR, Sugar::FRUIT),
            new Card(47, clienttranslate("Mountain Spring Water"), 3, 2, 1, CardType::WATER),
            new Card(48, clienttranslate("Figs"), 5, 2, 3, CardType::SUGAR, Sugar::FRUIT),
            new Card(48, clienttranslate("Figs"), 5, 2, 3, CardType::SUGAR, Sugar::FRUIT),
            new Card(49, clienttranslate("Grapes"), 6, 3, 4, CardType::SUGAR, Sugar::FRUIT),
            new Card(49, clienttranslate("Grapes"), 6, 3, 4, CardType::SUGAR, Sugar::FRUIT),
            new Card(50, clienttranslate("Potatoes"), 3, 1, 1, CardType::SUGAR, Sugar::PLANT),
            new Card(50, clienttranslate("Potatoes"), 3, 1, 1, CardType::SUGAR, Sugar::PLANT),
            new Card(51, clienttranslate("Agave"), 5, 3, 3, CardType::SUGAR, Sugar::PLANT),
            new Card(51, clienttranslate("Agave"), 5, 3, 3, CardType::SUGAR, Sugar::PLANT),
            new Card(52, clienttranslate("Apples"), 4, 1, 2, CardType::SUGAR, Sugar::FRUIT),
            new Card(52, clienttranslate("Apples"), 4, 1, 2, CardType::SUGAR, Sugar::FRUIT),
            new Card(53, clienttranslate("Palm"), 4, 2, 2, CardType::SUGAR, Sugar::PLANT),
            new Card(53, clienttranslate("Palm"), 4, 2, 2, CardType::SUGAR, Sugar::PLANT),
            new Card(54, clienttranslate("Wheat"), 3, 1, 1, CardType::SUGAR, Sugar::GRAIN),
            new Card(54, clienttranslate("Wheat"), 3, 1, 1, CardType::SUGAR, Sugar::GRAIN),
            new Card(55, clienttranslate("Sugarcane"), 4, 2, 2, CardType::SUGAR, Sugar::PLANT),
            new Card(55, clienttranslate("Sugarcane"), 4, 2, 2, CardType::SUGAR, Sugar::PLANT),
            new Card(56, clienttranslate("Anise"), 3, 1, 1, CardType::SUGAR, Sugar::PLANT),
            new Card(56, clienttranslate("Anise"), 3, 1, 1, CardType::SUGAR, Sugar::PLANT),
            new Card(57, clienttranslate("Sorghum"), 2, 0, 1, CardType::SUGAR, Sugar::GRAIN),
            new Card(57, clienttranslate("Sorghum"), 2, 0, 1, CardType::SUGAR, Sugar::GRAIN),
            new Card(58, clienttranslate("Rye"), 3, 1, 1, CardType::SUGAR, Sugar::GRAIN),
            new Card(58, clienttranslate("Rye"), 3, 1, 1, CardType::SUGAR, Sugar::GRAIN),
            new Card(59, clienttranslate("Corn"), 4, 2, 2, CardType::SUGAR, Sugar::GRAIN),
            new Card(59, clienttranslate("Corn"), 4, 2, 2, CardType::SUGAR, Sugar::GRAIN),
            new Card(60, clienttranslate("Rice"), 2, 0, 1, CardType::SUGAR, Sugar::GRAIN),
            new Card(60, clienttranslate("Rice"), 2, 0, 1, CardType::SUGAR, Sugar::GRAIN),
            new Card(61, clienttranslate("Barley"), 4, 2, 2, CardType::SUGAR, Sugar::GRAIN),
            new Card(61, clienttranslate("Barley"), 4, 2, 2, CardType::SUGAR, Sugar::GRAIN),
            new Card(62, clienttranslate("Millet"), 3, 1, 1, CardType::SUGAR, Sugar::GRAIN),
            new Card(62, clienttranslate("Millet"), 3, 1, 1, CardType::SUGAR, Sugar::GRAIN),

        );
        $this->premium_item_cards = array(
            new Card(21, clienttranslate("Wrapped Bottle"), 3, 1, 0, CardType::BOTTLE, Region::AMERICAS),
            new Card(22, clienttranslate("Worm Bottle"), 2, 1, 0, CardType::BOTTLE, Region::AMERICAS),
            new Card(23, clienttranslate("Skull Bottle"), 5, 2, 4, CardType::BOTTLE, Region::HOME),
            new Card(24, clienttranslate("Plastic Liter Bottle"), 1, 4, -1, CardType::BOTTLE),
            new Card(25, clienttranslate("Wax Sealed Bottle"), 4, 2, 0, CardType::BOTTLE, Region::AMERICAS),
            new Card(26, clienttranslate("Scandanavian Bottle"), 3, 1, 0, CardType::BOTTLE, Region::EUROPE),
            new Card(27, clienttranslate("Pirate Bottle"), 3, 1, 0, CardType::BOTTLE, Region::AMERICAS),
            new Card(28, clienttranslate("Vintage Decanter Bottle"), 5, 2, 4, CardType::BOTTLE, Region::HOME),
            new Card(29, clienttranslate("Rounded Bottle"), 3, 1, 0, CardType::BOTTLE, Region::EUROPE),
            new Card(30, clienttranslate("Pig Bottle"), 5, 2, 4, CardType::BOTTLE, Region::HOME),
            new Card(31, clienttranslate("Mason Jar"), 1, 0, 0, CardType::BOTTLE),
            new Card(32, clienttranslate("Faceted Bottle"), 3, 1, 0, CardType::BOTTLE, Region::ASIA),
            new Card(33, clienttranslate("Canister Bottle"), 2, 1, 0, CardType::BOTTLE, Region::EUROPE),
            new Card(34, clienttranslate("Half Bottle"), 3, 1, 0, CardType::BOTTLE, Region::ASIA),
            new Card(35, clienttranslate("Etched Crystal Decanter"), 4, 2, 0, CardType::BOTTLE, Region::EUROPE),
            new Card(36, clienttranslate("Carton Bottle"), 2, 1, 0, CardType::BOTTLE, Region::ASIA),
            new Card(37, clienttranslate("Frosted Glass Bottle"), 2, 2, 0, CardType::BOTTLE),
            new Card(38, clienttranslate("Ceramic Bottle"), 4, 2, 0, CardType::BOTTLE, Region::ASIA),
            new Card(39, clienttranslate("Jug"), 2, 2, 0, CardType::BOTTLE),
            new Card(40, clienttranslate("Stainless Steel Barrel"), 4, 2, 1, CardType::BARREL, Barrel::METAL),
            new Card(40, clienttranslate("Stainless Steel Barrel"), 4, 2, 1, CardType::BARREL, Barrel::METAL),
            new Card(41, clienttranslate("Kvevri Barrel"), 6, 2, 0, CardType::BARREL, Barrel::CLAY),
            new Card(41, clienttranslate("Kvevri Barrel"), 6, 2, 0, CardType::BARREL, Barrel::CLAY),
            new Card(42, clienttranslate("Dolium Barrel"), 4, 0, 1, CardType::BARREL, Barrel::CLAY),
            new Card(42, clienttranslate("Dolium Barrel"), 4, 0, 1, CardType::BARREL, Barrel::CLAY),
            new Card(42, clienttranslate("Dolium Barrel"), 4, 0, 1, CardType::BARREL, Barrel::CLAY),
            new Card(43, clienttranslate("Ex-Bourbon Hogshead"), 7, 0, 1, CardType::BARREL, Barrel::WOOD),
            new Card(43, clienttranslate("Ex-Bourbon Hogshead"), 7, 0, 1, CardType::BARREL, Barrel::WOOD),
            new Card(43, clienttranslate("Ex-Bourbon Hogshead"), 7, 0, 1, CardType::BARREL, Barrel::WOOD),
            new Card(44, clienttranslate("American Standard Barrel"), 5, 0, 1, CardType::BARREL, Barrel::WOOD),
            new Card(44, clienttranslate("American Standard Barrel"), 5, 0, 1, CardType::BARREL, Barrel::WOOD),
            new Card(44, clienttranslate("American Standard Barrel"), 5, 0, 1, CardType::BARREL, Barrel::WOOD),
            new Card(44, clienttranslate("American Standard Barrel"), 5, 0, 1, CardType::BARREL, Barrel::WOOD),
        );
        $this->basic_cards = array(
            new Card(139, clienttranslate("Yeast"), 0, 0, 0, CardType::YEAST),
            new Card(138, clienttranslate("Water"), 0, 1, 0, CardType::WATER),
            new Card(137, clienttranslate("Mixed Grains"), 0, 0, 0, CardType::SUGAR, Sugar::GRAIN),
            new Card(136, clienttranslate("Mixed Plants"), 1, 0, 0, CardType::SUGAR, Sugar::PLANT),
            new Card(135, clienttranslate("Mixed Fruits"), 2, 0, 0, CardType::SUGAR, Sugar::FRUIT),
            new Card(134, clienttranslate("Clay Barrel"), 3, 0, 0, CardType::BARREL, BARREL::CLAY),
            new Card(133, clienttranslate("Wood Barrel"), 4, 0, 0, CardType::BARREL, BARREL::WOOD),
            new Card(0, clienttranslate("Alcohol"), 0, 1, 0, CardType::ALCOHOL),
            new Card(19, clienttranslate("Metal Barrel"), 0, 1, 0, CardType::BARREL, Barrel::METAL),
            new Card(20, clienttranslate("Glass Bottle"), 0, 1, 0, CardType::BOTTLE)
        );
        $this->flavor_cards = array(
            new Card(63, clienttranslate("Vanilla"), 0, 3, 0, CardType::FLAVOR),
            new Card(64, clienttranslate("Sports Bag"), 0, 0, 0, CardType::FLAVOR),
            new Card(65, clienttranslate("Smoky"), 0, 2, 0, CardType::FLAVOR),
            new Card(66, clienttranslate("Tobacco"), 0, 1, 0, CardType::FLAVOR),
            new Card(67, clienttranslate("Spicy"), 0, 3, 0, CardType::FLAVOR),
            new Card(68, clienttranslate("Skunky"), 0, 0, 0, CardType::FLAVOR),
            new Card(69, clienttranslate("Toasted Marshmellow"), 0, 2, 0, CardType::FLAVOR),
            new Card(70, clienttranslate("Soy Sauce"), 0, 1, 0, CardType::FLAVOR),
            new Card(71, clienttranslate("Seaweed"), 0, 1, 0, CardType::FLAVOR),
            new Card(72, clienttranslate("Salty"), 0, 1, 0, CardType::FLAVOR),
            new Card(73, clienttranslate("Piney"), 0, 1, 0, CardType::FLAVOR),
            new Card(74, clienttranslate("Old Cellar"), 0, 1, 0, CardType::FLAVOR),
            new Card(75, clienttranslate("Rubber Tires"), 0, 0, 0, CardType::FLAVOR),
            new Card(76, clienttranslate("Peaty"), 0, 2, 0, CardType::FLAVOR),
            new Card(77, clienttranslate("Oaky"), 0, 2, 0, CardType::FLAVOR),
            new Card(78, clienttranslate("Plastic"), 0, 0, 0, CardType::FLAVOR),
            new Card(79, clienttranslate("Orange Peel"), 0, 2, 0, CardType::FLAVOR),
            new Card(80, clienttranslate("Nutty"), 0, 2, 0, CardType::FLAVOR),
            new Card(81, clienttranslate("Maple"), 0, 2, 0, CardType::FLAVOR),
            new Card(82, clienttranslate("Leather"), 0, 1, 0, CardType::FLAVOR),
            new Card(83, clienttranslate("Grass"), 0, 1, 0, CardType::FLAVOR),
            new Card(84, clienttranslate("Manure"), 0, 0, 0, CardType::FLAVOR),
            new Card(85, clienttranslate("Horse Blanket"), 0, 1, 0, CardType::FLAVOR),
            new Card(86, clienttranslate("Ginger"), 0, 2, 0, CardType::FLAVOR),
            new Card(87, clienttranslate("Malty"), 0, 2, 0, CardType::FLAVOR),
            new Card(88, clienttranslate("Honey"), 0, 2, 0, CardType::FLAVOR),
            new Card(89, clienttranslate("Fruity"), 0, 3, 0, CardType::FLAVOR),
            new Card(90, clienttranslate("Floral"), 0, 2, 0, CardType::FLAVOR),
            new Card(91, clienttranslate("Coffee"), 0, 2, 0, CardType::FLAVOR),
            new Card(92, clienttranslate("Cherry"), 0, 2, 0, CardType::FLAVOR),
            new Card(93, clienttranslate("Fishy"), 0, 1, 0, CardType::FLAVOR),
            new Card(94, clienttranslate("Cinnamon"), 0, 2, 0, CardType::FLAVOR),
            new Card(95, clienttranslate("Caramel"), 0, 3, 0, CardType::FLAVOR),
            new Card(96, clienttranslate("Coriander"), 0, 2, 0, CardType::FLAVOR),
            new Card(97, clienttranslate("Chocolate"), 0, 3, 0, CardType::FLAVOR),
            new Card(98, clienttranslate("Bready"), 0, 1, 0, CardType::FLAVOR),
            new Card(99, clienttranslate("Birthday Cake"), 0, 2, 0, CardType::FLAVOR),
            new Card(100, clienttranslate("Bacon"), 0, 1, 0, CardType::FLAVOR),
            new Card(101, clienttranslate("Berries"), 0, 1, 0, CardType::FLAVOR),
            new Card(102, clienttranslate("Bandages"), 0, 1, 0, CardType::FLAVOR),
        );

        $this->goals_cards = array(
            new Card(140, clienttranslate("Monarch"), 0, 0, 0, CardType::GOAL),
            new Card(141, clienttranslate("Photosynthesis"), 0, 0, 0, CardType::GOAL),
            new Card(142, clienttranslate("Red Glass"), 0, 0, 0, CardType::GOAL),
            new Card(143, clienttranslate("Skip the Easy Stuff"), 0, 0, 0, CardType::GOAL),
            new Card(144, clienttranslate("Thirst For Knowledge"), 0, 0, 0, CardType::GOAL),
            new Card(145, clienttranslate("Wealthy"), 0, 0, 0, CardType::GOAL),
            new Card(146, clienttranslate("From the Earth"), 0, 0, 0, CardType::GOAL),
            new Card(147, clienttranslate("Gear Head"), 0, 0, 0, CardType::GOAL),
            new Card(148, clienttranslate("Geriatric"), 0, 0, 0, CardType::GOAL),
            new Card(149, clienttranslate("Green Glass"), 0, 0, 0, CardType::GOAL),
            new Card(150, clienttranslate("Just Desserts"), 0, 0, 0, CardType::GOAL),
            new Card(151, clienttranslate("Juvenile"), 0, 0, 0, CardType::GOAL),
            new Card(152, clienttranslate("Blue Glass"), 0, 0, 0, CardType::GOAL),
            new Card(153, clienttranslate("Close to Home"), 0, 0, 0, CardType::GOAL),
            new Card(154, clienttranslate("Delegation"), 0, 0, 0, CardType::GOAL),
            new Card(155, clienttranslate("Diverse Portfolio"), 0, 0, 0, CardType::GOAL),
            new Card(156, clienttranslate("East Champion"), 0, 0, 0, CardType::GOAL),
            new Card(157, clienttranslate("For the Farmers"), 0, 0, 0, CardType::GOAL),
            new Card(158, clienttranslate("West Champion"), 0, 0, 0, CardType::GOAL),
            new Card(159, clienttranslate("Woody"), 0, 0, 0, CardType::GOAL),
        );

        $this->signature_ing_cards = array(
            new Card(1,  clienttranslate('Sangiovese Grapes'), 0, 2, 4, CardType::SUGAR, Sugar::FRUIT ),
            new Card(2,  clienttranslate('Dried Juniper Berries'), 0, 2, 4, CardType::SUGAR, Sugar::FRUIT ),
            new Card(3,  clienttranslate('Blue Agave'), 0, 2, 4, CardType::SUGAR, Sugar::PLANT ),
            new Card(4,  clienttranslate('Quebranta Grapes'), 0, 2, 4, CardType::SUGAR, Sugar::FRUIT ),
            new Card(5,  clienttranslate('Almond Potatoes'), 0, 2, 4, CardType::SUGAR, Sugar::PLANT ),
            new Card(6,  clienttranslate('Sugarcane Juice'), 0, 2, 4, CardType::SUGAR, Sugar::PLANT ),
            new Card(7,  clienttranslate('Common Juniper Berries'), 0, 2, 4, CardType::SUGAR, Sugar::FRUIT ),
            new Card(8,  clienttranslate('Nipa Palm'), 0, 2, 4, CardType::SUGAR, Sugar::PLANT ),
            new Card(9,  clienttranslate('Sugarcane Molasses'), 0, 2, 4, CardType::SUGAR, Sugar::PLANT ),
            new Card(10, clienttranslate('Sorghum Bicolor'), 0, 2, 4, CardType::SUGAR, Sugar::GRAIN ),
            new Card(11, clienttranslate('Dent Corn'), 0, 2, 4, CardType::SUGAR, Sugar::GRAIN ),
            new Card(12, clienttranslate('Winter Rye'), 0, 2, 4, CardType::SUGAR, Sugar::GRAIN ),
            new Card(13, clienttranslate('Sinica Rice'), 0, 2, 4, CardType::SUGAR, Sugar::GRAIN ),
            new Card(14, clienttranslate('Unmalted Barley'), 0, 2, 4, CardType::SUGAR, Sugar::GRAIN ),
            new Card(15, clienttranslate('Bere Barley'), 0, 2, 4, CardType::SUGAR, Sugar::GRAIN ),
            new Card(16, clienttranslate('Pearl Millet'), 0, 2, 4, CardType::SUGAR, Sugar::GRAIN ),
            new Card(17, clienttranslate('Buck Wheat'), 0, 2, 4, CardType::SUGAR, Sugar::GRAIN ),
            new Card(18, clienttranslate('Ugni Blanc Grapes'), 0, 2, 4, CardType::SUGAR, Sugar::FRUIT ),
        );

        // TODO need to get the values of the sig recipes
        $this->distillers = array(
            0 => new Distiller(0, "Ruthless Ajani", Region::AMERICAS, 0, 9, 4, 1, 0),
            2 => new Distiller(2, "Jacqueline Booker", Region::AMERICAS, 1, 11, 2, 1, 0),
            4 => new Distiller(4, "the Brown Brothers", Region::ASIA, 2, 7, 4, 1, 1),
            6 => new Distiller(6, "Etienne d'Eau-Claire", Region::EUROPE, 3, 18, 3, 1, 0),
            8 => new Distiller(8, "Juliana de la Cruz", Region::ASIA, 4, 8, 2, 1, 1),
            10 => new Distiller(10, "Angus Douglas", Region::EUROPE, 5, 15, 2, 1, 1),
            12 => new Distiller(12, "Pilar del Fuego Escalante", Region::AMERICAS, 6, 3, 2, 0, 1),
            14 => new Distiller(14, "Mother Mary Genever", Region::EUROPE, -7, 2, 3, 1, 1),
            16 => new Distiller(16, "Gunnhild Hellström", Region::EUROPE, 8, 5, 3, 0, 1),
            18 => new Distiller(18, "Jeong Ji-Na", Region::ASIA, 9, 13, 1, 0, 1),
            20 => new Distiller(20, "Anne McAdam", Region::EUROPE, 10, 14, 3, 0, 1),
            22 => new Distiller(22, "Nathan Migizi", Region::AMERICAS, 11, 12, 4, 1, 0),
            24 => new Distiller(24, "Guillermo Osorio Romero", Region::AMERICAS, 12, 4, 3, 1, 1),
            26 => new Distiller(26, "Nisha Sakuhar", Region::ASIA, 13, 16, 3, 0, 0),
            28 => new Distiller(28, "Sakai Sōtarō", Region::ASIA, 14, 17, 2, 0, 1),
            30 => new Distiller(30, "Joana Peri de Sousa", Region::AMERICAS, 15, 6, 4, 1, 0),
            32 => new Distiller(32, "Brother Vicente", Region::EUROPE, 16, 1, 5, 1, 0),
            34 => new Distiller(34, "Fang Xin", Region::ASIA, 17, 10, 5, 1, 0)
        );

        $this->signature_recipes = array(
            array('name' => clienttranslate('Premium Dark Rum'),
                    'sp' => 17,
                    'sugars' => 3,
                    'value' => 3,
                    'aged' => true,
                    'barrel' => Barrel::WOOD,
                    'cube' => 'sig',
                    'label' => 21,
                    'include' => 'sugarcane',
                    'region' => Region::HOME,
                    'signature' => true,
                    'allowed' => array(Sugar::PLANT)),
            array('name' => clienttranslate('Straight Bourbon Whiskey'),
                    'sp' => 18,
                    'sugars' => 3,
                    'value' => 1,
                    'aged' => true,
                    'barrel' => Barrel::WOOD,
                    'cube' => 'sig',
                    'label' => 22,
                    'include' => 'corn',
                    'region' => Region::HOME,
                    'signature' => true,
                    'allowed' => array(Sugar::GRAIN)),
            array('name' => clienttranslate('Oceania-Strength Gin'),
                    'sp' => 10,
                    'sugars' => 3,
                    'value' => 1,
                    'aged' => false,
                    'barrel' => Barrel::METAL,
                    'cube' => 'sig',
                    'label' => 23,
                    'include' => 'juniper berries',
                    'region' => Region::HOME,
                    'signature' => true,
                    'allowed' => array(Sugar::FRUIT)),
            array('name' => clienttranslate('VS Cognac Brandy'),
                    'sp' => 17,
                    'sugars' => 3,
                    'value' => 2,
                    'aged' => true,
                    'barrel' => Barrel::WOOD,
                    'cube' => 'sig',
                    'label' => 24,
                    'include' => 'grapes',
                    'region' => Region::HOME,
                    'signature' => true,
                    'allowed' => array(Sugar::FRUIT)),
            array('name' => clienttranslate('Quezon Lambanog'),
                    'sp' => 10,
                    'sugars' => 3,
                    'value' => 2,
                    'aged' => false,
                    'barrel' => Barrel::METAL,
                    'cube' => 'sig',
                    'label' => 25,
                    'include' => 'palm',
                    'region' => Region::HOME,
                    'signature' => true,
                    'allowed' => array(Sugar::PLANT)),
            array('name' => clienttranslate('Single Malt Whisky'),
                    'sp' => 20,
                    'sugars' => 3,
                    'value' => 3,
                    'aged' => true,
                    'barrel' => Barrel::WOOD,
                    'cube' => 'sig',
                    'label' => 26,
                    'include' => 'barley',
                    'region' => Region::HOME,
                    'signature' => true,
                    'allowed' => array(Sugar::GRAIN)),
            array('name' => clienttranslate('Extra Anejo Tequila'),
                    'sp' => 19,
                    'sugars' => 3,
                    'value' => 1,
                    'aged' => true,
                    'barrel' => Barrel::WOOD,
                    'cube' => 'sig',
                    'label' => 27,
                    'include' => 'agave',
                    'region' => Region::HOME,
                    'signature' => true,
                    'allowed' => array(Sugar::PLANT)),
            array('name' => clienttranslate('London Dry Gin'),
                    'sp' => 13,
                    'sugars' => 3,
                    'value' => 2,
                    'aged' => false,
                    'barrel' => Barrel::METAL,
                    'cube' => 'sig',
                    'label' => 28,
                    'include' => 'juniper berries',
                    'region' => Region::HOME,
                    'signature' => true,
                    'allowed' => array(Sugar::FRUIT)),
            array('name' => clienttranslate('Gammal Fin Aquavit'),
                    'sp' => 8,
                    'sugars' => 2,
                    'value' => 2,
                    'aged' => false,
                    'barrel' => Barrel::METAL,
                    'cube' => 'sig',
                    'label' => 29,
                    'include' => 'potatoes',
                    'region' => Region::HOME,
                    'signature' => true,
                    'allowed' => array(Sugar::PLANT)),
            array('name' => clienttranslate('Andong Soju'),
                    'sp' => 7,
                    'sugars' => 3,
                    'value' => 1,
                    'aged' => false,
                    'barrel' => Barrel::METAL,
                    'cube' => 'sig',
                    'label' => 30,
                    'include' => 'rice',
                    'region' => Region::HOME,
                    'signature' => true,
                    'allowed' => array(Sugar::GRAIN)),
            array('name' => clienttranslate('Single Pot Whiskey'),
                    'sp' => 19,
                    'sugars' => 3,
                    'value' => 2,
                    'aged' => true,
                    'barrel' => Barrel::WOOD,
                    'cube' => 'sig',
                    'label' => 31,
                    'include' => 'barley',
                    'region' => Region::HOME,
                    'signature' => true,
                    'allowed' => array(Sugar::GRAIN)),
            array('name' => clienttranslate('Canadian Rye Whisky'),
                    'sp' => 16,
                    'sugars' => 3,
                    'value' => 1,
                    'aged' => true,
                    'barrel' => Barrel::WOOD,
                    'cube' => 'sig',
                    'label' => 32,
                    'include' => 'rye',
                    'region' => Region::HOME,
                    'signature' => true,
                    'allowed' => array(Sugar::GRAIN)),
            array('name' => clienttranslate('Peruvian Pisco Puro'),
                    'sp' => 14,
                    'sugars' => 3,
                    'value' => 1,
                    'aged' => false,
                    'barrel' => Barrel::METAL,
                    'cube' => 'sig',
                    'label' => 33,
                    'include' => 'grapes',
                    'region' => Region::HOME,
                    'signature' => true,
                    'allowed' => array(Sugar::FRUIT)),
            array('name' => clienttranslate('Royal Officer\'s Whisky'),
                    'sp' => 11,
                    'sugars' => 2,
                    'value' => 1,
                    'aged' => true,
                    'barrel' => Barrel::WOOD,
                    'cube' => 'sig',
                    'label' => 34,
                    'include' => 'millet',
                    'region' => Region::HOME,
                    'signature' => true,
                    'allowed' => array(Sugar::GRAIN)),
            array('name' => clienttranslate('Otsurui Shōchū'),
                    'sp' => 14,
                    'sugars' => 2,
                    'value' => 3,
                    'aged' => true,
                    'barrel' => Barrel::CLAY,
                    'cube' => 'sig',
                    'label' => 35,
                    'region' => Region::HOME,
                    'include' => 'wheat',
                    'signature' => true,
                    'allowed' => array(Sugar::GRAIN)),
            array('name' => clienttranslate('Caninha Cachaça'),
                    'sp' => 11,
                    'sugars' => 2,
                    'value' => 2,
                    'aged' => false,
                    'barrel' => Barrel::METAL,
                    'cube' => 'sig',
                    'label' => 36,
                    'region' => Region::HOME,
                    'include' => 'sugarcane',
                    'signature' => true,
                    'allowed' => array(Sugar::PLANT)),
            array('name' => clienttranslate('Grappa Invecchiata'),
                    'sp' => 13,
                    'sugars' => 2,
                    'value' => 2,
                    'aged' => true,
                    'barrel' => Barrel::CLAY,
                    'cube' => 'sig',
                    'label' => 37,
                    'region' => Region::HOME,
                    'include' => 'grapes',
                    'signature' => true,
                    'allowed' => array(Sugar::FRUIT)),
            array('name' => clienttranslate('Strong Aroma Báijiŭ'),
                    'sp' => 15,
                    'sugars' => 3,
                    'value' => 2,
                    'aged' => true,
                    'barrel' => Barrel::CLAY,
                    'cube' => 'sig',
                    'label' => 38,
                    'region' => Region::HOME,
                    'include' => 'sorghum',
                    'signature' => true,
                    'allowed' => array(Sugar::GRAIN)),
        );

        $this->spirit_awards = array(
            new SpiritAward(0, clienttranslate("120 Proof"), 7),
            new SpiritAward(1, clienttranslate("Double Sale"), 5),
            new SpiritAward(2, clienttranslate("Land Grab"), 5),
            new SpiritAward(3, clienttranslate("Builder"), 5),
            new SpiritAward(4, clienttranslate("Globetrotter"), 7),
            new SpiritAward(5, clienttranslate("Mouth Party"), 7),
            new SpiritAward(6, clienttranslate("Collector"), 7),
            new SpiritAward(7, clienttranslate("High Class"), 5),

            new SpiritAward(8, clienttranslate("Olympic Spirit"), 5),
            new SpiritAward(9, clienttranslate("North and South"), 7),
            new SpiritAward(10,clienttranslate( "Perfect Pair"), 5),
            new SpiritAward(11,clienttranslate( "Sophisticated"), 5),
            new SpiritAward(12,clienttranslate( "Patience"), 5),
            new SpiritAward(13,clienttranslate( "Recipe Book"), 5),
            new SpiritAward(14,clienttranslate( "Sweet"), 7),
            new SpiritAward(15,clienttranslate( "Pennysaver"), 7),

            new SpiritAward(16,clienttranslate( "Recruiter"), 5),
            new SpiritAward(17,clienttranslate( "Sun Never Sets"), 7),
            new SpiritAward(18,clienttranslate( "Top Shelf"), 7),
            new SpiritAward(19,clienttranslate( "Silver Spoon"), 7),
            new SpiritAward(20,clienttranslate( "Up With the Sun"), 7),
            new SpiritAward(21,clienttranslate( "Gold Digger"), 7),
            new SpiritAward(22,clienttranslate( "Quantity Over Quality"), 5),
        );

        foreach ($this->distillery_cards as $c) {
            $this->AllCards[$c->uid] = $c;
        }
        foreach ($this->premium_ingredient_cards as $c) {
            $this->AllCards[$c->uid] = $c;
        }
        foreach ($this->premium_item_cards as $c) {
            $this->AllCards[$c->uid] = $c;
        }
        foreach ($this->flavor_cards as $c) {
            $this->AllCards[$c->uid] = $c;
        }
        foreach ($this->goals_cards as $c) {
            $this->AllCards[$c->uid] = $c;
        }

        $this->sigCardsByCardId = array();
        foreach ($this->signature_ing_cards as $c) {
            $this->AllCards[$c->uid] = $c;
            $this->sigCardsByCardId[$c->card_id] = $c;
        }

        $this->templateCards = array();
        foreach ($this->basic_cards as $c) {
            $this->templateCards[$c->card_id] = $c;
            $this->templateCards[$c->card_id]->market = 'bm';
            $this->AllCards[$c->uid] = $c;
        }

        $this->distilleryDeck = new Deck("Distillery Upgrade", "distillery_upgrade", $this->distillery_cards, $this);
        $this->ingredientsDeck = new Deck("Premium Ingredient", "premium_ingredient", $this->premium_ingredient_cards, $this);
        $this->itemsDeck = new Deck("Premium Item", "premium_item", $this->premium_item_cards, $this);
        $this->flavorDeck = new Deck("Flavor", "flavor", $this->flavor_cards, $this);

        // re-initialize bottomless cards, i have no idea why
        $sql = sprintf("SELECT uid, card_id FROM bottomless_card");
        $results = self::getCollectionFromDb($sql);

        foreach ($results as $key => $r) {
            $tmp = clone $this->templateCards[$r['card_id']];
            $tmp->uid = $r["uid"];
            $this->AllCards[$r["uid"]] = $tmp;
        }

        $this->labelBenefits = array(
            clienttranslate("5 <span class='icon-coin-em'></span>"),
            clienttranslate("Move signature ingredient to pantry"),
            clienttranslate("Discard 1 card from pantry. Gain 1 card from truck"),
            clienttranslate("1 free ingredient"),
            clienttranslate("1 free recipe"),
            clienttranslate("1 free item"),
            clienttranslate("1 free distillery upgrade"),
        );
	}
	
    protected function getGameName( )
    {
		// Used for translations and stuff. Please do not modify.
        return "distilled";
    }	

    /*
        setupNewGame:
        
        This method is called only once, when a new game is launched.
        In this method, you must setup the game according to the game rules, so that
        the game is ready to be played.
    */
    protected function setupNewGame( $players, $options = array() )
    {    
        // Set the colors of the players with HTML color code
        // The default below is red/green/blue/orange/brown
        // The number of colors defined here must correspond to the maximum number of players allowed for the gams

        $gameinfos = self::getGameinfos();
        $default_colors = $gameinfos['player_colors'];
 
        // Create players
        // Note: if you added some extra field on "player" table in the database (dbmodel.sql), you can initialize it there.
        $sql = "INSERT INTO player (player_id, player_color, player_canal, player_name, player_avatar) VALUES ";
        $values = array();
        foreach( $players as $player_id => $player )
        {
            $color = array_shift( $default_colors );
            $values[] = "('".$player_id."','$color','".$player['player_canal']."','".addslashes( $player['player_name'] )."','".addslashes( $player['player_avatar'] )."')";
        }
        $sql .= implode( ',', $values );
        self::DbQuery( $sql );
        self::reattributeColorsBasedOnPreferences( $players, $gameinfos['player_colors'] );
        self::reloadPlayersBasicInfos();

        /************ Start the game initialization *****/

        // Init global values with their initial values
        //self::setGameStateInitialValue( 'my_first_global_variable', 0 );
        
        // Init game statistics
        // (note: statistics used in this file must be defined in your stats.inc.php file)
        self::initStat( 'table', 'turns_number', 7 );    // Init a table statistics
        self::initStat( 'player', 'basic_cards', 0 );  // Init a player statistics (for all players)
        self::initStat( 'player', 'du_cards', 0 );  // Init a player statistics (for all players)
        self::initStat( 'player', 'item_cards', 0 );  // Init a player statistics (for all players)
        self::initStat( 'player', 'ing_cards', 0 );  // Init a player statistics (for all players)
        self::initStat( 'player', 'recipe_cubes', 0 );  // Init a player statistics (for all players)
        self::initStat( 'player', 'bottles_used', 0 );  // Init a player statistics (for all players)
        //self::initStat( 'player', 'years_aged', 0 );  // Init a player statistics (for all players)
        self::initStat( 'player', 'money_gained', 0 );  // Init a player statistics (for all players)
        self::initStat( 'player', 'bronze_labels', 0 );  // Init a player statistics (for all players)
        self::initStat( 'player', 'silver_labels', 0 );  // Init a player statistics (for all players)
        self::initStat( 'player', 'gold_labels', 0 );  // Init a player statistics (for all players)
        self::initStat( 'player', 'basic_labels', 0 );  // Init a player statistics (for all players)
        self::initStat( 'player', 'goals_achieved', 0 );  // Init a player statistics (for all players)
        self::initStat( 'player', 'spirit_awards_achieved', 0 );  // Init a player statistics (for all players)
        self::initStat( 'player', 'signature_spirit', 0 );  // Init a player statistics (for all players)
        self::initStat( 'player', 'points_ingame', 0);
        self::initStat( 'player', 'points_bottles', 0);
        self::initStat( 'player', 'points_goals', 0);
        self::initStat( 'player', 'points_warehouses', 0);
        self::initStat( 'player', 'points_money', 0);
        self::initStat( 'player', 'points_dus', 0);
        self::initStat( 'player', 'points_total', 0);

        // TODO: setup the initial game situation here
        self::setGameStateInitialValue( 'turn', 1 );
        self::setGameStateInitialValue( 'exitDistill', false);
        self::setGameStateInitialValue( 'reactIdx', null);
        self::setGameStateInitialValue( 'distillersSelected', false);
        //self::setGameStateInitialValue( 'playerPassedSell', array());

        
        $this->distilleryDeck->init();
        $this->dealToIndex($this->distilleryDeck, 1);
        $this->dealToIndex($this->distilleryDeck, 2);
        $this->dealToIndex($this->distilleryDeck, 3);
        $this->dealToIndex($this->distilleryDeck, 4);

        $this->ingredientsDeck->init();
        $this->dealToIndex($this->ingredientsDeck, 1);
        $this->dealToIndex($this->ingredientsDeck, 2);
        $this->dealToIndex($this->ingredientsDeck, 3);
        $this->dealToIndex($this->ingredientsDeck, 4);

        $this->itemsDeck->init();
        $this->dealToIndex($this->itemsDeck, 1);
        $this->dealToIndex($this->itemsDeck, 2);
        $this->dealToIndex($this->itemsDeck, 3);
        $this->dealToIndex($this->itemsDeck, 4);
        
        $this->flavorDeck->init();


        $flight = self::getGameStateValue("flight");
        if ($flight == '9') {
            $flight = (bga_rand(0, 96) % 3) + 1;
            self::setGameStateValue("flight", $flight);
        } else if ($flight == '10') {
            $flight = (bga_rand(0, 96) % 8) + 1;
            self::setGameStateValue("flight", $flight);
        }
        $this->initRecipeCard($flight);
        $this->initLabels();

        shuffle($this->goals_cards);

        $enablePairings = intval($this->getGameStateValue("pairings"));
        $distillers = $this->distillers;
        if ($enablePairings) {
            switch ($flight) {
                case 1:
                    unset($distillers[8]);
                    unset($distillers[12]);
                    unset($distillers[16]);
                    unset($distillers[24]);
                    unset($distillers[28]);
                    unset($distillers[32]);
                    break;
                case 2: 
                    unset($distillers[0]);
                    unset($distillers[4]);
                    unset($distillers[6]);
                    unset($distillers[14]);
                    unset($distillers[18]);
                    unset($distillers[30]);
                    unset($distillers[34]);
                    break;
                case 3:
                    unset($distillers[4]);
                    unset($distillers[8]);
                    unset($distillers[12]);
                    unset($distillers[14]);
                    unset($distillers[30]);
                    unset($distillers[32]);
                    unset($distillers[34]);
                    break;
                case 4: 
                    unset($distillers[0]);
                    unset($distillers[18]);
                    unset($distillers[24]);
                    unset($distillers[28]);
                    unset($distillers[30]);
                    unset($distillers[34]);
                    break;
                case 5:
                    unset($distillers[6]);
                    unset($distillers[8]);
                    unset($distillers[16]);
                    unset($distillers[18]);
                    unset($distillers[28]);
                    unset($distillers[32]);
                    break;
                case 6: 
                    unset($distillers[0]);
                    unset($distillers[4]);
                    unset($distillers[6]);
                    unset($distillers[12]);
                    unset($distillers[14]);
                    unset($distillers[16]);
                    break;
                case 7:
                    unset($distillers[0]);
                    unset($distillers[6]);
                    unset($distillers[12]);
                    unset($distillers[28]);
                    unset($distillers[32]);
                    unset($distillers[34]);
                    break;
                case 8: 
                    unset($distillers[4]);
                    unset($distillers[8]);
                    unset($distillers[14]);
                    unset($distillers[16]);
                    unset($distillers[18]);
                    unset($distillers[24]);
                    unset($distillers[30]);
                    break;

            }
        }

        $this->distillerShuffle = array_values($distillers);
        shuffle($this->distillerShuffle);

        //$this->originalAwards = $this->spirit_awards;
        // Set up spirit awards
        shuffle($this->spirit_awards);
        $saList = array();

        // deal n+1 spirit awards
        for ($i = 0; count($saList) < count($players) + 1; $i++) {
            // If using G which does not have gold recipes, do not use Olympic Spirit or Gold Digger
            $sa = array_pop($this->spirit_awards);
            if ($flight == 7 && ($sa->uid == 8 || $sa->uid == 21)) 
                continue;
    
            // On flight D or H with two players, do not  use quantity over quality
            if (($flight == 4 || $flight == 5 || $flight == 8) && count($players) == 2 && $sa->uid == 22)
                continue;

            // On flight D with two players, do not use up with the sun or  North and South
            if ($flight == 4 && count($players) == 2 && ($sa->uid == 20 || $sa->uid == 9))
                continue;

            // On flight E with 2 players, sun never sets and up with the sun are impossible
            if ($flight == 5 && count($players) == 2 && ($sa->uid == 17 || $sa->uid == 20)) 
                continue;

            // On flight F with 2 players, sun never sets and north and south are impossible
            if ($flight == 6 && count($players) == 2 && ($sa->uid == 9 || $sa->uid == 17)) 
                continue;

            $saList[] = sprintf("(%d, 'market')", $sa->uid);
        }
        $sql = sprintf("INSERT INTO spirit_award (uid, location) VALUES %s",
            implode(',', $saList));
        self::dbQuery($sql);

        $firstPlayer = true;
        foreach( $players as $player_id => $player ) {
            if ($firstPlayer) {
                self::dbQuery("UPDATE player SET first_player = 1 WHERE player_id=$player_id");
                $firstPlayer = false;
            }
            $this->dealDistillers($player_id);
            $this->dealStartingCards($player_id);
        }

        /************ End of the game initialization *****/
        // Activate first player (which is in general a good idea :) )
        //$this->activeNextPlayer();
        $this->gamestate->setAllPlayersMultiactive();
    }

    /*
        getAllDatas: 
        
        Gather all informations about current game situation (visible by the current player).
        
        The method is called each time the game interface is displayed to a player, ie:
        _ when the game starts
        _ when a player refreshes the game page (F5)
    */
    protected function getAllDatas()
    {
        $result = array();
    
        $current_player_id = self::getCurrentPlayerId();    // !! We must only return informations visible by this player !!
    
        // Get information about players
        // Note: you can retrieve some extra field you added for "player" table in "dbmodel.sql" if you need it.
        $sql = "SELECT player_id id, money, player_score score FROM player ";
        $result['players'] = self::getCollectionFromDb( $sql );
  
        $bmList = array();
        foreach ($this->basic_cards as $c) {
            // Skip Alcohols
            if ($c->card_id == 0 || $c->card_id == 19 || $c->card_id == 20)
                continue;

            $bmList[] = $c;
        }
        $result['basic_market'] = $bmList;


        // Get the distillery upgrade market cards
        $sql = "SELECT uid, location_idx, location
                FROM distillery_upgrade 
                WHERE (location='market' AND location_idx > 0) OR location='truck'";
        $duList = array();

        $tmp = self::getCollectionFromDb($sql);
        foreach($tmp as $uid => $card) {
            $tmp = $this->AllCards[$card["uid"]];
            $tmp->location_idx = $card["location_idx"];
            $tmp->location = $card["location"];
            $duList[] = $tmp;
        }
        $result['distillery_upgrade_market'] = $duList;
        $sql = "SELECT COUNT(*) FROM distillery_upgrade WHERE location='deck'";
        $result['distillery_upgrade_market_count'] = self::getUniqueValueFromDb($sql);

        // Get the premium ingredient market cards
        $sql = "SELECT uid, location_idx, location
                FROM premium_ingredient 
                WHERE (location='market' AND location_idx > 0) OR location='truck'";
        $ingList = array();
        $tmp = self::getCollectionFromDb($sql);
        foreach($tmp as $card) {
            $tmp = $this->AllCards[$card["uid"]];
            $tmp->location_idx = $card["location_idx"];
            $tmp->location = $card["location"];
            $ingList[] = $tmp;
        }
        $result['premium_ingredient_market'] = $ingList;
        $sql = "SELECT COUNT(*) FROM premium_ingredient WHERE location='deck'";
        $result['premium_ingredient_market_count'] = self::getUniqueValueFromDb($sql);

        // Get the premium item market cards
        $sql = "SELECT uid, location_idx, location
                FROM premium_item 
                WHERE (location='market' AND location_idx > 0) OR location='truck'";
        $itemList = array();
        $tmp = self::getCollectionFromDb($sql);
        foreach($tmp as $card) {
            $tmp = $this->AllCards[$card["uid"]];
            $tmp->location_idx = $card["location_idx"];
            $tmp->location = $card["location"];
            $itemList[] = $tmp;
        }
        $result['premium_item_market'] = $itemList;
        $sql = "SELECT COUNT(*) FROM premium_item WHERE location='deck'";
        $result['premium_item_market_count'] = self::getUniqueValueFromDb($sql);

        // TODO: Gather all information about current game situation (visible by player $current_player_id).
        $players = $this->loadPlayersBasicInfos();
        $result['playerCards'] = array();
        foreach ($players as $player_id => $info) {
            // passing true means we show all cards for all players
            $pantryList = $this->getPlayerCardList($player_id, $player_id == $current_player_id);
            $result['playerCards'][$player_id] = $pantryList;
        }

        // Get recipe cubes
        $sql = "SELECT id, player_id, slot, color FROM recipe";
        $tmp = self::getCollectionFromDb($sql);
        $recipeList = array();
        foreach($tmp as $r) {
            $recipeList[] = $r;
        }
        $result['recipes'] = $recipeList;


        $sql = "SELECT label, location, count, uid FROM label WHERE location='market' OR location='flight'";
        $tmp = self::getCollectionFromDb($sql);
        $recipes = $this->getRecipes();
        $flightData = array();
        if (count($tmp) == 0) {
            // TODO REMOVE THIS - THIS IS TO RECOVER BROKEN GAMES
            $result['flight'] = 'ERROR';
            return $result;
        }
        foreach ($recipes as $r) {
            $r["count"] = $tmp[$r["name"]]["count"];
            $flightData[] = $r;
        }
        $result["flight"] = $flightData;
        $result['alcohol'] = $this->AllCards[0]; // Add alcohol

        $sql = "SELECT player_id, card_id, 'distiller' as market
                FROM distiller WHERE discarded=0 ORDER BY uid DESC";
        $distillers = self::dbQuery($sql);
        $distillerList = array();
        $distillerLabels = array();
        $distillerLabelInfo = self::getCollectionFromDb("SELECT player_id, uid, label, location FROM label WHERE signature=1");
        foreach ($distillers as $d) {
            $distillerClass = $this->distillers[$d["card_id"]];
            $distillerClass->label = $this->signature_recipes[$distillerClass->id / 2];
            $distillerList[$d['player_id']][] = $distillerClass;
            if ($distillerLabelInfo != null) {
                $tmp = $this->signature_recipes[$d["card_id"] / 2];
                $tmp['location'] = $distillerLabelInfo[$d['player_id']]['location'];
                $distillerLabels[$d['player_id']][] = $tmp;
            }
        }
        $result["distillers"] = $distillerList;
        $result['distillersSelected'] = self::getGameStateValue("distillersSelected");
        $result['signatureLabels'] = $distillerLabels;
        $result['distillerLabelInfo'] = $distillerLabelInfo;

        $sql = "SELECT uid, location FROM spirit_award";
        $spiritAwards = self::getCollectionFromDb($sql);
        $saList = array();
        foreach($spiritAwards as $sa_uid => $sa) {
            $tmp = $this->spirit_awards[$sa['uid']];
            $tmp->location = $sa['location'];
            $saList[] = $tmp;
        }
        $result['spiritAwards'] = $saList;

        // Get awarded spirit awards
        $saAwarded = self::dbQuery("SELECT * from market_purchase WHERE action='sa'");
        foreach ($saAwarded as $info) {
            $result['saAwarded'][] = array('uid' => $info['uid'], 'player_id' => $info['player_id']);

        }

        // TODO i think flavor cards can be revealed too
        $revealed = self::dbQuery("
            SELECT uid, 'du' as market FROM distillery_upgrade WHERE location='reveal'
            UNION ALL
            SELECT uid, 'ing' as market FROM premium_ingredient WHERE location='reveal'
            UNION ALL
            SELECT uid, 'item' as market FROM premium_item WHERE location='reveal'
            UNION ALL
            SELECT uid, 'ing' as market FROM flavor WHERE location='reveal'
            ");
        $revealList = array();
        foreach($revealed as $r) {
            $tmp = $this->AllCards[$r['uid']];
            $tmp->market = $r['market'];
            $revealList[] = $tmp;
        }
        $result['reveal'] = $revealList;

        $result['spirits'] = $this->getSpirits();
        $result['flavor_map'] = $this->getFlavorMap();
        $result['firstplayer'] = self::getUniqueValueFromDb("SELECT player_id FROM player WHERE first_player=1");
        $result['turn'] = self::getGameStateValue("turn");
        $result['cardText'] = $this->cardText;
        $result['flightCard'] = self::getGameStateValue("flight");
        $result['recipeFlight'] = $this->getRecipeFlight();
        $result['card_text'] = $this->card_text;
        $result['sa_text'] = $this->sa_text;
        $result['goal_text'] = $this->goal_text;
        $result['distiller_text'] = $this->distiller_text;
        // Only do this if distillers have been selected
        $result['whatCanIMake'] = $this->getWCIM();
        /*if ($this->getStateName() != "chooseDistiller")
            $result['state'] = $this->gamestate->state();
        */
        return $result;
    }

    /*
        getGameProgression:
        
        Compute and return the current game progression.
        The number returned must be an integer beween 0 (=the game just started) and
        100 (= the game is finished or almost finished).
    
        This method is called each time we are in a game state with the "updateGameProgression" property set to true 
        (see states.inc.php)
    */
    function getGameProgression()
    {
        $turn = self::getGameStateValue("turn");
        $value = floor(100 * ($turn - 1) / 7);

        if ($this->getStateName() == 'marketEnd') {
            $value += 5;
        }
        if ($this->getStateName() == 'distillFinalize') {
            $value += 10;
        }
        
        return $value;
    }


//////////////////////////////////////////////////////////////////////////////
//////////// Utility functions
////////////    

    /*
        In this space, you can put any utility methods useful for your game logic
    */

    function getSpirits($bottleMap = null) {
        $spirits =  array_values(self::getCollectionFromDb("SELECT * FROM drink JOIN label on drink.label_uid=label.uid"));
        $ret = array();
        foreach ($spirits as $s) {
            $card_ids = [];
            $s['labelId'] = $this->getRecipeFromSlot($s['recipe_slot'], $s['player_id'])['label'];
            if ($s['barrel_uid'])
                $card_ids[] = $this->AllCards[$s['barrel_uid']]->card_id;
            else 
                $card_ids[] = 19;

            if ($bottleMap && array_key_exists($s['id'], $bottleMap)) 
                $card_ids[] = $this->AllCards[$bottleMap[$s['id']]]->card_id;
            if ($s['sold'] && $s['bottle_uid']) 
                $card_ids[] = $this->AllCards[$s['bottle_uid']]->card_id;
            else if ($s['sold'])
                $card_ids[] = 20;


            $uids = explode(',', $s['cards']);
            foreach ($uids as $uid) {
                $card_ids[] = $this->AllCards[$uid]->card_id;
            }
            $s['card_ids'] = $card_ids;
            $s['known_flavors'] = $this->getKnownFlavorCount($s['id']);
            $ret[] = $s;
        }
        return $ret;
    }
    function getFlavorMap() {
        return self::getCollectionFromDb("SELECT uid, card_id FROM flavor");
    }
    function isValidSpirit($wbCards) {
        $yeast = false;
        $water = false;
        $alcohol = 0;
        $sugar = false;
        foreach ($wbCards as $c) {
            $cardList[] = "'$c'";

            // Check for 1 yeast 1 water and 1 sugar
            switch ($this->AllCards[$c]->type) {
                case CardType::YEAST:
                    $yeast = true;
                    break;
                case CardType::WATER:
                    $water = true;
                    break;
                case CardType::SUGAR:
                    $sugar = true;
                    break;
                case CardType::ALCOHOL:
                    $alcohol++;
                    break;
            }
        }
        if ($yeast && $water && $sugar ||
            $yeast && $sugar && $alcohol ||
            $water && $sugar && $alcohol ||
            $alcohol >= 2 && $sugar) {
                return true;
        }
        return false;

    }
    function playerHasPowers($pid, $powers) {
        $powerCards = $this->getPowerCards();
        if (!$powers) {
            return true;
        }


        foreach ($powers as $checkPower) {
            if ($checkPower == "") // this sometimes happens with the explode command
                continue;
            if ($checkPower == 0) { // Distiller abilities may come through as 0 
                $checkPower = $this->getPlayerDistiller($pid)->id;
            }
            $found = false;
            foreach ($powerCards as $pc) {
                if ($pc['market'] == 'du' && $pc['uid'] == $checkPower && $pc['player_id'] == $pid)  {
                    $found = true;
                    break;
                }
                if ($pc['market'] == 'distiller' && $pc['card_id'] == $checkPower && $pc['player_id'] == $pid)  {
                    $found = true;
                    break;
                }
            }
            if (!$found) 
                return false;
        }
        return true;
    }

    function getEffectiveRecipeCost($recipeSlot, $powers, $playerId) {
        $cost = $this->getCostOfRecipeSlot($recipeSlot);

        $usedPowers = [];
        foreach ($powers as $power) {
            // no need to check distiller abilities here right now
            if ($power == "") {
                continue;
            }
            switch ($this->AllCards[$power]->card_id) {
                case 119:
                    $cost -= 2;
                    $turn = self::getGameStateValue("turn", 0);
                    #$this->recordPower($power, $playerId, false);
                    $usedPowers[] = [$power, 'du'];
                    break;
            }
        }
        return array('cost'=>$cost, 'usedPowers' => $usedPowers);
    }
    public function getEffectiveCost($uid, $powers, $playerId) {
        $c = $this->AllCards[$uid];
        $cost = $c->cost;
        $usedPowers = array();

        if (($powers != null && count($powers))) {
            $powerTypes = array();
            $cardIdToUid = array();
            foreach ($powers as $p) {
                if ($p == 0) { // This indicates a distiller ability
                    $tmp = self::getUniqueValueFromDb("SELECT card_id FROM distiller WHERE player_id=$playerId and discarded=0");
                    $powerTypes[] = $tmp;
                    continue;
                }
                $powerTypes[] = $this->AllCards[$p]->card_id;
                $cardIdToUid[$this->AllCards[$p]->card_id] = $p;
            }

            if (in_array(109, $powerTypes) && ($c->type == CardType::BARREL || $c->type == CardType::BOTTLE)) {
                $cost -= 1;
                $usedPowers[] = [$cardIdToUid[109], 'du'];
            }
            if (in_array(114, $powerTypes) && ($c->type == CardType::SUGAR || $c->type == CardType::WATER || $c->type == CardType::YEAST)) {
                $cost -= 2;
                $usedPowers[] = [$cardIdToUid[114], 'du'];
            }
            if (in_array(115, $powerTypes) && ($c->type == CardType::BOTTLE))  {
                $cost -= 2;
                $usedPowers[] = [$cardIdToUid[115], 'du'];
            }
            if (in_array(122, $powerTypes) && ($c->type == CardType::BOTTLE)) {
                $cost -= 1;
                $usedPowers[] = [$cardIdToUid[122], 'du'];
            }
            if (in_array(128, $powerTypes) && ($c->type == CardType::DU)) {
                $cost -= 2;
                $usedPowers[] = [$cardIdToUid[128], 'du'];
            }
            if (in_array(131, $powerTypes) && ($c->type == CardType::BARREL)) {
                $cost -= 2;
                $usedPowers[] = [$cardIdToUid[131], 'du'];
            }
            if (in_array(0, $powerTypes) && ($c->type == CardType::BOTTLE)) { // Ajani 
                $cost -= 1;
                $usedPowers[] = [0, 'distiller'];
            }
            if (in_array(6, $powerTypes) && ($c->type == CardType::DU)) { // etienne
                $cost -= 2;
                $usedPowers[] = [6, 'distiller'];
            }
            if (in_array(12, $powerTypes)  && ($c->type == CardType::BARREL)) { // pilar
                $cost -= 2;
                $usedPowers[] = [12, 'distiller'];
            }
            if (in_array(14, $powerTypes)  && ($c->card_id >= 133 && $c->card_id <= 139)) { // Mother Mary
                $cost -= 1;
                $usedPowers[] = [14, 'distiller'];
            }
            if (in_array(18, $powerTypes)  && ($c->type == CardType::SUGAR || $c->type == CardType::WATER || $c->type == CardType::YEAST)) { // Jeong
                $cost -= 2;
                $usedPowers[] = [18, 'distiller'];
            }

            // These ones just need to be recorded, no affect on the purchase
            if (in_array(2, $powerTypes)) {
                $usedPowers[] = [2, 'distiller'];
            }
            if (in_array(123, $powerTypes)) {
                $usedPowers[] = [$cardIdToUid[123], 'du'];
            }
            if (in_array(127, $powerTypes)) { // co-op manager
                $usedPowers[] = [$cardIdToUid[127], 'du'];
            }
            if (in_array(124, $powerTypes)) { // Market Buyer
                $usedPowers[] = [$cardIdToUid[124], 'du'];
            }
            if (in_array(34, $powerTypes)) { // Fang Xin
                $usedPowers[] = [34, 'distiller'];
                // TODO should we limit this to only certain situations?
                $this->stPlayerBuyTurnRevealCleanup(false);
            }
        }
        return array(
            'cost' => $cost,
            'usedPowers' => $usedPowers,
        );
    }
    public function canPlayerBuy($playerId) {
        $basics = $this->basicRemaining($playerId);
        if ($basics> 0) {
            return "basic";
        }

        $money = $this->getPlayerMoney($playerId);

        $allDatas = $this->getAllDatas();
        $cards = $allDatas['distillery_upgrade_market'];
        $cards = array_merge($cards, $allDatas['premium_item_market']);
        $cards = array_merge($cards, $allDatas['premium_ingredient_market']);

        $powerCards = $this->getPowerCards();
        $powers = array();
        foreach ($powerCards as $p) {
            if ($p['player_id'] != $playerId)
                continue;
            if ($p['market'] == 'distiller') {
                $powers[] = 0;
            }
            $powers[] = $p['uid'];
        }

        $ret = false;
        foreach ($cards as $c) {
            if ($c->location != 'market') 
                continue;
            $result = $this->getEffectiveCost($c->uid, $powers, $playerId);
            $cost = $result['cost'];
            if ($money >= $cost) {
                return $c->name;
            }
        }

        // Check recipe slots 0-7
        $recipesBought = self::getCollectionFromDb("SELECT slot, player_id FROM recipe WHERE player_id = $playerId");
        for ($ii = 0; $ii < 7; $ii++) {
            // can't buy the recipe because they already own it
            if (array_key_exists($ii, $recipesBought)) 
                continue;

            $result = $this->getEffectiveRecipeCost($ii, $powers, $playerId);
            $cost = $result['cost'];
            if ($money >= $cost) {
                return $this->getRecipeNameFromSlot($ii, $playerId);
                return true;
            }

        }

        return false;
    }

    public function recordPower($uid, $player_id, $isDistiller) {
        $turn = self::getGameStateValue("turn");
        $market = 'du';
        if ($isDistiller)
            $market = 'distiller';

        self::dbQuery("INSERT INTO market_purchase (action, uid, turn, player_id, market) VALUES ('dupower', $uid, $turn, $player_id, '$market')");
    }

    protected function isPlayerZombie($player_id) {
       $players = self::loadPlayersBasicInfos();
       if (! isset($players[$player_id]))
           throw new BgaSystemException("Player $player_id is not playing here");
       
       return ($players[$player_id]['player_zombie'] == 1);
    }
    public function getPlayerSp($pid=null) {
        if ($pid == null)
            $pid = self::getActivePlayerId();

        $money = self::getUniqueValueFromDb("select player_score from player where player_id=$pid");
        return $money;
    }
    public function getPlayerMoney($pid=null) {
        if ($pid == null)
            $pid = self::getActivePlayerId();

        $money = self::getUniqueValueFromDb("select money from player where player_id=$pid");
        return $money;
    }
    public function getFirstPlayer() {
        $player_id = self::getUniqueValueFromDb("SELECT player_id FROM player WHERE first_player = 1");
        return $player_id;
    }
    public function setActiveFirstPlayer() {
        $player_id = $this->getFirstPlayer();
        $this->gamestate->changeActivePlayer( $player_id );
        return $player_id;
    }

    public function rotateFirstPlayer() {
        $currentFirstPlayer = $this->getFirstPlayer();
        $playerCount = $this->getPlayersNumber();
        $nextFirstPlayer = $this->getPlayerNoById($currentFirstPlayer) + 1;
        if ($nextFirstPlayer > $playerCount) {
            $nextFirstPlayer = 1;
        }
        self::dbQuery("UPDATE player set first_player = 0");
        self::dbQuery("UPDATE player set first_player = 1 WHERE player_no=$nextFirstPlayer");
        $pid = self::getUniqueValueFromDb("SELECT player_id FROM player WHERE first_player=1");

        self::notifyAllPlayers("updateFirstPlayer", 
            clienttranslate('${player_name} is now first player'), 
            array('player_name' => $this->getPlayerName($pid),
                  'player_id' => $pid));
    }

    public function getMarketFromId($marketId) {
        switch ($marketId) {
            case 'bm':
                return "Basic Market";
            case 'du':
                return 'Distillery Upgrade';
            case 'ing':
                return "Premium Ingredient";
            case 'item':
                return "Premium Item";
            default:
                // well that's not good;
                // TODO do something fatal
        }
    }
    public function getDeckFromId($marketId) {
        switch ($marketId) {
            case 'bm':
                return null;
            case 'du':
                return $this->distilleryDeck;
            case 'ing':
                return $this->ingredientsDeck;
            case 'item':
                return $this->itemsDeck;
            default:
                // well that's not good;
                // TODO do something fatal
        }
    }
    public function getIdFromMarket($marketName) {
        switch ($marketName) {
            case 'Distillery Upgrade':
                return 'du';
            case 'Premium Ingredient':
                return 'ing';
            case 'Basic Market':
                return 'bm';
            case 'Premium Item':
                return 'item';
        }
    }
    public function getPlayerDistiller($playerId) {
        $distillerId = self::getUniqueValueFromDb("SELECT card_id FROM distiller WHERE player_id=$playerId AND discarded=0");
        return $this->distillers[$distillerId];
    }
    public function getRecipeRegionForPlayer($playerId, $recipe) {
        // Some sort of bug here on get region for player
        $region = $recipe['region'];
        if ($region == Region::HOME) {
            return $this->getPlayerDistiller($playerId)->region;
        }
        return $region;
    }
    public function getBottleRegionForPlayer($playerId, $bottleUid) {
        $region = $this->AllCards[$bottleUid]->subtype;
        if ($region == Region::HOME) {
            return $this->getPlayerDistiller($playerId)->region;
        }
        return $region;
    }
    public function playerHasLabelRegionMatch($playerId, $drinkInfo) {
        $label = $drinkInfo['label'];
        $recipe = $this->getRecipeByName($label, $playerId);
        $myRegion = $this->getRecipeRegionForPlayer($playerId, $recipe);

        $match = false;
        $prevDrinks = self::dbQuery("SELECT uid, label FROM label WHERE player_id=$playerId and location != 'flight'");
        foreach ($prevDrinks as $pd) {
            if ($pd['uid'] == $drinkInfo['label_uid']) {
                continue;
            }
            $r = $this->getRecipeByName($pd['label'], $playerId);
            $region = $this->getRecipeRegionForPlayer($playerId, $r);
            if ($region == $myRegion) {
                $match = true;
            }
        }
        return $match;
    }
    public function duMasterBlender($playerId, $drinkInfo, $pc) {
        $match = $this->playerHasLabelRegionMatch($playerId, $drinkInfo);
        
        if ($match) {
            $this->playerPoints($playerId, 1, $this->AllCards[$pc['uid']]->name);
            return 1;
        }
        return 0;

    }
    public function distillerBrownBrothers($playerId, $drinkInfo) {
        $match = $this->playerHasLabelRegionMatch($playerId, $drinkInfo);
        
        if (!$match) {
            $this->playerPoints($playerId, 2, $this->distillers[4]->name);
            return 2;
        }
        return 0;

    }
    
    public function addFlavorToDrink($drinkId, $playerId, $location, $triggerCard=null, $flavor=null, $logAge=true) {
        if ($location == null) {
            $location = self::getUniqueValueFromDb("SELECT location FROM drink WHERE id=$drinkId");
        }

        $sql = sprintf("UPDATE drink SET flavor_count=flavor_count+1 WHERE id=%d", $drinkId);
        self::dbQuery($sql);

        if ($flavor) {
            self::dbQuery("UPDATE flavor SET player_id=$playerId, location='$location', location_idx=$drinkId WHERE uid=$flavor");
            self::dbQuery("UPDATE drink SET cards = CONCAT(cards, ',$flavor') WHERE id=$drinkId");
        }

        $turn = self::getGameStateValue("turn");
        if ($logAge) {
            self::dbQuery("INSERT INTO market_purchase (player_id, action, turn, recipe_slot) VALUES ($playerId, 'age', $turn, $drinkId)");
        } else {
        }


        if ($triggerCard !== null) {
            $visibleCard = null;
            if ($triggerCard == 0) {
                $c = $this->getPlayerDistiller($playerId);
                $card_id = $c->id;
            } else {
                $c = $this->AllCards[$triggerCard];
                $card_id = $c->card_id;
            }
            if ($flavor != null) {
                switch ($card_id) {
                    case 113: // Doig
                    case 111: // Malting floor
                    case 10: // angus
                        $visibleCard = $this->AllCards[$flavor];
                        $visibleCard->location_idx = 1;
                        break;
                }
            }
            self::notifyAllPlayers("ageDrink", clienttranslate('Flavor card added to ${player_name}\'s ${location_str} by ${trigger_name}'), array(
                'i18n' => array("location_str", "trigger_name"),
                "player_name" => $this->getPlayerName($playerId),
                "player_id" => $playerId,
                "location" => $location,
                "location_str" => $this->normalizeString($location),
                "trigger_name" => $c->name,
                // TODO make this private
                "visible_card" => $visibleCard,
                "spirits" => $this->getSpirits(),
            ));
        } else {
            self::notifyAllPlayers("ageDrink", clienttranslate('Flavor card added to ${player_name}\'s ${location_str}'), array(
                'i18n' => array("location_str"),
                "player_name" => $this->getPlayerName($playerId),
                "player_id" => $playerId,
                "location" => $location,
                "location_str" => $this->normalizeString($location),
                "spirits" => $this->getSpirits(),
            ));
        }
    }
    public function normalizeString($location) {
        switch ($location) {
            case 'warehouse1': return clienttranslate("warehouse 1");
            case 'warehouse2': return clienttranslate("warehouse 2");
            case Region::ASIA: return clienttranslate("Asia and Oceania");
            case Region::AMERICAS: return clienttranslate("Americas");
            case Region::EUROPE: return clienttranslate("Europe");
        }
        return $location;
    }
    public function getPowerCards() {
        $sql = "SELECT uid, card_id, 'du' as market, player_id FROM distillery_upgrade
                WHERE location='player'
                UNION ALL 
                SELECT uid, card_id, 'distiller' as market, player_id FROM distiller WHERE discarded=0";
        $powerCards = self::dbQuery($sql);
        
        $turn = self::getGameStateValue("turn");
        $usedDuCards = self::getCollectionFromDb("SELECT uid FROM market_purchase WHERE action='dupower' AND turn=$turn AND market='du'");
        $usedDistillerCards = self::getCollectionFromDb("SELECT uid FROM market_purchase WHERE action='dupower' AND turn=$turn AND market='distiller'");

        $final = array();
        foreach ($powerCards as $pc) {
            if ($this->isPlayerZombie($pc['player_id']))
                continue;

            if ($pc['market'] == 'du') {
                if (array_key_exists($pc['uid'], $usedDuCards)) 
                    continue;
            } else {
                if (array_key_exists($pc['card_id'], $usedDistillerCards)) 
                    continue;
            }
            $final[] = $pc;
        }

        return $final;
    }
    public function notifyAllPlayersOfPowerCardGivingBasicCard($pid, $card_id, $pc, $location = null) {
        if ($location == null) {
            $location = "player";
        }
        $newUid = $this->addBasicCardToPlayer($this->templateCards[$card_id]->uid, $pid);
        $this->notifyAllPlayers("buyCard", clienttranslate('${player_name} gets ${card_name} from ${trigger_name}'), array(
                        'i18n' => array("trigger_name", "card_name"),
                        'player_name' => $this->getPlayerName($pid),
                        'player_id' => $pid,
                        'uid' => $newUid,
                        'card_name' => $this->AllCards[$newUid]->name,
                        'card_id' => $this->AllCards[$newUid]->card_id,
                        'card' => $this->AllCards[$newUid],
                        'market' => 'bm',
                        'trigger_name' => $this->AllCards[$pc]->name,
                        'location' => $location,
        ));
        return $newUid;
    }
    public function checkSpiritAwards() {
        //self::notifyAllPlayers("dbgdbg", "checking spirit awards", array());
        $saList = self::dbQuery("SELECT * FROM spirit_award WHERE location='market'");
        $turn = self::getGameStateValue("turn", 0);
        $sql = sprintf("SELECT * FROM drink WHERE sold_turn=%d", $turn);
        $drinks = self::dbQuery($sql);

        foreach ($saList as $sa) {
            $winningPlayers = array();
            $saObj = $this->spirit_awards[$sa["uid"]];
            switch ($sa['uid']) {
            case 0: 
                // 120 proof
                foreach ($drinks as $drink) {
                    $alcohols = 0;
                    $cards = $drink["cards"];
                    $cardList = explode(',', $cards);
                    foreach ($cardList as $card) {
                        $c = $this->AllCards[$card];
                        if ($c->type == CardType::ALCOHOL)
                            $alcohols++;
                    }
                    if ($alcohols >= 6)
                        $winningPlayers[$drink['player_id']] = true;
                }
                break;
            case 1: // double sale
                $playerCount = array();
                foreach ($drinks as $drink) {
                    $player = $drink['player_id'];
                    if (!array_key_exists($player, $playerCount)) {
                        $playerCount[$player] = 1;
                    } else {
                        $playerCount[$player]++;
                    }
                }
                foreach ($playerCount as $p => $c) {
                    if ($c >= 2)
                        $winningPlayers[$p] = true;
                }
                break;
            case 3:
            case 16: 
                // Builder
                // Recruiter
                $subtype = null;
                if ($sa['uid'] == 3)
                    $subtype = DU::EQUIPMENT;
                else
                    $subtype = DU::SPECIALIST;
                

                $sql = "SELECT * FROM distillery_upgrade WHERE location='player'";
                $duCardsByPlayer = self::dbQuery($sql);

                $playerCount = array();
                foreach ($duCardsByPlayer as $card) {
                    $playerId = $card['player_id'];
                    if ($this->AllCards[$card['uid']]->subtype == $subtype) {
                        if (!array_key_exists($playerId, $playerCount)) {
                            $playerCount[$playerId] = 1;
                        } else {
                            $playerCount[$playerId]++;
                        }
                    }
                }
                foreach ($playerCount as $p => $c) {
                    if ($c >= 3)
                        $winningPlayers[$p] = true;
                }
                break;
            case 2:
            case 4:
                // Globetrotter
                if ($sa['uid'] == 2) {
                    $needed = 2;
                } else if ($sa['uid'] == 4) {
                    $needed = 3;
                }
                $players = $this->loadPlayersBasicInfos();
                foreach ($players as $p => $info) {
                    $labels = self::dbQuery("SELECT * FROM label WHERE player_id=$p AND (location='player' OR location LIKE 'warehouse%' AND  count != 0)");
                    $regions = array();
                    foreach ($labels as $l) {
                        $recipe = $this->getRecipeByName($l['label'], $p);
                        $adjustedRegion = $this->getRecipeRegionForPlayer($p, $recipe);
                        $regions[$adjustedRegion] = true;
                    }
                    if (count($regions) >= $needed) {
                        $winningPlayers[$p] = true;
                    }
                }
                break;
            case 5:
                // Mouth Party
                foreach ($drinks as $drink) {
                    if ($drink['flavor_count'] >= 4)
                        $winningPlayers[$drink['player_id']] = true;
                }
                break;
            case 6:
                $bottles = self::dbQuery("SELECT * FROM premium_item WHERE location='display'");
                $playerCount = array();
                foreach ($bottles as $card) {
                    $playerId = $card['player_id'];
                    if ($this->AllCards[$card['uid']]->type == CardType::BOTTLE) {
                        if (!array_key_exists($playerId, $playerCount)) {
                            $playerCount[$playerId] = 1;
                        } else {
                            $playerCount[$playerId]++;
                        }
                    }
                }
                foreach ($playerCount as $p => $c) {
                    if ($c >= 4)
                        $winningPlayers[$p] = true;
                }
                break;
            case 7:
                // High Class
                foreach ($drinks as $drink) {
                    if ($drink['sale_sp'] >= 12) {
                        $winningPlayers[$drink['player_id']] = true;
                    }
                }
                break;
            case 8: // Olympic Spirit
                // collect one bronze, one silver, and one gold spirit label
                $labels = self::getCollectionFromDb("SELECT uid, label, player_id FROM label WHERE player_id is not null AND count != 0 AND (location='player' or location like 'warehouse%')");
                $playerCount = array();
                foreach ($labels as $info) {
                    $pid = $info['player_id'];
                    if (!array_key_exists($pid, $playerCount)) {
                        $playerCount[$pid] = array();
                    }
                    $r = $this->getRecipeByName($info['label'], $pid);
                    if ($r['cube'] != 'none' && $r['cube'] != 'sig')
                        $playerCount[$pid][$r['cube']] = true;
                }
                foreach ($playerCount as $pid => $colors) {
                    if (count($colors) >= 3)
                        $winningPlayers[$pid] = true;
                }
                break;
            case 9: 
                // North and South, 3 americas => 7
                $labels = self::getCollectionFromDb("SELECT uid, label, player_id FROM label WHERE player_id is not null AND count != 0 AND (location='player' or location like 'warehouse%')");
                $playerCount = array();
                foreach ($labels as $info) {
                    $pid = $info['player_id'];
                    if (!array_key_exists($pid, $playerCount)) {
                        $playerCount[$pid] = 0;
                    }
                    $r = $this->getRecipeByName($info['label'], $pid);
                    if ($r['region'] == Region::AMERICAS) {
                        $playerCount[$pid]++;
                    }
                }
                foreach ($playerCount as $pid => $ct) {
                    if ($ct >= 3) {
                        $winningPlayers[$pid] = true;
                    }
                }
                break;
            case 10:  // Perfect pair
                // sell a non-vodka recipe with a matching region bottle
                foreach ($drinks as $drink) {
                    $bottleRegion = $this->getBottleRegionForPlayer($drink['player_id'], $drink['bottle_uid']);
                    $recipe = $this->getRecipeFromSlot($drink['recipe_slot'], $drink['player_id']);
                    $labelRegion = $this->getRecipeRegionForPlayer($drink['player_id'], $recipe);

                    if ($bottleRegion != "NONE" && $bottleRegion == $labelRegion && $recipe['name'] != "Vodka")
                        $winningPlayers[$drink['player_id']] = true;
                }
                break;
            case 11: // Sophisticated
                foreach ($drinks as $drink) {
                    $recipe = $this->getRecipeFromSlot($drink['recipe_slot'], $drink['player_id']);
                    if ($recipe['aged'])
                        $winningPlayers[$drink['player_id']] = true;
                }
                break;

            case 12: // Patience
                $playerCounts = self::getCollectionFromDb("SELECT player_id, COUNT(*) as ct FROM drink WHERE location like 'warehouse%'  AND sold=0 GROUP BY player_id");
                foreach ($playerCounts as $pid => $info) {
                    if ($info['ct'] >= 2) {
                        $winningPlayers[$pid] = true;
                    }
                }
                break;
            case 13:  // Recipe book
                // 4 recipe cubes => 5 points
                $recipes = self::getCollectionFromDb("SELECT player_id, COUNT(*) as ct FROM recipe GROUP BY player_id");
                foreach ($recipes as $pid => $info) {
                    if ($info['ct'] >= 4) {
                        $winningPlayers[$pid] = true;
                    }
                }
                break;
            case 14: // Sweet
                // sell a card with 5 sugar cards or more
                foreach ($drinks as $drink) {
                    $cards = explode(',', $drink['cards']);
                    $sugarCount = 0;
                    foreach ($cards as $c) {
                        if ($this->AllCards[$c]->type == CardType::SUGAR) {
                            $sugarCount++;
                        }
                    }
                    if ($sugarCount >= 5) {
                        $winningPlayers[$drink['player_id']] = true;
                    }
                }
                break;
            case 15: // Pennysaver
                // have 25 money
                $players = self::getCollectionFromDb("SELECT player_id FROM player WHERE money >= 25");
                foreach($players as $pid => $info) {
                    $winningPlayers[$pid] = true;
                }
                break;

            case 17: // The Sun never sets
                // 3 europes
                $labels = self::getCollectionFromDb("SELECT uid, label, player_id FROM label WHERE player_id is not null AND count != 0 AND (location='player' or location like 'warehouse%')");
                $playerCount = array();
                foreach ($labels as $info) {
                    $pid = $info['player_id'];
                    if (!array_key_exists($pid, $playerCount)) {
                        $playerCount[$pid] = 0;
                    }
                    $r = $this->getRecipeByName($info['label'], $pid);
                    if ($r['region'] == Region::EUROPE) {
                        $playerCount[$pid]++;
                    }
                }
                foreach ($playerCount as $pid => $ct) {
                    if ($ct >= 3) {
                        $winningPlayers[$pid] = true;
                    }
                }
                break;
            case 18: // Top Shelf
                foreach ($drinks as $drink) {
                    if ($drink['sale_value'] >= 15) {
                        $winningPlayers[$drink['player_id']] = true;
                    }
                }
                break;
            case 19: // silver spoon
                $labels = self::getCollectionFromDb("SELECT uid, label, player_id FROM label WHERE player_id is not null AND count != 0 AND (location='player' or location like 'warehouse%')");
                $playerCount = array();
                foreach ($labels as $info) {
                    $pid = $info['player_id'];
                    if (!array_key_exists($pid, $playerCount)) {
                        $playerCount[$pid] = 0;
                    }
                    $r = $this->getRecipeByName($info['label'], $pid);
                    if ($r['cube'] == 'silver') {
                        $playerCount[$pid]++;
                    }
                }
                foreach ($playerCount as $pid => $ct) {
                    if ($ct >= 3) {
                        $winningPlayers[$pid] = true;
                    }
                }
                break;
            case 20: // Up with the sun
                 // 3 asias
                $labels = self::getCollectionFromDb("SELECT uid, label, player_id FROM label WHERE player_id is not null AND count != 0 AND (location='player' or location like 'warehouse%')");
                $playerCount = array();
                foreach ($labels as $info) {
                    $pid = $info['player_id'];
                    if (!array_key_exists($pid, $playerCount)) {
                        $playerCount[$pid] = 0;
                    }
                    $r = $this->getRecipeByName($info['label'], $pid);
                    if ($r['region'] == Region::ASIA) {
                        $playerCount[$pid]++;
                    }
                }
                foreach ($playerCount as $pid => $ct) {
                    if ($ct >= 3) {
                        $winningPlayers[$pid] = true;
                    }
                }
                break;
            case 21: // Gold Digger
                $labels = self::getCollectionFromDb("SELECT uid, label, player_id FROM label WHERE player_id is not null AND count != 0 AND (location='player' or location like 'warehouse%')");
                $playerCount = array();
                foreach ($labels as $info) {
                    $pid = $info['player_id'];
                    if (!array_key_exists($pid, $playerCount)) {
                        $playerCount[$pid] = 0;
                    }
                    $r = $this->getRecipeByName($info['label'], $pid);
                    if ($r['cube'] == 'gold') {
                        $playerCount[$pid]++;
                    }
                }
                foreach ($playerCount as $pid => $ct) {
                    if ($ct >= 2) {
                        $winningPlayers[$pid] = true;
                    }
                }
                break;
            case 22: // Quantity over Quality
                 case 19: // silver spoon
                $labels = self::getCollectionFromDb("SELECT uid, label, player_id FROM label WHERE player_id is not null AND count != 0 AND (location='player' or location like 'warehouse%')");
                $playerCount = array();
                foreach ($labels as $info) {
                    $pid = $info['player_id'];
                    if (!array_key_exists($pid, $playerCount)) {
                        $playerCount[$pid] = 0;
                    }
                    $r = $this->getRecipeByName($info['label'], $pid);
                    if ($r['cube'] == 'bronze') {
                        $playerCount[$pid]++;
                    }
                }
                foreach ($playerCount as $pid => $ct) {
                    if ($ct >= 3) {
                        $winningPlayers[$pid] = true;
                    }
                }
 

                
                
            }
            $wpList = array_keys($winningPlayers);
            if (count($wpList) == 1) {
                self::notifyAllPlayers("spiritAward", 
                    clienttranslate('${player_name} wins ${sa_name} Spirit Award and ${sp} <span class="icon-sp-em"></span>'), array(
                        'i18n' => array("location_str", "sa_name"),
                        'player_name' => $this->getPlayerName($wpList[0]),
                        'player_id' => $wpList[0],
                        'sp' => $saObj->sp,
                        'sa_name' => $saObj->name,
                        'sa_uid' => $saObj->uid,
                ));
                $this->playerPoints($wpList[0], $saObj->sp);
                $sql = sprintf("UPDATE spirit_award SET location='player' WHERE uid=%d", $saObj->uid);
                self::dbQuery($sql);
                $sql = sprintf("INSERT INTO spirit_award (uid, player_id, sp_gained)
                                VALUES (%d, %d, %d)", $saObj->uid, $wpList[0], $saObj->sp);
                self::dbQuery($sql);
                $this->incStat(1, "spirit_awards_achieved", $wpList[0]);
                $pid = $wpList[0];
                $sa_uid = $saObj->uid;
                self::dbQuery("INSERT INTO market_purchase (player_id, action, uid, turn) VALUES ($pid, 'sa', $sa_uid, $turn)");
            } else if (count($wpList) > 1) {
                foreach ($wpList as $player_id) {
                    $value = ceil(1.0 * $saObj->sp / count($wpList));
                    self::notifyAllPlayers("spiritAward", 
                        clienttranslate('${player_name} wins ${sa_name} Spirit Award and ${sp} <span class="icon-sp-em"></span>'), array(
                            'i18n' => array("sa_name"),
                            'player_name' => $this->getPlayerName($player_id),
                            'player_id' => $player_id,
                            'sp' => $value,
                            'sa_name' => $saObj->name,
                            'sa_uid' => $saObj->uid,
                    ));
                    $this->playerPoints($player_id, $value);
                    $this->incStat(1, "spirit_awards_achieved", $player_id);
                    $sa_uid = $saObj->uid;
                    self::dbQuery("INSERT INTO market_purchase (player_id, action, uid, turn) VALUES ($player_id, 'sa', $sa_uid, $turn)");
                }
                $sql = sprintf("UPDATE spirit_award SET location='player' WHERE uid=%d", $saObj->uid);
                self::dbQuery($sql);
                $sql = sprintf("INSERT INTO spirit_award (uid, player_id, sp_gained)
                                VALUES (%d, %d, %d)", 
                                $saObj->uid, $wpList[0], ceil(1.0 * $saObj->sp / count($wpList)));
                self::dbQuery($sql);
            }
        }
    }
    public function getPlayerName($pid) {
        $players = $this->loadPlayersBasicInfos();
        foreach ($players as $player_id => $info) {
            if ($pid == $player_id) {
                return $info["player_name"];
            }
        }
        return null;
    }
    public function getAgeableDrinks($player_id) {
        $turn = self::getGameStateValue("turn");
        $sql = "SELECT drink.id as id, drink.player_id as player_id, drink.recipe_slot as recipe_slot, cards, location, first_turn, barrel_uid 
                        FROM drink LEFT OUTER JOIN market_purchase ON drink.id = market_purchase.recipe_slot 
                        WHERE sold = 0 and drink.player_id='$player_id' and 
                            NOT EXISTS (SELECT recipe_slot FROM market_purchase WHERE turn = $turn and recipe_slot = drink.id and action='age')";
        $drinks = self::getCollectionFromDb($sql);
        return $drinks;
    }

    
    public function getStateName() {
       $state = $this->gamestate->state();
       return $state['name'];
    }
    public function getStateId() {
       $state = $this->gamestate->state();
       return $state['name'];
    }
    function array_replace_value($ar, $value, $replacement)
    {
        $newArr = [];
        foreach ($ar as $entry) {
            if ($entry == $value) 
                $newArr[] = $replacement;
            else
                $newArr[] = $entry;
        }
        return $newArr;
    }
    function tradeCard($tradeOut, $tradeIn, $pid) {
        $pname = $this->getPlayerName($pid);
        // Make a new card
        $newCard = $this->newBottomlessCard($this->AllCards[$tradeIn]->card_id, $pid);
        
        $actualTable = null;
        foreach (array('premium_item', 'premium_ingredient', 'bottomless_card') as $table) {
            $sql = sprintf("UPDATE %s SET location='tradeOut' WHERE uid=%d", $table, $tradeOut);
            self::dbQuery($sql);
            $uid = self::DbAffectedRow();
            if ($uid != null) {
                $actualTable = $table;
            }
        }

        $market = null;
        switch ($actualTable) {
            case 'premium_item':
                $market = 'item';
                break;
            case 'premium_ingredient':
                $market = 'ing';
                break;
            case 'bottomless_card':
                $market = 'bm';
                break;
        }

        $sql = sprintf("UPDATE bottomless_card SET location='tradeIn' WHERE uid=%d", $newCard);
        self::dbQuery($sql);
        $outCard = $this->AllCards[$tradeOut];
        $outCard->market = $market;

        self::notifyAllPlayers("trade", 
            clienttranslate('${player_name} trades in ${card1_name} for ${card2_name}'), array(
            'i18n' => array("card1_name", "card2_name"),
            'player_name' => $pname,
            'player_id' => $pid,
            'out_name' => $outCard->name,
            'card1_name' => $outCard->name,
            'card1_id' => $outCard->uid,
            'out_card' => $outCard,
            'in_name' => $this->AllCards[$newCard]->name,
            'card2_name' => $this->AllCards[$newCard]->name,
            'card2_id' => $newCard,
            'in_card' => $this->AllCards[$newCard],
        ));

        return $newCard;

    }
    function getSellableDrinks($player_id) {
        // get the current drinks 
        $sql = sprintf("SELECT id, drink.player_id, recipe_slot, cards, flavor_count, label.count as label_count, first_turn, drink.location
                        FROM drink JOIN label on label_uid=label.uid WHERE sold = 0 and drink.player_id='%d'",
            $player_id);
        $drinks = self::DbQuery($sql);
        $result = array();
        $turn = self::getGameStateValue("turn");
        foreach ($drinks as $drink) {
            $cards = explode(",", $drink["cards"]);
            $r = $this->getRecipeFromSlot($drink["recipe_slot"], $player_id);

            $drink["name"] = $r["name"];
            $drink["aged"] = $r["aged"];

            // If it is an aged drink, check if it has any flavor cards
            if ($r["aged"]) {
                // Aged drink hasnt been aged
                if ($drink['first_turn'] == $turn || $drink['first_turn'] == null) {
                    continue;
                } 
            }

            $drink["card_count"] = count($cards);
            $result[] = $drink;
        }

        return $result;
    }

    function newBottomlessCard($card_id, $player_id, $item=false) {
        $market = 'ing';
        if ($item) {
            $market = 'item';
        }

        $turn = self::getGameStateValue("turn");
        $sql = sprintf("INSERT INTO bottomless_card (card_id, location, player_id, market, turn) 
                        VALUES (%d, 'player', %d, '%s', $turn)", $card_id, $player_id, $market, $turn);

        // TODO figure out if there's a race condition with other users here
        self::DbQuery($sql);
        
        $uid = self::DbGetLastId();

        // TODO need to get some sort of template card here
        $t = null;
        foreach ($this->basic_cards as $c) {
            if ($c->card_id == $card_id) {
                $t = $c;
            }
        }
        if ($t == null) {
            throw new BgaSystemException( "Unable to create new card for card_id" );
        }

        $this->AllCards[$uid] = new Card($card_id, $t->name, $t->cost, $t->sale, $t->sp, $t->type, $t->subtype, $uid);

        return $uid;
        
    }
    function exchangeTasting($exchange) {
        self::checkAction("tasting");
        
        $pid = self::getCurrentPlayerId();
        $sp = $this->getPlayerSp($pid);

        if ($exchange > $sp) {
            throw new BgaSystemException("Not enough money");
        }


        if ($exchange != 0) {
            $this->playerGains($pid, $exchange, "tasting");
            $this->playerPoints($pid, -1 * $exchange, "tasting");
        }

        $this->gamestate->setPlayerNonMultiactive($pid, ''); 
    }
    function selectDistiller($playerId, $distillerId) {
        $distiller = $this->distillers[$distillerId];
        $this->playerGains($playerId, $distiller->startingMoney, $distiller->name);
        for ($ii = 0; $ii < $distiller->startingYeast; $ii++)
            $this->buyCard_internal($playerId, $this->templateCards[139]->uid, 'bm');
        for ($ii = 0; $ii < $distiller->startingWater; $ii++)
            $this->buyCard_internal($playerId, $this->templateCards[138]->uid, 'bm');

        self::notifyAllPlayers('selectDistiller2', clienttranslate('${player_name} has selected ${distiller_name}'), array(
            'player_name' => $this->getPlayerName($playerId),
            'player_id' => $playerId,
            'distiller_name' => $distiller->name,
            'distiller_id' => $distillerId,
            'distiller_region' => $distiller->region,
        ));

        $sigCard = $this->sigCardsByCardId[$distiller->sigIngCardId];
        $sigLabel = $this->signature_recipes[$distiller->id / 2];
        $sigLabel['location'] = 'flight';

        $sql = sprintf("INSERT INTO premium_ingredient (uid, card_id, location, player_id, location_idx)
                        VALUES (%d, %d, 'signature', %d, %d)",
                        $sigCard->uid, $sigCard->card_id, $playerId, 1);
        self::dbQuery($sql);

        $sql = sprintf('INSERT INTO label(label, location, count, signature, player_id) VALUES ("%s", "flight", "%s", 1, "%s")',
            $sigLabel['name'], 1, $playerId);
        self::dbQuery($sql);

        self::notifyAllPlayers("sigIngredient", clienttranslate('${player_name} gets ${card_name} with ${distiller_name}'), array(
            'i18n' => array("card_name"),
            'player_id' => $playerId,
            'player_name' => $this->getPlayerName($playerId),
            'card_name' => $sigCard->name,
            'card_id' => $sigCard->uid,
            'ing_uid' => $sigCard->uid,
            'ing_card_id' => $sigCard->card_id,
            'distiller_name' => $distiller->name,
            'ing_card' => $sigCard,
            'card' => $sigCard,
            'sig_label' => $sigLabel,
        ));

        if ($distiller->id == 22) { // Nathan 
            $slot = $this->getRecipeSlotFromName("Whiskey");
            $this->buyRecipe_internal($playerId, $slot, array(), $this->distillers[22]->name);
        }

    }
    function dealDistillers($player_id) {
        $distiller = null;
        for ($i = 0; $i < 2; $i++) {
            $distiller = array_pop($this->distillerShuffle);
            //$distiller = $this->distillers[34];
            $sql = sprintf("INSERT INTO distiller (card_id, player_id)
                            VALUES (%d, %d)", $distiller->id, $player_id);
            self::dbQuery($sql);

            self::notifyPlayer($player_id, "revealDistiller", clienttranslate('${player_name} may select ${distiller_name}'), array(
                'distiller_name' => $distiller->name,
                'player_id' => $player_id,
                'player_name' => $this->getPlayerName($player_id),
                'distiller_id' => $distiller->id,
                'slot' => $i+1,
            ));
        }
    }
    function dealStartingCards($player_id) {
        // Basic Items
        for( $i = 19; $i <= 20; $i++) {
            $newC = $this->AllCards[$this->newBottomlessCard($i, $player_id, true)];
        }
        // Goals
        $flight = self::getGameStateValue("flight");
        for ($i = 0; $i < 3; $i++) {
            $c = array_pop($this->goals_cards);

            // Do not use From The Earth on Flight G
            if ($flight == 7 && $c->card_id == 146)  {
                $i--;
                continue; 
            }

            $sql = sprintf("INSERT INTO distillery_goal (uid, card_id, player_id) 
                            VALUES ('%s', %d, %d)", $c->uid, $c->card_id, $player_id);
            self::DbQuery($sql);
        }
    }

    function basicRemaining($playerId) {
        $turn = self::getGameStateValue("turn", 0);
        $sql = sprintf("SELECT COUNT(*) FROM market_purchase
                       WHERE player_id='%s' AND market='bm' AND turn='%s'
                       ", $playerId, $turn);
        $count = self::getUniqueValueFromDb($sql);
        if ($this->getPlayerDistiller($playerId)->id == 26) {  // Nisha 
            return 3 - $count;
        } else {
            return 2 - $count;
        }
        return $count;
    }
    function checkPlayerCanBuyBasic($playerId) {
        $turn = self::getGameStateValue("turn", 0);
        $sql = sprintf("SELECT COUNT(*) FROM market_purchase
                       WHERE player_id='%s' AND market='bm' AND turn='%s'
                       ", $playerId, $turn);
        $count = self::getUniqueValueFromDb($sql);
        if ($this->getPlayerDistiller($playerId)->id == 26) {  // Nisha 
            if ($count >= 3) {
                return false;
            }
        } else if  ($count >= 2) {
            return false;
        }
        return true;
    }
    function checkPlayerCanBuy($playerId, $cost, $marketId) {
        $sql = sprintf("SELECT money FROM player WHERE player_id='%s'", $playerId);
        $result = self::getObjectFromDb($sql);
        if ($result['money'] < $cost) {
            // Send an error message
            self::notifyAllPlayers( "moneyMoney", 'PLEASE REPORT THIS BUG: ${playerId} does not have ${money} money. Bug in state: ${stateName}', array(
                'playerId' => $playerId,
                'money' => $cost,
                'stateName' => $this->getStateName(),
            ));
        }

        // For basic market cards, check to see if the player has already purchased 2 cards
        if ($marketId == 'bm') {
            if (!$this->checkPlayerCanBuyBasic($playerId))
                throw new BgaSystemException( "Already purchased max items from basic market" );
        }

        return true;
    }

    function playerPays($playerId, $cost, $notify=false) {
        $sql = sprintf("UPDATE player SET money=money-%d WHERE player_id='%s'",
                        $cost, $playerId);
        self::DbQuery($sql);


        if ($notify) {
            self::notifyAllPlayers("playerPays", clienttranslate('${player_name} pays ${cost} <span class="icon-coin-em"></span>'), array(
                'cost' => $cost,
                'player_id' => $playerId,
                'player_name' => $this->getPlayerName($playerId),
            ));
        }
    }
    function playerGains($playerId, $amount, $trigger_name, $trigger_uid=null) {
        $sql = sprintf("UPDATE player SET money=money+%d WHERE player_id='%s'",
                        $amount, $playerId);
        self::DbQuery($sql);

        if ($amount > 0)
            $this->incStat($amount, "money_gained", $playerId);

        if ($trigger_name) {
            $normalAmount = abs($amount);
            if ($amount >= 0) {
                self::notifyAllPlayers( "playerGains", clienttranslate('${player_name} gains ${amount} <span class="icon-coin-em"></span> from ${card_name}'), array(
                    'i18n' => ['card_name'],
                    'amount' => $amount,
                    'player_name' => $this->getPlayerName($playerId),
                    'player_id' => $playerId,
                    'card_name' => $trigger_name,
                    'card_id' => $trigger_uid,
                    'normal_amount' => $normalAmount,
                ));
            } else {
                self::notifyAllPlayers( "playerGains", clienttranslate('${player_name} loses ${normal_amount} <span class="icon-coin-em"></span> from ${card_name}'), array(
                    'i18n' => ['card_name'],
                    'amount' => $amount,
                    'player_name' => $this->getPlayerName($playerId),
                    'player_id' => $playerId,
                    'card_name' => $trigger_name,
                    'card_id' => $trigger_uid,
                    'normal_amount' => $normalAmount,
                ));
            }

        }
    }
    function playerPoints($playerId, $amount, $trigger_name=null) {
        $this->PlayerPoints_internal($playerId, $amount, "playerPoints", $trigger_name);
    }
    function playerPoints_internal($playerId, $amount, $notif, $trigger_name=null) {
        $sql = sprintf("UPDATE player SET player_score=player_score+%d WHERE player_id='%s'",
                        $amount, $playerId);
        self::DbQuery($sql);

        $this->incStat($amount, "points_total", $playerId);
        if ($trigger_name) {
            $normalAmount = abs($amount);
            if ($amount >= 0) {
                self::notifyAllPlayers( $notif, clienttranslate('${player_name} gains ${sp} <span class="icon-sp-em"></span> from ${trigger_name}'), array(
                    'sp' => $amount,
                    'player_name' => $this->getPlayerName($playerId),
                    'player_id' => $playerId,
                    'trigger_name' => $trigger_name,
                ));
            } else {
                self::notifyAllPlayers( $notif, clienttranslate('${player_name} loses ${normal_amount} <span class="icon-sp-em"></span> from ${trigger_name}'), array(
                    'sp' => $amount,
                    'player_name' => $this->getPlayerName($playerId),
                    'player_id' => $playerId,
                    'trigger_name' => $trigger_name,
                    'normal_amount' => $normalAmount,
                ));

            }
        }
    }
    function playerPointsEndgame($playerId, $amount, $row, $trigger_name, $card=null) {
        $sql = sprintf("UPDATE player SET player_score=player_score+%d WHERE player_id='%s'",
                        $amount, $playerId);
        self::DbQuery($sql);


        $this->incStat($amount, sprintf("points_%s", $row), $playerId);
        $this->incStat($amount, "points_total", $playerId);
        if ($trigger_name) {
            self::notifyAllPlayers( 'playerPointsEndgame', clienttranslate('${player_name} gains ${sp} <span class="icon-sp-em"></span> from ${card_name}'), array(
                'i18n' => ['card_name'],
                'sp' => $amount,
                'player_name' => $this->getPlayerName($playerId),
                'player_id' => $playerId,
                'row' => $row,
                'trigger_name' => $trigger_name,
                'card_name' => $trigger_name,
                'card' => $card,
            ));
        }
    }



    function recordPurchase($playerId, $uid, $market, $recipeSlot) {
        $turn = self::getGameStateValue("turn", 0);
        // TODO HANDLE ERROR

        if ($uid != null) {
            $sql = sprintf("INSERT INTO market_purchase(player_id, market, uid, turn)
                VALUES ('%s', '%s', '%s', '%s')", $playerId, $market, $uid, $turn);
            self::DbQuery($sql);
        }
        if ($recipeSlot != null) {
            $sql = sprintf("INSERT INTO market_purchase(player_id, market, recipe_slot, turn)
                VALUES ('%s', 'recipe', '%s', '%s')", $playerId, $recipeSlot, $turn);
            self::DbQuery($sql);
        }
    }


//////////////////////////////////////////////////////////////////////////////
//////////// Player actions
//////////// 

    /*
        Each time a player is doing some game action, one of the methods below is called.
        (note: each method below must match an input method in distilled.action.php)
    */

    // Set pay to false
    function selectDistillerAction($distillerId, $player_id) {
        self::checkAction("selectDistiller");

        // ensure that this was one of the choices
        $result = self::getUniqueValueFromDb("SELECT count(*) FROM distiller WHERE player_id=$player_id AND card_id=$distillerId");
        if (!$result || $result == 0) {
            throw new BgaSystemException("Invalid selection");
        }

        return $this->selectDistillerAction_internal($distillerId, $player_id);
    }

    function selectDistillerAction_internal($distillerId, $player_id) {
        $distiller = $this->distillers[$distillerId];
        self::notifyPlayer($player_id, 'selectDistiller', clienttranslate('${player_name} has selected ${distiller_name}'), array(
            'player_name' => $this->getPlayerName($player_id),
            'player_id' => $player_id,
            'distiller_name' => $distiller->name,
            'distiller_id' => $distillerId,
            'distiller_region' => $distiller->region,
        ));
        self::dbQuery("UPDATE distiller SET discarded=1 WHERE player_id=${player_id} AND card_id != ${distillerId}");

        $this->gamestate->setPlayerNonMultiactive($player_id, 'selectDistiller'); 
    }
    function buyCard_internal($playerId, $uid, $marketId, $slotId=null, $duSlot=null, $powers=null) {
        $free = false;
        if (
            $this->getStateName() == "roundStartAction" || // TODO: This may require some other indicator, I dont think everything is free at the start
            $this->getStateName() == 'chooseDistillerGame' || 
            $this->getStateName() == 'sell') {
            // Log round start action purchase
            $turn = self::getGameStateValue("turn", 0);
            $turndbg = sprintf("Debug purchase %s - %s - %s -- ", $this->getStateName(), implode(',', $powers ? $powers : []), $uid, $marketId);
            self::dbQuery("Insert into market_purchase (turn, player_id, action) values($turn, $playerId, '$turndbg')");
            $free = true;
        }

        $card_ids = array();
        if ($powers) {
            foreach ($powers as $p) {
                $card_ids[] = $this->AllCards[$p]->card_id;
            }
        }

        $deck = $this->getDeckFromId($marketId);
        // TODO differentiate between when you can buy from market vs bm vs reveal
        if ($this->getStateName() == 'roundStartAction' && $this->getGameStateValue("powercard") == 123) {
            if (!$this->isCardInTruck($deck, $uid)) {
                throw new BgaSystemException("Card not in truck for trucker");
            }
        } else if ($marketId != 'bm' && !$this->isCardInMarket($deck, $uid) && !$this->isCardRevealed($deck, $uid)) {
            throw new BgaSystemException( "Card not available for purchase" );
        }

        if (!$this->playerHasPowers(self::getActivePlayerId(), $powers)) {
            throw new BgaSystemException("Ability/Power not available.");
        }

        // Fang Xin and Trucker can fall into this during roundStartAction and should not qualify as free purchases
        if ($this->getStateName() == 'roundStartAction') {
            if ($powers && in_array(0, $powers) && $this->getPlayerDistiller($playerId)->id == 34) {
                $free = false;
            }
            if ($powers && in_array(123, $card_ids)) {
                // trucker
                $free = false;
            }
            if ($powers && in_array(124, $card_ids)) {
                //market buyer
                $free = false;
            }
        }

        $card_name = $this->AllCards[$uid]->name;
        $market = $this->getMarketFromId($marketId);
        $deck = $this->getDeckFromId($marketId);
        $nextPhase = "buyCard";
        $usedPowers = array();
        $turn = self::getGameStateValue("turn", 0);

        if ($free != null && $free != $marketId) {
            throw new BgaSystemException( "Cannot claim this free item at this time." );
        }

        if (!$free || ($powers != null && count($powers))) {
            $c = $this->AllCards[$uid];
            $cost = $c->cost;

            // TODO validate powers are all available
            // Check for powers discounts
            if (($powers != null && count($powers))) {
                $result = $this->getEffectiveCost($uid, $powers, $playerId);
                $cost = $result['cost'];
                $usedPowers = $result['usedPowers'];
            }

            if ($cost < 0) 
                $cost = 0;

            if (!$free && $this->checkPlayerCanBuy($playerId, $cost, $marketId)) {
                $this->playerPays($playerId, $cost, true);
            }

            foreach ($usedPowers as $up) {
                $this->recordPower($up[0], $playerId, $up[1] == 'distiller');
            }
        }
        
        if ($marketId == 'bm') {
            $newUid = $this->addBasicCardToPlayer($uid, $playerId);
            $this->incStat(1, "basic_cards", $playerId);
            $this->notifyAllPlayers("buyCard", clienttranslate('${player_name} gets ${card_name} from the basic market'), array(
                'i18n' => ['card_name'],
                'player_name' => $this->getPlayerName($playerId),
                'player_id' => $playerId,
                'uid' => $newUid,
                'card_name' => $card_name,
                'card_id' => $this->AllCards[$newUid]->card_id,
                'card' => $this->AllCards[$newUid],
                'market' => $marketId,
            ));
            
            // Logic for basic card abilities
            if (!$free && $this->AllCards[$uid]->card_id == 139) { // Yeast
                // Give player $1
                $this->playerGains($playerId, 1, $this->AllCards[$uid]->name, $uid);
            } else if (!$free && $this->AllCards[$uid]->card_id == 138) { // Water
                // TODO Choose a deck to reveal the top card of
                self::giveExtraTime($playerId);
                $nextPhase = 'buyWater';
            }

            if (!$free && $this->AllCards[$uid]->card_id == 138 && $this->getPlayerDistiller($playerId)->id == 16) {
                $this->playerGains($playerId, 1, $this->distillers[16]->name); // Gunnhild Hellström
            }
            
        } else {
            $this->incStat(1, sprintf("%s_cards", $marketId), $playerId);
            $tableName = $deck->dbTable;
            $cardLocation = self::getUniqueValueFromDb("SELECT location FROM $tableName WHERE uid=$uid");
            if ($marketId == "du") {
                $this->placeDuCard($uid, $slotId, $duSlot);
            } else {
                $this->moveCardToPlayer($deck, $uid, $playerId);
                self::notifyAllPlayers("buyCard", clienttranslate('${player_name} buys ${card_name} from ${card_location}'), array(
                    'i18n' => ['card_location', 'card_name'],
                    'player_name' => $this->getPlayerName($playerId),
                    'player_id' => $playerId,
                    'uid' => $uid,
                    'card_name' => $card_name,
                    'card' => $this->AllCards[$uid],
                    'market' => $marketId,
                    'market_name' => $market,
                    'slot' => $slotId,
                    'card_location' => $cardLocation,
                ));
            }

            if ($slotId != 0) {
                $this->shiftMarketRight($deck, $slotId);
                $dealt = $this->dealToIndex($deck, 1);
                $newMarket = $this->getMarket($deck);
                if ($dealt == null) {
                    // TODO reshuffle and redeal
                }

                $table = $deck->dbTable;
                $deck_count = self::getUniqueValueFromDb("
                    SELECT COUNT(*) FROM ${table} WHERE location='deck'");

                self::notifyAllPlayers("updateMarket", clienttranslate('All ${market} cards shift to the right. ${card_name} revealed'), array(
                    'i18n' => ['market', 'card_name'],
                    'market' => $market,
                    'market_id' => $marketId,
                    'card_name' => $this->AllCards[$dealt]->name,
                    'card' => $this->AllCards[$dealt],
                    'removed_slot' => $slotId,
                    'new_market' => $newMarket,
                    'deck_count' => $deck_count,
                ));
            }
        }

        if (!$free)
            $this->recordPurchase($playerId, $uid, $marketId, null);

        $revealed = $this->getRevealedCards();
        if ($this->getStateName() == 'roundStartAction' && count($revealed)) {
            $this->stPlayerBuyTurnRevealCleanup(false);
        }

        return $nextPhase;

    }
    function buyCard($uid, $marketId, $slotId, $duSlot, $powers) {
        self::checkAction("buyCard");

        $newPhase = $this->buyCard_internal(self::getActivePlayerId(), $uid, $marketId, $slotId, $duSlot, $powers);

        $this->gamestate->nextState($newPhase);
    }
    function getRevealedCards() {
        $cards = self::getCollectionFromDb("
            SELECT uid, 'du' as market FROM distillery_upgrade WHERE location='reveal'
            UNION ALL
            SELECT uid, 'ing' as market FROM premium_ingredient WHERE location='reveal'
            UNION ALL 
            SELECT uid, 'item' as market FROM premium_item WHERE location='reveal'");
        return $cards;
    }
    function dbgactiveplayer() {
        $pid = self::getActivePlayerId();
        self::notifyAllPlayers("dbgdbg", 'active player is ${pid} ${player_name}', array(
            'pid' => $pid,
            'player_name' => $this->getPlayerName($pid),
        ));
    }
    function dbgrecipeflight() {
        self::notifyAllPlayers("dbgdbg", 'recipe flight', array(
            'recipeflight' => $this->recipeFlight,
            'variant' => self::getGameStateValue("flight")
        ));
    }
    // Note this is also used for Fang Xin
    function waterReveal($deckName) {
        self::checkAction("reveal");

        $pid = self::getActivePlayerId();
        $count = 1;
        $powercard = $this->getGameStateValue("powercard");
        if ($this->getStateName() == 'fangXinRevealSelect') {
            if ($powercard == 34)
                $count = 2;
            if ($powercard == 124) 
                $count = 3;
        }
        if ($deckName == 'Pass') {
            if ($powercard != -1) {
                $turn = self::getGameStateValue("turn");
                $card_uid = $powercard;
                $distiller = true;
                if ($card_uid > 35) {
                    $card_uid = self::getUniqueValueFromDb("SELECT uid FROM distillery_upgrade WHERE location='player' AND player_id=$pid AND card_id=$powercard LIMIT 1");
                    $distiller = false;
                }
                $this->recordPower($card_uid, $pid, $distiller);

            }

            self::notifyAllPlayers("noaction", clienttranslate('${player_name} chooses not to reveal cards'), array(
                'player_name' => $this->getPlayerName($pid)));

            $this->gamestate->nextState('pass');
            return;
        }

        $marketId = $this->getIdFromMarket($deckName);
        $deck = $this->getDeckFromId($marketId);

        for ($ii = 0; $ii < $count; $ii++) {
            $revealUid = $this->revealFromDeck($deck);
            self::notifyAllPlayers('revealCards', clienttranslate('${player_name} reveals ${card_name} from ${market_name}'), array(
                'i18n' => ['card_name', 'market_name'],
                'player_id' => $pid,
                'player_name' => self::getActivePlayerName(),
                'card_id' => $revealUid,
                'card_name' => $this->AllCards[$revealUid]->name,
                'card' => $this->AllCards[$revealUid],
                'market_name' => $deckName,
                'market_id' => $marketId,
            ));
        }

        self::giveExtraTime($pid);
        $this->gamestate->nextState('reveal');
    }

    function getCostOfRecipeSlot( $recipeSlot ) {
        $r = $this->getRecipeFromSlot($recipeSlot);
        if ($r["cube"] == "bronze") {
            return 2;
        } else if ($r["cube"] == "silver") {
            return 4;
        } else if ($r["cube"] == "gold") {
            return 6;
        }
    }

    function buyRecipe($recipeSlot, $powers, $triggerCard=null) {
        self::checkAction("buyRecipe");
        $pid = self::getActivePlayerId();


        $ret =  $this->buyRecipe_internal($pid, $recipeSlot, $powers, $triggerCard);
        $this->gamestate->nextState("buyRecipe");
        return $ret;
    }
    function buyRecipe_internal($playerId, $recipeSlot, $powers,  $triggerCard=null) {
        if (!$this->playerHasPowers($playerId, $powers)) 
            throw new BgaSystemException( "Invalid Powers" );

        if ($this->getStateName() == "placeLabel4" || 
            $this->getStateName() == "sell" ||
            $triggerCard != null) {
            $cost = 0;
        } else {
            $result = $this->getEffectiveRecipeCost($recipeSlot, $powers, $playerId);
            $cost = $result['cost'];

            foreach ($result['usedPowers'] as $usedPower) {
                $this->recordPower($usedPower[0], $playerId, $usedPower[1] == 'distiller');
            }

            if ($this->checkPlayerCanBuy($playerId, $cost, "recipe")) {
                $this->playerPays($playerId, $cost);
            }
        } 

        if ($recipeSlot < -2 || $recipeSlot > 7) 
            throw new BgaSystemException( "Invalid Recipe Slot" );

        $this->moveRecipeCubeToPlayer($playerId, $recipeSlot);
        $this->recordPurchase($playerId, null, null, $recipeSlot);
        $this->incStat(1, "recipe_cubes", $playerId);


        if ($triggerCard) {
            self::notifyAllPlayers("buyRecipeCube", clienttranslate('${player_name} unlocks recipe for ${recipe_name} (${trigger_card})'), array(
                'player_name' => $this->getPlayerName($playerId),
                'player_id' => $playerId,
                'cost' => $cost,
                'slot' => $recipeSlot,
                'recipe_name' => $this->getRecipeNameFromSlot($recipeSlot, $playerId),
                'color' => $this->getRecipeFlight()[$recipeSlot]["cube"], //$this->recipeFlight[$recipeSlot]["cube"],
                'trigger_card' => $triggerCard,
            ) );
            
        } else {
            self::notifyAllPlayers("buyRecipeCube", clienttranslate('${player_name} pays ${cost} to unlock recipe for ${recipe_name}'), array(
                'player_name' => $this->getPlayerName($playerId),
                'player_id' => $playerId,
                'cost' => $cost,
                'slot' => $recipeSlot,
                'recipe_name' => $this->getRecipeNameFromSlot($recipeSlot, $playerId),
                'color' => $this->getRecipeFlight()[$recipeSlot]["cube"],
            ) );
        }

        // Check to make sure they have enough money
        // Check to make sure they have a spot for that type of cube
    }

    function stMarketPass() {
        $turn = self::getGameStateValue("turn", 0);
        $playerId = self::getActivePlayerId();

        $sql = sprintf("INSERT INTO market_purchase (player_id, market_pass, turn) 
                        VALUES ('%s', '%d', '%d')", $playerId, 1, $turn);
        self::DbQuery($sql);

        $this->gamestate->nextState();
    }
    function roundStartPass($power) {
        self::checkAction("roundStartPass");

        $pid = self::getActivePlayerId();
        if ($power && !$this->playerHasPowers($pid, [$power])) {
            throw new BgaSystemException( "Invalid Power" );
        }

        $isDistiller = false;
        if ($power == 0) {
            $distiller = $this->getPlayerDistiller($pid);
            $power = $distiller->id;
            $isDistiller = true;
        }
        $turn = self::getGameStateValue("turn", 0);
        $this->recordPower($power, $pid, $isDistiller);

        $this->stPlayerBuyTurnRevealCleanup(false);

        $this->gamestate->nextState("pass");
    }
    function marketPass() {
        self::checkAction("pass");

        if ($this->getStateName() == 'playerBuyTurnReveal') {
        } else {
            self::notifyAllPlayers("pass", clienttranslate('${player_name} ends their market phase'), array(
                'player_name' => self::getActivePlayerName(),
            ));
        }

        $this->gamestate->nextState("pass");
    }
    function placeDuCard($uid, $marketSlot, $duSlot) {
        // Evict any previous card

        $pid = self::getActivePlayerId();
        $existing = self::getUniqueValueFromDb("SELECT uid FROM distillery_upgrade WHERE player_id=$pid AND location_idx=$duSlot;");
        
        if ($existing) {
            self::dbQuery("UPDATE distillery_upgrade set location = 'truck', player_id=null, location_idx=0 WHERE uid=$existing");
            self::notifyAllPlayers('removeDuCard', clienttranslate('${card_name} is discarded and placed in the truck'), array(
                'i18n' => ['card_name'],
                'player_name' => $this->getPlayerName($pid),
                'player_id' => $pid,
                'uid' => $existing,
                'card_id' => $existing,
                'card' => $this->AllCards[$existing],
                'duSlot' => $duSlot,
                'card_name' => $this->AllCards[$existing]->name));
        }

        self::notifyAllPlayers("placeDuCard", clienttranslate('${player_name} places ${card_name} on slot ${duSlot}'), array(
            'i18n' => ['card_name'],
            'player_name' => self::getActivePlayerName(),
            'player_id' => self::getActivePlayerId(),
            'uid' => $uid,
            'card_id' => $uid,
            'market_slot' => $marketSlot,
            'duSlot' => $duSlot,
            'card_name' => $this->AllCards[$uid]->name,
            'card' => $this->AllCards[$uid],
        ) );

        $sql = sprintf("UPDATE `distillery_upgrade` set location='player', player_id=%d, location_idx=%d WHERE uid=%d",
                        self::getActivePlayerId(), $duSlot, $uid);
        self::DbQuery($sql);
    }

    function discardGoal($goalUid, $player_id = null) {
        self::checkAction("discardGoal");
        // TODO delegate
        if ($player_id == null)
            $player_id = self::getCurrentPlayerId();
        $sql  = sprintf('UPDATE distillery_goal SET discarded=1 WHERE uid=%d', $goalUid);
        self::DbQuery($sql);
        if (0 == self::DbAffectedRow()) {
            throw new BgaSystemException( "Invalid Goal" );
        }

        self::notifyPlayer($player_id, "discardGoal", clienttranslate('You discarded ${goal_name}'), array(
            'goal_name' => $this->AllCards[$goalUid]->name,
            'goal' => $this->AllCards[$goalUid],
            'goal_uid' => $goalUid,
            'player_id' => $player_id,
        ));

        self::notifyAllPlayers("discardGoal", 
            clienttranslate('${player_name} discards 1 Distillery Goal Card'),
            array(
                'player_name' => $this->getPlayerName($player_id),
                'player_id' => $player_id,
        ));

        // TODO set player order
        $this->gamestate->setPlayerNonMultiactive($player_id, "");
    }

    function stRestartDistill() {
        $this->gamestate->nextState('');
    }

    function stPlayerBuyTurnRevealCleanup($nextState = true) {
        $tables = array("distillery_upgrade", "premium_ingredient", "premium_item");
        $affected = 0;
        foreach ($tables as $table) {
            // TODO handle situation where there are no cards left
            $cards = self::getCollectionFromDb("SELECT uid FROM $table WHERE location='reveal'");
            if (count($cards)  == 0) {
                continue;
            }
            $max = self::getUniqueValueFromDb("SELECT location_idx FROM $table WHERE location='deck' ORDER BY location_idx DESC LIMIT 1");

            foreach ($cards as $uid => $c) {
                $max += 1;
                self::dbQuery("UPDATE $table SET location='deck', location_idx=$max WHERE uid=$uid");
                $affected = true;
            }
        }
        if ($affected) 
            self::notifyAllPlayers("endReveal", clienttranslate("Revealed card(s) are returned to the bottom of the deck"), array());
        else 
            self::notifyAllPlayers("endReveal", clienttranslate("No revealed cards to return to deck"), array());

        if ($nextState)
            $this->gamestate->nextState();
    }
    function stDistillMaster() {
        $this->gamestate->setAllPlayersMultiactive();

        $this->gamestate->initializePrivateStateForAllActivePlayers();

        //$this->gamestate->nextPrivateStateForAllActivePlayers("preDistill");
    }
    function stNextPlayerDistill() {
        $pid = self::activeNextPlayer();
        $turn = self::getGameStateValue("turn");

        $spirits = self::getCollectionFromDb("SELECT player_id, id FROM drink WHERE player_id = $pid AND location='washback'");
        $skips = self::getCollectionFromDb("SELECT player_id, id FROM market_purchase WHERE turn=$turn AND action='skip_distill'");

        self::giveExtraTime($pid);
        if (array_key_exists($pid, $spirits) || array_key_exists($pid, $skips)) {
            $this->gamestate->nextState('sellPhase');
            return;
        }
        $this->gamestate->nextState("nextPlayer");
    }

    function argPreDistill($player_id) {
        // TODO remove all traces of predistill, i dont think it does anything anymore
        $player_name = $this->getPlayerName($player_id);

        return array("skip" => true);
    }
    function passPreDistill() {
        $player_id = self::getActivePlayerId();
        $player_name = $this->getPlayerName($player_id);
        $this->gamestate->nextState("distill");
    }

    function argRoundStartAction() {
        $player_id = self::getActivePlayerId();
        $player_name = $this->getPlayerName($player_id);

        $powerCards = $this->getPowerCards();
        $options = array();

        $powercard = $this->getGameStateValue('powercard');
        foreach ($powerCards as $pc) {
            $pid = $pc['player_id'];
            if ($pid != $player_id)
                continue;

            // TODO clean up this code, it's pretty gross
            if ($powercard != $pc['card_id']) {
                continue;
            }

            $trigger = null;
            $triggerCard = 0;
            $triggerCardUid = 0;
            $allowedCards = array();
            $pass = false;
            if ($pc["market"] == 'du') {
                switch ($pc["card_id"]) {
                    case 123:
                        // Trucker
                        $cards = self::dbQuery("
                            SELECT uid, 'du' as market FROM distillery_upgrade WHERE location='truck'
                            UNION ALL
                            SELECT uid, 'item' as market FROM premium_item WHERE location='truck'
                            UNION ALL 
                            SELECT uid, 'ing' as market FROM premium_ingredient WHERE location='truck'");
                        $allowedCards = array();
                        foreach ($cards as $c) {
                            $tmp = $this->AllCards[$c['uid']];
                            $tmp->market = $c['market'];
                            $allowedCards[] = $tmp;
                        }
                        $trigger = 'Distiller';
                        $trigger = $this->AllCards[$pc['uid']]->name;
                        $triggerCard = 123;
                        $triggerCardUid = $pc['uid'];
                        $pass = true;
                        break;
                    case 124: 
                        // Market Buyer
                        $cards = self::dbQuery("
                            SELECT uid, 'du' as market FROM distillery_upgrade WHERE location='reveal'
                            UNION ALL
                            SELECT uid, 'ing' as market FROM premium_ingredient WHERE location='reveal'
                            UNION ALL 
                            SELECT uid, 'item' as market FROM premium_item WHERE location='reveal'");
                        $allowedCards = array();
                        foreach ($cards as $c) {
                            $tmp = $this->AllCards[$c['uid']];
                            $tmp->market = $c['market'];
                            $allowedCards[] = $tmp;
                        }
                        $trigger = $this->AllCards[$pc['uid']]->name;
                        $triggerCard = 124;
                        $triggerCardUid = $pc['uid'];
                        $pass = true;
                        break;
                    case 127:
                        // Co-op manager
                        $allowedCards = array();
                        for ($ii = 139; $ii >= 135; $ii--) {
                            $tmp = $this->templateCards[$ii];
                            $tmp->market = 'bm';
                            $allowedCards[] = $tmp;
                        }
                        $trigger = $this->AllCards[$pc['uid']]->name;
                        $triggerCard = 127;
                        $triggerCardUid = $pc['uid'];
                        break;
                }
            }
            else if ($pc["market"] == 'distiller') {
                
                switch ($pc["card_id"]) {
                    case 2:
                        // Jacqueline 
                        // TODO have to jump to a reveal and action state.
                        $allowedCards = array(
                            $this->templateCards[138],
                            $this->templateCards[139],
                        );
                        $trigger = 'Distiller';
                        $triggerCard = 2;
                        $triggerCardUid = 0;
                        break;
                    case 34:
                        // Fang Xin
                        $cards = self::dbQuery("
                            SELECT uid, 'du' as market FROM distillery_upgrade WHERE location='reveal'
                            UNION ALL
                            SELECT uid, 'ing' as market FROM premium_ingredient WHERE location='reveal'
                            UNION ALL 
                            SELECT uid, 'item' as market FROM premium_item WHERE location='reveal'");
                        $allowedCards = array();
                        foreach ($cards as $c) {
                            $tmp = $this->AllCards[$c['uid']];
                            $tmp->market = $c['market'];
                            $allowedCards[] = $tmp;
                        }
                        $trigger = 'Distiller';
                        $triggerCard = 34;
                        $triggerCardUid = 0;
                        $pass = true;
                        break;
                }
            }
            if ($trigger != null) {
                $options[] = array('allowedCards' => $allowedCards, 
                                    'triggerName' => $trigger,
                                    'trigger' => $triggerCard,
                                    'triggerUid' => $triggerCardUid,
                                    'pass' => $pass);
            }
        }
        $powercard = $this->getGameStateValue('powercard');
        return array(
            'options' => $options,
            'pc' => $powerCards,
            'powercard' => $powercard,
            'whatCanIMake' => $this->getWCIM(),
        );
    }
    function argChooseDistiller() {
        $cards = self::dbQuery("SELECT * FROM distiller ORDER BY uid DESC");

        $distillers = array();
        foreach($cards as $c) {
            $tmp = $this->distillers[$c['card_id']];
            $tmp->player_id = $c['player_id'];
            $distillers[] = $tmp;
        }
        return array(
            'allowedCards' => $distillers,
        );
    }
    function argRoundStartActionSelect() {
        $startActions = $this->getRoundStartActions();

        $pid = self::getActivePlayerId();
        $actions = $startActions[$pid];

        $choices = array();

        foreach ($actions as $pc) {
            // TODO this is a terrible way to check for Distiller
            $card_id = $pc['card_id'];
            if ($card_id < 35) {
                $choices[] = array(
                    'name' => $this->distillers[$card_id]->name,
                    'card_id' => $card_id,
                    'uid' => $card_id,
                    'market' => 'distiller',
                );
            } else {
                $choices[] = array(
                    'name' => $this->AllCards[$pc['uid']]->name,
                    'card_id' => $card_id,
                    'uid' => $pc['uid'],
                    'market' => 'du',
                );
            }
        }
        return array('choices' => $choices);
    }

    function argFangXin() {
        $powercard = $this->getGameStateValue("powercard");
        return array(
            'options' => array(
                array('name' => 'Distillery Upgrade', 'shortName' => 'du'),
                array('name' => 'Premium Ingredient', 'shortName' => 'ing'),
                array('name' => 'Premium Item', 'shortName' => 'item'),
            ),
            'trigger' => $powercard,
            'whatCanIMake' => $this->getWCIM(),
        );
    }
    function argDistillReact() {
        $player_id = self::getActivePlayerId();
        $result = array();

        //$player_id = self::getCurrentPlayerId();
        // Get all cards that might have async abilities
        $powerCards = $this->getPowerCards();

        $sql = sprintf("SELECT uid, location, 'item' as market, location_idx
                FROM premium_item WHERE player_id='%s'
                UNION ALL
                SELECT uid, location, 'du' as market, location_idx
                FROM distillery_upgrade WHERE player_id='%s'
                UNION ALL
                SELECT uid, location, 'ing' as market, location_idx
                FROM premium_ingredient WHERE player_id='%s'
                UNION ALL
                SELECT uid, location, market, 0 as location_idx
                FROM bottomless_card WHERE player_id=%d AND used=0
                ", $player_id, $player_id, $player_id, $player_id, $player_id);
                /*
                UNION ALL
                SELECT uid, 'player' as location, 'basic' as market
                FROM pantry_card WHERE player_id=%d
                */
        $signatureReturn = array();
        $returnableCards = array();
        $tmp = self::getCollectionFromDb($sql);
        foreach($tmp as $card) {
            $c = $this->AllCards[$card["uid"]];
            $c->location = $card["location"];
            $c->market = $card["market"];
            $c->location_idx = $card["location_idx"];
            if ($c->location == 'removed') {
                if ($this->isSignatureCard($this->AllCards[$card["uid"]])) {
                    $signatureReturn[] = $c;
                    continue;
                }
                $returnableCards[] = $c;
            }
        }

        $retry = false;
        foreach ($powerCards as $pc) {
            if ($pc['player_id'] != $player_id) 
                continue;

            if ($pc["market"] == 'du' && $pc["card_id"] == 117) { // column still
                $result["distillAgain"] = array(
                    "triggerCard" => $this->AllCards[$pc['uid']],
                );
            }
            if ($pc["market"] == 'du' && $pc["card_id"] == 103) { // spirit safe
                $result["returnCard"] = array(
                    "triggerCard" => $this->AllCards[$pc['uid']],
                    "returnableCards" => $returnableCards,
                );
            }
            /* TODO remove after automating doig ventilator 
            if ($pc["market"] == 'du' && $pc["card_id"] == 113) {
                $result["usePower"][] = array(
                    "triggerCard" => $this->AllCards[$pc['uid']],
                );
            }
            */
        }

        $result["signatureCard"] = $signatureReturn;
        $result['player_id'] = $player_id;
        $result['pc'] = $powerCards;
        $result['whatCanIMake'] = $this->getWCIM();

        return $result;

    }

    function useDistillPower($trigger, $player_id=null) {
        self::checkAction("useDistillPower");

        if ($player_id == null)
            $player_id = self::getActivePlayerId();

        if (!$this->playerHasPowers($player_id, [$trigger])) {
            throw new BgaSystemException( "Invalid Power" );
        }

        // Don't currently have a need for using distillers
        $card = $this->AllCards[$trigger];
        switch ($card->card_id) {
            case 113: // Doig Ventilator
                $c1 = $this->revealFromDeck($this->flavorDeck);
                $c2 = $this->revealFromDeck($this->flavorDeck);
                $card1 = $this->AllCards[$c1];
                $card2 = $this->AllCards[$c2];
                $winner = null;
                if ($card1->sale > $card2->sale) {
                    $winner = $card1;
                    $this->placeOnBottom($this->flavorDeck, $c2);
                }
                else  {
                    $winner = $card2;
                    $this->placeOnBottom($this->flavorDeck, $c1);
                }
                $this->addFlavorToDrink($drink, $player_id, null, $card, $winner, false);
                break;
        }
        $this->gamestate->nextState();
    }
    function distillReactPass() {
        self::checkAction("distillReactPass");

        $this->gamestate->nextState("exitDistill");
    }

    function distillAgain($triggerCard) {
        self::checkAction("distillAgain");

        $pid = self::getActivePlayerId();
        if (!$this->playerHasPowers($pid, [$triggerCard])) {
            throw new BgaSystemException("Invalid Powers");
        }
        if ($this->AllCards[$triggerCard]->card_id != 117) {
            throw new BgaSystemException("Invalid Powers");
        }

        $relevantCards = self::dbQuery("
            SELECT uid FROM premium_ingredient WHERE player_id = $pid AND (location='removed' OR location='limbo')
            UNION ALL 
            SELECT uid FROM bottomless_card WHERE player_id = $pid AND (location='removed' OR location='limbo')
        ");

        $wbCards = array();
        foreach ($relevantCards as $rc) {
            $wbCards[] = $rc['uid'];
        }

        self::dbQuery("UPDATE premium_ingredient SET location='selected' WHERE player_id = $pid AND (location='removed' OR location='limbo')");
        self::dbQuery("UPDATE bottomless_card SET location='selected' WHERE player_id = $pid AND (location='removed' OR location='limbo')");

        $turn = self::getGameStateValue("turn");
        $alcohols = array_keys(self::getCollectionFromDb("
            SELECT uid 
            FROM bottomless_card WHERE card_id=0 AND turn=$turn AND player_id=$pid
        "));
        self::dbQuery("UPDATE bottomless_card SET used=1,location='trash' WHERE card_id=0 AND turn=$turn AND player_id=$pid");

        // Make spirit safes usable a second time
        self::dbQuery("DELETE FROM market_purchase WHERE turn = $turn AND player_id=$pid AND uid IN 
                    (SELECT uid FROM distillery_upgrade WHERE card_id = 103)");

        self::notifyAllPlayers("deleteCards", clienttranslate("Removing alcohols before distilling again"), array(
            'remove' => $alcohols,
            'player_id' => $pid,
        ));

        self::notifyAllPlayers("moveToWashback", clienttranslate("Moving cards back to washback"), array(
            'cards' => $wbCards,
            'player_id' => $pid,
        ));

        self::dbQuery("DELETE FROM market_purchase WHERE turn=$turn AND player_id=$pid AND action='trade'");

        $this->recordPower($triggerCard, $pid, false); // Currently this is only triggered by DU cards

        $this->gamestate->nextState('distillAgain');
    }
    function addBack($triggerCard, $returnCard) {
        self::checkAction("addBack");
        $player_id = self::getActivePlayerId();

        if (!$this->playerHasPowers($player_id, [$triggerCard])) {
            throw new BgaSystemException( "Invalid Power" );
        }

        $tables = array("bottomless_card", "premium_ingredient");
        $affected = 0;
        foreach ($tables as $table) {
            if ($returnCard) {
                $sql = sprintf("UPDATE %s SET location = 'limbo' WHERE uid=%d and player_id=$player_id", $table, $returnCard);
                self::dbQuery($sql);
                $affected += self::DbAffectedRow();
            }
        }
        if ($affected != 1) {
            throw new BgaSystemException("Invalid action - affected cards");
        }

        if ($triggerCard) {
            if ($this->AllCards[$triggerCard]->card_id != 103)
                throw new BgaSystemException("Invalid power - add back");

            $turn = self::getGameStateValue("turn");
            $this->recordPower($triggerCard, $player_id, false); // currently this is only triggered by DU cards

            self::notifyAllPlayers("addBack", clienttranslate('${player_name} uses ${card1_name} to add ${card2_name} back to spirit'), array(
                'player_name' => $this->getPlayerName($player_id),
                'player_id' => $player_id,
                'card1_name' => $this->AllCards[$triggerCard]->name,
                'card1_id' => $this->AllCards[$triggerCard]->name,
                'card2_name' => $this->AllCards[$returnCard]->name,
                'return_card' => $this->AllCards[$returnCard],
                'card2_id' => $this->AllCards[$returnCard]->uid,

            ));
        } else {
            // TODO check how this can really happen - i think only signature cards?
            if (!$this->isSignatureCard($this->AllCards[$returnCard])) {
                throw new BgaSystemException("Invalid card added back - non-signature");
            }
            self::notifyAllPlayers("addBack", clienttranslate('${player_name} adds ${return_name} back to spirit'), array(
                'player_name' => self::getPlayerName($player_id),
                'player_id' => $player_id,
                'return_name' => $this->AllCards[$returnCard]->name,
                'return_card' => $this->AllCards[$returnCard],
            ));
        }
        if ($this->checkForDistillReaction($player_id)) {
            self::giveExtraTime($player_id);
            $this->gamestate->nextState("distillReact");
            return;
        }
        $this->gamestate->nextState("exitDistill");
    }
    function getPowerCardsForPredistill($player_id) {
        $result = array();
        $powerCards = $this->getPowerCards();
        foreach ($powerCards as $pc) {
            if ($pc['player_id'] != $player_id) {
                continue;
            }
            switch ($pc['card_id']) {
                case 104: // Worm Tub
                case 116: // Column Still
                case 129: // Coppersmith
                    $result[] = $pc;
                    break;
                
            }
        }
        return $result;
    }
    function checkForDistillReaction($player_id) {
        $react = false;

        $sql = "SELECT uid, location, 'item' as market, location_idx
                FROM premium_item WHERE player_id=$player_id
                UNION ALL
                SELECT uid, location, 'du' as market, location_idx
                FROM distillery_upgrade WHERE player_id=$player_id
                UNION ALL
                SELECT uid, location, 'ing' as market, location_idx
                FROM premium_ingredient WHERE player_id=$player_id AND (location='limbo' OR location='removed')
                UNION ALL
                SELECT uid, location, market, 0 as location_idx
                FROM bottomless_card WHERE player_id=$player_id AND used=0 
                ";
        $playerCards = self::dbQuery($sql);
        foreach ($playerCards as $c) {
            if ($this->isSignatureCard($this->AllCards[$c["uid"]]) && $c['location'] == 'removed') {
                $react = true;
            }
        }

        $turn = self::getGameStateValue("turn");
        // Get all cards that might have async abilities
        $powerCards = $this->getPowerCards();

        foreach ($powerCards as $pc) {
            if ($pc['player_id'] != $player_id) 
                continue;

            if ($pc["market"] == 'du' && in_array($pc["card_id"], array(
                103, 117
            ))) {
                $react = true;
            }
        }

        return $react;
    }

    function isSignatureCard($c) {
        if ($c->card_id > 0 && $c->card_id <= 18)
            return true;
        return false;
    }
    function distill($wbCards, $tradeOut, $tradeIn, $skipAlcohol=false) {
        // make most of this a helper function that can be called by distill again
        self::checkAction("distill");

        $playerId = self::getActivePlayerId();

        $cardList = array();

        $yeast = false;
        $water = false;
        $alcohol = 0;
        $sugar = false;
        foreach ($wbCards as $c) {
            $cardList[] = "'$c'";

            // Check for 1 yeast 1 water and 1 sugar
            switch ($this->AllCards[$c]->type) {
                case CardType::YEAST:
                    $yeast = true;
                    break;
                case CardType::WATER:
                    $water = true;
                    break;
                case CardType::SUGAR:
                    $sugar = true;
                    break;
                case CardType::ALCOHOL:
                    $alcohol++;
                    break;
            }
        }
        if ($yeast && $water && $sugar ||
            $yeast && $sugar && $alcohol ||
            $water && $sugar && $alcohol ||
            $alcohol >= 2 && $sugar) {}
        else {
            throw new BgaSystemException("Invalid cards - Must have yeast, water, and sugar");
        }

        if ($tradeOut) {
            $check = self::getUniqueValueFromDb(sprintf("
                SELECT COUNT(*) FROM (SELECT uid, player_id FROM bottomless_card UNION ALL SELECT uid, player_id FROM  premium_ingredient) as t
                WHERE uid in (%s) AND player_id=$playerId
            ", implode(',', $cardList + [$tradeOut])));
            if ($check != count($cardList)+1)
                throw new BgaSystemException("Invalid cards - Not owner of all cards or trades");
        } else {
            $check = self::getUniqueValueFromDb(sprintf("
                SELECT COUNT(*) FROM (SELECT uid, player_id FROM bottomless_card UNION ALL SELECT uid, player_id FROM  premium_ingredient) as t
                WHERE uid in (%s) AND player_id=$playerId
            ", implode(',', $cardList)));
            if ($check != count($cardList))
                throw new BgaSystemException("Invalid cards - Not owner of all cards");
        }

        // PUT THINGS INTO LIMBO
        $sql = sprintf("UPDATE premium_ingredient SET location='selected' WHERE uid in (%s)",
            implode(',', $cardList));
        self::DbQuery($sql);

        $sql = sprintf("UPDATE bottomless_card SET location='selected' WHERE uid in (%s)",
            implode(',', $cardList));
        self::DbQuery($sql);

        self::notifyAllPlayers("moveToWashback", clienttranslate('${player_name} adds cards to washback'), array(
            'cards' => $wbCards,
            'player_id' => $playerId,
            'player_name' => $this->getPlayerName($playerId),
        ));

        if (count($this->getPowerCardsForPredistill($playerId))) {
            $this->gamestate->nextState("distillPowers");
            return;
        } else {
            $this->distillPostPowers_internal();
            return;
        }
        $this->gamestate->nextState("exitDistill");
    }
    function distillPostPowers($activePowers=null, $skipAlcohol=false) {
        // make most of this a helper function that can be called by distill again
        self::checkAction("distillPostPowers");
        return $this->distillPostPowers_internal($activePowers, $skipAlcohol);
    }
    function distillPostPowers_internal($activePowers=null, $skipAlcohol=false) {
        $playerId = self::getActivePlayerId();
        if ($activePowers == [""]) {
            $activePowers = null;
        } else {
            if (!$this->playerHasPowers($playerId, $activePowers)) 
                throw new BgaSystemException("Invalid powers");
        }

        $sql = "SELECT uid FROM premium_ingredient WHERE player_id=$playerId AND location='selected'
                UNION ALL 
                SELECT uid FROM bottomless_card WHERE player_id=$playerId AND location='selected'";
        $wbCards = array_keys(self::getCollectionFromDb($sql));

        if (!$skipAlcohol) {
            $wbCards = $this->addAlcohols($wbCards, $activePowers);
        }

        $wbCardsSpirit = $this->distillRemoval($wbCards, $skipAlcohol, $activePowers);
        $cardList = array(0);
        $removedCardList = array();
        $cardsToAdd = array();
        foreach ($wbCards as $c) {
            if (in_array($c, $wbCardsSpirit)) {
                $cardList[] = "'$c'";
            } else {
                $removedCardList[] = "'$c'";
                $cardInfo = $this->AllCards[$c];
                switch ($cardInfo->card_id) {
                    case 47: // mountain spring water
                        $newUid = $this->notifyAllPlayersOfPowerCardGivingBasicCard($playerId, 138, $c, 'washback');
                        $cardList[] = "'${newUid}'";
                        break;
                }
            }
        }

        // PUT THINGS INTO LIMBO
        $sql = sprintf("UPDATE premium_ingredient SET location='limbo' WHERE uid in (%s)",
            implode(',', $cardList));
        self::DbQuery($sql);

        $sql = sprintf("UPDATE bottomless_card SET location='limbo' WHERE uid in (%s)",
            implode(',', $cardList));
        self::DbQuery($sql);

        // PUT THINGS INTO REMOVED 
        $sql = sprintf("UPDATE premium_ingredient SET location='removed' WHERE uid in (%s)",
            implode(',', $removedCardList));
        self::DbQuery($sql);

        $sql = sprintf("UPDATE bottomless_card SET location='removed' WHERE uid in (%s)",
            implode(',', $removedCardList));
        self::DbQuery($sql);

        if ($this->checkForDistillReaction($playerId)) {
            $this->gamestate->nextState("distillReact");
            return;
        }
        $this->gamestate->nextState("exitDistill");
    }

    function skipDistill($activePlayer = null) {
        self::checkAction("skipDistill");
        self::notifyAllPlayers("skipDistill", clienttranslate('${player_name} skips distill phase'), array(
            'player_id' => self::getActivePlayerId(),
            'player_name' => self::getActivePlayerName()
        ));
        $turn = self::getGameStateValue("turn");
        $pid = self::getActivePlayerId();
        self::dbQuery("INSERT INTO market_purchase (player_id, action, turn) VALUES ($pid, 'skip_distill', $turn)");
        $this->gamestate->nextState('skip');
    }
    function skipSale() {
        self::checkAction("skipSale");
        $sql = sprintf("INSERT INTO market_purchase (sell_pass, turn, player_id) VALUES (1, %d, %d)",
            self::getGameStateValue("turn"), self::getActivePlayerId());
        self::dbQuery($sql);
            
        self::notifyAllPlayers("skipSale", clienttranslate('${player_name} passes'), array(
            'player_id' => self::getActivePlayerId(),
            'player_name' => self::getActivePlayerName(),
        ));
        $this->gamestate->nextState("skipSale");
    }

    function trade($in, $out) {
        self::checkAction("trade");

        $pid = self::getActivePlayerId();
        $check = self::getUniqueValueFromDb("
            SELECT count(*) from (
                SELECT uid, player_id FROM bottomless_card
                UNION ALL SELECT uid, player_id FROM premium_ingredient
                UNION ALL SELECT uid, player_id FROM premium_item) as t
            WHERE uid=$out AND player_id=$pid");
        if ($check != 1) {
            throw new BgaSystemException("Invalid Card - not your cards");
        }
        if ($this->AllCards[$in]->card_id < 133 || $this->AllCards[$in]->card_id > 139) 
            throw new BgaSystemException("Invalid Card - Non-basic");

        if ($this->isSignatureCard($this->AllCards[$out])) {
            throw new BgaSystemException("Invalid Card - Signature");
        }

        $newCardUid = $this->tradeCard($out, $in, $pid);
        if ($this->AllCards[$in]->cost > $this->AllCards[$out]->cost) {
            throw new BgaSystemException("Invalid Card - invalid trade");
        }

        $turn = self::getGameStateValue("turn");
        self::dbQuery("INSERT INTO market_purchase (player_id, action, turn, recipe_slot) VALUES ($pid, 'trade', $turn, $newCardUid)");

        $this->gamestate->nextState("trade");
    }

    function restartDistill() {
        self::checkAction("restartDistill");
        $pid = $this->getActivePlayerId();

        $turn = self::getGameStateValue("turn");
        $tradeCard = self::getUniqueValueFromDb("SELECT recipe_slot FROM market_purchase WHERE player_id=$pid AND turn=$turn AND action='trade'");

        if ($tradeCard) {
            self::dbQuery("UPDATE bottomless_card SET location='truck' WHERE uid=$tradeCard");
        }
        self::dbQuery("UPDATE bottomless_card SET location='player' WHERE (location='tradeOut' OR location='selected') AND player_id=${pid}");
        self::dbQuery("UPDATE premium_item SET location='player' WHERE (location='tradeOut' OR location='selected') AND player_id=${pid}");
        self::dbQuery("UPDATE premium_ingredient SET location='player' WHERE (location='tradeOut' OR location='selected') AND player_id=${pid}");


        self::dbQuery("UPDATE bottomless_card SET location='truck', player_id=null WHERE location='tradeIn' AND player_id=${pid}");
        self::dbQuery("UPDATE premium_item SET location='truck', player_id=null WHERE location='tradeIn' AND player_id=${pid}");
        self::dbQuery("UPDATE premium_ingredient SET location='truck', player_id=null WHERE location='tradeIn' AND player_id=${pid}");

        self::dbQuery("DELETE FROM market_purchase WHERE player_id=$pid AND action='trade' AND turn=$turn");

        self::notifyPlayer($pid, "restartDistill", clienttranslate('${player_name} restarts the distill phase'), array(
            'player_id' => $pid,
            'player_name' => $this->getPlayerName($pid),
            'player_cards' => $this->getPlayerCardList($pid, false), // Don't need secret info
        ));

        // TODO do I need to send this to other players also?
        $this->gamestate->nextState("restart");
    }

    function placeLabel($slot) {
        $this->gamestate->nextState(sprintf('label%d', $slot));
    }

    function placeLabel2Pass() {
        self::checkAction("placeLabel2Pass");
        $this->gamestate->nextState("nextPlayerSell");
    }

    function placeLabel2Trade($in, $out, $truck, $duSlot) {
        $pid = $this->getActivePlayerId();
        $cardIn = $this->AllCards[$in];
        $cardOut = $this->AllCards[$out];

        // verify card out is in the active player's pantry
        if (1 != self::getUniqueValueFromDb("SELECT COUNT(*) FROM (
            SELECT uid, player_id, location FROM premium_ingredient
            UNION ALL SELECT uid, player_id, location FROM bottomless_card
            ) as t WHERE uid=$out AND player_id=$pid AND location='player'")) {
                throw new BgaSystemException("Trade card not valid (out)");
        }
        if (1 != self::getUniqueValueFromDb("SELECT COUNT(*) FROM (
            SELECT uid, player_id, location FROM premium_ingredient
            UNION ALL SELECT uid, player_id, location FROM bottomless_card
            UNION ALL SELECT uid, player_id, location FROM distillery_upgrade
            UNION ALL SELECT uid, player_id, location FROM premium_item
            ) as t WHERE uid=$in AND location='truck'")) {
                throw new BgaSystemException("Trade card not valid (in)");
        }



        $tableOut = null;
        $deckIn = null;
        $truckName = null;
        switch ($truck) {
            case 'du': 
                $deckIn = $this->distilleryDeck;
                $truckName = 'Distillery Upgrade';
                break;
            case 'ing':
                $deckIn = $this->ingredientsDeck;
                $truckName = 'Premium Ingredients';
                break;
            case 'item':
                $deckIn = $this->itemsDeck;
                $truckName = 'Premium Item';
                break;
            default:
                // TODO
                break;
        }

        if ($out < 1000) {
            $tableOut = "premium_ingredient";
        } else {
            $tableOut = 'bottomless_card';
        }

        $sql = sprintf("UPDATE %s SET location='truck', player_id=NULL WHERE uid=%d",
            $tableOut, $out);
        self::dbQuery($sql);

        // TODO validate that everything is in the correct place
        if ($truck == 'du') {
            $in_uid = $cardIn->uid;
            //self::dbQuery("UPDATE distillery_upgrade SET location='player', player_id=$pid, location_idx=$duSlot WHERE uid=$in_uid");
            self::notifyAllPlayers("placeLabel2Trade", 
                clienttranslate('${player_name} discards ${card1_name} and draws ${card2_name} from the ${truck_name} truck'), array(
                'i18n' => ['card1_name', 'card2_name', 'truck_name'],
                'player_name' => self::getActivePlayerName(),
                'player_id' => self::getActivePlayerId(),
                'in_name' => $cardIn->name,
                'card2_name' => $cardIn->name,
                'out_name' => $cardOut->name,
                'card1_name' => $cardOut->name,
                'in_card' => $cardIn,
                'out_card' => $cardOut,
                'truck_name' => $truckName,
                'truck' => $truck,
                'card1_id' => $cardOut->uid,
                'card2_id' => $cardIn->uid,
            ));


            $this->placeDuCard($in, null, $duSlot);


        } else { 
            $this->moveCardToPlayer($deckIn, $in, self::getActivePlayerId());

            self::notifyAllPlayers("placeLabel2Trade", 
                clienttranslate('${player_name} discards ${out_name} and draws ${in_name} from the ${truck_name} truck'), array(
                    'player_name' => self::getActivePlayerName(),
                    'player_id' => self::getActivePlayerId(),
                    'in_name' => $cardIn->name,
                    'out_name' => $cardOut->name,
                    'in_card' => $cardIn,
                    'out_card' => $cardOut,
                    'truck_name' => $truckName,
                    'truck' => $truck,
                    'card1_id' => $cardOut->uid,
                    'card2_id' => $cardIn->uid,
                ));
        }

    }

    // Note, this is not card id, this is UID
    function selectRoundStartAction($uid) {
        self::checkAction("selectRoundStartAction");
        $pid = self::getActivePlayerId();

        if ($uid == 0) {
            $card_id = $this->getPlayerDistiller($pid)->id;
        } else {
            $card_id = $this->AllCards[$uid]->card_id;
        }
        if (!$this->playerHasPowers($pid, [$uid])) {
            throw new BgaSystemException("Invalid round start action");
        }

        $this->setGameStateValue("powercard", $card_id);
        self::giveExtraTime($pid);
        switch ($card_id) {
            case 123:
            case 127:
            case 2:
                break;
            case 34:
            case 124: 
                $this->gamestate->nextState("fangXin");
                return;
        }
        $this->gamestate->nextState("select");
    }

    function dbgPowerCard() {
        $pc = $this->getGameStateValue("powercard");
        self::notifyAllPlayers("dbgdbg", "powercard", array('powercard'=>$pc));
    }

    function selectFlavor($flavor, $drink) {
        // Angus falls into this
        self::checkAction("selectFlavor");

        $check = self::getUniqueValueFromDb("SELECT COUNT(*) FROM flavor WHERE uid=$flavor AND location='reveal'");
        if ($check != 1) {
            throw new BgaSystemException("Invalid card");
        }
        $this->addFlavorToDrink($drink, self::getActivePlayerId(), null, 0, $flavor);

        $playerId = $this->getActivePlayerId();

        $uids = self::getCollectionFromDb("SELECT uid FROM flavor WHERE location='reveal'");
        foreach ($uids as $uid => $info) {
            $this->placeOnBottom($this->flavorDeck, $uid);
        }

        // Todo place on bottom
        self::dbQuery("UPDATE flavor set location='deck' WHERE location='reveal'");
        self::notifyAllPlayers("endReveal", clienttranslate("Flavor cards are returned to the bottom of the deck"), array());


        $d = $this->getObjectFromDb("SELECT * FROM drink WHERE id=$drink");
        $this->agingPowers($playerId, $d);

        $this->gamestate->nextState('next');
    }

    function getBottleData($playerId, $recipe, $bottleUid) {
        $bottleCardId = $this->AllCards[$bottleUid]->card_id;
        $recipeRegion = $this->getBottleRegionForPlayer($playerId, $bottleUid);
        $recipeRegion = $this->getRecipeRegionForPlayer($playerId, $recipe);
        $bottleBonusValue = 0;
        $bottleBonusSp = 0;
        $bottleName = "";
        switch ($bottleCardId) {
            case 21: // Wrapped Bottle
                if ($recipeRegion == Region::AMERICAS) {
                    $bottleBonusSp = 3;
                } else {
                    $bottleBonusSp = 2;
                }
                break;

            case 22: // Worm Bottle
                if ($recipeRegion == Region::AMERICAS) {
                    $bottleBonusSp = 2;
                } else {
                    $bottleBonusSp = 1;
                }
                break;
            case 25: // Wax Sealed
                if ($recipeRegion == Region::AMERICAS) {
                    $bottleBonusSp = 4;
                } else {
                    $bottleBonusSp = 2;
                }
                break;
            case 26: // Scandanavian
                if ($recipeRegion == Region::EUROPE) {
                    $bottleBonusSp = 3;
                } else {
                    $bottleBonusSp = 2;
                }
                break;
            case 27: // Pirate
                if ($recipeRegion == Region::AMERICAS) {
                    $bottleBonusSp = 3;
                } else {
                    $bottleBonusSp = 2;
                }
                break;
            case 29: // Rounded
                if ($recipeRegion == Region::EUROPE) {
                    $bottleBonusSp = 3;
                } else {
                    $bottleBonusSp = 2;
                }
                break;
            case 31: // Mason Jar
                if ($recipe["name"] == "Moonshine") {
                    $bottleBonusValue = 4;
                } else {
                    $bottleBonusValue = 2;
                }
                break;
            case 32: // Faceted
                if ($recipeRegion == Region::ASIA) {
                    $bottleBonusSp = 3;
                } else {
                    $bottleBonusSp = 2;
                }
                break;
            case 33: // Canister 
                if ($recipeRegion == Region::EUROPE) {
                    $bottleBonusSp = 2;
                } else {
                    $bottleBonusSp = 1;
                }
                break;
            case 34: // half bottle
                if ($recipeRegion == Region::ASIA) {
                    $bottleBonusSp = 3;
                } else {
                    $bottleBonusSp = 2;
                }
                break;
            case 35: // etched crystal
                if ($recipeRegion == Region::EUROPE) {
                    $bottleBonusSp = 4;
                } else {
                    $bottleBonusSp = 2;
                }
                break;
            case 36: // carton bottle
                if ($recipeRegion == Region::ASIA) {
                    $bottleBonusSp = 2;
                } else {
                    $bottleBonusSp = 1;
                }
                break;
            case 37: // Frosted
                if ($recipe["aged"]) {
                    $bottleBonusSp = 1;
                } else {
                    $bottleBonusSp = 2;
                }
                break;
            case 38: // ceramic
                if ($recipeRegion == Region::ASIA) {
                    $bottleBonusSp = 4;
                } else {
                    $bottleBonusSp = 2;
                }
                break;
            case 39: // Jug
                if ($recipe["name"] == "Moonshine") {
                    $bottleBonusSp = 2;
                } else {
                    $bottleBonusSp = 1;
                }
                break;
        }

        return array('sp' => $bottleBonusSp, 'value' => $bottleBonusValue);
    }

    function getBarrelData($playerId, $recipe, $barrelUid, $cards) {
        $barrelCardId = $this->AllCards[$barrelUid]->card_id;
        $barrelBonusValue = 0;
        $barrelBonusSp = 0;
        $barrelName = "";
        switch ($barrelCardId) {
            case 41:
                $flavors = 0;
                foreach ($cards as $card) {
                    $c = $this->AllCards[$card];
                    if ($c->type == CardType::FLAVOR) {
                        $flavors++;
                    }
                }
                $barrelBonusSp = $flavors;
                break;
            case 42:
                $flavors = 0;
                foreach ($cards as $card) {
                    $c = $this->AllCards[$card];
                    if ($c->type == CardType::FLAVOR) {
                        $flavors++;
                    }
                }
                $barrelBonusValue = $flavors;
                break;
        }

        return array('sp' => $barrelBonusSp, 'value' => $barrelBonusValue);
    }

    function getDrinkValue($playerId, $cards, $recipeSlot, $bottleUid, $barrelUid)  {
        $value = 0;
        $maxFlavor = 0;
        foreach ($cards as $card) { // This is used for abilities like warehouse manager
            $c = $this->AllCards[$card];
            $value += $c->sale;
            if ($c->type == CardType::FLAVOR) {
                $maxFlavor = ($maxFlavor < $c->sale) ? $c->sale : $maxFlavor;
            }
        }

        $bonus = 0;

        $powerCards = $this->getPowerCards();
        foreach ($powerCards as $pc) {
            if ($playerId != $pc['player_id']) 
                continue;

            switch ($pc['card_id']) {
                case 120: // warehouse manager
                    $bonus += $maxFlavor;
                    break;
                case 130: // celebrity promoter
                    $bonus += 2;
                    break;
            }
        }

        $allRecipes = $this->getRecipes();
        $allRecipes[] = $this->signature_recipes[
            ($this->getPlayerDistiller($playerId))->id / 2
        ];
        $recipe = $allRecipes[$recipeSlot + 2];

        $bottleData = $this->getBottleData($playerId, $recipe, $bottleUid);
        $barrelData = $this->getBarrelData($playerId, $recipe, $barrelUid, $cards);
        
        $total = $value + $recipe["value"] + $this->AllCards[$bottleUid]->sale + $this->AllCards[$barrelUid]->sale + $bonus + $bottleData['value'] + $barrelData['value'];
        $result = array(
            'total' => $total,
            'bottle' => $this->AllCards[$bottleUid]->sale + $bottleData['value'],
            'barrel' => $this->AllCards[$barrelUid]->sale + $barrelData['value'],
            'bonus' => $bonus,
            'recipe' => $recipe['value'],
            'cards' => $value,
        );
        return $result;
    }

    function getFlavorScore($flavorCount) {
        switch($flavorCount) {
            case 0: 
                return 0;
            case 1:
                return 1;
            case 2: 
                return 3;
            case 3: 
                return 6;
            case 4: 
                return 10;
            case 5:
            default:
                return 15;
        }

    }

    function getDrinkSp($playerId, $cards, $recipeSlot, $flavorCount, $bottle, $barrel, $sold=true) {
        $sp = 0;
        foreach ($cards as $card) {
            $sp += $this->AllCards[$card]->sp;
        }

        $origFlavorCount = $flavorCount;
        $powerCards = $this->getPowerCards();
        foreach ($powerCards as $pc) {
            if ($playerId !=  $pc['player_id']) 
                continue;

            switch ($pc['card_id']) {
                case 106: // Tropical Warehouse
                    $flavorCount++;
                    break;
            }
        }
        $allRecipes = $this->getRecipes();
        $allRecipes[] = $this->signature_recipes[
            ($this->getPlayerDistiller($playerId))->id / 2
        ];
        $recipe = $allRecipes[$recipeSlot + 2];
        
        $flavor = 0;
        if ($sold && $recipe['aged'])
            $flavor += $this->getFlavorScore($flavorCount);
        if (!$sold && $recipe['aged'])
            $flavor = $origFlavorCount;

        if ($sold) {
            $bottleData = $this->getBottleData($playerId, $recipe, $bottle);
        } else {
            $bottleData = array('value' => 0, 'sp' => 0);
        }
        $barrelData = $this->getBarrelData($playerId, $recipe, $barrel, $cards);

        if ($sold)
            $bottleSale = $this->AllCards[$bottle]->sp;
        else
            $bottleSale = 0;

        $total = $sp + $recipe["sp"] + $bottleSale + $bottleData['sp'] + $this->AllCards[$barrel]->sp + $barrelData['sp'] + $flavor;
        return array(
            'total' => $total,
            'cards' => $sp,
            'recipe' => $recipe["sp"],
            'bottle' => $bottleSale + $bottleData['sp'],
            'barrel' => $this->AllCards[$barrel]->sp + $barrelData['sp'],
            'flavor' => $flavor,
        );
    }

    function getSellFlavorString() {
        $set1 = array(
            clienttranslate('has notes of ${card_name}.'),
            clienttranslate('smells like ${card_name}.'),
            clienttranslate('has a little ${card_name} on the finish.'),
            clienttranslate('makes me think ${card_name}.'),
            clienttranslate('has just a hint of ${card_name}.'),
            clienttranslate('has a distinct ${card_name} character.'),
            clienttranslate('has some ${card_name} in the aftertaste.'),
            clienttranslate('has a strong ${card_name} flavor.'),
            clienttranslate('has a subtle ${card_name} taste to it.'),
            clienttranslate('reminds me of ${card_name}.'),
            clienttranslate('tastes of ${card_name}.'), 
            clienttranslate('brings a natural ${card_name} flavor.'),
        );

        $set2 = array(
            clienttranslate("I don't like it."),
            clienttranslate("It's actually pretty good."),
            clienttranslate("Nice."),
            clienttranslate("Not the best. Not the worst."),
            clienttranslate("Why would anyone drink this."),
            clienttranslate("That has a kick."),
            clienttranslate("Intense."),
            clienttranslate("At least it's unique."),
            clienttranslate("Some people might like it."),
            clienttranslate("It's an acquired taste."),
            clienttranslate("Right. That's enough of that."),
            clienttranslate("Interesting."),
            clienttranslate("Ooh la la."),
            clienttranslate("Well that's a new one."),
            clienttranslate("Not bad for a first attempt."),
            clienttranslate("Ugh."),
            clienttranslate("That's not half bad."),
            clienttranslate("Just like mom used to make."),
        );

        $key1 = array_rand($set1);
        $key2 = array_rand($set2);
        $tmp = sprintf(clienttranslate('${player_name}\'s ${spirit_name} ${key1_rec} ${key2} ${value} <span class="icon-coin-em"></span>'), $set1[$key1], $set2[$key2]);
        return array('notif' => $tmp, 'key1'=>$set1[$key1], 'key2'=>$set2[$key2]);
    }

    function sellDrink($drinkId, $bottle, $labelSlot, $optForSp, $sellArgs) {
        self::checkAction("sellDrink");
        return $this->sellDrink_internal($drinkId, $bottle, $labelSlot, $optForSp, $sellArgs);
    }
    function sellDrink_internal($drinkId, $bottle, $labelSlot, $optForSp, $sellArgs) {
        $playerId = self::getActivePlayerId();

        // Check that player has drink
        /*if (!self::getUniqueValueFromDb("SELECT COUNT(*) FROM drink WHERE id=$drinkId AND player_id=$playerId"))
            throw new BgaSystemException("Invalid drink - Not sellable");*/
        // Check that drink can be sold (aged/unaged)
        $drinks = $this->getSellableDrinks($playerId);
        $found = false;
        foreach ($drinks as $drink) {
            if ($drink['id'] == $drinkId) {
                $found = true;
                break;
            }
        }
        if (!$found) 
            throw new BgaSystemException("Invalid drink - Not sellable");

        // Check that label slot is open 
        if (self::getUniqueValueFromDb("SELECT COUNT(*) FROM label WHERE location='player' AND location_idx=$labelSlot AND player_id=$playerId"))
            throw new BgaSystemException("Label slot already taken");

        if ($this->AllCards[$bottle]->card_id != 20 && !self::getUniqueValueFromDb(
            "SELECT COUNT(*) FROM premium_item WHERE uid=$bottle AND location='player' and player_id=$playerId")) {
                throw new BgaSystemException("Invalid Bottle");
        }

        // Dont try to handle sell args yet
        $sql = sprintf("SELECT cards, recipe_slot, drink.location, flavor_count, label_uid, label.count as label_count, barrel_uid, label
                        FROM drink JOIN label on label.uid=label_uid WHERE id='%s'", $drinkId);
        $info = self::getObjectFromDb($sql);
        $cards = explode(',', $info["cards"]);
        $cardList = array();
        $sigCard = null;
        foreach ($cards as $card) {
            // Signature ingredients don't go in the truck
            if ($this->isSignatureCard($this->AllCards[$card])) {
                $sigCard = $card;
                continue;
            }
            $cardList[] = sprintf("'%d'", $card);
        }
        $cardListStr = implode(',', $cardList);

        $drinkName = $this->getRecipeNameFromSlot($info["recipe_slot"], $playerId);

        $flavors = array();
        $flavorStrings = array();

        $knownFlavors = $this->getKnownFlavorCount($drinkId);
        $knownFlavorCards = $this->getKnownFlavors($drinkId);
        foreach ($knownFlavorCards as $flavor_card) {
            $flavorString = $this->getSellFlavorString();
            self::notifyAllPlayers("knownFlavor",
                $flavorString['notif'],
                array(
                    'i18n' => ['card_name', 'spirit_name', 'key1', 'key2'],
                    'player_name' => $this->getPlayerName($playerId),
                    'player_id' => $playerId,
                    'card_name' => $flavor_card->name,
                    'card' => $flavor_card,
                    'flavor' => $flavor_card,
                    'spirit_name' => $drinkName,
                    'value' => $flavor_card->sale,
                    'key1_rec' => ['log' => $flavorString['key1'], 'args' => ['card_name'=>$flavor_card->name, 'card'=>$flavor_card]],
                    'key2' => $flavorString['key2'],
                ));
        }
        for ($ii = 0; $ii < $info["flavor_count"] - $knownFlavors; $ii++) {
            $c = $this->dealToIndex($this->flavorDeck, 1);
            $flavors[] = $c;
            $flavor_card = $this->AllCards[$c];
            $flavorString = $this->getSellFlavorString();
            self::notifyAllPlayers("revealFlavor",
                $flavorString['notif'],
                array(
                    'i18n' => ['card_name', 'spirit_name', 'key1', 'key2'],
                    'player_name' => $this->getPlayerName($playerId),
                    'player_id' => $playerId,
                    'card_name' => $flavor_card->name,
                    'card' => $flavor_card,
                    'flavor' => $flavor_card,
                    'spirit_name' => $drinkName,
                    'value' => $flavor_card->sale,
                    'key1_rec' => ['log' => $flavorString['key1'], 'args' => ['card_name'=>$flavor_card->name, 'card'=>$flavor_card]],
                    'key2' => $flavorString['key2'],
                ));
            self::dbQuery("UPDATE drink SET cards = CONCAT(cards, ',$c') WHERE id=$drinkId");
        }
       

        $cardsWithFlavors = array_merge($cards, $flavors);
        $value = $this->getDrinkValue(self::getActivePlayerId(), $cardsWithFlavors, $info["recipe_slot"], $bottle, $info['barrel_uid']);
        $sp = $this->getDrinkSp(self::getActivePlayerId(), $cardsWithFlavors, $info["recipe_slot"], $info["flavor_count"], $bottle, $info['barrel_uid']);

        self::notifyAllPlayers("chooseBottle", clienttranslate('${player_name} uses ${card_name}'), array(
            'i18n' => ['card_name'],
            'player_name' => self::getActivePlayerName(),
            'player_id' => self::getActivePlayerId(),
            'card_name' => $this->AllCards[$bottle]->name,
            'bottle' => $this->AllCards[$bottle],
            'card' => $this->AllCards[$bottle],
            'location' => $info['location'],
        ));

        $this->playerGains(self::getActivePlayerId(), $value['total'], null);
        $this->playerPoints(self::getActivePlayerId(), $sp['total']);

        // Return the barrel to the storeroom or truck
        $barrelCard = $this->AllCards[$info['barrel_uid']];
        if ($barrelCard->subtype == Barrel::METAL) {
            self::dbQuery(sprintf("UPDATE premium_item SET location='player' WHERE uid=%d", $info['barrel_uid']));
            self::dbQuery(sprintf("UPDATE bottomless_card SET location='player' WHERE uid=%d", $info['barrel_uid']));
        }
        else {
            self::dbQuery(sprintf("UPDATE premium_item SET location='truck', player_id=NULL, location_idx=0 WHERE uid=%d", $info['barrel_uid']));
            self::dbQuery(sprintf("UPDATE bottomless_card SET location='truck', player_id=NULL WHERE uid=%d", $info['barrel_uid']));
        }

        self::dbQuery(sprintf("UPDATE bottomless_card SET location='player' WHERE uid=%d", $info['barrel_uid']));

        // This is a noop if it's a basic bottle
        $sql = sprintf("UPDATE premium_item SET location='display' WHERE uid=%d", $bottle);
        self::dbQuery($sql);

        foreach (array('premium_item', 'premium_ingredient', 'bottomless_card', 'flavor') as $table) {
            $sql = sprintf("UPDATE %s SET location='truck' WHERE uid IN (%s)", $table, $cardListStr);
            self::dbQuery($sql);
        }

        if ($sigCard) {
            $sql = sprintf("UPDATE premium_ingredient SET location='outofgame' WHERE uid=%d", $sigCard);
            self::dbQuery($sql);
        }

        $recipeName = $this->getRecipeNameFromSlot($info["recipe_slot"], self::getActivePlayerId());
        if ($this->AllCards[$bottle]->card_id == 20) {
            $this->notifyAllPlayers("sellDrink", clienttranslate('${player_name} sold ${recipe_name} for ${value} <span class="icon-coin-em"></span> and ${sp} <span class="icon-sp-em"></span>. Money Breakdown:
                    Ingredients: ${card_value}, 
                    Barrel: ${barrel_value}, 
                    Bottle: ${bottle_value}, 
                    Spirit: ${recipe_value}, 
                    Bonus: ${bonus_value}. SP Breakdown: 
                    Ingredients: ${card_sp},
                    Barrel: ${barrel_sp},
                    Bottle: ${bottle_sp},
                    Spirit: ${spirit_sp},
                    Flavor: ${flavor_sp}.'), array(
                "player_id" => self::getActivePlayerId(),
                "player_name" => self::getActivePlayerName(),
                "value" => $value['total'],
                "sp" => $sp['total'],
                "recipe_name" => $recipeName,
                "bottle" => $this->AllCards[$bottle],
                "bottle_name" => $this->AllCards[$bottle]->name,
                "flavors" => $flavors,
                "location" => $info["location"],
                "card_value" => $value['cards'],
                "barrel_value" => $value['barrel'],
                "bottle_value" => $value['bottle'],
                "bonus_value" => $value['bonus'],
                "recipe_value" => $value['recipe'],
                'barrel_sp' => $sp['barrel'],
                'card_sp' => $sp['cards'],
                'flavor_sp' => $sp['flavor'],
                "spirit_sp" => $sp['recipe'],
                "bottle_sp" => $sp['bottle'],
                "spirits" => $this->getSpirits([$drinkId => $bottle]),
            ));
        } else {
            $this->notifyAllPlayers("sellDrink", clienttranslate('${player_name} sold ${recipe_name} for ${value} <span class="icon-coin-em"></span> and ${sp} <span class="icon-sp-em"></span>. Money Breakdown:
                    Ingredients: ${card_value}, 
                    Barrel: ${barrel_value}, 
                    Bottle: ${bottle_value}, 
                    Spirit: ${recipe_value}, 
                    Bonus: ${bonus_value}. SP Breakdown: 
                    Ingredients: ${card_sp},
                    Barrel: ${barrel_sp},
                    Bottle: ${bottle_sp},
                    Spirit: ${spirit_sp},
                    Flavor: ${flavor_sp}. ${player_name} places ${bottle_name} in the display case.'), array(
                "player_id" => self::getActivePlayerId(),
                "player_name" => self::getActivePlayerName(),
                "value" => $value['total'],
                "sp" => $sp['total'],
                "recipe_name" => $recipeName,
                "bottle" => $this->AllCards[$bottle],
                "bottle_name" => $this->AllCards[$bottle]->name,
                "flavors" => $flavors,
                "location" => $info["location"],
                "card_value" => $value['cards'],
                "barrel_value" => $value['barrel'],
                "bottle_value" => $value['bottle'],
                "bonus_value" => $value['bonus'],
                "recipe_value" => $value['recipe'],
                'barrel_sp' => $sp['barrel'],
                'card_sp' => $sp['cards'],
                'flavor_sp' => $sp['flavor'],
                "spirit_sp" => $sp['recipe'],
                "bottle_sp" => $sp['bottle'],
                "spirits" => $this->getSpirits([$drinkId => $bottle]),
            ));
            $this->incStat(1, "bottles_used", self::getActivePlayerId());
        }

        $powerCards = $this->getPowerCards();
        foreach ($powerCards as $pc) {
            if ($pc['player_id'] != $playerId) 
                continue;

            switch ($pc['card_id']) {
                case 121: // master blender
                    $sp['total'] += $this->duMasterBlender($playerId, $info, $pc);
                    break;
                case 4: // brown brothers
                    $sp['total'] += $this->distillerBrownBrothers($playerId, $info);
                    break;
                case 22: // Nathan
                    $recipe = $this->getRecipeFromSlot($info["recipe_slot"], $playerId);
                    if ($recipe['aged']) {
                        $this->playerGains($playerId, 1, $this->distillers[22]->name);
                        $value['total'] += 1;
                    }
                    break;
                case 32: // brother vicente
                    $bottleRegion = $this->getBottleRegionForPlayer($playerId, $bottle);
                    $recipe = $this->getRecipeFromSlot($info["recipe_slot"], $playerId);
                    $recipeRegion = $this->getRecipeRegionForPlayer($playerId, $recipe);

                    if ($bottleRegion == $recipeRegion) {
                        $this->playerGains($playerId, 2, $this->distillers[32]->name);
                        $sp['total'] += 2;
                    }
                    break;
                case 20: // anne mcadam (untested)
                    if ($info["flavor_count"] >= 3) {
                        $this->playerPoints($playerId, 2, $this->distillers[20]->name) ;
                        $sp['total'] += 2;
                    }
                    break;
                case 24: // guillermo (untested)
                    $sugars = 0;
                    foreach ($cards as $c) {
                        if ($this->AllCards[$c]->type == CardType::SUGAR) {
                            $sugars++;
                        }
                    }
                    if ($sugars >= 3) {
                        $this->playerPoints($playerId, 1, $this->distillers[24]->name);
                        $sp['total'] += 1;
                    }
                    break;
                case 30: // joana
                    $recipe = $this->getRecipeFromSlot($info["recipe_slot"], $playerId);
                    if (!$recipe["aged"]) {
                        $this->playerGains($playerId, 1, $this->distillers[30]->name);
                        $value['total'] += 1;
                    }
                    break;
            }
        }

        $turn = self::getGameStateValue("turn");
        $sql = sprintf("UPDATE drink SET sold=1, sold_turn=%d, bottle_uid=%d, sale_value=%d, sale_sp=%d, location='sold' WHERE id='%s'",
             $turn, $bottle, $value['total'], $sp['total'], $drinkId);
        self::DbQuery($sql);

        // Work on placing the label
        if ($info["label_count"] > 0 || $info['recipe_slot'] == 7) {
            $sql = sprintf("UPDATE label SET location='player', location_idx=%d WHERE uid=%d",
                $labelSlot,
                $info["label_uid"]);
            self::dbQuery($sql);

            if ($optForSp || true) {
                self::notifyAllPlayers("placeLabel", clienttranslate('${player_name} places label'), array(
                    'player_name' => self::getActivePlayerName(),
                    'player_id' => self::getActivePlayerId(),
                    'slot' => $labelSlot,
                    'location' => $info["location"],
                    'hasLabel' => true,
                ));
                if ($optForSp)  {
                    $this->stPlaceLabelForSp();
                    $this->gamestate->nextState("placeLabelForSP");
                    return;
                } else  {
                    switch ($labelSlot) {
                        case 0:
                            $this->stPlaceLabel0();
                            break;
                        case 1:
                            $this->stPlaceLabel1();
                            break;
                        case 2:
                            $this->placeLabel2Trade(
                                $sellArgs['tradeCardIn'], 
                                $sellArgs['tradeCardOut'], 
                                $sellArgs['tradeTruck'], 
                                $sellArgs['duSlot']);
                            break;
                        case 3:
                            $this->buyCard_internal($playerId, $sellArgs['collectCard'], 'ing', $sellArgs['collectCardSlot']);
                            break;
                        case 4:
                            $this->buyRecipe_internal($playerId, $sellArgs['collectRecipeSlot'], array(), null);
                            break;
                        case 5: 
                            $this->buyCard_internal($playerId, $sellArgs['collectCard'], 'item', $sellArgs['collectCardSlot']);
                            break;
                        case 6: 
                            $this->buyCard_internal($playerId, $sellArgs['collectCard'], 'du', $sellArgs['collectCardSlot'], $sellArgs['duSlot']);
                            break;

                    }
                    $this->gamestate->nextState(sprintf('label%d', $labelSlot));
                    self::giveExtraTime(self::getActivePlayerId());
                }
            } 
        } else {
            // No actual label to place
            $sql = sprintf("UPDATE label SET location='truck', location_idx=%d WHERE uid=%d",
                $labelSlot,
                $info["label_uid"]);
            self::dbQuery($sql);

            // This notification is just to get rid of the label
            self::notifyAllPlayers("placeLabel", clienttranslate('No label to place for ${player_name}'), array(
                'player_name' => self::getActivePlayerName(),
                'player_id' => self::getActivePlayerId(),
                'hasLabel' => false,
                'location' => $info["location"],
            ));
            $this->gamestate->nextState("sellDrinkNoLabel");
        } 
    }

    function selectRecipe($slot, $drinkId, $barrelUid) {
        self::checkAction("selectRecipe");

        $pid = self::getActivePlayerId();
        $recipe = $this->getRecipeFromSlot($slot, $pid);

        // Validate that this could be made
        $result = $this->argSelectRecipe();
        $found = false;
        foreach ($result['recipes'] as $r) {
            if ($r['recipeSlot'] == $slot) {
                $found = true;
            }
        }
        if (!$found) {
            throw new BgaSystemException("Invalid recipe - Recipe not distillable");
        }
        // Validate barrel
        if (!self::getUniqueValueFromDb("SELECT COUNT(*) FROM 
            (SELECT uid, location, player_id FROM bottomless_card
             UNION ALL SELECT uid, location, player_id FROM premium_item) as t
            WHERE uid=$barrelUid AND player_id=$pid AND location='player'")) {
                throw new BgaSystemException("Invalid recipe - bad barrel");
        }

        $recipeName = $recipe['name'];

        $sql = sprintf('UPDATE drink SET recipe_slot=%d, barrel_uid=%d WHERE id=%d', 
            $slot,
            $barrelUid,
            $drinkId
        );
        self::DbQuery($sql);

        $sql = sprintf("UPDATE premium_item SET location='washback' WHERE uid=%d", $barrelUid);
        self::dbQuery($sql);
        $sql = sprintf("UPDATE bottomless_card SET location='washback' WHERE uid=%d", $barrelUid);
        self::dbQuery($sql);

        if ($slot != 7) { // Signature 
            $sql = sprintf("SELECT count FROM label WHERE location='market' AND label='%s'", $recipeName);
            $count = self::getUniqueValueFromDb($sql);

            $sql = sprintf('INSERT INTO label (label, location, player_id, count) VALUES ("%s", "washback", "%s", %d)',
                $recipeName, $pid, $count);
            self::DbQuery($sql);
            $label_id = self::DbGetLastId();
            $sql = sprintf("UPDATE drink SET label_uid=%d, barrel_uid=%d WHERE id=%d", $label_id, $barrelUid, $drinkId);
            self::dbQuery($sql);

            if ($count > 0) {
                $sql = sprintf("UPDATE label SET count=count-1 WHERE location='market' AND label='%s'", $recipeName);
                self::dbQuery($sql);

                if ($recipe["cube"] != "bronze" && $recipe["cube"] != "silver" && $recipe["cube"] != "gold") {
                    $stat = "basic_labels";
                } else {
                    $stat = sprintf("%s_labels", $recipe["cube"]);
                }
                $this->incStat(1, $stat, $pid);
            }
        } else {
            $this->setStat(true, "signature_spirit", $pid);
            $label_id = self::getUniqueValueFromDb("SELECT uid FROM label WHERE player_id=$pid AND signature=1");
            self::dbQuery("UPDATE label SET location='washback' WHERE signature=1 and player_id=$pid");

            $sql = sprintf("UPDATE drink SET label_uid=%d, barrel_uid=%d WHERE id=%d", $label_id, $barrelUid, $drinkId);
            self::dbQuery($sql);
        }


        $r = $this->getRecipeByName($recipeName, $pid);
        $r['location'] = 'washback';
        if ($slot == 7) // signature
            $r['count'] = 1;
        else 
            $r['count'] = $count;

        self::notifyAllPlayers("selectRecipe", clienttranslate('${player_name} distilled ${recipe_name} in ${card_name}'), array(
            'i18n' => ['card_name'],
            "player_name" => self::getActivePlayerName(),
            "player_id" => $pid,
            "recipe_name" => $recipeName,
            "recipe" => $r,
            "barrel" => $this->AllCards[$barrelUid],
            "card_name" => $this->AllCards[$barrelUid]->name,
            "card" => $this->AllCards[$barrelUid],
            "spirits" => $this->getSpirits(),
        ));

        $this->gamestate->nextState("");
    }

    function getRecipeNameFromSlot($recipeSlot, $playerId=null) {
        return $this->getRecipeFromSlot($recipeSlot, $playerId)["name"];
    }

    function getRecipeFromSlot($recipeSlot, $player_id = null) {
        $allRecipes = $this->getRecipes();
        if ($player_id) {
            $allRecipes[] = $this->signature_recipes[
                ($this->getPlayerDistiller($player_id))->id / 2
            ];
        }
        $keys = array_keys($allRecipes);
        return $allRecipes[$keys[$recipeSlot + 2]];
    }

    function getRecipeSlotFromName($recipeName, $player_id=null) {
        $allRecipes = $this->getRecipes();
        $slot = -3;
        foreach ($allRecipes as $r) {
            $slot++;
            if ($r["name"] == $recipeName) {
                return $slot;
            }
        }
        if ($player_id) {
            if ($recipeName == $this->signature_recipes[$this->getPlayerDistiller($player_id)->id / 2]['name']) {
                return 7;
            }
        }

        throw new BgaSystemException( sprintf("Recipe name not found: %s", $recipeName ));
    }

    function getRecipeByName($recipeName, $player_id=null) {
        $allRecipes = $this->getRecipes();

        foreach ($allRecipes as $r) {
            if ($r["name"] == $recipeName) {
                return $r;
            }
        }
        if ($player_id) {
            if ($recipeName == $this->signature_recipes[$this->getPlayerDistiller($player_id)->id / 2]['name']) { 
                return $this->signature_recipes[$this->getPlayerDistiller($player_id)->id / 2];
            }
        }
    }
    /*
    
    Example:

    function playCard( $card_id )
    {
        // Check that this is the player's turn and that it is a "possible action" at this game state (see states.inc.php)
        self::checkAction( 'playCard' ); 
        
        $player_id = self::getActivePlayerId();
        
        // Add your game logic to play a card there 
        ...
        
        // Notify all players about the card played
        self::notifyAllPlayers( "cardPlayed", clienttranslate( '${player_name} plays ${card_name}' ), array(
            'player_id' => $player_id,
            'player_name' => self::getActivePlayerName(),
            'card_name' => $card_name,
            'card_id' => $card_id
        ) );
          
    }
    
    */

    
//////////////////////////////////////////////////////////////////////////////
//////////// Game state arguments
////////////

    /*
        Here, you can create methods defined as "game state arguments" (see "args" property in states.inc.php).
        These methods function is to return some additional information that is specific to the current
        game state.
    */

    /*
    
    Example for game state "MyGameState":
    
    function argMyGameState()
    {
        // Get some values from the current game situation in database...
    
        // return values:
        return array(
            'variable1' => $value1,
            'variable2' => $value2,
            ...
        );
    }    
    */

    function argPlayerBuyTurnReveal() {
        $result = $this->argPlayerBuyTurn();
        $allowedCards = self::getCollectionFromDb("
            SELECT uid, 'du' as market FROM distillery_upgrade WHERE location='reveal'
            UNION ALL
            SELECT uid, 'item' as market FROM premium_item WHERE location='reveal'
            UNION ALL
            SELECT uid, 'ing' as market FROM premium_ingredient WHERE location='reveal'
            UNION ALL
            SELECT uid, 'ing' as market FROM flavor WHERE location='reveal'
        ");
        $result['allowedCards'] = $allowedCards;
        return $result;
    }
    function argPlayerSelectFlavor($player_id=null) {
        $result = $this->argPlayerBuyTurnReveal();
        $drinks = $this->getAgeableDrinks($this->getActivePlayerId());
        $k = array_keys($drinks)[0];
        $drinkLocation = self::getUniqueValueFromDb("SELECT location FROM drink WHERE id=$k");
        $result['drink'] = $k;
        $result['location'] = $drinkLocation;
        return $result;
    }
    function argPlayerBuyTurn() {
        $powerCards = $this->getPowerCards();
        $pid = $this->getActivePlayerId();

        $discounts = array();
        foreach ($powerCards as $pc) {
            if ($pc['player_id'] != $pid)
                continue;

            if ($pc['market'] == 'du') {
                switch ($pc['card_id']) {
                    case 109:
                        // Large Storage
                        $discounts[] = array(
                            'typename' => clienttranslate('item'),
                            'type' => 'item',
                            'amount' => 1,
                            'triggerCard' => $pc,
                        );
                        break;
                    case 114:
                        // Malt mill
                        $discounts[] = array(
                            'typename' => clienttranslate('ingredient'),
                            'type' => 'ing',
                            'amount' => 2,
                            'triggerCard' => $pc,
                        );
                        break;
                    case 115:
                        // Glassworks
                        $discounts[] = array(
                            'typename' => clienttranslate('bottle'),
                            'type' => 'item',
                            'subtype' => 'BOTTLE',
                            'amount' => 2,
                            'triggerCard' => $pc,
                        );
                        break;
                    case 119:
                        // Intern Researcher
                        $discounts[] = array(
                            'typename' => clienttranslate('recipe'),
                            'type' => 'recipe',
                            'amount' => 2,
                            'triggerCard' => $pc,
                        );
                        break;
                    case 122:
                        // Glassblower
                        $discounts[] = array(
                            'typename' => clienttranslate('bottle'),
                            'type' => 'item',
                            'subtype' => 'BOTTLE',
                            'amount' => 1,
                            'triggerCard' => $pc,
                        );
                        break;
                    case 128:
                        // Architect
                        $discounts[] = array(
                            'typename' => clienttranslate('distillery upgrade'),
                            'type' => 'du',
                            'amount' => 2,
                            'triggerCard' => $pc,
                        );
                        break;
                    case 131:
                        // Cooper
                        $discounts[] = array(
                            'typename' => clienttranslate('barrel'),
                            'type' => 'item',
                            'subtype' => 'BARREL',
                            'amount' => 2,
                            'triggerCard' => $pc,
                        );
                        break;
                }
            } else if ($pc['market'] == 'distiller') {
                switch ($pc['card_id']) {
                    case 0:  // ajani
                        $discounts[] = array(
                            'typename' => clienttranslate('bottle'),
                            'type' => 'item',
                            'subtype' => 'BOTTLE',
                            'amount' => 1,
                            'triggerCard' => $pc,
                        );
                        break;
                    case 6:  // etienne
                        $discounts[] = array(
                            'typename' => clienttranslate('distillery upgrade'),
                            'type' => 'du',
                            'amount' => 2,
                            'triggerCard' => $pc,
                        );
                        break;
                    case 12: // pilar
                        $discounts[] = array(
                            'type' => 'item',
                            'subtype' => 'BARREL',
                            'typename' => clienttranslate('barrel'),
                            'type' => 'du',
                            'amount' => 2,
                            'triggerCard' => $pc,
                        );
                        break;
                    case 14: // Mother mary
                        $discounts[] = array(
                            'typename' => clienttranslate('basic card'),
                            'type' => 'du',
                            'type' => 'ing',
                            'subtype' => 'basic', // TODO handle this?
                            'amount' => 1,
                            'triggerCard' => $pc,
                        );
                        break;
                    case 18: // Jeong
                        $discounts[] = array(
                            'typename' => clienttranslate('ingredient'),
                            'type' => 'du',
                            'type' => 'ing',
                            'amount' => 2,
                            'triggerCard' => $pc,
                        );
                        break;
                }
            }
        }

        $basic = $this->checkPlayerCanBuyBasic($pid);
        $basicRemaining = $this->basicRemaining($pid);
        $money = $this->getPlayerMoney();
        $canBuy = $this->canPlayerBuy($pid);

        return array('discounts' => $discounts,
                     'canBuyBasic' => $basic,
                     'basicRemaining' => $basicRemaining,
                     'money' => $money,
                     'cpb' => $canBuy,
                     'pc' => $powerCards,
                     'whatCanIMake' => $this->getWCIM());
    }
    function getWCIM($debug = false) {
        $players = $this->loadPlayersBasicInfos();
        $ret = array();
        foreach ($players as $player_id => $info) {
            $cards = self::getCollectionFromDb("
                SELECT uid FROM bottomless_card WHERE location='player' AND player_id=${player_id}
                UNION ALL
                SELECT uid FROM premium_ingredient WHERE location='player' AND player_id=${player_id}
                ");

            if ($debug) {
                $cardCards = array();
                foreach ($cards as $uid => $info) {
                    $cardCards[] = $this->AllCards[$uid];
                }
                self::notifyAllPlayers("dbgdbg", 'cards for ${player_name}', 
                    array('player_name' => $this->getPlayerName($player_id),
                          'cards' => $cardCards));
            }
            
            // This means we're trying to find out what spirits we can make
            if (!$this->isValidSpirit(array_keys($cards))) {
                $ret[$player_id] = array();
                continue;
            }

            $distillable = $this->getDistillableRecipes(array_keys($cards), true, $player_id);
            if ($debug) {
                self::notifyAllPlayers("dbgdbg", 'distillable for  ${player_name}', 
                    array('player_name' => $this->getPlayerName($player_id),
                          'distillable' => $distillable));
            }

            $raw = array();
            foreach ($distillable as $d) {
                if ($d['recipeSlot'] < 0)
                    continue;
                $r = $this->getRecipeFromSlot($d['recipeSlot'], $player_id);
                $raw[$r['label']] = $r;
            }
            $ret[$player_id] = array_values($raw);
        }
        if ($debug) {
            self::notifyAllPlayers("dbgdbg", 'ret', array('ret' => $ret));
        }
        return $ret;
    }

    function argNextPlayer() {
        // update player boards
        $result = array();

        $sql = "SELECT player_id id, money, player_score score FROM player ";
        $result['players'] = self::getCollectionFromDb( $sql );

        return $result;
    }

    function argDistill() {
        $powerCards = $this->getPowerCards();

        $turn = self::getGameStateValue("turn", 0);
        $tradeCollection = self::getCollectionFromDb("SELECT player_id FROM market_purchase WHERE turn=${turn} AND action='trade'");

        $players = array();
        foreach ($powerCards as $pc) {
            switch ($pc['card_id']) {
                case 116:
                    // Column Still
                    if (!array_key_exists($pc['player_id'], $players)) {
                        $players[$pc['player_id']] = array();
                    }
                    $players[$pc['player_id']][] = $pc;
                    break;
            }
        }
        return array('players' => $players, 'trades' => $tradeCollection);
    }

    function argDistillPowers() {
        $playerId = self::getActivePlayerId();
        $powerCards = $this->getPowerCardsForPredistill($playerId);
        $result = array();
        foreach ($powerCards as $pc) {
            if ($pc['player_id'] != $playerId) 
                continue;

            $tmp = $this->AllCards[$pc['uid']];
            switch ($tmp->card_id) {
                case 104:
                    $tmp->description = clienttranslate("Add 2 additional alcohol");
                    break;
                case 116:
                    $tmp->description = clienttranslate("Remove only top card");
                    break;
                case 129:
                    $tmp->description = clienttranslate("Add 1 additional alcohol");
                    break;
            }
            $result[] = $tmp;
        }

        $turn = self::getGameStateValue("turn", 0);
        $secondTime = self::getUniqueValueFromDb("
            SELECT COUNT(*) FROM market_purchase WHERE action='dupower' AND market='du' AND turn=$turn AND uid IN 
                (SELECT uid FROM distillery_upgrade WHERE card_id = 117)");

        $canRestart = true;
        if ($secondTime) {
            $canRestart = false;
        }
        
        return array('powerCards' => $result, 'canRestart' => $canRestart );
    }

    function argPlaceLabel() {
        $result = array();

        $sql = sprintf("SELECT location_idx FROM label WHERE player_id='%d' AND location='player'",
            $this->getActivePlayerId());
        $resp = $this->getCollectionFromDb($sql);

        $avail = array();
        for ($i = 0; $i < 7; $i++) {
            if (in_array($i, $resp)) {
                continue;
            }
            $avail[] = array("description" => $this->labelBenefits[$i], 
                             "idx" => $i);
        } 
        return array(
            'availSlots' => $avail,
            'whatCanIMake' => $this->getWCIM(),
        );
    }

    function argSell() {
        // get the current drinks 
        $pid = self::getActivePlayerId();
        $drinks = $this->getSellableDrinks(self::getActivePlayerId());

        // get the current bottles
        $sql = sprintf("SELECT uid, card_id FROM premium_item WHERE location='player' AND player_id='%s' 
                        UNION
                        SELECT uid, card_id FROM bottomless_card WHERE location='player' AND player_id='%s'",
            self::getActivePlayerId(), self::getActivePlayerId());
        $cards = self::DbQuery($sql);

        $bottles = array();
        foreach ($cards as $c) {
            $card = $this->AllCards[$c["uid"]];
            if ($card->type == CardType::BOTTLE) {
                $bottles[] = $card;
            }
        }

        $mustSellAged = false;
        // Aged drink in washback?
        $slot = self::getUniqueValueFromDb("SELECT recipe_slot FROM drink WHERE player_id=$pid AND location='washback'");
        $whCount = self::getUniqueValueFromDb("SELECT COUNT(*) FROM drink WHERE player_id=$pid AND location LIKE 'warehouse%'");
        $recipe = null;
        if ($slot != null) {
            $recipe = $this->getRecipeFromSlot($slot, $pid);
            if ($recipe['aged'] && $whCount == 2) {
                $mustSellAged = true;
            }
        }
        $cardList = $this->getPlayerCardList($pid, $pid == self::getCurrentPlayerId());
        return array("drinks" => $drinks, 
                     "bottles" => $bottles, 
                     "labels" => $this->labelBenefits, 
                     "mustSellAged" => $mustSellAged,
                     "playerCards" => $cardList, 
                     'whatCanIMake' => $this->getWCIM(),
                     // Debug only
                    "slot" => $slot,
                    "recipe" => $recipe,
                    "recipes" => $this->getRecipes(),
                );
    }

    function argChooseBottle() {
        $sql = sprintf("SELECT uid, card_id FROM premium_item WHERE location='player' AND player_id='%s' 
                        UNION
                        SELECT uid, card_id FROM bottomless_card WHERE location='player' AND player_id='%s'",
            self::getActivePlayerId(), self::getActivePlayerId());
        $cards = self::DbQuery($sql);

        $sql = sprintf("SELECT id, player_id, recipe_slot, cards FROM drink WHERE sold = 0 and player_id='%d'",
            self::getActivePlayerId());
        $drinks = self::dbQuery($sql);

        $bottles = array();
        foreach ($cards as $c) {
            $card = $this->AllCards[$c["uid"]];
            if ($card->type == CardType::BOTTLE) {
                $bottles[] = $card;
            }
        }
        return array(
            "bottles" => $bottles,
            "drinkId" => $drinks[0]->id,
            'whatCanIMake' => $this->getWCIM(),
        );

    }

    function argSelectRecipe() {

        //self::notifyAllPlayers("dbgdbg", "arg select recipe", array());
        $sql = sprintf('SELECT id, cards FROM drink WHERE player_id="%d" AND `recipe_slot` IS NULL',
            self::getActivePlayerId());
        $entry = self::getObjectFromDb($sql);
        if ($entry == null) {
            // Can I transition state here?
            return array();
        }

        // TODO check if there's an available warehouse slot
        $cards = explode(",", $entry["cards"]);
        $result = $this->getDistillableRecipes($cards);
        return array('recipes' => $result,
                     'drinkId' => $entry["id"],
                     'whatCanIMake' => $this->getWCIM(),
        );

    }

    function getPlayerLabels() {
        $labels = self::getCollectionFromDb("SELECT * FROM label WHERE (location='player' or location LIKE 'warehouse%') AND count > 0");
        $playerLabels = array();
        foreach ($labels as $luid => $labelInfo) {
            $playerLabels[$labelInfo['player_id']][] = $this->getRecipeByName($labelInfo['label'], $labelInfo['player_id']);
        }
        return $playerLabels;
    }
//////////////////////////////////////////////////////////////////////////////
//////////// Game state actions
////////////

    /*
        Here, you can create methods defined as "game state actions" (see "action" property in states.inc.php).
        The action method of state X is called everytime the current game state is set to X.
    */
    function stEndGameScoring($debug=false) {

        $players = $this->loadPlayersBasicInfos();
        $playerList = array_keys($players);
        sort($playerList);
        $playerRegions = array();
        $playerRegionsWithoutHome = array();
        $playerBottles = array();

        $scores = $this->getCollectionFromDb("SELECT player_id, player_score FROM player");
        if (!$debug || true) {
            self::notifyAllPlayers("playerPointsEndgameInit", clienttranslate("End game scoring!"), array(
                'scores' => $scores,
            ));
        }

        $result = array();
        // first get all the bottle data so we don't do it multiple times
        foreach ($playerList as $player_id) {
            $this->incStat($scores[$player_id]['player_score'], "points_ingame", $player_id);

            $regions = array();
            $regionsWithoutHome = array();
            $bottles = self::getCollectionFromDb("SELECT uid FROM premium_item WHERE location='display' AND player_id=$player_id");
            foreach ($bottles as $uid => $b) {
                $card = $this->AllCards[$uid];

                $region = $this->getBottleRegionForPlayer($player_id, $uid);
                if (!array_key_exists($region, $regions)) 
                    $regions[$region] = 0;
                $regions[$region]++;

                $regionWithoutHome = $this->AllCards[$uid]->subtype;
                if (!array_key_exists($regionWithoutHome, $regionsWithoutHome)) 
                    $regionsWithoutHome[$regionWithoutHome] = 0;
                $regionsWithoutHome[$regionWithoutHome]++;
            }
            $playerBottles[$player_id] = $bottles;
            $playerRegions[$player_id] = $regions;
            $playerRegionsWithoutHome[$player_id] = $regionsWithoutHome;
        }

        $playerLabels = $this->getPlayerLabels();


        if ($debug) {
            self::notifyAllPlayers("dbgdbg", "end game scoring globals", array(
                'regions' => $playerRegions, 
                'regionsWithoutHome' => $playerRegionsWithoutHome, 
                'playerLabels' => $playerLabels));
        }

        foreach ($playerList as $player_id) {
            // Spirits in warehouse (SP on cards)
            $spirits = self::getCollectionFromDb("SELECT * FROM drink WHERE player_id=$player_id AND (location='warehouse1' or location='warehouse2') AND sold=0");
            foreach ($spirits as $spirit) {
                $cards = explode(',', $spirit['cards']);
                $value = $this->getDrinkSp($player_id, $cards, $spirit['recipe_slot'], $spirit['flavor_count'], null, $spirit['barrel_uid'], false);
                $this->playerPointsEndgame($player_id, $value['total'], "warehouses", $this->normalizeString($spirit['location']));
            }
        }
        foreach ($playerList as $player_id) {
            // Score bottles
            $regions = $playerRegions[$player_id];
            unset($regions[""]);
            foreach ($regions as $r => $count) {
                $score = 0;
                switch ($count) {
                    case 2: 
                        $score = 2;
                        break;
                    case 3:
                        $score = 4;
                        break;
                    case 4: 
                        $score = 7;
                        break;
                    case 5:
                        $score = 10;
                        break;
                    case 6:
                    case 7:
                    case 8:
                    case 9:
                        $score = 15;
                        break;
                }
                if ($score > 0) {
                    $bottleRegion = $this->normalizeString($r);
                    $this->playerPointsEndgame($player_id, $score, "bottles", "$bottleRegion bottles", $r);
                }
            }
            if (count($regions) >= 3)
                $this->playerPointsEndgame($player_id, 5, "bottles", clienttranslate("bottles 3 or more regions"), 'SET');
        }

        $playerDuScores = array();
        foreach ($playerList as $player_id) {
            $playerDuScores[$player_id] = array(
                DU::EQUIPMENT => 0,
                DU::SPECIALIST => 0,
            );

            $regions = $playerRegions[$player_id];

            // Score distillery upgrades
            $dus = self::getCollectionFromDb("SELECT * FROM distillery_upgrade WHERE location='player' AND player_id=$player_id");
            if ($debug) {
                // In debug mode, grab literally all of them
                //$dus = self::getCollectionFromDb("SELECT * FROM distillery_upgrade");
            }
            foreach ($dus as $id => $du) {
                $uid = $du['uid'];
                $score = $this->AllCards[$uid]->sp;
                $printResult = true;
                switch ($du['card_id']) {
                    case 112: // Greenhouse
                    case 105: // orchard
                    case 125: // Farmer
                        if ($du['card_id'] == 105) $match = Region::EUROPE;
                        if ($du['card_id'] == 112) $match = Region::AMERICAS;
                        if ($du['card_id'] == 125) $match = Region::ASIA;
                        $count = 0;
                        $labels = $this->getPlayerLabels()[$player_id];
                        foreach ($labels as $recipe) {
                            //self::notifyAllPlayers("dbgdbg", "recipe region 0", array('recipe' => $recipe));
                            $myRegion = $this->getRecipeRegionForPlayer($player_id, $recipe);
                            if ($myRegion == $match) {
                                $count++;
                            }
                        }
                        $score = intdiv($count, 2);
                        break;
                    case 107: // Natural Spring
                        $score = 0;
                        foreach ($dus as $iuid => $idu) {
                            if ($this->AllCards[$idu['uid']]->subtype == DU::EQUIPMENT) {
                                $score++;
                            }
                        }
                        break;
                    case 109: // Large Storage
                        $count = 0;
                        foreach ($dus as $iuid => $idu) {
                            if ($this->AllCards[$idu['uid']]->subtype == DU::EQUIPMENT) {
                                $count++;
                            }
                        }
                        if ($count == 1) {
                            $score = 2;
                        } else {
                            $score = 0;
                        }
                        break;
                    case 119: // Intern Researcher
                        $score = self::getUniqueValueFromDb("SELECT COUNT(id) FROM recipe WHERE player_id=$player_id AND (color='silver' OR color='gold')");
                        break;
                    case 120: // Warehouse Manager
                        $labels = self::getCollectionFromDb("SELECT * FROM label WHERE player_id=$player_id AND count != 0");
                        $aged = 0;
                        //self::notifyAllPlayers("dbgdbg", "labels", array('labels', $labels));
                        foreach ($labels as $iuid => $info) {
                            $r = $this->getRecipeByName($info['label'], $player_id);
                            //self::notifyAllPlayers("dbgdbg", "r", array('r' => $r));
                            if ($r['aged']) {
                                $aged++;
                            }
                        }
                        $score = $aged;
                        break;
                    case 121: // Master Blender
                        $labelNames = array();
                        foreach ($playerLabels[$player_id] as $label) {
                            if (!array_key_exists($label['name'], $labelNames)) 
                                $labelNames[$label['name']] = 0;
                            $labelNames[$label['name']]++;
                        }
                        foreach ($labelNames as $key => $ct) {
                            $score += intdiv($ct,  2) * 2;
                        }
                        break;
                    case 122: // Glassblower
                        foreach ($playerRegions[$player_id] as $region => $ct) {
                            if ($region == Region::HOME || $region == null) {
                                continue;
                            }
                            $score++;
                        }
                        break;
                    case 123:  // Trucker
                        $iuid = $this->revealFromDeck($this->ingredientsDeck);
                        self::notifyAllPlayers("trucker", '${card1_name} reveals ${card2_name}', array(
                            'card1' => $this->AllCards[$uid],
                            'card1_name' => $this->AllCards[$uid]->name,
                            'card2_name' => $this->AllCards[$iuid]->name,
                            'card2' => $this->AllCards[$iuid]));

                        $score = $this->AllCards[$iuid]->sale;
                        break;
                    case 126: // Tour Guide is a super exception;
                        $printResult = false;
                        break;
                    case 127: // coop manager
                        $score = self::getUniqueValueFromDb("SELECT COUNT(*) FROM label WHERE player_id=$player_id AND (location='player' OR location LIKE 'warehouse%') AND (label LIKE 'moonshine' OR label LIKE 'vodka')");
                        break;
                    case 128: //Architect
                        $score = count($dus);
                        break;
                    case 129: // Coppersmith
                        $specialists = 0;
                        foreach ($dus as $iuid => $idu) {
                            if ($this->AllCards[$idu['uid']]->subtype == DU::SPECIALIST) {
                                $specialists++;
                            }
                        }
                        if ($specialists == 1) {
                            $score = 2;
                        }
                        break;
                    case 131: // Cooper
                        $labels = self::getCollectionFromDb("SELECT uid, label FROM label WHERE player_id=$player_id AND (location='player' OR location LIKE 'warehouse%')");
                        $barrels = array();
                        foreach ($labels as $luid => $labelInfo) {
                            $recipe = $this->getRecipeByName($labelInfo['label'], $player_id);
                            $barrels[$recipe['barrel']] = true;
                        }
                        if ($debug) {
                            self::notifyAllPlayers("dbgdbg", 'Cooper barrels sit in the old gum tree: ${count}', array(
                                'count' => count($barrels),
                                'barrels' => $barrels,
                                'labels' => $labels,
                            ));
                        }
                        $score = count($barrels);
                        break;
                    case 132: // Biochemist
                        $specialists = 0;
                        foreach ($dus as $iuid => $idu) {
                            if ($this->AllCards[$idu['uid']]->subtype == DU::SPECIALIST) {
                                $specialists++;
                            }
                        }
                        $score = $specialists;
                        break;
                }
                if ($printResult) {
                    $this->playerPointsEndgame($player_id, $score, "dus", $this->AllCards[$uid]->name, $this->AllCards[$uid]);
                    $playerDuScores[$player_id][$this->AllCards[$uid]->subtype] += $score;
                }
            }
        }

        foreach ($playerList as $player_id) {
            // Distillery Goals (yes or no)
            $goals = self::getCollectionFromDb("SELECT uid, card_id FROM distillery_goal WHERE player_id=$player_id AND discarded=0");
            if ($debug) {
                //$goals = self::getCollectionFromDb("SELECT uid, card_id FROM distillery_goal");
            }
            foreach ($goals as $uid => $goalInfo) {
                $score = 0;
                switch ($goalInfo['card_id']) {
                    case 140: // Monarch
                    case 158: // West Champion
                    case 156: // East Champion
                        $match = null;
                        if ($goalInfo['card_id'] == 140) $match = Region::EUROPE;
                        if ($goalInfo['card_id'] == 158) $match = Region::AMERICAS;
                        if ($goalInfo['card_id'] == 156) $match = Region::ASIA;

                        $maxPlayers = array();
                        $maxCount = 0;
                        foreach ($players as $pid => $info) {
                            $lbls = $playerLabels[$pid];
                            $playerCount = 0;
                            foreach ($lbls as $recipe ) {
                                $region = $recipe['region'];
                                if ($region == $match) {
                                    if ($debug) {
                                        self::notifyAllPlayers("dbgdbg", 'Counting ${player_name}\'s ${label_name}', array(
                                            'label' => $recipe,
                                            'player_name' => $this->getPlayerName($pid),
                                            'label_name' => $recipe['name'],
                                        ));
                                    }
                                    $playerCount++;
                                }
                            }
                            if ($maxCount != 0 && $playerCount == $maxCount) {
                                $maxPlayers[] = $pid;
                            } else if ($playerCount > $maxCount) {
                                $maxPlayers = array($pid);
                                $maxCount = $playerCount;
                            }
                        }
                        if ($debug) {
                            self::notifyAllPlayers("dbgdbg", 'Debugging monarch and east/west goals', array(
                                'playerCount' => $playerCount,
                                'maxCount' => $maxCount,
                            ));
                        }
                        if (in_array($player_id, $maxPlayers)) {
                            $score = 6;
                        }
                        break;
                    case 141: // Photosynthsis
                        $maxPlayers = array();
                        $maxCount = 0;
                        foreach ($players as $pid => $info) {
                            $plantCount = 0;
                            foreach ($playerLabels[$pid] as $label) {
                                if ($label['name'] == 'Vodka') 
                                    continue;

                                if (in_array(Sugar::PLANT, $label['allowed'])) {
                                    $plantCount++;
                                }
                            }
                            if ($plantCount == $maxCount) {
                                $maxPlayers[] = $pid;
                            }
                            if ($plantCount > $maxCount) {
                                $maxPlayers = [$pid];
                                $maxCount = $plantCount;
                            }
                        }
                        if (in_array($player_id, $maxPlayers)) {
                            $score = 7;
                        }
                        break;
                    case 143: // Skip the easy stuff
                        // have or be tied for the most gold, silver, or bronze tiered spirits

                        $myScores = 0;
                        $maxScore = 0;
                        foreach ($players as $pid => $info) {
                            $playerScore = 0;
                            foreach ($playerLabels[$pid] as $label) {
                                if (0 <= $this->getRecipeSlotFromName($label['name'], $pid) &&
                                    7 >  $this->getRecipeSlotFromName($label['name'], $pid)) {
                                        $playerScore++;
                                        if ($debug) {
                                            self::notifyAllPlayers("dbgdbg", 'DEBUG STES: ${player_name}\'s ${name} gets counted', array(
                                                'player_name' => $this->getPlayerName($pid),
                                                'name' => $label['name'],
                                            ));
                                        }
                                }
                            }
                            if ($playerScore > $maxScore)
                                $maxScore = $playerScore;
                            if ($pid == $player_id)
                                $myScore = $playerScore;
                        }
                        if ($debug) {
                            self::notifyAllPlayers("dbgdbg", 'scores for ${player_name} is ${player_score} / ${max_score}', 
                                array('player_name' => $this->getPlayerName($player_id),
                                      'player_score' => $myScore, 
                                      'max_score'=> $maxScore));
                        }
                        if ($myScore == $maxScore && $myScore > 0) {
                            $score = 7;
                        }
                        break;
                    case 144: // Thirst For Knowledge
                        // have or be tied for the most recipe cubes => 6
                        $counts = self::getCollectionFromDb("SELECT player_id, COUNT(*) as ct FROM recipe GROUP BY player_id");
                        $myCount = 0;
                        $maxCount = 0;
                        foreach ($counts as $pid => $info) {
                            $ct = $info['ct'];
                            if ($player_id == $pid) 
                                $myCount = $ct;
                            if ($ct > $maxCount) 
                                $maxCount = $ct;
                        }
                        if ($myCount == $maxCount) {
                            $score = 6;
                        }
                        break;
                    case 145: // Wealthy
                        // have or be tied for the most money => 5
                        $counts = self::getCollectionFromDb("SELECT player_id, money FROM player");
                        $myCount = 0;
                        $maxCount = 0;
                        foreach ($counts as $pid => $info) {
                            $ct = $info['money'];
                            if ($player_id == $pid) 
                                $myCount = $ct;
                            if ($ct > $maxCount) 
                                $maxCount = $ct;
                        }
                        if ($myCount == $maxCount && $maxCount > 0) {
                            $score = 5;
                        }
                        break;
                    case 146: // from the earth
                        // have or be tied for the most recipe labels with clay pots => 5
                        $maxPlayers = array();
                        $maxCount = 0;
                        foreach ($players as $pid => $info) {
                            $playerCount = 0;
                            foreach ($playerLabels[$pid] as $label) {
                                if ($label['barrel'] == Barrel::CLAY) {
                                    $playerCount++;
                                }
                            }
                            if ($playerCount == $maxCount) {
                                $maxPlayers[] = $pid;
                            }
                            if ($playerCount > $maxCount) {
                                $maxPlayers = [$pid];
                                $maxCount = $playerCount;
                            }
                        }
                        if (in_array($player_id, $maxPlayers) && $maxCount > 0) {
                            $score = 5;
                        }
                        break;
                    case 147: // Gear Head
                        // have or be tied for the most SP from Equipment distillery upgrades => 6
                        $maxScore = 0;
                        foreach ($playerDuScores as $pid => $scoreSet) {
                            $ct = $scoreSet[DU::EQUIPMENT];
                            if ($ct > $maxScore) 
                                $maxScore = $ct;
                        }
                        if ($playerDuScores[$player_id][DU::EQUIPMENT] == $maxScore && $maxScore > 0) {
                            $score = 6;
                        }
                        break;
                    case 148:  // Geriatric
                        // Have or be tied for the most aged spirit labels => 7
                        $maxPlayers = array();
                        $maxCount = 0;
                        foreach ($players as $pid => $info) {
                            $agedCount = 0;
                            foreach ($playerLabels[$pid] as $label) {
                                if ($label['aged'] == true) {
                                    $agedCount++;
                                }
                            }
                            if ($agedCount == $maxCount) {
                                $maxPlayers[] = $pid;
                            }
                            if ($agedCount > $maxCount) {
                                $maxPlayers = [$pid];
                                $maxCount = $agedCount;
                            }
                        }
                        if (in_array($player_id, $maxPlayers)) {
                            $score = 7;
                        }
                        break;
                    case 142: // red glass => 5
                    case 152: //  Blue Glass
                    case 149:  // green glass => 5
                        if ($goalInfo['card_id'] == 142) $match = Region::ASIA;
                        if ($goalInfo['card_id'] == 152) $match = Region::EUROPE;
                        if ($goalInfo['card_id'] == 149) $match = Region::AMERICAS;
                        $maxCount = 0;
                        $myCount = 0;
                        $maxPlayer = 0;
                        foreach ($playerBottles as $pid => $bottles) {
                            $count = 0;
                            foreach ($bottles as $b) {
                                $bottle = $this->AllCards[$b['uid']];
                                if ($bottle->subtype == Region::HOME || $bottle->subtype == $match)  {
                                    $count++;
                                    /*
                                    self::notifyAllPlayers("dbgGlass", 'GLASS DEBUG: ${card_name} counts as ${match}', array(
                                        'card_name' => $bottle->name,
                                        'card' => $bottle,
                                        'match' => $match,
                                    ));
                                    */
                                }

                                if ($player_id == $pid) {
                                    $myCount = $count;
                                }
                            }
                            if ($count > $maxCount) {
                                $maxCount = $count;
                                $maxPlayer = $pid;
                            }
                        }
                        if ($debug) {
                            self::notifyAllPlayers("dbgdbg", 'debugigng colored glass', array(
                                'goalInfo' => $goalInfo,
                                'match' => $match,
                                'playerBottles' => $playerBottles
                            ));
                            self::notifyAllPlayers("dbgdbg", 'GLASS DEBUG: My count is ${myCount}, maxCount is ${maxCount}, Winner: ${player_name}', array(
                                'myCount' => $myCount,
                                'maxCount' => $maxCount,
                                'player_name' => $maxPlayer ? $this->getPlayerName($maxPlayer) : "no one",
                            ));
                        }
                        if ($myCount == $maxCount && $myCount > 0) 
                            $score = 5;
                        break;
                    case 150: // Just desserts
                        $maxCount = 0;
                        $myCount = 0;
                        foreach ($players as $pid => $info) {
                            $playerCount = 0;
                            foreach ($playerLabels[$pid] as $label) {
                                if ($label['name'] == 'Vodka') {
                                    continue;
                                }
                                if (in_array(Sugar::FRUIT, $label['allowed'])) {
                                    $playerCount++;
                                }
                            }
                            if ($playerCount > $maxCount) {
                                $maxCount = $playerCount;
                            }
                            if ($pid == $player_id)
                                $myCount = $playerCount;
                        }
                        if ($myCount == $maxCount && $myCount > 0)
                            $score = 7;
                        break;
                    case 151: // Juvenile
                        //self::notifyAllPlayers("dbgdbg", "juvenile", array());
                        $maxPlayers = array();
                        $maxCount = 0;
                        foreach ($players as $pid => $info) {
                            $unagedCount = 0;
                            if (!array_key_exists($pid, $playerLabels))
                                continue;

                            foreach ($playerLabels[$pid] as $label) {
                                if ($label['aged'] == false) {
                                    $unagedCount++;
                                }
                            }
                            if ($unagedCount == $maxCount) {
                                $maxPlayers[] = $pid;
                            }
                            if ($unagedCount > $maxCount) {
                                $maxPlayers = [$pid];
                                $maxCount = $unagedCount;
                            }
                            /*self::notifyAllPlayers("dbgdbg", "juvenile counts", array(
                                'pid' => $pid,
                                'unagedCount' => $unagedCount,
                                'maxCount' => $maxCount,
                            ));*/
                        }
                        if (in_array($player_id, $maxPlayers)) {
                            $score = 7;
                        }
                        /*self::notifyAllPlayers("dbgdbg", "juvenile max players", 
                            array('maxplayers' => $maxPlayers,
                                  'in_array' => in_array($player_id, $maxPlayers),
                                   'pid' => $player_id));*/
                        break;
                    case 153: // Close to Home
                        // Have or be tied for the most spirit labels from the same region => 5
                        $myScores = array();
                        $maxScores = array();
                        foreach ($players as $pid => $info) {
                            $playerScores = array();
                            foreach ($playerLabels[$pid] as $label) {
                                $r = $this->getRecipeByName($label['name'], $pid);
                                $region = $this->getRecipeRegionForPlayer($pid, $r);
                                if (!array_key_exists($region, $playerScores)) {
                                    $playerScores[$region] = 0;
                                }
                                $playerScores[$region]++;
                                if ($debug) {
                                    self::notifyAllPlayers("dbgdbg", '${player_name}\'s ${label_name} counts for ${region}',
                                        array('player_name' => $this->getPlayerName($pid),
                                              'label_name' => $label['name'],
                                              'region' => $region));
                                }
                            }
                            foreach ($playerScores as $color => $ct) {
                                if (!array_key_exists($color, $maxScores)) {
                                    $maxScores[$color] = $ct;
                                } else if ($ct > $maxScores[$color]) {
                                    $maxScores[$color] = $ct;
                                }
                            }
                            if ($pid == $player_id) {
                                $myScores = $playerScores;
                            }
                        }
                        $maxScore = 0;
                        foreach ($maxScores as $color => $ct) {
                            if ($ct > $maxScore) {
                                $maxScore = $ct;
                            }
                        }
                        if ($debug) {
                                self::notifyAllPlayers("dbgdbg", 'Close to home max is ${max}', array(
                                    'max' => $maxScore));
                        }
                        foreach ($myScores as $color => $ct) {
                            if ($debug) {
                                self::notifyAllPlayers("dbgdbg", 'Close to home ${player_name} ${color} ${score} ${maxScore}', array(
                                    'player_name' => $this->getPlayerName($pid),
                                    'score' => $ct,
                                    'maxScore' => $maxScore,
                                    'color' => $color,
                                ));
                            }
                            if ($ct && $ct == $maxScore) {
                                $score = 5;
                            }
                        }
                        break;
                    case 154: // Delegation
                        // Score or be tied for the most SP from SPECIALIST DU => 6
                        $maxScore = 0;
                        foreach ($playerDuScores as $pid => $scoreSet) {
                            $ct = $scoreSet[DU::SPECIALIST];
                            if ($ct > $maxScore) 
                                $maxScore = $ct;
                        }
                        if ($playerDuScores[$player_id][DU::SPECIALIST] == $maxScore && $maxScore > 0) {
                            $score = 6;
                        }
                        break;
                    case 155: // Diversity
                        // Have or be tied for the most diversity in spirit labels
                        $myScore = 0;
                        $maxScore = 0;
                        foreach ($players as $pid => $info) {
                            $labelNames = array();
                            if (!array_key_exists($pid, $playerLabels))
                                continue;

                            foreach ($playerLabels[$pid] as $label) {
                                $labelNames[$label['name']] = true;
                            }

                            if (count($labelNames) > $maxScore) 
                                $maxScore = count($labelNames);
                            if ($pid == $player_id) 
                                $myScore = count($labelNames);
                        }
                        if ($maxScore > 0 && $maxScore == $myScore) {
                            $score = 7;
                        }
                        break;
                   case 157: // For the farmers
                        // Have or be tied for the most non-vodka labels that require wheat 
                        $maxCount = 0;
                        $myCount = 0;
                        foreach ($players as $pid => $info) {
                            $playerCount = 0;
                            foreach ($playerLabels[$pid] as $label) {
                                if ($label['name'] == 'Vodka') {
                                    continue;
                                }
                                if (in_array(Sugar::GRAIN, $label['allowed'])) {
                                    if ($debug) {
                                        self::notifyAllPlayers("dbgdbg", 'Counting ${player_name}\'s ${label_name}', array(
                                            'label' => $label,
                                            'player_name' => $this->getPlayerName($pid),
                                            'label_name' => $label['name'],
                                        ));
                                    }
                                    $playerCount++;
                                }
                            }
                            if ($playerCount > $maxCount) {
                                $maxCount = $playerCount;
                            }
                            if ($pid == $player_id)
                                $myCount = $playerCount;
                        }
                        if ($debug) {
                            self::notifyAllPlayers('dbgdbg', 'My count: ${myCount} maxcount: ${maxCount}', array(
                                'myCount' => $myCount,
                                'maxCount' => $maxCount,
                            ));
                        }
                        if ($myCount == $maxCount && $myCount > 0)
                            $score = 7;
                        break;
                    case 159:  // Woody
                        // have or be tied for the most recipes requiring a wood barrel => 5
                        $maxPlayers = array();
                        $maxCount = 0;
                        foreach ($players as $pid => $info) {
                            $playerCount = 0;
                            foreach ($playerLabels[$pid] as $label) {
                                if ($label['barrel'] == Barrel::WOOD) {
                                    $playerCount++;
                                }
                            }
                            if ($playerCount == $maxCount) {
                                $maxPlayers[] = $pid;
                            }
                            if ($playerCount > $maxCount) {
                                $maxPlayers = [$pid];
                                $maxCount = $playerCount;
                            }
                        }
                        if (in_array($player_id, $maxPlayers) && $maxCount > 0) {
                            $score = 5;
                        }

                }
                if ($score > 0) {
                    $this->incStat(1, "goals_achieved", $player_id);
                }
                $this->playerPointsEndgame($player_id, $score, "goals", $this->AllCards[$uid]->name, $this->AllCards[$uid]);
            }

        }
        foreach ($playerList as $player_id) {
            // remaining money (multiples of 5)
            // Check to see if this player has the tour guide
            $present = self::getUniqueValueFromDb(
                "SELECT COUNT(*) FROM distillery_upgrade WHERE location='player' AND player_id=$player_id AND card_id=126");
            $money = self::getUniqueValueFromDb("SELECT money from player where player_id=$player_id");
            $score = 0;
            if ($present == 1) {
                $score = intdiv($money, 3);
                $this->playerGains($player_id, -3 * $score, clienttranslate("converting <span class='icon-coin-em'></span> to <span class='icon-sp-em'></span>"));
            } else {
                $score = intdiv($money, 5);
                $this->playerGains($player_id, -5 * $score, clienttranslate("converting <span class='icon-coin-em'></span> to <span class='icon-sp-em'></span>"));
            }
            $this->playerPointsEndgame($player_id, $score, "money", clienttranslate("converting <span class='icon-coin-em'></span> to <span class='icon-sp-em'></span>"));
        }

        // set up tie breaking
        self::dbQuery("UPDATE player SET player_score_aux=money");
        if ($debug) {
            return;
        }

        $nextPlayerId = $this->activeNextPlayer();
        while ($this->isPlayerZombie($nextPlayerId)) {
            $nextPlayerId = $this->activeNextPlayer();
        }

        $this->gamestate->nextState();
    }
    function stChooseDistiller() {
        $distillers = self::getCollectionFromDb("SELECT player_id, card_id FROM distiller WHERE discarded=0");
        foreach ($distillers as $player_id => $info) {
            $this->selectDistiller($player_id, $info['card_id']);
        }
        $this->gamestate->nextState();
    }
    function getRoundStartActions() {
        $powerCards = self::getPowerCards();


        $startActions= array();
        foreach ($powerCards as $pc) {
            $pid = $pc['player_id'];
            if (!array_key_exists($pid, $startActions)) {
                $startActionCount[$pid] = array();
            }
            if ($pc["market"] == 'du') {
                switch ($pc["card_id"]) {
                    case 123:
                        $startActions[$pid][] = $pc;
                        // Trucker
                        break;
                    case 124: 
                        // Market Buyer
                        $startActions[$pid][] = $pc;
                        break;
                    case 127:
                        // Co-op manager
                        $startActions[$pid][] = $pc;
                        break;
                }
            }
            else if ($pc["market"] == 'distiller') {
                switch ($pc["card_id"]) {
                    case 2:
                        // Jacqueline 
                        $startActions[$pid][] = $pc;
                        break;
                    case 34:
                        // Fang Xin
                        $startActions[$pid][] = $pc;
                        break;
                }
            }
        }
        return $startActions;
    }
    function dbgroundstartactions() {
        $result = $this->getRoundStartActions();
        self::notifyAllPlayers("dbgdbg", "round start actions", array('result' => $result));
    }
    function stEnterTasting() {
        $this->checkSpiritAwards();

        $turn = self::getGameStateValue("turn", 0);
        $sales = self::getCollectionFromDb("SELECT player_id, COUNT(*) FROM drink WHERE sold_turn=$turn GROUP BY player_id");
        $players = $this->loadPlayersBasicInfos();

        $tastingPlayers = array();
        foreach ($players as $player_id => $info) {
            $sp = $this->getPlayerSp($player_id);
            if (!array_key_exists($player_id, $sales) ) {
                if ($sp == 0) {
                    self::notifyAllPlayers("noTastings", clienttranslate('${player_name} cannot hold a tasting.'), array(
                        'player_name' => $this->getPlayerName($player_id)));
                    continue;
                }
                $tastingPlayers[] = $player_id;
                self::giveExtraTime($player_id);
            }
        }

        if (count($tastingPlayers) == 0) {
            $this->gamestate->nextState('notasting');
            return;
        }

        $this->gamestate->setPlayersMultiactive( $tastingPlayers, '', true);
        $this->gamestate->nextState('tasting');
        return;
    }
    function stNextPlayerRoundStart() {
        $startActions = $this->getRoundStartActions();
        $transitionAction = 'startAction';

        //self::notifyAllPlayers("dbgdbg", "setting to -1 in stnextplayerroundstart", array());
        self::setGameStateValue("powercard", -1);

        $pid = self::getActivePlayerId();
        if (array_key_exists($pid, $startActions)) {
            $transitionAction = 'startActionSelect';
            self::setGameStateValue("powercard", $startActions[$pid][0]['card_id']);
            $this->gamestate->nextState($transitionAction);
            self::giveExtraTime($pid);
            return;
        } 

        if (count($startActions) > 0) {
            self::activeNextPlayer();
            $this->gamestate->nextState('nextPlayer');
            return;
        }

        /*self::notifyAllPlayers("dbgdbg", "made it to the bottom", array(
            'startActions' => $startActions,
        ));*/

        $playerId = self::setActiveFirstPlayer();
        self::giveExtraTime($pid);
        $this->gamestate->nextState('market');
    }

    function stRoundStartOnce() {
        $turn = self::getGameStateValue("turn", 0);
        self::notifyAllPlayers("roundStart", 
            clienttranslate('Starting round ${turn}'), 
            array('turn' => $turn,
                  "spirits" => $this->getSpirits(),
        ));
        if ($turn > 1) {
            $this->rotateFirstPlayer();
        } else {
            self::setGameStateValue("distillersSelected", true);
        }
        $this->gamestate->nextState();
    }
    function stRoundStart() {
        $sql = "SELECT uid, card_id, 'du' as market, player_id FROM distillery_upgrade
                WHERE location='player'
                UNION ALL 
                SELECT uid, card_id, 'distiller' as market, player_id FROM distiller";
        $powerCards = self::getPowerCards();

        //self::notifyAllPlayers("dbgdbg", "setting to -1 in stroundstart", array());
        self::setGameStateValue("powercard", -1);
        $playerId = self::setActiveFirstPlayer();

        $usedPowers = [];
        foreach ($powerCards as $pc) {
            $pid = $pc['player_id'];
            if ($pc["market"] == 'du') {
                switch ($pc["card_id"]) {
                    case 105:
                        // Orchard
                        $this->notifyAllPlayersOfPowerCardGivingBasicCard($pid, 135, $pc['uid']);
                        $usedPowers[] = [$pc['uid'], 'du'];
                        break;
                    case 107:
                        // Natural Spring
                        $this->notifyAllPlayersOfPowerCardGivingBasicCard($pid, 138, $pc['uid']);
                        $usedPowers[] = [$pc['uid'], 'du'];
                        break;
                    case 112:
                        // Orchard
                        $this->notifyAllPlayersOfPowerCardGivingBasicCard($pid, 136, $pc['uid']);
                        $usedPowers[] = [$pc['uid'], 'du'];
                        break;
                    case 118:
                        // Private Investor
                        $sql = "SELECT id FROM drink 
                            WHERE location like 'warehouse%' AND player_id=$pid AND sold=0";
                        $result = self::getCollectionFromDb($sql);

                        if (count($result) > 0) {
                            $this->playerGains($pid, 2, $this->AllCards[$pc['uid']]->name, $pc['uid']) ;
                        }
                        $usedPowers[] = [$pc['uid'], 'du'];
                        break;
                    case 123:
                        // Trucker
                        break;
                    case 124: 
                        // Market Buyer
                        break;
                    case 125:
                        // Farmer
                        $this->notifyAllPlayersOfPowerCardGivingBasicCard($pid, 137, $pc['uid']);
                        $usedPowers[] = [$pc['uid'], 'du'];
                        break;
                    case 126:
                        // Tour Guide
                        $this->playerGains($pid, 1, $this->AllCards[$pc["uid"]]->name, $pc['uid']);
                        $usedPowers[] = [$pc['uid'], 'du'];
                        break;
                    case 127:
                        // Co-op manager
                        // TODO add ability to get a free ingredient.
                        break;
                    case 132:
                        // Biochemist
                        $this->notifyAllPlayersOfPowerCardGivingBasicCard($pid, 139, $pc['uid']);
                        $usedPowers[] = [$pc['uid'], 'du'];
                        break;
                }
            }
            else if ($pc["market"] == 'distiller') {
                switch ($pc["card_id"]) {
                    case 2:
                        // Jacqueline 
                        break;
                    case 28:
                        // Sakai
                        $this->playerGains($pid, 1, $this->distillers[$pc['card_id']]->name);
                        $usedPowers[] = [$pc['card_id'], 'distiller'];
                        break;
                    case 34:
                        // Fang Xin
                        break;
                }
            }
        }
        foreach ($usedPowers as $up) {
            $this->recordPower($up[0], $playerId, $up[1] == 'distiller');
        }
        $this->gamestate->nextState();
    }

    function stDistillFinalize() {
        //self::notifyAllPlayers("dbgdbg", "finalize", array());
        $limboCards = self::dbQuery(
            "SELECT uid, player_id, location FROM premium_ingredient WHERE location='limbo' OR location='removed'
             UNION ALL
             SELECT uid, player_id, location FROM bottomless_card WHERE location='limbo' OR location='removed'"
        );
        $playerList = array();
        $playerRemovedList = array();
        foreach ($limboCards as $lc) {
            if ($lc['location'] == 'limbo') {
                $pid = $lc["player_id"];
                if (!array_key_exists($pid, $playerList)) {
                    $playerList[$pid] = array();
                }
                $playerList[$pid][] = $lc['uid'];
            } else if ($lc['location'] == 'removed') {
                $pid = $lc["player_id"];
                if (!array_key_exists($pid, $playerRemovedList)) {
                    $playerRemovedList[$pid] = array();
                }
                $playerRemovedList[$pid][] = $lc;
            }
        }

        // TODO make it possible to disable these power cards
        $powerCards = $this->getPowerCards();
        $turn = self::getGameStateValue("turn", 0);

        //self::notifyAllPlayers('dbgdbg', "debug finalize", array('drink' => $playerList, 'removed' => $playerRemovedList));
        foreach ($playerList as $pid => $l) {
            $sql = sprintf('INSERT INTO drink(cards, player_id, location, first_turn)
                            VALUES ("%s", "%d", "washback", "%d")', 
                            implode(",", $l),
                            $pid,
                            $turn,
                        );
            self::DbQuery($sql);
            $drinkId = self::DbGetLastId();
        
            foreach ($powerCards as $pc) {
                if ($pid !=  $pc['player_id']) 
                    continue;
                if ($pc['market'] == 'du') {
                    switch ($pc["card_id"]) {
                        case 111: 
                            // Malting Floor
                            $c1 = $this->revealFromDeck($this->flavorDeck);
                            $this->addFlavorToDrink($drinkId, $pid, null, $pc['uid'], $c1, false);
                            break;
                        case 113: // Doig Ventilator
                            $c1 = $this->revealFromDeck($this->flavorDeck);
                            $c2 = $this->revealFromDeck($this->flavorDeck);
                            $card1 = $this->AllCards[$c1];
                            $card2 = $this->AllCards[$c2];
                            $winner = null;
                            if ($card1->sale > $card2->sale) {
                                $winner = $c1;
                                $this->placeOnBottom($this->flavorDeck, $c2);
                            }
                            else  {
                                $winner = $c2;
                                $this->placeOnBottom($this->flavorDeck, $c1);
                            }
                            self::notifyPlayer($pid, "doig", clienttranslate('${trigger_name} reveals ${card1_name} and ${card2_name}. ${winner_name} selected.'), array(
                                "trigger_name" => $this->AllCards[$pc['uid']]->name,
                                'card1_name' => $card1->name,
                                'card1_id' => $card1->uid,
                                'card2_name' => $card2->name,
                                'card2_id' => $card2->uid,
                                'winner_name' => $this->AllCards[$winner]->name,
                            ));
                            $this->addFlavorToDrink($drinkId, $pid, null, $pc['uid'], $winner, false);
                            break;

                    }
                } else if ($pc['market'] == 'distiller') {
                    switch ($pc['card_id']) {
                        case 8: // Juliana
                            $maxValueRemoved = 0;
                            foreach ($playerRemovedList[$pid] as $rc) {
                                $c = $this->AllCards[$rc['uid']];
                                $maxValueRemoved = ($maxValueRemoved < $c->sale) ? $c->sale : $maxValueRemoved;
                            } 
                            $this->playerGains($pid, $maxValueRemoved, $this->distillers[8]->name);
                            break;
                    }
                }
            }
        }
        
        // PUT THINGS INTO REMOVED 
        //self::notifyAllPlayers("dbgdbg", "about to move things into final locations", array());


        $tables = array("bottomless_card", "premium_ingredient", "premium_item");
        foreach ($tables as $table) {
            $cards = self::dbQuery("UPDATE $table SET location='truck' WHERE location='tradeOut'");
        }
        self::dbQuery("UPDATE premium_ingredient SET location='washback' WHERE location='limbo'");
        self::dbQuery("UPDATE bottomless_card SET location='washback' WHERE location='limbo'");
        self::dbQuery("UPDATE premium_ingredient SET location='player' WHERE location='removed'");
        self::dbQuery("UPDATE bottomless_card SET location='player' WHERE location='removed'");

        //$playerId = $this->setActiveFirstPlayer();
        //self::notifyAllPlayers("dbgdbg", "first player is now active", array('pid'=>$playerId));
        $this->gamestate->nextState();
    }

    function stMarketEnd() {
        // Discard cards from the market

        // Do it twice if you have 2 or fewer players
        $players = $this->loadPlayersBasicInfos();
        $iterations = 1;
        if (count($players) < 3) {
            $iterations = 2;
        }
        
        $newCards = array();
        $newCardNames = array();
        $removedCards = array();
        for ($i = 0; $i < $iterations; $i++) {
            $sql = "
                    SELECT uid, 'du' as market FROM distillery_upgrade
                    WHERE location='market' and location_idx=4
                    UNION ALL
                    SELECT uid, 'ing' as market FROM premium_ingredient
                    WHERE location='market' and location_idx=4
                    UNION ALL
                    SELECT uid, 'item' as market FROM premium_item
                    WHERE location='market' and location_idx=4
                    ";
            $results = self::getCollectionFromDb($sql);
            foreach ($results as $uid => $entry) {
                $tmp = $this->AllCards[$uid];
                $tmp->market = $entry["market"];
                $removedCards[] = $tmp;
            }

            $sql = sprintf("UPDATE distillery_upgrade SET location='truck'
                            WHERE location_idx=4");
            self::dbQuery($sql);
            $deck = $this->distilleryDeck;
            $this->shiftMarketRight($deck, 4);
            $dealt = $this->dealToIndex($deck, 1);
            $newCards[] = $dealt;
            $newCardNames[] = $this->AllCards[$dealt]->name;

            $sql = sprintf("UPDATE premium_ingredient SET location='truck'
                            WHERE location_idx=4");
            self::dbQuery($sql);
            $deck = $this->ingredientsDeck;
            $this->shiftMarketRight($deck, 4);
            $dealt = $this->dealToIndex($deck, 1);
            $newCards[] = $dealt;
            $newCardNames[] = $this->AllCards[$dealt]->name;
            
            $sql = sprintf("UPDATE premium_item SET location='truck'
                            WHERE location_idx=4");
            self::dbQuery($sql);
            $deck = $this->itemsDeck;
            $this->shiftMarketRight($deck, 4);
            $dealt = $this->dealToIndex($deck, 1);
            $newCards[] = $dealt;
            $newCardNames[] = $this->AllCards[$dealt]->name;
        }
        
        $newMarkets = array();
        $newMarkets['item'] = $this->getMarket($this->itemsDeck);
        $newMarkets['du'] = $this->getMarket($this->distilleryDeck);
        $newMarkets['ing'] = $this->getMarket($this->ingredientsDeck);

        $table = $deck->dbTable;
        $deckCounts = array();
        $deckCounts['item'] = self::getUniqueValueFromDb("SELECT COUNT(*) FROM premium_item WHERE location='deck'");
        $deckCounts['ing'] = self::getUniqueValueFromDb("SELECT COUNT(*) FROM premium_ingredient WHERE location='deck'");
        $deckCounts['du'] = self::getUniqueValueFromDb("SELECT COUNT(*) FROM distillery_upgrade WHERE location='deck'");
        self::notifyAllPlayers("updateMarkets", 
            clienttranslate('Markets update at the end of the market phase, ${new_cards} added'), 
            array(
                'new_cards' => implode(', ', $newCardNames),
                'new_markets' => $newMarkets,
                'removed_slot' => (count($players) < 2) ? 3 : 4,
                'removed_cards' => $removedCards,
                'deck_counts' => $deckCounts,
            ));
        
        $nextPlayer = $this->setActiveFirstPlayer();
        self::giveExtraTime($nextPlayer);
        $this->gamestate->nextState();
    }
    function stRoundEnd() {
        $gs = self::getGameStateValue("turn");
        self::setGameStateValue("turn", $gs + 1);

        // TODO fix up next active player, move first player
        if ($gs == 3) {
            $this->gamestate->setAllPlayersMultiactive();
            $this->gamestate->nextState("discardGoals");
            $players = $this->loadPlayersBasicInfos();
            foreach ($players as $player_id => $info) {
                self::giveExtraTime($player_id);
            }
        } else if ($gs == 7) {
            $this->gamestate->nextState("endGame");
        } else {
            $this->gamestate->nextState("nextRound");
        }
    }

    function stMoveToWarehouse() {
        $players = $this->loadPlayersBasicInfos();
        foreach ($players as $player_id => $info) {
            $sql = sprintf("SELECT id, recipe_slot, location, cards, barrel_uid FROM drink WHERE sold = 0 AND player_id='%d'",
                $player_id);
            $agingDrinks = self::getCollectionFromDb($sql);
            $dest = "warehouse1";

            if (count($agingDrinks) == 0) {
                continue;
            }

            // Location for new drinks
            foreach ($agingDrinks as $d) 
                if ($d["location"] == "warehouse1") 
                    $dest = "warehouse2";
            
            foreach ($agingDrinks as $d)  {
                if ($d["location"] == "washback") {

                    $turn = self::getGameStateValue("turn", 0);
                    // Move drink to warehouse
                    $sql = sprintf("UPDATE drink SET location='%s', first_turn=%d WHERE id=%d", 
                        $dest, $turn, $d["id"]);
                    self::DbQuery($sql);

                    // Move all the cards too
                    $cardList = array();
                    foreach (explode(',', $d['cards']) as $c) {
                        $cardList[] = "'$c'";
                    }

                    foreach (array('premium_item', 'premium_ingredient', 'bottomless_card', 'flavor') as $table) {
                        $sql = sprintf("UPDATE %s SET location='%s' WHERE uid in (%s,'%d')",
                            $table, $dest, implode(',', $cardList), $d['barrel_uid']);
                        self::DbQuery($sql);
                    }

                    $sql = sprintf("UPDATE label SET location='%s' WHERE player_id=%d AND location='washback'",
                        $dest, $player_id);
                    self::DbQuery($sql);
                        
                    $r = $this->getRecipeFromSlot($d["recipe_slot"], $player_id);
                    self::notifyAllPlayers("moveToWarehouse", clienttranslate('${player_name}\'s ${recipe_name} moved to ${location_str}'), array(
                        "player_name" => $this->getPlayerName($player_id),
                        "player_id" => $player_id,
                        "location" => $dest,
                        "location_str" => $this->normalizeString($dest),
                        "recipe_name" => $r['name'],
                        "recipe_label" => $r['label'],
                        "i18n" => ["location_str", "recipe_name"],
                    ));
                }
            }
        }
        $this->setActiveFirstPlayer();
        $this->gamestate->nextState("");
    }
    function stAge() {
        $player_id = $this->getActivePlayerId();

        $turn = self::getGameStateValue("turn");
        $sales = self::getUniqueValueFromDb("SELECT COUNT(*) FROM drink WHERE player_id=$player_id AND sold_turn=$turn");


        $result = $this->stAge_internal($player_id);
        $this->gamestate->nextState('aged');
        return $result;
    }
    function stAge_internal($player_id, $drinkId=null, $flavorId=null) {
        //$firstTurn = array();
        //$players = $this->loadPlayersBasicInfos();
        //foreach ($players as $player_id => $info) {

        if (true) {
            $drinks = $this->getAgeableDrinks($player_id);
            //self::notifyAllPlayers("dbgdbg", "drinks", array('drinks'=>$drinks));

            $newCards = array();
            $turn = self::getGameStateValue("turn", 0);
            foreach ($drinks as $d) {
                $this->agingPowers($player_id, $d);
                if ($d["location"] == "washback") {

                } else {
                    //self::notifyAllPlayers("dbgdbg", "add flavor to drink", array());
                    $this->addFlavorToDrink($d['id'], $player_id, $d['location']);
                }

            }
        }

    }
    function agingPowers($player_id, $d) {
        $turn = self::getGameStateValue("turn");
        $powerCards = $this->getPowerCards();
        foreach ($powerCards as $pc) {
            if ($player_id !=  $pc['player_id']) 
                continue;

            if ($pc['market'] == 'du') {
                switch ($pc["card_id"]) {
                    case 108: 
                        // Metal Rickhouse
                        if ($d['first_turn'] == $turn) 
                            $this->addFlavorToDrink($d['id'], $player_id, $d['location'], $pc['uid']);
                        break;
                }
            }
        }
        switch ($this->AllCards[$d['barrel_uid']]->card_id) {
            case 43: // Ex bourbon hogshead
                if ($d['first_turn'] == $turn) 
                    $this->addFlavorToDrink($d['id'], $player_id, $d['location'], $d['barrel_uid']);
                break;
            case 44:
                $this->playerGains($player_id, 1, $this->AllCards[$d['barrel_uid']]->name, $d['barrel_uid']);
                break;
        }
    }
    
    function stPlaceLabelTodo() {
        //self::notifyAllPlayers("dbgdbg", _("place label"), array());
        $this->gamestate->nextState("nextPlayerSell");
    }

    function stPlaceLabelForSp() {
        $this->playerPoints(self::getActivePlayerId(), 2);
        self::notifyAllPlayers("playerPoints", clienttranslate('${player_name} gains ${sp} points from label rewards'), array(
            'player_name' => self::getActivePlayerName(),
            'player_id' => self::getActivePlayerId(),
            'sp' => 2,
        ));
    }

    function stPlaceLabel0() {
        $this->playerGains(self::getActivePlayerId(), 5, 'label rewards');
        //$this->gamestate->nextState("nextPlayerSell");
    }

    function stPlaceLabel1() {
        $sql = sprintf("SELECT pi.uid 
                        FROM premium_ingredient as pi
                        JOIN distiller as d on d.player_id=pi.player_id
                        WHERE discarded=0 and location='signature' AND pi.player_id=%d",
                        self::getActivePlayerId());
        $sigUid = self::getUniqueValueFromDb($sql);
        $sigCard = $this->AllCards[$sigUid];

        $this->moveCardToPlayer($this->ingredientsDeck, $sigUid, self::getActivePlayerId());

        self::notifyAllPlayers("moveSignature", 
            clienttranslate('${player_name} moves signature ingredient ${card_name} to the pantry'),
            array(
                'i18n' => ['card_name'],
                'player_name' => self::getActivePlayerName(),
                'player_id' => self::getActivePlayerId(),
                'card_name' => $sigCard->name,
                'sig_card' => $sigCard,
                'card' => $sigCard,
        ));

    }

    function argPlaceLabel2() {
        $sql = "SELECT uid, 'ing' as market FROM premium_ingredient WHERE location='truck'
             UNION ALL
             SELECT uid, 'item' as market FROM premium_item WHERE location='truck'
             UNION ALL
             SELECT uid, 'du' as market FROM distillery_upgrade WHERE location='truck'
            ";
        $truckCards = self::DbQuery($sql);

        $truckCardList = array();
        foreach ($truckCards as $c) {
            $tmp = $this->AllCards[$c['uid']];
            $tmp->location = 'truck';
            $tmp->market = 'market';

            $truckCardList[] = $tmp;
        }

        return $truckCardList;
    }
    function stNextPlayer() {
        $turn = self::getGameStateValue("turn", 0);
        $sql = sprintf("SELECT player_id FROM market_purchase WHERE turn='%d' and market_pass=1", $turn);
        $passedPlayers = self::getCollectionFromDb($sql);

        // check if all players have passed
        if (count($passedPlayers) == $this->getPlayersNumber()) {
            //self::notifyAllPlayers("allPass", "All players have passed", array());
            foreach (array_keys($passedPlayers) as $pid) {
                self::giveExtraTime($pid);
            }
            
            $this->gamestate->nextState('distillPhase');
            // This is usually done in master state action method
            $this->gamestate->setAllPlayersMultiactive();
            return;
        }
        /*
        while ($this->isPlayerZombie($playerId) && array_key_exists($playerId, $passedPlayers))
            $playerId = self::activeNextPlayer();
        */

        $playerId = self::activeNextPlayer();
        if (array_key_exists($playerId, $passedPlayers)) {
            /*
            self::notifyAllPlayers("dbgdbg", '${player_name} player cant play', array(
                'playerId' => $playerId,
                'player_name' => $this->getPlayerName($playerId),
                'passedPlayers' => $passedPlayers));
                */
            //$playerId = self::activeNextPlayer();
            /*
            self::notifyAllPlayers("dbgdbg", '${player_name} player cant play 2', array(
                'playerId' => $playerId,
                'player_name' => $this->getPlayerName($playerId),
                'passedPlayers' => $passedPlayers));
                */
            $this->gamestate->nextState("cantPlay");
            return;
        }

        // Can Player Buy, if not force them to pass
        $canBuy = $this->canPlayerBuy($playerId);
        if (!$canBuy) {
            $sql = sprintf("INSERT INTO market_purchase (player_id, market_pass, turn) 
                            VALUES ('%s', '%d', '%d')", $playerId, 1, $turn);
            self::DbQuery($sql);

            self::notifyAllPlayers("cannotPlay", clienttranslate('${player_name} cannot play'), array(
                'player_name' => $this->getPlayerName($playerId),
            ));

            $this->gamestate->nextState("cantPlay");
            return;
        }

        self::giveExtraTime($playerId);
        $this->gamestate->nextState('nextPlayerBuyTurn');
    }

    function stNextPlayerAge() {
        $turn = self::getGameStateValue("turn", 0);

        $players = $this->loadPlayersBasicInfos();
        $drinkMap = array();
        $remainingPlayers = false;
        foreach ($players as $pid => $info) {
            $drinkMap[$pid] = $this->getAgeableDrinks($pid);
            if (count($drinkMap[$pid]) > 0) {
                $remainingPlayers = true;
            }
        }

        // check if all players have aged
        if (!$remainingPlayers) {
            //self::notifyAllPlayers("allPass", "All players have aged", array());
            $this->gamestate->nextState('roundEnd');
            return;
        }


        $playerId = self::getActivePlayerId();
        if (count($drinkMap[$playerId]) == 0) {
            //self::notifyAllPlayers("dbgdbg", "nextPlayer", array());
            $playerId = self::activeNextPlayer();
            $this->gamestate->nextState("nextPlayer");
            return;
        }

        // Mark a player as aged if they have no drinks to age
        $drinks = $drinkMap[$playerId];
        //self::notifyAllPlayers("dbgdbg", "drinks is ", array("drinks" => $drinks));
        if (!$drinks || count($drinks) == 0) {
            self::dbQuery("INSERT INTO market_purchase (player_id, action, turn) VALUES ($playerId, 'age', $turn)");
            $this->gamestate->nextState("nextPlayer");
            return;
        }

        self::giveExtraTime($playerId);
        $react = false;
        $powerCards = $this->getPowerCards();
        //self::notifyAllPlayers("dbgdbg", "powerCards", array("pc" => $powerCards));
        foreach ($powerCards as $pc) {
            if ($pc['player_id'] != $playerId) 
                continue;

            /*self::notifyAllPlayers("dbgdbg", 'pc2 ${pid1} ${pid2}',
                array(
                    'pid1' => $pc['player_id'],
                    'pid2' => $playerId,
                ));
                */

            switch ($pc['card_id']) {
                case 10: // Angus
                    $c1 = $this->revealFromDeck($this->flavorDeck);
                    $c2 = $this->revealFromDeck($this->flavorDeck);
                    $c3 = $this->revealFromDeck($this->flavorDeck);
                    self::notifyPlayer($playerId, 'revealCards', clienttranslate('${player_name} reveals ${card_name} from flavor deck'), array(
                        'i18n' => ['card_name'],
                        'player_id' => $playerId,
                        'player_name' => self::getActivePlayerName(),
                        'card_id' => $c1,
                        'card_name' => $this->AllCards[$c1]->name,
                        'card' => $this->AllCards[$c1],
                        'market_id' => 'ing',
                    ));
                    self::notifyPlayer($playerId, 'revealCards', clienttranslate('${player_name} reveals ${card_name} from flavor deck'), array(
                        'i18n' => ['card_name'],
                        'player_id' => $playerId,
                        'player_name' => self::getActivePlayerName(),
                        'card_id' => $c2,
                        'card_name' => $this->AllCards[$c2]->name,
                        'card' => $this->AllCards[$c2],
                        'market_id' => 'ing',
                    ));
                    self::notifyPlayer($playerId, 'revealCards', clienttranslate('${player_name} reveals ${card_name} from flavor deck'), array(
                        'i18n' => ['card_name'],
                        'player_id' => $playerId,
                        'player_name' => self::getActivePlayerName(),
                        'card_id' => $c3,
                        'card_name' => $this->AllCards[$c3]->name,
                        'card' => $this->AllCards[$c3],
                        'market_id' => 'ing',
                    ));
                    $react = true;
                    break;
            }
        }
        if ($react) {
            //self::notifyAllPlayers("dbgdbg", "selectFlavor", array());
            self::giveExtraTime($playerId);
            $this->gamestate->nextState('selectFlavor');
            return;
        }
        else  {
            //self::notifyAllPlayers("dbgdbg", 'age for ${player_name}', array('player_id'=>$playerId, 'player_name'=>$this->getActivePlayerName()));
            $this->gamestate->nextState('age');
            return;
        }
    }

    function stNextPlayerSelectRecipe() {
        $sql = "SELECT DISTINCT player_id FROM drink WHERE recipe_slot is NULL";
        $distillingPlayers = self::getCollectionFromDb($sql);

        // check if all players have passed
        if (count($distillingPlayers) == 0) {
            //$playerId = self::activeNextPlayer();
            $playerId = $this->setActiveFirstPlayer();
            $this->gamestate->nextState('sellPhase');
            return;
        }

        $playerId = self::getActivePlayerId();
        if (!array_key_exists($playerId, $distillingPlayers)) {
            $playerId = self::activeNextPlayer();
            $this->gamestate->nextState("cantPlay");
            return;
        }
        self::giveExtraTime($playerId);
        $this->gamestate->nextState('nextPlayerDistill');
    }
    function stNextPlayerSellHack() {
        self::activeNextPlayer();
        $this->gamestate->nextState();
    }
    function stNextPlayerSell() {
        $playerId = self::getActivePlayerId();

        // TODO have a way to track passes
        $sellable = $this->getSellableDrinks($playerId);

        $turn = self::getGameStateValue("turn", 0);

        $sql = sprintf("SELECT player_id, count(*) FROM market_purchase 
                        WHERE sell_pass=1 AND turn=%d
                        GROUP BY player_id",
                        $turn);
        $passes = self::getCollectionFromDb($sql);

        if (count($sellable) == 0 || array_key_exists($playerId, $passes)) {
            /*self::notifyAllPlayers("dbgdbg", 'sellable is 0 or pass for ${player_name}', 
                array(
                    'player_name' => $this->getPlayerName($playerId),
                    'player_id' => $playerId,
                ));*/
            $allDone = true;
            $players = $this->loadPlayersBasicInfos();
            foreach ($players as $pid => $info) {
                $sellable = $this->getSellableDrinks($pid);
                if (count($sellable) != 0 && !array_key_exists($pid, $passes)) {
                    $allDone = false;
                    /*self::notifyAllPlayers("dbgdbg", '${player_name} is not done yet', 
                        array(
                            'player_name' => $this->getPlayerName($pid),
                            'player_id' => $pid,
                            'sellable' => $sellable,
                        ));*/
                }
            }

            if ($allDone) {
                $this->gamestate->nextState("agePhase");
                return;
            }
            $pid = $this->activeNextPlayer();
            $this->gamestate->nextState("cantPlay");
            return;
        } 

        self::giveExtraTime($playerId);
        $this->gamestate->nextState('nextPlayerSell');
    }

//////////////////////////////////////////////////////////////////////////////
//////////// Zombie
////////////

    /*
        zombieTurn:
        
        This method is called each time it is the turn of a player who has quit the game (= "zombie" player).
        You can do whatever you want in order to make sure the turn of this player ends appropriately
        (ex: pass).
        
        Important: your zombie code will be called when the player leaves the game. This action is triggered
        from the main site and propagated to the gameserver from a server, not from a browser.
        As a consequence, there is no current player associated to this action. In your zombieTurn function,
        you must _never_ use getCurrentPlayerId() or getCurrentPlayerName(), otherwise it will fail with a "Not logged" error message. 
    */

    function zombieTurn( $state, $active_player )
    {
    	$statename = $state['name'];
    	
        if ($state['type'] === "activeplayer") {
            switch ($statename) {
                case 'playerBuyTurn':
                    //self::notifyAllPlayers("dbgdbg", '3 zombie ${state}', array('state' => $this->getStateName()));
                case 'playerBuyTurnRevealSelect':
                    //self::notifyAllPlayers("dbgdbg", '2 zombie ${state}', array('state' => $this->getStateName()));
                case 'playerBuyTurnReveal':
                    $this->marketPass();

                    //self::notifyAllPlayers("dbgdbg", '1 zombie ${state}', array('state' => $this->getStateName()));
                    //$this->gamestate->nextState('pass');
                    break;
                case 'selectRecipe':
                    $args = $this->argSelectRecipe();
                    $r = $args['recipes'][0];
                    $this->selectRecipe($r['recipeSlot'], $args['drinkId'], $r['barrelUid']);
                    break;
                case 'placeLabel2':
                    $this->placeLabel2Pass();
                    break;
                case 'tasting':
                    $this->tasting(0);
                    break;
                case 'distill':
                    $this->gamestate->nextState('skip');
                    break;
                case 'sell':
                case 'selectFlavor':
                case 'placeLabel3':
                case 'placeLabel4':
                case 'placeLabel5':
                case 'placeLabel6':
                case 'placeLabel':
                case 'roundStartAction':
                case 'roundStartActionSelect':
                    $this->gamestate->nextState( "zombiePass" );
                	break;
            }

            return;
        }

        if ($state['type'] === "multipleactiveplayer") {
            // Make sure player is in a non blocking status for role turn
            switch ($statename) {
                case 'chooseDistiller': 
                    $available = self::getUniqueValueFromDb("SELECT card_id FROM distiller WHERE player_id=$active_player LIMIT 1");
                    //self::notifyAllPlayers("dbgdbg", "choosing distiller", array('available' => $available, 'active_player'=>$active_player));
                    $this->selectDistillerAction($available, $active_player);

                    break;
                case 'distill':
                    $this->skipDistill($active_player);
                    break;
                case 'preDistill':
                    $this->passPreDistill();
                    break;
                case 'discardGoals':
                    $goalUid = self::getUniqueValueFromDb("SELECT uid FROM distillery_goal WHERE player_id=$active_player LIMIT 1");
                    $this->discardGoal($goalUid, $active_player);
                    return;
                    //$this->gamestate->nextState("zombiePass");
                    break;
            }
            $this->gamestate->setPlayerNonMultiactive( $active_player, '' );
            
            return;
        }

        throw new feException( "Zombie mode not supported at this game state: ".$statename );
    }
    
///////////////////////////////////////////////////////////////////////////////////:
////////// DB upgrade
//////////

    /*
        upgradeTableDb:
        
        You don't have to care about this until your game has been published on BGA.
        Once your game is on BGA, this method is called everytime the system detects a game running with your old
        Database scheme.
        In this case, if you change your Database scheme, you just have to apply the needed changes in order to
        update the game database and allow the game to continue to run with your new version.
    
    */
    
    function upgradeTableDb( $from_version )
    {
        // $from_version is the current version of this game database, in numerical form.
        // For example, if the game was running with a release of your game named "140430-1345",
        // $from_version is equal to 1404301345
        
        // Example:
//        if( $from_version <= 1404301345 )
//        {
//            // ! important ! Use DBPREFIX_<table_name> for all tables
//
//            $sql = "ALTER TABLE DBPREFIX_xxxxxxx ....";
//            self::applyDbUpgradeToAllDB( $sql );
//        }
//        if( $from_version <= 1405061421 )
//        {
//            // ! important ! Use DBPREFIX_<table_name> for all tables
//
//            $sql = "CREATE TABLE DBPREFIX_xxxxxxx ....";
//            self::applyDbUpgradeToAllDB( $sql );
//        }
//        // Please add your future database scheme changes here
//
//


    }    
    /* leaky abstractions from Deck because I dont have access to a bunch of functions I need */
    function reshuffle($deck) {
        $sql = sprintf("SELECT uid FROM %s WHERE location='truck'", $deck->dbTable);
        $results = self::getCollectionFromDb($sql);
        $card_ids = array_keys($results);
        shuffle($card_ids);
        $order = 0;
        foreach ($card_ids as $uid) {
            $order++;
            self::dbQuery(sprintf("UPDATE %s SET location='deck', location_idx=%d WHERE uid=%d", 
                $deck->dbTable, $order, $uid));
        }
        self::notifyAllPlayers("shuffleDeck", clienttranslate('Shuffling ${deck_name} truck into deck'), array(
            'deck_name' => $deck->name,
            'deck_id' => $this->getIdFromMarket($deck->name),
            'card_count' => count($card_ids),
        ));
    }

    function isCardInMarket($deck, $uid) {
        $market = $deck->dbTable;
        $check = self::getUniqueValueFromDb("SELECT COUNT(*) FROM $market WHERE location='market' AND uid=$uid");
        return $check && $check == 1;
    }
    function isCardInTruck($deck, $uid) {
        $market = $deck->dbTable;
        $check = self::getUniqueValueFromDb("SELECT COUNT(*) FROM $market WHERE location='truck' AND uid=$uid");
        return $check && $check == 1;
    }

    function dealToIndex($deck, $index) {
        // TODO handle shuffle?
        $sql = sprintf("SELECT * FROM %s WHERE location='deck' ORDER BY location_idx ASC LIMIT 1", $deck->dbTable);
        $result = self::getObjectFromDb($sql);
        if ($result != null) {
            self::DbQuery(
                sprintf("UPDATE %s SET location_idx='%d', location='market' WHERE id='%d'",
                        $deck->dbTable,
                        $index,
                        $result['id']
            ));
            return $result['uid'];
        } 
        $this->reshuffle($deck);
        return $this->dealToIndex($deck, $index);
    }
    function placeOnBottom($deck, $uid) {
        $max = self::getUniqueValueFromDb(sprintf("SELECT location_idx from %s WHERE location='deck' ORDER BY location_idx DESC LIMIT 1", $deck->dbTable));
        // TODO Handle getting no results back
        $order = $max;
        $order++;
        self::dbQuery(sprintf("UPDATE %s SET location='deck', location_idx=%d WHERE uid=%d", 
            $deck->dbTable, $order, $uid));
    }
    function revealFromDeck($deck) {
        $sql = sprintf("SELECT * FROM %s WHERE location='deck' ORDER BY location_idx ASC LIMIT 1", $deck->dbTable);
        $result = self::getObjectFromDb($sql);
        if ($result != null) {
            self::DbQuery(
                sprintf("UPDATE %s SET location='reveal' WHERE id='%d'",
                        $deck->dbTable,
                        $result['id']
            ));
            return $result['uid'];
        }
        $this->reshuffle($deck);
        return $this->revealFromDeck($deck);
    }

    function moveCardToPlayer($deck, $uid, $playerId) {
        $sql = sprintf("UPDATE %s SET location='player', location_idx=0, player_id=%s WHERE uid='%d'", 
                       $deck->dbTable, $playerId, $uid);
        self::DbQuery($sql);
    }
    function moveCardToTruck($deck, $uid, $playerId) {
        $sql = sprintf("UPDATE %s SET location='truck', location_idx=0, player_id=%s WHERE uid='%d'", 
                       $deck->dbTable, $playerId, $uid);
        self::DbQuery($sql);
    }

    function moveCardToLimbo($deck, $uid, $playerId) {
        $sql = sprintf("UPDATE %s SET location=\"limbo\", location_idx=0, player_id=%s WHERE uid='%d'", 
                       $deck->dbTable, $playerId, $uid);
        self::DbQuery($sql);
    }

    function addBasicCardToPlayer($uid, $playerId) {
        $card = $this->AllCards[$uid];
        // create a new bottomless card for the player
        $newUid = $this->newBottomlessCard($card->card_id, 
                                            $playerId,
                                            $card->type == CardType::BARREL);

        return $newUid;
    }

    function shiftMarketRight($deck, $slotId) {
        // TODO sanity check the slotId for emptiness
        $sql = sprintf("UPDATE %s SET location_idx=location_idx+1 WHERE location_idx < '%d' AND location_idx > 0 AND location='market'", 
                        $deck->dbTable, $slotId);
        $result = self::DbQuery($sql);

    }

    function isCardRevealed($deck, $uid) {
        $table = $deck->dbTable;
        $check = self::getUniqueValueFromDb("SELECT COUNT(*) FROM $table WHERE uid=$uid AND location='reveal'");
        return $check == 1;
    }

    function getMarket($deck) {
        // Get the relevant market cards
        $sql = sprintf("SELECT uid, location, location_idx FROM %s WHERE location='market' AND location_idx > 0 ORDER BY location_idx DESC",
            $deck->dbTable);
        $duList = array();
        $result = self::getCollectionFromDb($sql);
        foreach($result as $uid => $card) {
            $c = $this->AllCards[$uid];
            $c->location_idx = $card["location_idx"];
            $c->location = $card["location"];
            $duList[] = $c;
        }
        return $duList;
    }

    function moveRecipeCubeToPlayer($playerId, $slot) {
        $color = $this->getRecipeFlight()[$slot]["cube"];
        $sql = sprintf("INSERT INTO recipe (player_id, slot, color) 
                        VALUES ('%s', '%s', '%s')",
                            $playerId, $slot, $color);
        self::DbQuery($sql);
    }
    function getKnownFlavorCount($drinkId) {
        $info = self::getObjectFromDb("select * from drink where id=$drinkId");
        $loc = $info['location'];
        $pid = $info['player_id'];
        $cards = explode(',', $info['cards']);
        $count = 0;
        foreach ($cards as $c) {
            if ($this->AllCards[$c]->type == CardType::FLAVOR)
                $count++;
        }
        return $count;
    }
    function getKnownFlavors($drinkId) {
        $info = self::getObjectFromDb("select * from drink where id=$drinkId");
        $loc = $info['location'];
        $pid = $info['player_id'];
        $flavors = self::getCollectionFromDb("SELECT uid, card_id FROM flavor WHERE location='$loc' AND player_id=$pid");
        $ret = array();
        foreach ($flavors as $uid => $info) {
            $ret[] = $this->AllCards[$uid];
        }
        return $ret;
    }
    function getPlayerCardList($player_id, $isCurrent) {
        // Get the premium item market cards
        $current_player_id = self::getCurrentPlayerId();

        $sql = sprintf("SELECT uid, location, 'item' as market, location_idx
                FROM premium_item WHERE player_id='%s'
                UNION ALL
                SELECT uid, location, 'du' as market, location_idx
                FROM distillery_upgrade WHERE player_id='%s'
                UNION ALL
                SELECT uid, location, 'ing' as market, location_idx
                FROM premium_ingredient WHERE player_id='%s'
                UNION ALL
                SELECT uid, location, market, 0 as location_idx
                FROM bottomless_card WHERE player_id=%d AND used=0
                UNION ALL 
                SELECT uid, location, 'ing' as market, location_idx
                FROM flavor WHERE player_id=%d",
                $player_id, $player_id, $player_id, $player_id, $player_id);


        $pantryList = array();
        $tmp = self::getCollectionFromDb($sql);
        foreach($tmp as $card) {
            $c = $this->AllCards[$card["uid"]];
            $c->location = $card["location"];
            $c->market = $card["market"];
            $c->location_idx = $card["location_idx"];
            $pantryList[] = $c;
        }

        $sql = sprintf("SELECT label, label.location as location, 'label' as market, location_idx, count, signature, uid
                        FROM label JOIN drink on label.uid = drink.label_uid
                        WHERE label.player_id=%d", $player_id);
        $labels = self::dbQuery($sql);

        foreach ($labels as $label) {
            $tmp = $this->getRecipeByName($label["label"], $player_id);
            $tmp["market"] = 'label';
            $tmp["location"] = $label["location"];
            $tmp['location_idx'] = $label['location_idx'];
            $tmp['count'] = $label['count'];
            $tmp['uid'] = $label['uid'];

            /*
            // TODO remove all this
            $tmp['bunchofstuff'] = $label;
            $tmp['name'] = $label['label'];
            $tmp['distiller'] = $this->getPlayerDistiller($player_id);
            $tmp['allrecipes'] = $allRecipes = $this->getRecipes();
            $tmp['signatureRecipe'] = $this->signature_recipes[$this->getPlayerDistiller($player_id)->id / 2];
            $tmp['equal'] = $tmp['signatureRecipe']['name'] == $label['label'];
            */


            $pantryList[] = $tmp;
        }

        $sql = sprintf("SELECT id, flavor_count, location FROM drink
                        WHERE player_id=%d AND sold=0 AND
                        (location='warehouse1' OR location='warehouse2')", $player_id);
        $counts = self::getCollectionFromDb($sql);


        $pantryList[] = array('location' => 'debug', 'counts' => $counts);
        foreach ($counts as $count) {
            $known = $this->getKnownFlavorCount($count['id']);
            $pantryList[] = array('location' => 'debug', 'id' => $count['id'], 'known_flavors' => $known);
            for ($i = 0; $i < $count["flavor_count"] - $known; $i++) {
                $pantryList[] = array('type'=>CardType::FLAVOR, 'location'=>$count["location"], 'market'=>'flavor');
            }
        }

        if ($isCurrent) {
            $sql = sprintf("SELECT uid, card_id, 'goal' as market
                            FROM distillery_goal
                            WHERE player_id=%d AND discarded=0", $player_id);
            $goals = self::getCollectionFromDb($sql);
            foreach ($goals as $g) {
                $tmp = $this->AllCards[$g["uid"]];
                $tmp->market = "goal";
                $pantryList[] = $tmp;
            }
        }

        return $pantryList;
    }

    function getAllCards() {
        return $this->AllCards;
    }

    function getDistillableRecipes($uids, $ignoreInvalid=false, $pid=null) {
        if ($pid == null)
            $pid = self::getActivePlayerId();


        $drinks = array();
        $allRecipes = $this->getRecipes();
        $allRecipes[] = $this->signature_recipes[
            ($this->getPlayerDistiller($pid))->id / 2
        ];
        $slot = -3;
        $reason = "unknown";

        //self::notifyAllPlayers("dbgdbg", "all recipes", array("all_recipes" => $allRecipes));

        $purchasedSlots = array();
        $sql = sprintf("SELECT slot FROM recipe WHERE player_id='%s'",
                $pid);
        $tmp = self::getCollectionFromDb($sql);
        foreach($tmp as $r) {
            $purchasedSlots[] = $r['slot'];
        }
        // TODO check location of item, should be in storeroom?
        $sql = sprintf("SELECT uid from premium_item WHERE player_id='%d' and location='player' and used=0
                        UNION
                        SELECT uid from bottomless_card where market='item' and location='player' and player_id='%d'",
                    $pid, $pid);
        $items = self::getCollectionFromDb($sql);
        $barrelTypes = array();
        $barrels = array();


        $stainlessBarrel = false;
        // TODO check for using barrels that are in a warehouse
        foreach ($items as $c => $item) {
            if ($this->AllCards[$c]->type == CardType::BARREL) {
                if ($this->AllCards[$c]->card_id == 40)
                    $stainlessBarrel = true;
                $barrelTypes[] = $this->AllCards[$c]->subtype;
                $barrels[] = $this->AllCards[$c];

            }
        }

        //self::notifyAllPlayers("dbgdbg", "recipes", array('recipes' => $allRecipes));
        //self::notifyAllPlayers("dbgdbg", "barrels", array('barrels' => $barrels, 'barrel_types'=>$barrelTypes));

        $purchasedSlots[] = -2; // Moonshine
        $purchasedSlots[] = -1; // Vodka

        $sigLocation = self::getUniqueValueFromDb("SELECT location FROM label WHERE signature=1 AND player_id=$pid");
        if ($sigLocation == 'flight') // Only add the signature slot if the recipe label is still on the flight (only once per game)
            $purchasedSlots[] = 7; // Signature

        // Get information on labels
        $sql = "SELECT label, count FROM label WHERE location='market' OR location='flight'";
        $labelCounts = self::getCollectionFromDb($sql);

        $reason = array();
        // TODO 
        $combinations = array();
        foreach($allRecipes as $r) {
            $slot++;

            // Check if the slot is purchased
            if ($slot >= 0 && !in_array($slot, $purchasedSlots))  {
                $reason[] = "slot";
                continue;
            }

            $sugars = 0;
            $invalid = false;
            $badCard = 0;

            $include = null;
            $includeFound = false;
            if (array_key_exists("include", $r)) {
                $include = $r["include"];
                $reason['include'] = $include;
                //self::notifyAllPlayers("dbgdbg", "found an include in ", array('r' => $r));
            }
            foreach ($uids as $c) {
                $cardInfo = $this->AllCards[$c];

                if ($cardInfo->type == CardType::SUGAR) {
                    if (in_array($cardInfo->subtype, $r["allowed"]))
                        $sugars++;
                    else if (!$ignoreInvalid) {
                        $invalid = true;
                        $badCard = $cardInfo;
                    }
                }
                if ($include != null && str_contains(strtolower($cardInfo->name), $include)) {
                    $includeFound = true;
                }
            }

            if ($include != null && !$includeFound)  { // signature ingredient not found
                $reason[] = 'include';
                continue;
            }

            if ($invalid)  {
                $reason[] = 'invalid';
                //self::notifyAllPlayers("dbgdbg", 'invalid ${recipe_name}', array(
                //    'barrels' => $barrels,
                //    'recipe_name' => $r['name'],
                //    'r' => $r,
                //));
                continue;
            }

            if (!in_array($r["barrel"], $barrelTypes)) {
                $reason[] = 'barrel';
                //self::notifyAllPlayers("dbgdbg", 'no barrel ${recipe_name}', array(
                //    'barrels' => $barrels,
                //    'recipe_name' => $r['name'],
                //    'r' => $r,
                //));
                continue;
            }

            if ($sugars < $r["sugars"]) {
                $reason[] = 'wrong sugar';
                //self::notifyAllPlayers("dbgdbg", 'azucar ${recipe_name}', array(
                //    'barrels' => $barrels,
                //    'recipe_name' => $r['name'],
                //    'r' => $r,
                //));
                continue;
            }

            $reason[] = 'good';
            $drinks[] = $r["name"];
            foreach ($barrels as $barrel) {
                if ($barrel->subtype == $r["barrel"]) {
                    if ($barrel->card_id == 19 && $stainlessBarrel) // metal barrel
                        continue;

                    if ($slot == 7) // Signature
                        $labelCount = 1;
                    else 
                        $labelCount =  $labelCounts[$r["name"]]["count"];

                    $combinations[] = array(
                        "recipe" => $r["name"],
                        "barrel" => $barrel->name,
                        "barrelUid" => $barrel->uid,
                        "labelCount" => $labelCount,
                        "recipeSlot" => $this->getRecipeSlotFromName($r['name'], $pid),
                    );
                }
            }
        }


        return $combinations;
    }

    function distillRemoval($cards, $skipAddAlcohol, $activePowers) {
        /*
        $cards = array();
        foreach($cardsObj as $c) {
            $cards[] = $c
        }*/

        $card_ids = array();
        if ($activePowers) {
            foreach ($activePowers as $power) {
                $card_ids[] = $this->AllCards[$power]->card_id;
            }
        }

        shuffle($cards);
        if ($activePowers && in_array(116, $card_ids)) {
            $card1 = array_shift($cards);
            self::notifyAllPlayers("removeCards", clienttranslate('${card1_name} was removed from ${player_name}\'s washback.'), 
                array(
                    'i18n' => ['card1_name'],
                    "card1_name" => $this->AllCards[$card1]->name,
                    "card2_name" => null,
                    "card1_id" => $card1,
                    "card2_id" => null,
                    "player_name" => $this->getActivePlayerName(),
                    "player_id" => $this->getActivePlayerId(),
                    "wb_cards" => $cards,
                    "skip_add_alcohol" => $skipAddAlcohol,
                ));
        } else {
            $card1 = array_shift($cards);
            $card2 = array_shift($cards);

            // Check to see if there's any post-removal steps.
            self::notifyAllPlayers("removeCards", clienttranslate('${card1_name} and ${card2_name} were removed from ${player_name}\'s washback.'), 
                array(
                    'i18n' => ['card1_name', 'card2_name'],
                    "card1_name" => $this->AllCards[$card1]->name,
                    "card2_name" => $this->AllCards[$card2]->name,
                    "card1_id" => $card1,
                    "card2_id" => $card2,
                    "player_name" => $this->getActivePlayerName(),
                    "player_id" => $this->getActivePlayerId(),
                    "wb_cards" => $cards,
                    "skip_add_alcohol" => $skipAddAlcohol,
                ));
        }
        
        // TODO Handle signature ingredients returning... but this is actually a DU thing too
        return $cards;
    }
    function addAlcohols($cards, $activePowers) {
        $count = 0;
        foreach ($cards as $uid) {
            if (!array_key_exists($uid, $this->AllCards))
                continue;
            if ($this->AllCards[$uid]->type == CardType::SUGAR) {
                $count++;
            }
            if ($this->AllCards[$uid]->card_id == 45) {
                $count++;
            }
        }

        if ($activePowers) {
            // TODO make it possible to disable these power cards
            foreach ($activePowers as $pc) {
                // TODO validate that this player has that card
                switch ($this->AllCards[$pc]->card_id) {
                    case 104: 
                        // Worm Tub
                        self::notifyAllPlayers("powerCard", clienttranslate('Adding 2 additional alcohol (${card_name})'),
                            array('trigger_name' => $this->AllCards[$pc]->name,
                                  'i18n' => ['card_name'],
                                  'card_name' => $this->AllCards[$pc]->name,
                                  'card' => $this->AllCards[$pc]));
                        $count += 2;
                        break;
                    case 129:
                        // Coppersmith
                        self::notifyAllPlayers("powerCard", clienttranslate('Adding 1 additional alcohol (${card_name})'),
                            array('trigger_name' => $this->AllCards[$pc]->name,
                                  'i18n' => ['card_name'],
                                  'card_name' => $this->AllCards[$pc]->name,
                                  'card' => $this->AllCards[$pc]));
                        $count += 1;
                        break;
                }
            }
        }

        $newCards = array();
        for ($ii = 0; $ii < $count; $ii++) {
            $c = $this->AllCards[$this->newBottomlessCard(0, self::getActivePlayerId())];
            $newCards[] = $c;
            $cards[] = $c->uid;
        }
        self::notifyAllPlayers("addAlcohols", clienttranslate('${player_name} adds ${count} ${card_name} to their spirit.'),
            array(
                'i18n' => ['card_name'],
                "player_name" => $this->getActivePlayerName(),
                "player_id" => $this->getActivePlayerId(),
                "card_name" => "Alcohol",
                "card_id" => 0,
                "count" => $count,
                "new_cards" => $newCards,
                "cards" => $cards,
            ));
        return $cards;
    }

    function initLabels() {

        $playerCount = $this->getPlayersNumber();
        $items = array();

        $recipes = $this->getRecipes();
        foreach($recipes as $r) {
            $ct = $playerCount;
            if ($r['name'] == "Vodka" || $r['name'] == "Moonshine")
                $ct *= 2;
            $items[] = sprintf("('%s', 'market', %d)", $r["name"], $ct);
        }

        $sql = sprintf('INSERT INTO label(label, location, count) VALUES %s',
            implode(',', $items));
        self::DbQuery($sql);
    }
    function debugCards() {
        self::notifyAllPlayers('dbgdbg', "cards", array("AllCards" => array_keys($this->AllCards)));
    }
    function debugCard($id) {
        self::notifyAllPlayers('dbgdbg', "card", array("card" => $this->AllCards[$id]));
    }
    function cardName($id) {
        self::notifyAllPlayers('dbgdbg', '${card_name}', array("card_name" => $this->AllCards[$id]->name));
    }


    /**
     * 
     * 
     * 
     */
    public function LoadDebug()
	{
		// These are the id's from the BGAtable I need to debug.
		// you can get them by running this query : SELECT JSON_ARRAYAGG(`player_id`) FROM `player`
		$ids = [
            84056525,
            7350337,
		];
                // You can also get the ids automatically with $ids = array_map(fn($dbPlayer) => intval($dbPlayer['player_id']), array_values($this->getCollectionFromDb('select player_id from player order by player_no')));

		// Id of the first player in BGA Studio
		$sid = 2383524;
		
        $tables = ['bottomless_card', 
            'premium_ingredient',
            'distillery_upgrade',
            'distiller',
            'distillery_goal',
            'drink',
            'flavor',
            'label',
            'market_purchase',
            'player',
            'premium_ingredient',
            'premium_item',
            'recipe',
            'spirit_award'];
		foreach ($ids as $id) {
			// basic tables
			self::DbQuery("UPDATE player SET player_id=$sid WHERE player_id = $id" );
			self::DbQuery("UPDATE global SET global_value=$sid WHERE global_value = $id" );
			self::DbQuery("UPDATE stats SET stats_player_id=$sid WHERE stats_player_id = $id" );

            foreach ($tables as $table) {

                // 'other' game specific tables. example:
                // tables specific to your schema that use player_ids
                self::DbQuery("UPDATE $table SET player_id=$sid WHERE player_id = $id" );
            }
			
			++$sid;
		}
	}
    public function loadBugReportHelp() {
        $this->loadBugReportSQL(125469, [2383524, 2383525]);
    }
    public function loadBugReportSQL(int $reportId, array $studioPlayersIds): void {
      $players = $this->getObjectListFromDb('SELECT player_id FROM player', true);
  
      // Change for your game
      // We are setting the current state to match the start of a player's turn if it's already game over
      $sql = ['UPDATE global SET global_value=10 WHERE global_id=1 AND global_value=99'];
      $map = [];
      foreach ($players as $index => $pId) {
        $studioPlayer = $studioPlayersIds[$index];
  
        // All games can keep this SQL
        $sql[] = "UPDATE player SET player_id=$studioPlayer WHERE player_id=$pId";
        $sql[] = "UPDATE global SET global_value=$studioPlayer WHERE global_value=$pId";
        $sql[] = "UPDATE stats SET stats_player_id=$studioPlayer WHERE stats_player_id=$pId";
  
        // Add game-specific SQL update the tables for your game
        //$sql[] = "UPDATE card SET card_location_arg=$studioPlayer WHERE card_location_arg = $pId";
        //$sql[] = "UPDATE global_variables SET `value` = REPLACE(`value`,'$pId','$studioPlayer')";
        $tables = ['premium_ingredient', 'premium_item', 'label', 'distillery_upgrade', 'flavor', 'drink',
            'bottomless_card', 'spirit_award'];
        foreach ($tables as $t) {
            $sql[] = "UPDATE $t SET `location` = REPLACE(`location`,'$pId','$studioPlayer')";
        }
        $tables = array_merge($tables, ['recipe', 'market_purchase', 'distillery_goal', 'distiller']);
        foreach ($tables as $t) {
            $sql[] = "UPDATE $t SET `player_id` = REPLACE(`player_id`,'$pId','$studioPlayer')";
        }
      }
  
      foreach ($sql as $q) {
        $this->DbQuery($q);
      }
  
      $this->reloadPlayersBasicInfos();
    }
}
