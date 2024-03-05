const path_ig = "https://realitybending.github.io/IllusionGame/v3/"

// Instructions ==================================================================================
// General instructions
var ig_instructions =
    // Illusion Game
    "<h3>Игра иллюзий</h3>" +
    // "In this game of speed and reflex"
    "<p>Перед вами игра, в которой скорость реакции имеет значение.</p>" +
    // "you will need to make visual judgments"
    "<p>Вам потребуется максимально быстро <b>визуально оценивать</b> объекты, не совершая ошибок.</p>" +
    // "(for instance, which circle is the biggest, or which line is the longest), as fast and as correctly as possible, while <b>resisting different visual illusions"
    "<p>Например, определить какой круг больше или какая линия длиннее, <b>сопротивляясь эффектам различных иллюзий</b>.<br></p>" +
    // "We are going to start with some examples of all the illusions you will encounter in the game."
    "<p>Мы начнем с короткой тренировки, в ходе которой вы познакомитесь с типами иллюзий, которые встретятся в игре.</p>"

// Instructions for Illusion Trials
var mullerlyer_instructions =
    // "In this part, two horizontal red lines will appear one above the other"
    "<p>Сейчас на экране появятся две красные горизонтальные линии, расположенные друг под другом.</p>" +
    // "Your task is to select which <b>line is longer</b> in length as fast as you can, without making errors.
    "<p>Ваша задача – как можно быстрее и без ошибок определить, <b>какая из линий длиннее</b>.</p>" +
    // "Don't get distracted by the surrounding black arrows at the end of the red lines!"
    "<p>Пожалуйста, постарайтесь не обращать внимания на черные стрелки в конце красных линий!</p>" +
    // "Press the UP or the DOWN arrow to indicate where is the longer red line"
    "<p>Используйте <b>стрелку ВВЕРХ или ВНИЗ</b> на клавиатуре, чтобы указать, какая <b>красная линяя длиннее</b>.</p>" +
    `<div style='float: center'><img src='${path_ig}/images/MullerLyer_Demo.png' height='200'></img>` +
    `<p><img src='${path_ig}/images/answer_updown_keyboard.PNG' height='100'></img></p>` +
    // "In this example, the correct answer is the UP arrow."
    "<p class='small'>В этом примере правильный ответ – верхняя линяя, то есть <b>стрелка вверх</b>.</p></div>" +
    // "Are you ready? Press ENTER to start."
    "<p>Вы готовы? <br><b>Нажмите ENTER, чтобы начать</b>.<br></p>"

var ebbinghaus_instructions =
    // "In this part, two red circles will appear side by side on the screen."
    "<p>Сейчас на экране появятся два красных круга, расположенных рядом.</p>" +
    // "Your task is to select which <b>red circle is bigger</b> in size as fast as you can, without making errors."
    "<p>Ваша задача – как можно быстрее и без ошибок определить, <b>какой красный круг больше</b>.</p>" +
    // "Don't get distracted by the surrounding black circles around the red circles."
    "<p>Пожалуйста, постарайтесь не отвлекаться на черные круги!</p>" +
    // "Press <b>the LEFT or the RIGHT arrow</b> to indicate which is the bigger red circle."
    "<p>Используйте <b>ЛЕВУЮ или ПРАВУЮ стрелку</b> на клавиатуре, чтобы указать, какой <b>красный круг</b> больше.</p>" +
    `<div style='float: center'><img src='${path_ig}/images/Ebbinghaus_Demo.png' height='200'></img>` +
    `<p><img src='${path_ig}/images/answer_leftright_keyboard.PNG' height='100'></img></p>` +
    // "In this example, the correct answer is the <b>LEFT arrow</b>."
    "<p class='small'>В этом примере верный ответ – левый круг, то есть <b>левая стрелка</b>.</p></div>" +
    // "Are you ready? Press ENTER to start"
    "<p>Вы готовы? <br><b>Нажмите ENTER, чтобы начать</b>.<br></p>"

var verticalhorizontal_instructions =
    // "In this part, two red lines will appear side by side."
    "<p>Сейчас на экране появятся две красные линии, расположенные рядом.</p>" +
    // "Your task is to tell <b>which line is longer</b> in length, regardless of their orientation, as fast as you can, and without making errors."
    "<p>Ваша задача – как можно быстрее и без ошибок определить, <b>какая линяя длиннее</b>, несмотря на их расположение.</p>" +
    // "Don't get distracted by the orientation of the lines!"
    "<p>Пожалуйста, постарайтесь не отвлекаться на то, как расположены линии!</p>" +
    // "Press <b>the LEFT or the RIGHT arrow</b> to indicate which line is the longer one."
    "<p>Используйте <b>ЛЕВУЮ или ПРАВУЮ стрелку</b> на клавиатуре, чтобы указать, где находится <b>более длинная линия</b>.</p>" +
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
    "<p><br>На следующем этапе игры испытаний будет больше и некоторые из них станут сложнее. <br>К тому же, после каждого блока иллюзий будет подсчитываться ваш <b>результат</b>, исходя из<br> вашей скорости (времени, за которое вы дали ответ) и точности (количества допущенных ошибок).<br></p><br>" +
    // "Try to keep up a high score!"
    "<p><i>Постарайтесь удержать результат высоким!</i></p><br>" +
    // "Note that it can be really challenging at times, so you will need to rely on your intuition and gut feeling to answer as fast as you can without making errors. Each illusion block will be repeated two times (so that you have the opportunity to improve your score), but the order of the blocks is random."
    "<p>Обратите внимание, что иногда будет <i>очень сложно</i> определить верный ответ. <br>Вам придется полагаться на <b>интуицию</b> и <b>ощущения</b>, чтобы ответить как можно быстрее, не допустив ошибки. <br>Каждый блок с иллюзиями будет повторен дважды, что позволит вам улучшить свой результат,<br>однако порядок блоков будет случайным.</p>" +
    // "Remember, your goal is to be as <b>fast</b> and <b>accurate</b> as possible. Good luck!"
    "<p><br>Помните, ваша цель – давать ответы максимально <b>быстро</b>, но при этом <b>не совершать ошибок</b>. Удачи!</p><br>"

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
var ig_text_score = "<p>Ваш результат по этому блоку иллюзий</p>"
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
