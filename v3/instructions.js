const path = "https://realitybending.github.io/IllusionGame/v3/"

// Instructions ==================================================================================
// General instructions
var ig_instructions =
    "<h1>Illusion Game</h1>" +
    "<p>In this game of speed and reflex, you will need to make <b>visual judgments</b> (for instance, which circle is the biggest, or which line is the longest), as fast and as correctly as possible, while <b>resisting different visual illusions</b>.</p>" +
    "<p>We are going to start with some examples of all the illusions you will encounter in the game.</p>"

// Instructions for Illusion Trials
var mullerlyer_instructions =
    "<p>In this part, two horizontal red lines will appear one above the other.</p>" +
    "<p>Your task is to select which <b>line is longer</b> in length as fast as you can, without making errors.</p>" +
    "<p>Don't get distracted by the surrounding black arrows at the end of the red lines!</p>" +
    "<p>Press <b>the UP or the DOWN arrow</b> to indicate where is the longer <b>red line</b>.</p>" +
    `<div style='float: center'><img src='${path}/images/MullerLyer_Demo.png' height='200'></img>` +
    `<p><img src='${path}/images/answer_updown_keyboard.PNG' height='100'></img></p>` +
    "<p class='small'>In this example, the correct answer is the <b>UP arrow</b>.</p></div>" +
    "<p>Are you ready? <b>Press ENTER to start</b></p>"

var ebbinghaus_instructions =
    "<p>In this part, two red circles will appear side by side on the screen.</p>" +
    "<p>Your task is to select which <b>red circle is bigger</b> in size as fast as you can, without making errors.</p>" +
    "<p>Don't get distracted by the surrounding black circles around the red circles!</p>" +
    "<p>Press <b>the LEFT or the RIGHT arrow</b> to indicate which is the bigger <b>red circle</b>.</p>" +
    `<div style='float: center'><img src='${path}/images/Ebbinghaus_Demo.png' height='200'></img>` +
    `<p><img src='${path}/images/answer_leftright_keyboard.PNG' height='100'></img></p>` +
    "<p class='small'>In this example, the correct answer is the <b>LEFT arrow</b>.</p></div>" +
    "<p>Are you ready? <b>Press ENTER to start</b></p>"

var verticalhorizontal_instructions =
    "<p>In this part, two red lines will appear side by side.</p>" +
    "<p>Your task is to tell <b>which line is longer</b> in length, regardless of their orientation, as fast as you can, and without making errors.</p>" +
    "<p>Don't get distracted by the orientation of the lines!</p>" +
    "<p>Press <b>the LEFT or the RIGHT arrow</b> to indicate which <b>line is the longer one</b>.</p>" +
    `<div style='float: center'><img src='${path}/images/VerticalHorizontal_Demo.png' height='200'></img>` +
    `<p><img src='${path}/images/answer_leftright_keyboard.PNG' height='100'></img></p>` +
    "<p class='small'>In this example, the correct answer is the <b>LEFT arrow</b>.</p></div>" +
    "<p>Are you ready? <b>Press ENTER to start</b></p>"

var ig_practice_end =
    "<h1>Training Completed</h1>" +
    "<p>In the next phase, there will be more trials, and some might be harder too.<br>Moreover, after each illusion block, a <b>score</b> will be calculated based on speed (time you took to answer) and accuracy (number of errors).</p>" +
    "<p><i>Try to keep up a high score!</i></p><br>" +
    "<p>Note that it can be <i>really</i> challenging at times, so you will need to rely on your <b>intuition</b> and gut feeling to answer as fast as you can without making errors.</p>" +
    "<p>Each illusion block will be repeated two times (so that you have the opportunity to improve your score), but the order of the blocks is random.</p>" +
    "<p>Remember, your goal is to be as <b>fast</b> and <b>accurate</b> as possible. Good luck!</p><br>"

// Other text
var ig_text_practice = "<p><b>Practice</b></p>"
var ig_text_startpractice = "Start the practice!"
var ig_text_letsplay = "Let's Play!"
var ig_text_part = "Part "
var ig_text_continue = "Continue"
var ig_text_dobetter = "<p>Can you do better in the next illusion?</p>"
var ig_text_score = "<p>Your score for this illusion is</p>"
var ig_text_finalscore = "<p><strong>Your final score is</strong></p>"
var ig_text_correct = "Correct Responses:"
var ig_text_averagert = "Average Response Time:"
var ig_text_popcompare1 = "You performed better than"
var ig_text_popcompare2 = "of the population"
