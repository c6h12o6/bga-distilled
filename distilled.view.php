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
 * distilled.view.php
 *
 * This is your "view" file.
 *
 * The method "build_page" below is called each time the game interface is displayed to a player, ie:
 * _ when the game starts
 * _ when a player refreshes the game page (F5)
 *
 * "build_page" method allows you to dynamically modify the HTML generated for the game interface. In
 * particular, you can set here the values of variables elements defined in distilled_distilled.tpl (elements
 * like {MY_VARIABLE_ELEMENT}), and insert HTML block elements (also defined in your HTML template file)
 *
 * Note: if the HTML of your game interface is always the same, you don't have to place anything here.
 *
 */
  
require_once( APP_BASE_PATH."view/common/game.view.php" );
  
class view_distilled_distilled extends game_view
{
    protected function getGameName()
    {
        // Used for translations and stuff. Please do not modify.
        return "distilled";
    }
    
  	function build_page( $viewArgs )
  	{		
  	    // Get players & players number
        $players = $this->game->loadPlayersBasicInfos();
        $players_nbr = count( $players );

        /*********** Place your code below:  ************/


        $basic_market_cards = array(
            "distilled_yeast",
            "distilled_water",
            "distilled_mixed_grains",
            "distilled_mixed_plants",
            "distilled_mixed_fruits",
            "distilled_clay_barrel",
            "distilled_wood_barrel"
        );

        $flight = array(
            array('name' => 'Cachaca',
                  'sp' => 4,
                  'grain' => 0,
                  'plant' => 1,
                  'fruit' => 0,
                  'aged' => false,
                  'barrel' => Barrel::METAL,
                  'cube' => Cube::BRONZE,
                  'region' => _('Americas')),
            array('name' => 'Soju',
                  'sp' => 5,
                  'grain' => 2,
                  'plant' => 0,
                  'fruit' => 0,
                  'aged' => false,
                  'barrel' => Barrel::METAL,
                  'cube' => Cube::BRONZE,
                  'region' => _('Asia')),
            array('name' => 'Gin',
                  'sp' => 7,
                  'grain' => 0,
                  'plant' => 0,
                  'fruit' => 2,
                  'aged' => false,
                  'barrel' => Barrel::METAL,
                  'cube' => Cube::SILVER,
                  'region' => _('Asia')),
            array('name' => 'Whiskey',
                  'sp' => 10,
                  'grain' => 2,
                  'plant' => 0,
                  'fruit' => 0,
                  'aged' => true,
                  'barrel' => Barrel::WOOD,
                  'cube' => Cube::SILVER,
                  'region' => _('Distiller\'s')),
            array('name' => 'Rum',
                  'sp' => 11,
                  'grain' => 0,
                  'plant' => 2,
                  'fruit' => 0,
                  'aged' => true,
                  'barrel' => Barrel::WOOD,
                  'cube' => Cube::SILVER,
                  'region' => _('Americas')),
            array('name' => 'Baijiu',
                  'sp' => 12,
                  'grain' => 3,
                  'plant' => 0,
                  'fruit' => 0,
                  'aged' => true,
                  'barrel' => Barrel::CLAY,
                  'cube' => Cube::GOLD,
                  'region' => _('Asia')),
            array('name' => 'Brandy',
                  'sp' => 13,
                  'grain' => 0,
                  'plant' => 0,
                  'fruit' => 2,
                  'aged' => true,
                  'barrel' => Barrel::CLAY,
                  'cube' => Cube::GOLD,
                  'region' => _('Asia'))
        );
        
        /*
        $this->page->begin_block( "distilled_distilled", "basicMarket" );
        foreach ($basic_market_cards as $card) {
            $this->page->insert_block("basicMarket", array('CARD_NAME' => $card));
        }*/

        $increment = 54;
        $this->page->begin_block( "distilled_distilled", "recipeCubes" );
        for($i = 0; $i < 7; $i++) {
            $this->page->insert_block("recipeCubes", array(
                'CUBE_SLOT' => $i,
                'TOP' => 244 + $increment * $i,
                'LEFT' => 20,
                'TITLE' => $flight[$i]["name"]
            ));
        }



        /*
        
        // Examples: set the value of some element defined in your tpl file like this: {MY_VARIABLE_ELEMENT}

        // Display a specific number / string
        $this->tpl['MY_VARIABLE_ELEMENT'] = $number_to_display;

        // Display a string to be translated in all languages: 
        $this->tpl['MY_VARIABLE_ELEMENT'] = self::_("A string to be translated");

        // Display some HTML content of your own:
        $this->tpl['MY_VARIABLE_ELEMENT'] = self::raw( $some_html_code );
        
        */
        
        /*
        
        // Example: display a specific HTML block for each player in this game.
        // (note: the block is defined in your .tpl file like this:
        //      <!-- BEGIN myblock --> 
        //          ... my HTML code ...
        //      <!-- END myblock --> 
        

        $this->page->begin_block( "distilled_distilled", "myblock" );
        foreach( $players as $player )
        {
            $this->page->insert_block( "myblock", array( 
                                                    "PLAYER_NAME" => $player['player_name'],
                                                    "SOME_VARIABLE" => $some_value
                                                    ...
                                                     ) );
        }
        
        */



        /*********** Do not change anything below this line  ************/
  	}
}
