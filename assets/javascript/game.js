//Global variable
$(document).ready(function() {

    //audio clips
    let audio = new Audio('assets/audio/imperial_march.mp3');
    let force = new Audio('assets/audio/force.mp3');
    let blaster = new Audio('assets/audio/blaster-firing.mp3');
    let jediKnow = new Audio('assets/audio/jedi-know.mp3');
    let lightsaber = new Audio('assets/audio/light-saber-on.mp3');
    let rtwoo = new Audio('assets/audio/R2D2.mp3');
    
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
    
    var currSelectedCharacter;
    var currDefender;
    var combatants = [];
    var indexofSelChar;
    var attackResult;
    var turnCounter = 1;
    var killCount = 0;
    
    
    var renderOne = function(character, renderArea, makeChar) {
        
        var charDiv = $("<div class='character' data-name='" + character.name + "'>");
        var charName = $("<div class='character-name'>").text(character.name);
        var charImage = $("<img alt='image' class='character-image'>").attr("src", character.imageUrl);
        var charHealth = $("<div class='character-health'>").text(character.health);
        charDiv.append(charName).append(charImage).append(charHealth);
        $(renderArea).append(charDiv);
       
        if (makeChar == 'enemy') {
          $(charDiv).addClass('enemy');
        } else if (makeChar == 'defender') {
          currDefender = character;
          $(charDiv).addClass('target-enemy');
        }
      };
    
      
      var renderMessage = function(message) {
        var gameMesageSet = $("#gameMessage");
        var newMessage = $("<div>").text(message);
        gameMesageSet.append(newMessage);
    
        if (message == 'clearMessage') {
          gameMesageSet.text('');
        }
      };
    
      var renderCharacters = function(charObj, areaRender) {
       
        if (areaRender == '#characters-section') {
          $(areaRender).empty();
          for (var key in charObj) {
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
          for (var i = 0; i < charObj.length; i++) {
    
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
        
        if (areaRender == '#defender') {
          $(areaRender).empty();
          for (var i = 0; i < combatants.length; i++) {
            //add enemy to defender area
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
          lightsaber.play();
        }
        
        if (areaRender == 'enemyDamage') {
          $('#selected-character').empty();
          renderOne(charObj, '#selected-character', '');
        }
       
        if (areaRender == 'enemyDefeated') {
          $('#defender').empty();
          var gameStateMessage = "You have defated " + charObj.name + ", you can choose to fight another enemy.";
          renderMessage(gameStateMessage);
          blaster.play();
        }
      };
      
      renderCharacters(characters, '#characters-section');
      $(document).on('click', '.character', function() {
        name = $(this).data('name');
        
        if (!currSelectedCharacter) {
          currSelectedCharacter = characters[name];
          for (var key in characters) {
            if (key != name) {
              combatants.push(characters[key]);
            }
          }
          $("#characters-section").hide();
          renderCharacters(currSelectedCharacter, '#selected-character');
          
          renderCharacters(combatants, '#available-to-attack-section');
        }
      });
    
      // ----------------------------------------------------------------
      // Create functions to enable actions between objects.
      $("#attack-button").on("click", function() {
        
        if ($('#defender').children().length !== 0) {
          
          var attackMessage = "You attacked " + currDefender.name + " for " + (currSelectedCharacter.attack * turnCounter) + " damage.";
          renderMessage("clearMessage");
          
          currDefender.health = currDefender.health - (currSelectedCharacter.attack * turnCounter);
    
          
          if (currDefender.health > 0) {
            
            renderCharacters(currDefender, 'playerDamage');
            
            var counterAttackMessage = currDefender.name + " attacked you back for " + currDefender.enemyAttackBack + " damage.";
            renderMessage(attackMessage);
            renderMessage(counterAttackMessage);
    
            currSelectedCharacter.health = currSelectedCharacter.health - currDefender.enemyAttackBack;
            renderCharacters(currSelectedCharacter, 'enemyDamage');
            if (currSelectedCharacter.health <= 0) {
              renderMessage("clearMessage");
              restartGame("You have been defeated...GAME OVER!!!");
              force.play();
              $("#attack-button").unbind("click");
            }
          } else {
            renderCharacters(currDefender, 'enemyDefeated');
            killCount++;
            if (killCount >= 3) {
              renderMessage("clearMessage");
              restartGame("You Won!!!! GAME OVER!!!");
              jediKnow.play();
              
              setTimeout(function() {
              audio.play();
              }, 2000);
    
            }
          }
          turnCounter++;
        } else {
          renderMessage("clearMessage");
          renderMessage("No enemy here.");
          rtwoo.play();
        }
      });
    
    
      var restartGame = function(inputEndGame) {
        
        var restart = $('<button class="btn">Restart</button>').click(function() {
          location.reload();
        });
        var gameState = $("<div>").text(inputEndGame);
        $("#gameMessage").append(gameState);
        $("#gameMessage").append(restart);
      };
    
    });
