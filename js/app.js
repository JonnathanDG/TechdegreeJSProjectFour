!function () {

    //JS only runs when the DOM is fully loaded
    document.addEventListener('DOMContentLoaded', () => {

        //Elements to manipulate
        const $startScreen = $('#start');
        const $boardScreen = $('#board');
        const $gameFinished = $('#finish');
        const $startButton = $(".button:contains('Start game')");
        const $startAnotherGame = $(".button:contains('New game')");
        let $finishMessage = $('.message');

        // Players
        const $playerOne = $('#player1');
        const $playerTwo = $('#player2');

        //Select Boxes element (ul)
        const $ulBoxes = $('.boxes');

        //Get boxes items
        const $boxes = $ulBoxes.children();

        //Holds the active player
        let $activePlayer;

        // Tie flag
        let wasATie = false;

        //Winning pattern
        const winningPattern = [
            //Horizontal
            [$boxes[0], $boxes[1], $boxes[2]],
            [$boxes[3], $boxes[4], $boxes[5]],
            [$boxes[6], $boxes[7], $boxes[8]],
            
            //Vertical
            [$boxes[0], $boxes[3], $boxes[6]],
            [$boxes[1], $boxes[4], $boxes[7]],
            [$boxes[2], $boxes[5], $boxes[8]],

            //crossed lined
            [$boxes[0], $boxes[4], $boxes[8]],
            [$boxes[2], $boxes[4], $boxes[6]]
            ];

        //Hold players selections
        let playerOneSelections = [];
        let playerTwoSelections = []; 

        let username = "";
        
        ///////////////////////////////////////////////////////////////////////////////////
        //Functions

        //Perform the steps needed in a player turn
        function playerTurn(event){

            //Determines if the event come from a box
            if(event.target.className === "box"){

                //Adds the proper class for the user selection
                if($playerOne.hasClass('active')){

                    //$activePlayer = $playerOne;

                    //Because the event target is a box 
                    event.target.classList.add("box-filled-1");
                    event.target.classList.add("disabled");

                    //adds the user selection
                    console.log(event.target);
                    playerOneSelections.push(event.target);

                    //Checks if the user has a winner pattern
                    if(lookForWinner(playerOneSelections, winningPattern)){
                        
                        gameOver($playerOne);

                    } else {

                        //If the player one has 5 selections and has not win yet
                        // (only way to get into this block)
                        // means all the boxes has been selected and then there is no winner
                        if(playerOneSelections.length == 5){
                            
                            isATie();

                        } else {

                            //Removes the player one as active
                            $playerOne.removeClass('active');
                            $playerTwo.addClass('active');
                            $activePlayer = $playerTwo;

                        }
                    }
                } else {
                    
                    // Further improvement required to let user to chose between playing alone
                    // or with a friend

                    
                    //Because the event target is a box 
                    event.target.classList.add("box-filled-2");
                    event.target.classList.add("disabled");

                    //adds the user two selection
                    playerTwoSelections.push(event.target);

                    //Checks if the user has a winner pattern
                    if(lookForWinner(playerTwoSelections, winningPattern)){
                        
                        gameOver($playerTwo);

                    } else {

                        //If the player one has 5 selections and has not win yet
                        // (only way to get into this block)
                        // means all the boxes has been selected and then there is no winner
                        if(playerOneSelections.length == 5){
                            
                            isATie();

                        } else {

                            //Removes the player one as active
                            $playerTwo.removeClass('active');
                            $playerOne.addClass('active');
                            $activePlayer = $playerOne;

                        }
                    }
                      
                }
            }
        }

        //Controls the computer when there is only one user
        /*function computer(){
            
            do{
                // gets random index number
                computerSelection = Math.floor(Math.random() * 9);

                //if the li is not disabled and filled we can pick it
                if( !($boxes.eq(computerSelection).hasClass("disabled")) ){

                    //Because the event target is a box 
                    $boxes.eq(computerSelection).addClass("box-filled-2");
                    $boxes.eq(computerSelection).addClass("disabled");
                }

                //adds the user selection
                playerTwoSelections.push($boxes.eq(computerSelection)[0]);

                //This blocks only runs if player two wins (computer)
                if(lookForWinner(playerTwoSelections, winningPattern)){

                    //Game over
                    gameOver($playerTwo);

                } else {

                    //Removes the player two as active
                    $playerTwo.removeClass('active');
                    $playerOne.addClass('active');
                    //Switchs the active player
                    $activePlayer = $playerOne;
                }
            
            //This only happens while the active player is equal to player Two (The computer)
            } while( $activePlayer == $playerTwo);
        }*/

        //Checks if the player selections are part 
        //of a winning pattern
        function lookForWinner(playerSelections, winningPattern){

            // Winner flag
            let isWinner = false;
            
            //Goes over every array inside winning pattern array
            for(let i = 0; i < winningPattern.length; i++){

                // For every combination on the winning pattern 
                // we check if player selection matched the combination
                if (winningPattern[i].every(combination => playerSelections.indexOf(combination) != -1)){
                    
                    // Player is a winner
                    isWinner = true;
                }
            }
            return isWinner;
        } 

        // Determines the proper screen after the game ends
        function gameOver(player){

            if(player == $playerOne){

                $gameFinished.addClass('screen-win-one');

            } else {

                $gameFinished.addClass('screen-win-two');
            }

            //Waits .2 seconds before doing the changes
            setTimeout(() => {

                $boardScreen.hide();

                // Winner message when are two players 
                $finishMessage.text('Winner'); 
                // Further improvement required to let user to chose between playing alone
                // or with a friend

                $gameFinished.show();
                
            }, 200);
        }

        // Sets the Message and displays the proper screen
        // When a Tie comes to the table
        function isATie(){
            
            $boardScreen.hide();
            $finishMessage.text("It's a Tie!");
            $gameFinished.addClass('screen-win-tie').show();

            // Flag turns to true
            wasATie = true;
        }

        //Hide game board screen and game finished screen
        $boardScreen.hide();
        $gameFinished.hide();

        

        /*do{
            //Gets the player name 
            username = prompt('Enter your name');

        } while(username == "");

        //Appends username 
        $('#player1').append('<h3>' + username + '</h3>');*/


        // When user starts the game...
        $startButton.on('click', () => {

            //Hides the start screen
            $startScreen.hide();

            //Displays the board screen
            $boardScreen.show();

            //Sets player one
            $playerOne.addClass('active');

            $activePlayer = $playerOne;
        });

        //When the user clicks the boxes ...
        $ulBoxes.on('click', (event) => {

            //Perform all the operations
            playerTurn(event);

            // The computer is only called if player one has not won and there is no a tie
            /*if(!lookForWinner(playerOneSelections, winningPattern) && !wasATie){

                computer();
            }*/
            
        });

        //When the mouse is over the boxes an image is displayed
        // according to the player turn
        $ulBoxes.on('mouseover', (event) => {

            if( !($(event.target).hasClass('disabled')) ){
                
                if($activePlayer == $playerOne){

                    //Displays a circle
                    event.target.style.backgroundImage = 'url("./img/o.svg")';

                } else {

                    // Displays an X
                    event.target.style.backgroundImage = 'url("./img/x.svg")';
                }
            }   
        });

        //Removes the backgoruns img
        $boxes.on('mouseleave', (event) => {

            event.target.style.backgroundImage = "";
        });

        //Reloads the page
        $startAnotherGame.on('click', () => {

            location.reload(true);
        });        
    });
} ();