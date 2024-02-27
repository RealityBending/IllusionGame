const path_ig = "https://realitybending.github.io/IllusionGame/v3/"

// Instructions ==================================================================================
// General instructions
var ig_instructions =
    // Illusion Game
    '<h3>Игра "Иллюзии"</h3>' +
    // "In this game of speed and reflex, you will need to make visual judgments (for instance, which circle is the biggest, or which line is the longest), as fast and as correctly as possible, while <b>resisting different visual illusions"
    "<p>В этой игре на скорость реакции вам будет нужно как можно быстрее и точнее <b>дать визуальную оценку</b> объектам.</p>" +
    "<p>Например, выбрать, какой круг больше или какая линия длиннее, <b>сопротивляясь при этом эффектам иллюзий</b>.</p>" +
    // "We are going to start with some examples of all the illusions you will encounter in the game."
    "<p>Мы начнем с примеров всех иллюзий, которые вы можете встретить в игре.</p>"

// Instructions for Illusion Trials
var mullerlyer_instructions =
    // "In this part, two horizontal red lines will appear one above the other"
    "<p>В этой части на экране появятся две красные горизонтальные линии, расположенные друг под другом.</p>" +
    // "Your task is to select which <b>line is longer</b> in length as fast as you can, without making errors.
    "<p>Ваша задача – как можно быстрее и без ошибок определить, <b>какая из линий длиннее</b>.</p>" +
    // "Don't get distracted by the surrounding black arrows at the end of the red lines!"
    "<p>Пожалуйста, постарайтесь не обращать внимания на черные стрелки в конце красных линий!</p>" +
    // "Press the UP or the DOWN arrow to indicate where is the longer red line"
    "<p>Нажмите на <b>стрелку ВВЕРХ или ВНИЗ</b> на клавиатуре, чтобы указать, где находится <b>более длинная красная линия</b>.</p>" +
    `<div style='float: center'><img src='${path_ig}/images/MullerLyer_Demo.png' height='200'></img>` +
    `<p><img src='${path_ig}/images/answer_updown_keyboard.PNG' height='100'></img></p>` +
    // "In this example, the correct answer is the UP arrow."
    "<p class='small'>В этом примере правильный ответ – верхняя линяя, то есть <b>стрелка вверх</b>.</p></div>" +
    // "Are you ready? Press ENTER to start."
    "<p>Вы готовы? <br><b>Нажмите ENTER, чтобы начать</b>.<br></p>"

var ebbinghaus_instructions =
    // "In this part, two red circles will appear side by side on the screen."
    "<p>В этой части на экране появятся два красных круга, расположенные рядом.</p>" +
    // "Your task is to select which <b>red circle is bigger</b> in size as fast as you can, without making errors."
    "<p>Ваша задача – как можно быстрее и без ошибок определить, <b>какой красный круг больше</b>.</p>" +
    // "Don't get distracted by the surrounding black circles around the red circles."
    "<p>Постарайтесь не отвлекаться на черные круги вокруг красных кругов!</p>" +
    // "Press <b>the LEFT or the RIGHT arrow</b> to indicate which is the bigger red circle."
    "<p>Нажмите <b>на ЛЕВУЮ или на ПРАВУЮ стрелку</b> на клавиатуре, чтобы выбрать, какой <b>красный круг</b> больше.</p>" +
    `<div style='float: center'><img src='${path_ig}/images/Ebbinghaus_Demo.png' height='200'></img>` +
    `<p><img src='${path_ig}/images/answer_leftright_keyboard.PNG' height='100'></img></p>` +
    "<p class='small'>В этом примере верный ответ – левый круг, то есть <b>левая стрелка</b>.</p></div>" +
    // "Are you ready? Press ENTER to start"
    "<p>Вы готовы? <br><b>Нажмите ENTER, чтобы начать</b>.<br></p>"

