// TODO hér vantar að sækja viðeigandi föll úr öðrum modules
import { show } from './lib/ui.js';
import { computerPlay } from './lib/rock-paper-scissors.js';
import { createButtons } from './lib/ui.js';
import { checkGame } from './lib/rock-paper-scissors.js';
/** Hámarks fjöldi best-of leikja, ætti að vera jákvæð heiltala stærri en 0 */
const MAX_BEST_OF = 10;

/** Fjöldi leikja sem á að spila í núverandi umferð */
let totalRounds;

/** Númer umferðar í núverandi umferð */
let currentRound;

/** Sigrar spilara í núverandi umferð */
let playerWins = 0;

/** Töp spilara í núverandi umferð */
let computerWins = 0;

/**
 * Fjöldi sigra spilara í öllum leikjum. Gætum reiknað útfrá `games` en til
 * einföldunar höldum við utan um sérstaklega.
 */
let totalWins = 0;

/**
 * Utanumhald um alla spilaða leiki, hver leikur er geymdur á forminu:
 *
 * ```
 * {
 *   player: 2,
 *   computer: 1,
 *   win: true,
 * }
 * ```
 */
const games = [];

/**
 * Uppfærir stöðu eftir að spilari hefur spilað.
 * Athugar hvort leik sé lokið, uppfærir stöðu skjá með `updateResultScreen`.
 * Birtir annað hvort `Næsti leikur` takka ef leik er lokið eða `Næsta umferð`
 * ef spila þarf fleiri leiki.
 *
 * @param {number} player Það sem spilari spilaði
 */
function playRound(player) {
  
  const computer = computerPlay().toString();
  // Komumst að því hvað tölva spilaði og athugum stöðu leiks
  const result = checkGame(player, computer);
  // Uppfærum result glugga áður en við sýnum, hér þarf að importa falli
  if (result === 1) {
    playerWins += 1;
  } else if (result === -1) {
    computerWins += 1;
  }
  updateResultScreen({
    player: player.toString(),
    computer,
    result,
    currentRound,
    totalRounds,
    playerWins,
    computerWins,
  });

  // Uppfærum teljara ef ekki jafntefli, verðum að gera eftir að við setjum titil

  if (result != 0){
    currentRound ++;
  }
  
  // Ákveðum hvaða takka skuli sýna

  if (currentRound <= totalRounds) {
    document.querySelector('.nextRound').classList.remove('hidden');
    document.querySelector('.finishGame').classList.add('hidden');
  } else {
    document.querySelector('.nextRound').classList.add('hidden');
    document.querySelector('.finishGame').classList.remove('hidden');
  }

  
  if (playerWins >= Math.floor(totalRounds / 2 + 1)) {
    document.querySelector(".finishGame").classList.remove("hidden");
    document.querySelector(".nextRound").classList.add("hidden");
    finishGame();
  } else if (computerWins >= Math.floor(totalRounds / 2 + 1)) {
    document.querySelector(".finishGame").classList.remove("hidden");
    document.querySelector(".nextRound").classList.add("hidden");
    finishGame();
  }
  // Sýnum niðurstöðuskjá
}

/**
 * Fall sem bregst við því þegar smellt er á takka fyrir fjölda umferða
 * @param {Event} e Upplýsingar um atburð
 */
function round(e) {
  // TODO útfæra
  currentRound = 1;
  totalRounds = e.target.dataset.num;
  show('play');

  
}

// Takki sem byrjar leik
document
  .querySelector('.start button')
  .addEventListener('click', () => show('rounds'));

// Búum til takka
createButtons(MAX_BEST_OF, round);

// Event listeners fyrir skæri, blað, steinn takka
// TODO
document
  .querySelector('button.scissor')
  .addEventListener('click', () => playRound("1"));
document
  .querySelector('button.paper')
  .addEventListener('click', () => playRound("2")); 
document
  .querySelector('button.rock')
  .addEventListener('click', () => playRound("3"));

/**
 * Uppfærir stöðu yfir alla spilaða leiki þegar leik lýkur.
 * Gerir tilbúið þannig að hægt sé að spila annan leik í framhaldinu.
 */
function finishGame() {
  // Bætum við nýjasta leik

  // Uppfærum stöðu
  if (computerWins<playerWins) {
    totalWins++;
  }
  
  games.push({
    player: playerWins,
    computer: computerWins,
    wins: playerWins > computerWins,
  });

  const totalGames =games.length;
  const totalLosses =totalGames- totalWins;
  // Bætum leik við lista af spiluðum leikjum

  document.querySelector(".games__played").textContent = totalGames.toString();
  document.querySelector(".games__wins").textContent = totalWins.toString();
  document.querySelector(".games__winratio").textContent = (
    100 * (totalWins / totalGames).toFixed(4)
  ).toString();
  document.querySelector(".games__losses").textContent = totalLosses.toString();
  document.querySelector(".games__lossratio").textContent = (
    100 * (totalLosses / totalGames).toFixed(4)
  ).toString();


  // Núllstillum breytur
    playerWins=0;
    computerWins=0;
  // Byrjum nýjan leik!
  show('start');
}

// Næsta umferð og ljúka leik takkar
document.querySelector('button.finishGame').addEventListener('click', finishGame);
// TODO takki sem fer með í næstu umferð
document.querySelector('button.nextRound') .addEventListener('click', nextRound)
