 // Get DOM elements
 const userScore_span = document.getElementById("user-score");
 const computerScore_span = document.getElementById("computer-score");
 const result_div = document.getElementById("result");
 const playerDisplay_div = document.getElementById("player-display");
 const computerDisplay_div = document.getElementById("computer-display");
 const message_p = document.getElementById("message");
 const choices = document.querySelectorAll(".choice");
 const resetButton = document.getElementById("reset-button");
 const historyItems_div = document.getElementById("history-items");
 const gameContainer_div = document.querySelector(".game-container");
 const streakIndicator_div = document.getElementById("streak-indicator");
 const body = document.querySelector("body");
 const playerProgress_div = document.getElementById("player-progress");
 const computerProgress_div = document.getElementById("computer-progress");
 const matchWinner_div = document.getElementById("match-winner");
 const winnerTitle_h2 = document.getElementById("winner-title");
 const winnerText_p = document.getElementById("winner-text");
 const newMatchBtn = document.getElementById("new-match-btn");
 
 // Game variables
 let userScore = 0;
 let computerScore = 0;
 let roundCount = 0;
 let currentStreak = 0;
 let gameInProgress = false;
 let matchInProgress = true;
 let choiceOptions = ["stone", "paper", "scissors"];
 const winGoal = 3; // First to score 3 wins
 
 // Emojis for choices
 const emojis = {
     stone: "✊",
     paper: "✋",
     scissors: "✌️"
 };
 
 // Sound effects
 let winSound, loseSound, drawSound, clickSound;
 
 // Initialize sounds
 function initSounds() {
     winSound = new Audio("https://cdnjs.cloudflare.com/ajax/libs/sound-effects/1.0.1/success.mp3");
     loseSound = new Audio("https://cdnjs.cloudflare.com/ajax/libs/sound-effects/1.0.1/fail.mp3");
     drawSound = new Audio("https://cdnjs.cloudflare.com/ajax/libs/sound-effects/1.0.1/neutral.mp3");
     clickSound = new Audio("https://cdnjs.cloudflare.com/ajax/libs/sound-effects/1.0.1/click.mp3");
     
     // Set volume
     [winSound, loseSound, drawSound, clickSound].forEach(sound => {
         sound.volume = 0.5;
     });
 }
 
 // Try to initialize sounds (will fail silently if CDN doesn't have these specific sounds)
 try {
     initSounds();
 } catch (e) {
     console.log("Sound initialization failed:", e);
 }
 
 // Main functions
 function getComputerChoice() {
     const randomNumber = Math.floor(Math.random() * 3);
     return choiceOptions[randomNumber];
 }
 
 function convertToWord(choice) {
     return choice.charAt(0).toUpperCase() + choice.slice(1);
 }
 
 function playSound(result) {
     try {
         if (result === "win") winSound.play();
         else if (result === "lose") loseSound.play();
         else drawSound.play();
     } catch (e) {
         console.log("Sound playback failed:", e);
     }
 }
 
 function createConfetti() {
     const confettiCount = 100;
     const colors = ['#f94144', '#f3722c', '#f8961e', '#f9c74f', '#90be6d', '#43aa8b', '#577590'];
     
     for (let i = 0; i < confettiCount; i++) {
         const confetti = document.createElement('div');
         confetti.className = 'confetti';
         
         // Random position
         const left = Math.random() * 100;
         const top = Math.random() * -10;
         
         // Random color
         const color = colors[Math.floor(Math.random() * colors.length)];
         
         // Random size
         const size = Math.random() * 10 + 5;
         
         // Apply styles
         confetti.style.left = left + 'vw';
         confetti.style.top = top + 'vh';
         confetti.style.backgroundColor = color;
         confetti.style.width = size + 'px';
         confetti.style.height = size + 'px';
         
         // Set animation
         confetti.style.position = 'fixed';
         confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear`;
         
         document.body.appendChild(confetti);
         
         // Remove after animation is done
         setTimeout(() => {
             confetti.remove();
         }, 5000);
     }
 }
 
 // Add a style for the falling animation
 const styleSheet = document.createElement('style');
 styleSheet.textContent = `
 @keyframes fall {
     0% { transform: translateY(0) rotate(0deg); }
     100% { transform: translateY(100vh) rotate(360deg); }
 }`;
 document.head.appendChild(styleSheet);
 
 function updateStreak(result) {
     if (result === "win") {
         currentStreak = currentStreak > 0 ? currentStreak + 1 : 1;
     } else if (result === "lose") {
         currentStreak = currentStreak < 0 ? currentStreak - 1 : -1;
     } else {
         currentStreak = 0;
     }
     
     // Display streak if it's 3 or more (or -3 or less)
     if (Math.abs(currentStreak) >= 3) {
         streakIndicator_div.textContent = currentStreak > 0 
             ? `${currentStreak} Win Streak! 🔥` 
             : `${Math.abs(currentStreak)} Loss Streak 😢`;
         streakIndicator_div.classList.add("show");
     } else {
         streakIndicator_div.classList.remove("show");
     }
     
     // Create confetti for 5+ win streak
     if (currentStreak >= 5 && result === "win") {
         createConfetti();
     }
 }
 
 function updateProgressBars() {
     // Update progress bars based on the score
     playerProgress_div.style.width = `${(userScore / winGoal) * 100}%`;
     computerProgress_div.style.width = `${(computerScore / winGoal) * 100}%`;
 }
 
 function checkWinner() {
     if (userScore >= winGoal || computerScore >= winGoal) {
         const isPlayerWinner = userScore >= winGoal;
         
         // Show winner message
         /*winnerTitle_h2.textContent = isPlayerWinner ? "You Win the Match! 🏆" : "Computer Wins the Match! 🤖";
         winnerText_p.textContent = isPlayerWinner ? 
             `Congratulations! You won ${userScore}-${computerScore}!` : 
             `Computer won ${computerScore}-${userScore}. Better luck next time!`;*/

             winnerTitle_h2.textContent = isPlayerWinner ? "～♡Happy Birthday♡～" : "～♡Happy Birthday♡～";
         winnerText_p.textContent = isPlayerWinner ? `Preet🌘` : `Preet🌘`;
         
         // Show confetti if player wins
         if (isPlayerWinner) {
             createConfetti();
         }
         
         // Play appropriate sound
         playSound(isPlayerWinner ? "win" : "lose");
         
         // Show winner overlay
         setTimeout(() => {
             matchWinner_div.classList.add("show");
             matchInProgress = false;
         }, 1000);
     }
 }
 
 function win(userChoice, computerChoice) {
     userScore++;
     userScore_span.textContent = userScore;
     userScore_span.classList.add("highlight");
     setTimeout(() => userScore_span.classList.remove("highlight"), 500);
     
     result_div.textContent = `${convertToWord(userChoice)} beats ${convertToWord(computerChoice)}. You win! 🔥`;
     result_div.classList.add("fade-in");
     
     addToHistory(userChoice, computerChoice, "win");
     playSound("win");
     
     // Change background color briefly
     body.classList.add("win-bg");
     setTimeout(() => body.classList.remove("win-bg"), 1000);
     
     // Update streak
     updateStreak("win");
     
     // Update progress bars
     updateProgressBars();
     
     // Show message based on progress
     if (userScore === winGoal - 1) {
         message_p.textContent = "Match point! One more to win!";
     } else if (userScore < winGoal) {
         message_p.textContent = `Score ${userScore} more to win!`;
     }
     
     // Check for match winner
     checkWinner();
 }
 
 function lose(userChoice, computerChoice) {
     computerScore++;
     computerScore_span.textContent = computerScore;
     computerScore_span.classList.add("highlight");
     setTimeout(() => computerScore_span.classList.remove("highlight"), 500);
     
     result_div.textContent = `${convertToWord(computerChoice)} beats ${convertToWord(userChoice)}. You lose... 💧`;
     result_div.classList.add("fade-in");
     
     addToHistory(userChoice, computerChoice, "lose");
     playSound("lose");
     
     // Change background color briefly
     body.classList.add("lose-bg");
     setTimeout(() => body.classList.remove("lose-bg"), 1000);
     
     // Update streak
     updateStreak("lose");
     
     // Update progress bars
     updateProgressBars();
     
     // Show message based on progress
     if (computerScore === winGoal - 1) {
         message_p.textContent = "Watch out! Computer is at match point!";
     } else if (computerScore < winGoal) {
         message_p.textContent = `Don't give up! Computer needs ${winGoal - computerScore} more.`;
     }
     
     // Check for match winner
     checkWinner();
 }
 
 function draw(userChoice, computerChoice) {
     result_div.textContent = `Both chose ${convertToWord(userChoice)}. It's a draw! 🤝`;
     result_div.classList.add("fade-in");
     
     addToHistory(userChoice, computerChoice, "draw");
     playSound("draw");
     
     // Change background color briefly
     body.classList.add("draw-bg");
     setTimeout(() => body.classList.remove("draw-bg"), 1000);
     
     // Update streak
     updateStreak("draw");
     
     message_p.textContent = "Great minds think alike!";
 }
 
 function addToHistory(userChoice, computerChoice, result) {
     roundCount++;
     
     const historyItem = document.createElement("div");
     historyItem.classList.add("history-item", result);
     
     const emoji = result === "win" ? "✅" : (result === "lose" ? "❌" : "➖");
     
     historyItem.innerHTML = `
         <span class="history-round">#${roundCount}</span>
         <span>${emojis[userChoice]}</span>
         <span>${emojis[computerChoice]}</span>
         <span>${emoji}</span>
     `;
     
     historyItems_div.prepend(historyItem);
     
     // Apply animation with delay
     setTimeout(() => {
         historyItem.style.animation = "slideIn 0.3s forwards";
     }, 50);
 }
 
 function showChoices(userChoice, computerChoice) {
     // Clear previous displays
     playerDisplay_div.innerHTML = emojis[userChoice];
     playerDisplay_div.appendChild(document.createElement("div")).className = "player-label";
     playerDisplay_div.lastChild.textContent = "You";
     
     computerDisplay_div.innerHTML = emojis[computerChoice];
     computerDisplay_div.appendChild(document.createElement("div")).className = "computer-label";
     computerDisplay_div.lastChild.textContent = "Computer";
     
     // Animate choices appearing
     setTimeout(() => {
         playerDisplay_div.classList.add("show");
         setTimeout(() => {
             computerDisplay_div.classList.add("show");
         }, 300);
     }, 300);
 }
 
 function game(userChoice) {
     if (gameInProgress || !matchInProgress) return;
     gameInProgress = true;
     
     try {
         clickSound.play();
     } catch (e) {}
     
     // Clear previous animations
     result_div.classList.remove("fade-in");
     playerDisplay_div.classList.remove("show");
     computerDisplay_div.classList.remove("show");
     
     // Highlight selected choice
     const selectedButton = document.getElementById(userChoice);
     selectedButton.classList.add("selected");
     setTimeout(() => selectedButton.classList.remove("selected"), 700);
     
     // Reset results text during animation
     result_div.textContent = "...";
     message_p.textContent = "Thinking...";
     
     // Computer makes choice with slight delay for suspense
     setTimeout(() => {
         const computerChoice = getComputerChoice();
         
         // Show the choices in the battle area
         showChoices(userChoice, computerChoice);
         
         // Determine winner after showing choices
         setTimeout(() => {
             // Remove previous animation class
             result_div.classList.remove("fade-in");
             
             // Force reflow to restart animation
             void result_div.offsetWidth;
             
             // Add animation class back
             result_div.classList.add("fade-in");
             
             // Animate container
             gameContainer_div.classList.add("animate");
             setTimeout(() => gameContainer_div.classList.remove("animate"), 600);
             
             // Determine winner
             switch (userChoice + computerChoice) {
                 case "stonescissors":
                 case "paperstone":
                 case "scissorspaper":
                     win(userChoice, computerChoice);
                     break;
                 case "stonepaper":
                 case "paperscissors":
                 case "scissorsstone":
                     lose(userChoice, computerChoice);
                     break;
                 default:
                     draw(userChoice, computerChoice);
                     break;
             }
             
             gameInProgress = false;
         }, 1000);
     }, 500);
 }
 
 function resetGame() {
     // Play click sound
     try {
         clickSound.play();
     } catch (e) {}
     
     // Reset scores and counters
     userScore = 0;
     computerScore = 0;
     roundCount = 0;
     currentStreak = 0;
     matchInProgress = true;
     
     // Update display
     userScore_span.textContent = userScore;
     computerScore_span.textContent = computerScore;
     result_div.textContent = "Choose your weapon!";
     message_p.textContent = "First to score 3 wins the match!";
     streakIndicator_div.classList.remove("show");
     
     // Reset progress bars
     playerProgress_div.style.width = "0%";
     computerProgress_div.style.width = "0%";
     
     // Clear choice displays
     playerDisplay_div.classList.remove("show");
     computerDisplay_div.classList.remove("show");
     
     // Clear history
     historyItems_div.innerHTML = "";
     
     // Reset background
     body.className = "";
     
     // Close winner modal if open
     matchWinner_div.classList.remove("show");
     
     // Animate container
     gameContainer_div.classList.add("animate");
     setTimeout(() => gameContainer_div.classList.remove("animate"), 600);
 }
 
 function startNewMatch() {
     resetGame();
 }
 
 // Event listeners
 choices.forEach(choice => {
     choice.addEventListener("click", function() {
         const userChoice = this.getAttribute("data-choice");
         game(userChoice);
     });
 });
 
 resetButton.addEventListener("click", resetGame);
 newMatchBtn.addEventListener("click", startNewMatch);
 
 // Add keyboard support
 document.addEventListener("keydown", function(e) {
     if (gameInProgress) return;
     
     // Don't process keyboard if match winner is showing
     if (!matchInProgress && e.key.toLowerCase() !== "enter") return;
     
     switch(e.key.toLowerCase()) {
         case "r":
         case "1":
             game("stone");
             document.getElementById("stone").classList.add("selected");
             setTimeout(() => document.getElementById("stone").classList.remove("selected"), 700);
             break;
         case "p":
         case "2":
             game("paper");
             document.getElementById("paper").classList.add("selected");
             setTimeout(() => document.getElementById("paper").classList.remove("selected"), 700);
             break;
         case "s":
         case "3":
             game("scissors");
             document.getElementById("scissors").classList.add("selected");
             setTimeout(() => document.getElementById("scissors").classList.remove("selected"), 700);
             break;
         case "0":
         case "escape":
             resetGame();
             break;
         case "enter":
             // Start new match if winner is showing
             if (!matchInProgress) {
                 startNewMatch();
             }
             break;
     }
 });
 
 // Initialize message
 message_p.textContent = "First to score 3 wins the match!";