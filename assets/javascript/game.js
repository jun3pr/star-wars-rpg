//Global variables
$(document).ready(function() {

   
    
    //Array of Playable Characters
    let characters = {
        'rey': {
            name: 'rey',
            health: 120,
            attack: 8,
            imageUrl: "assets/images/rey.png",
            enemyAttackBack: 15
        }, 
        'darth': {
            name: 'darth',
            health: 100,
            attack: 14,
            imageUrl: "assets/images/darthVader.png",
            enemyAttackBack: 5
        }, 
        'finn': {
            name: 'finn',
            health: 150,
            attack: 8,
            imageUrl: "assets/images/finn.png",
            enemyAttackBack: 20
        }, 
        'stormtrooper': {
            name: 'stormtrooper',
            health: 180,
            attack: 7,
            imageUrl: "assets/images/trooper.png",
            enemyAttackBack: 20
        }
    };
    
    let currSelectedCharacter;
    let currDefender;
    let combatants = [];
    let indexofSelChar;
    let attackResult;
    let turnCounter = 1;
    let killCount = 0;
    
    
    let renderOne = function(character, renderArea, makeChar) {
        
        let charDiv = $("<div class='character' data-name='" + character.name + "'>");
        let charName = $("<div class='character-name'>").text(character.name);
        let charImage = $("<img alt='image' class='character-image'>").attr("src", character.imageUrl);
        let charHealth = $("<div class='character-health'>").text(character.health);
        charDiv.append(charName).append(charImage).append(charHealth);
        $(renderArea).append(charDiv);
     
        if (makeChar == 'enemy') {
          $(charDiv).addClass('enemy');
        } else if (makeChar == 'defender') {
          currDefender = character;
          $(charDiv).addClass('target-enemy');
        }
      };
    
      // Create function to render game message to DOM
      let renderMessage = function(message) {
        let gameMesageSet = $("#gameMessage");
        let newMessage = $("<div>").text(message);
        gameMesageSet.append(newMessage);
    
        if (message == 'clearMessage') {
          gameMesageSet.text('');
        }
      };
    
      let renderCharacters = function(charObj, areaRender) {
        //render all characters
        if (areaRender == '#characters-section') {
          $(areaRender).empty();
          for (let key in charObj) {
            if (charObj.hasOwnProperty(key)) {
              renderOne(charObj[key], areaRender, '');
            }
          }
        }
       
        if (areaRender == '#selected-character') {
          $('#selected-character').prepend("Your Character");       
          renderOne(charObj, areaRender, '');
          $('#attack-button').css('visibility', 'visible');
        }
        
        if (areaRender == '#available-to-attack-section') {
            $('#available-to-attack-section').prepend("Choose Your Next Opponent");      
          for (let i = 0; i < charObj.length; i++) {
    
            renderOne(charObj[i], areaRender, 'enemy');
          }
          
          $(document).on('click', '.enemy', function() {
            
            name = ($(this).data('name'));
           
            if ($('#defender').children().length === 0) {
              renderCharacters(name, '#defender');
              $(this).hide();
              renderMessage("clearMessage");
            }
          });
        }
        //render defender
        if (areaRender == '#defender') {
          $(areaRender).empty();
          for (let i = 0; i < combatants.length; i++) {
            
            if (combatants[i].name == charObj) {
              $('#defender').append("Your selected opponent")
              renderOne(combatants[i], areaRender, 'defender');
            }
          }
        }
        
        if (areaRender == 'playerDamage') {
          $('#defender').empty();
          $('#defender').append("Your selected opponent")
          renderOne(charObj, '#defender', 'defender');
          
        }
        
        if (areaRender == 'enemyDamage') {
          $('#selected-character').empty();
          renderOne(charObj, '#selected-character', '');
        }
        
        if (areaRender == 'enemyDefeated') {
          $('#defender').empty();
          let gameStateMessage = "You have defated " + charObj.name + ", you can choose to fight another enemy.";
          renderMessage(gameStateMessage);
         
        }
      };
      //this is to render all characters for user to choose their computer
      renderCharacters(characters, '#characters-section');
      $(document).on('click', '.character', function() {
        name = $(this).data('name');
        
        if (!currSelectedCharacter) {
          currSelectedCharacter = characters[name];
          for (let key in characters) {
            if (key != name) {
              combatants.push(characters[key]);
            }
          }
          $("#characters-section").hide();
          renderCharacters(currSelectedCharacter, '#selected-character');
          //this is to render all characters for user to choose fight against
          renderCharacters(combatants, '#available-to-attack-section');
        }
      });
    
      // ----------------------------------------------------------------
      // Create functions to enable actions between objects.
      $("#attack-button").on("click", function() {
       
        if ($('#defender').children().length !== 0) {
         
          let attackMessage = "You attacked " + currDefender.name + " for " + (currSelectedCharacter.attack * turnCounter) + " damage.";
          renderMessage("clearMessage");
         
          currDefender.health = currDefender.health - (currSelectedCharacter.attack * turnCounter);
    
          
          if (currDefender.health > 0) {
            
            renderCharacters(currDefender, 'playerDamage');
            
            let counterAttackMessage = currDefender.name + " attacked you back for " + currDefender.enemyAttackBack + " damage.";
            renderMessage(attackMessage);
            renderMessage(counterAttackMessage);
    
            currSelectedCharacter.health = currSelectedCharacter.health - currDefender.enemyAttackBack;
            renderCharacters(currSelectedCharacter, 'enemyDamage');
            if (currSelectedCharacter.health <= 0) {
              renderMessage("clearMessage");
              restartGame("You have been defeated...GAME OVER!!!");
              
              $("#attack-button").unbind("click");
            }
          } else {
            renderCharacters(currDefender, 'enemyDefeated');
            killCount++;
            if (killCount >= 3) {
              renderMessage("clearMessage");
              restartGame("You Won!!!! GAME OVER!!!");
              
              
              setTimeout(function() {
              audio.play();
              }, 2000);
    
            }
          }
          turnCounter++;
        } else {
          renderMessage("clearMessage");
          renderMessage("No enemy here.");
          
        }
      });
    
    //Restarts the game - renders a reset button
      let restartGame = function(inputEndGame) {
        //When 'Restart' button is clicked, reload the page.
        let restart = $('<button class="btn">Restart</button>').click(function() {
          location.reload();
        });
        let gameState = $("<div>").text(inputEndGame);
        $("#gameMessage").append(gameState);
        $("#gameMessage").append(restart);
      };
    
    });