var verticalhorizontal_instructions =
    // "In this part, two red lines will appear side by side."
    "<p>В этой части на экране появятся две красные линии, расположенные рядом.</p>" +
    // "Your task is to tell <b>which line is longer</b> in length, regardless of their orientation, as fast as you can, and without making errors."
    "<p>Ваша задача – как можно быстрее и без ошибок определить, <b>какая линяя длиннее</b>, несмотря их расположение.</p>" +
    // "Don't get distracted by the orientation of the lines!"
    "<p>Пожалуйста, пострайтесь не отвлекаться на то, как расположены линии! </p>" +
    // "Press <b>the LEFT or the RIGHT arrow</b> to indicate which line is the longer one."
    "<p>Нажмите <b>на ЛЕВУЮ или на ПРАВУЮ стрелку</b> на клавиатуре, чтобы указать, где находится <b>более длинная линия</b>.</p>" +
    `<div style='float: center'><img src='${path_ig}/images/VerticalHorizontal_Demo.png' height='200'></img>` +
    `<p><img src='${path_ig}/images/answer_leftright_keyboard.PNG' height='100'></img></p>` +
    // "In this example, the correct answer is the <b>LEFT arrow</b>."
    "<p class='small'>В этом примере верный ответ – линия слева, то есть <b>левая стрелка</b>.</p></div>" +
    // "Are you ready? Press ENTER to start"
    "<p>Вы готовы? <br><b>Нажмите ENTER, чтобы начать</b>.<br></p>"

var ig_practice_end =
    // "TRAINING COMPLETED"
    "<h2>Тренировка завершена</h2>" +
    // "In the next phase, there will be more trials, and some might be harder too.<br> Moreover, after each illusion block, a <b>score</b> will be calculated based on speed (time you took to answer) and accuracy (number of errors)."
    "<p><br>На следующем этапе игры испытаний будет больше, а некоторые из них могут быть сложнее.<br> Кроме того, после каждого блока иллюзий ваш <b>результат</b> будет подсчитываться,<br>исходя из вашей скорости (времени, которое вы затратили на ответы) и точности (количества ошибок).<br></p><br>" +
    // "Try to keep up a high score!"
    "<p><i>Постарайтесь удержать высокий результат!</i></p><br>" +
    // "Note that it can be really challenging at times, so you will need to rely on your intuition and gut feeling to answer as fast as you can without making errors"
    "<p>Обратите внимание, что иногда может быть <i>очень сложно</i> определить верный ответ. <br>Поэтому вам придется полагаться на <b>интуицию</b> и ощущения, чтобы ответить как можно быстрее, не допустив ошибки.<br></p>" +
    // "Each illusion block will be repeated two times (so that you have the opportunity to improve your score), but the order of the blocks is random."
    "<p>Каждый блок с иллюзиями будет повторен два раза, чтобы у вас была возможность улучшить свой результат. <br>Однако порядок блоков будет случаным.<br></p>" +
    // "Remember, your goal is to be as <b>fast</b> and <b>accurate</b> as possible. Good luck!"
    "<p>Помните, ваша цель – действовать настолько <b>быстро</b> и <b>точно</b>, насколько это возможно. Удачи!</p><br>"

// Other text
// "Practice"
var ig_text_practice = "<p><b>Тренировка</b></p>"
// "Start the practice!"
var ig_text_startpractice = "Начать тренировку!"
// "Let's Play!"
var ig_text_letsplay = "Начать игру!"
// "Part "
var ig_text_part = "Часть "
// "Continue"
var ig_text_continue = "Продолжить"
// Can you do better in the next illusion?
var ig_text_dobetter = "<p>Попробуете справиться лучше со следующей иллюзией?</p>"
// "Your score for this illusion is"
var ig_text_score = "<p>Ваш результат для этой иллюзии</p>"
// "Your final score is"
var ig_text_finalscore = "<p><strong>Ваш финальный результат</strong></p>"
// "Correct Responses:"
var ig_text_correct = "Правильные ответы:"
// "Average Response Time:"
var ig_text_averagert = "Среднее время ответа:"
// "You performed better than"
var ig_text_popcompare1 = "Вы справились лучше, чем"
//  "of the population"
var ig_text_popcompare2 = "% людей"
