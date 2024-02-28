const path_ig = "https://realitybending.github.io/IllusionGame/v3/"

// Instructions ==================================================================================
// General instructions
var ig_instructions =
    "<h1>Le jeux d'illusions</h1>" +
    "<p>Dans ce jeu de rapidité et de réflexe, vous allez devoir faire des <b>jugements visuels</b> (par exemple, quel cercle est le plus grand, ou quelle ligne est la plus longue), aussi rapidement et justement que possible, tout en <b>résistant à des illusions visuelles</b>.</p>" +
    "<p>Nous allons débuter avec quelques exemples de toutes les illusions que vous allez rencontrer dans le jeu.</p>"

// Instructions for Illusion Trials
var mullerlyer_instructions =
    "<p>Dans cette partie, deux lignes horizontales rouges vont apparaître l'une au dessus de l'autre.</p>" +
    "<p>Vous devez sélectionner quelle <b>ligne est la plus longue</b> aussi rapidement que vous pouvez sans faire d'erreurs.</p>" +
    "<p>Ne soyez pas distrait par les croix noires à la fin des lignes rouges!</p>" +
    "<p>Appuyez sur <b>la flèche HAUT ou BAS</b> pour indiquer où est la plus longue <b>ligne rouge</b>.</p>" +
    `<div style='float: center'><img src='${path_ig}/images/MullerLyer_Demo.png' height='200'></img>` +
    `<p><img src='${path_ig}/images/answer_updown_keyboard.PNG' height='100'></img></p>` +
    "<p class='small'Dans cet exemple, la réponse correcte est la <b>flèche HAUT</b>.</p></div>" +
    "<p>Êtes-vous prêt? <b>Appuyer sur la touche ENTRÉE pour démarrer</b></p>"

var ebbinghaus_instructions =
    "<p>Dans cette partie, deux cercles rouges vont apparaître côte à côte à l'écran.</p>" +
    "<p>Vous devez sélectionner quel <b>cercle rouge est plus grand</b> aussi rapidement que possible et sans faire d'erreurs.</p>" +
    "<p>Ne soyez pas distraits par les cercles noirs autour des cercles rouges!</p>" +
    "<p>Appuyez sur <b>la flèche GAUCHE ou DROITE</b> pour indiquer quel est le plus grand <b>cercle rouge</b>.</p>" +
    `<div style='float: center'><img src='${path_ig}/images/Ebbinghaus_Demo.png' height='200'></img>` +
    `<p><img src='${path_ig}/images/answer_leftright_keyboard.PNG' height='100'></img></p>` +
    "<p class='small'>Dans cet exemple, la réponse correcte est la <b>flèche GAUCHE</b>.</p></div>" +
    "<p>Êtes-vous prêt? <b>Appuyer sur la touche ENTRÉE pour démarrer</b></p>"

var verticalhorizontal_instructions =
    "<p>Dans cette partie, deux lignes rouges vont apparaître côte à côte à l'écran.</p>" +
    "<p>Vous devez sélectionner <b>quelle est la plus longue</b>, peu importe leur orientation, aussi vite que vous pouvez et sans faire d'erreurs.</p>" +
    "<p>Ne soyez pas distrait par l'orientation des lignes!</p>" +
    "<p>Appuyez sur <b>la flèche GAUCHE ou DROITE</b> pour indiquer quelle <b>ligne est la plus longue</b>.</p>" +
    `<div style='float: center'><img src='${path_ig}/images/VerticalHorizontal_Demo.png' height='200'></img>` +
    `<p><img src='${path_ig}/images/answer_leftright_keyboard.PNG' height='100'></img></p>` +
    "<p class='small'>Dans cet exemple, la réponse correcte est la <b>flèche GAUCHE</b>.</p></div>" +
    "<p>Êtes-vous prêt? <b>Appuyer sur la touche ENTRÉE pour démarrer</b></p>"

var ig_practice_end =
    "<h1>Entraînement terminé</h1>" +
    "<p>Dans la phase suivante, il va y avoir plus d'essais, dont certains pourraient être plus difficiles.<br>De plus, après chaque bloc d'illusion, un <b>score</b> sera calculé sur la base de votre vitesse (le temps que vous avez mis à répondre) et de votre précision (votre nombre d'erreurs).</p>" +
    "<p><i>Essayez de maintenir un score élevé!</i></p><br>" +
    "<p>Notez que ça peut être <i>vraiment</i> difficile parfois, de manière à ce que vous deviez vous fier à votre <b>intuition</b> et vos ressentis pour répondre aussi vite que possible sans faire d'erreur.</p>" +
    "<p>Chaque bloc d'illusion sera répété deux fois (de manière à ce que vous puissiez améliorer votre score), mais l'ordre des blocs est aléatoire.</p>" +
    "<p>Souvenez-vous, vous devez être aussi <b>rapide</b> et <b>précis</b> que possible. Bonne chance!</p><br>"

// Other text
var ig_text_practice = "<p><b>Entraînement</b></p>"
var ig_text_startpractice = "Démarrer l'entraînement"
var ig_text_letsplay = "Commencer le jeu!"
var ig_text_part = "Partie "
var ig_text_continue = "Continuer"
var ig_text_dobetter = "<p>Pouvez-vous faire mieux avec la prochaine illusion?</p>"
var ig_text_score = "<p>Votre score pour cette illusion est</p>"
var ig_text_finalscore = "<p><strong>Votre score final est</strong></p>"
var ig_text_correct = "Réponses correctes:"
var ig_text_averagert = "Temps de réaction:"
var ig_text_popcompare1 = "Vous avez fait mieux que"
var ig_text_popcompare2 = "de la population"
