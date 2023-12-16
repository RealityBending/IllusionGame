// Global variables ===============================================================================
var block_number = 1 // block indexing variable
var trial_number = 1 // trial indexing variable

// Instructions ==================================================================================
// General instructions
var IG_instructions = {
    type: jsPsychHtmlButtonResponse,
    choices: [ig_text_startpractice],
    stimulus: ig_instructions,
    data: { screen: "IG_instructions" },
}

function add_blocknumber(instructions, block) {
    return "<p><b>" + ig_text_part + block + "/6" + "</b></p>" + instructions
}

// Math utilities =================================================================================
function randomInteger(min = 1, max = 10) {
    return Math.round(Math.random() * (max - min) + min)
}

function cumulative_probability(x, mean, sd) {
    var z = (x - mean) / Math.sqrt(2 * sd * sd)
    var t = 1 / (1 + 0.3275911 * Math.abs(z))
    var a1 = 0.254829592
    var a2 = -0.284496736
    var a3 = 1.421413741
    var a4 = -1.453152027
    var a5 = 1.061405429
    var erf =
        1 -
        ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-z * z)
    var sign = 1
    if (z < 0) {
        sign = -1
    }
    return (1 / 2) * (1 + sign * erf)
}

function round_digits(x, digits = 2) {
    return Number(
        Math.round(parseFloat(x + "e" + digits)) + "e-" + digits
    ).toFixed(digits)
}

// EEG / Physio trigger
// [x, y, width, height] in pixels. Set to [0, 0, 0, 0] to disable.
const marker_position = [0, 0, 100, 100]

function ig_create_marker(marker_position, color = "black") {
    const html = `<div id="marker" style="position: absolute; background-color: ${color};\
left:${marker_position[0]}px; top:${marker_position[1]}px; \
width:${marker_position[2]}px; height:${marker_position[3]}px";></div>`
    document.querySelector("body").insertAdjacentHTML("beforeend", html)
}
// Feedback and Debriefing ========================================================================
function get_results(illusion_mean, illusion_sd, illusion_type) {
    if (typeof illusion_type != "undefined") {
        var trials = jsPsych.data
            .get()
            .filter({ screen: "IG_Trial", type: illusion_type }) // results by block
    } else {
        var trials = jsPsych.data.get().filter({ screen: "IG_Trial" }) // overall results
    }
    var correct_trials = trials.filter({ correct: true })
    var proportion_correct = correct_trials.count() / trials.count()
    var rt_mean = trials.select("rt").mean()
    if (correct_trials.count() > 0) {
        var rt_mean_correct = correct_trials.select("rt").mean()
        var ies = rt_mean_correct / proportion_correct // compute inverse efficiency score
        var score_to_display = 100 - ies / 35
        if (score_to_display < 0) {
            score_to_display = 0
        }
        var percentile =
            100 - cumulative_probability(ies, illusion_mean, illusion_sd) * 100
    } else {
        var rt_mean_correct = ""
        var ies = ""
        var percentile = 0
        var score_to_display = 0
    }
    return {
        accuracy: proportion_correct,
        mean_reaction_time: rt_mean,
        mean_reaction_time_correct: rt_mean_correct,
        inverse_efficiency: ies,
        percentage: percentile,
        score: score_to_display,
    }
}

function get_debrief_display(results, type = "Block") {
    if (type === "Block") {
        // Debrief at end of each block
        var score =
            ig_text_score +
            '<p style="color: black; font-size: 48px; font-weight: bold;">' +
            Math.round(results.score * 10) / 10 +
            " %</p>"
    } else if (type === "Final") {
        // Final debriefing at end of game
        var score =
            ig_text_finalscore +
            '<p style="color: black; font-size: 48px; font-weight: bold;">&#127881; ' +
            Math.round(results.score) +
            " &#127881;</p>"
    }

    return {
        display_score: score,
        display_accuracy:
            "<p style='color:rgb(76,175,80);'>" +
            ig_text_correct +
            "<b>" +
            round_digits(results.accuracy * 100) +
            "" +
            "%</b></p>",
        display_rt:
            "<p style='color:rgb(139, 195, 74);'>" +
            ig_text_averagert +
            "<b>" +
            round_digits(results.mean_reaction_time) +
            "</b> ms.</p>",
        display_comparison:
            "<p style='color:rgb(76,175,80);'>" +
            ig_text_popcompare1 +
            "<b>" +
            round_digits(results.percentage) +
            "</b>% " +
            ig_text_popcompare1 +
            "</p>",
    }
}

// Trial Creation ================================================================================
function jittered_fixation_cross() {
    var fixation = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: function () {
            return (
                '<p style="color: black; font-size: 80px; padding-left: ' +
                randomInteger(0, 50) +
                "%; padding-right: " +
                randomInteger(0, 50) +
                "%; padding-top: " +
                randomInteger(0, 50) +
                "%; padding-bottom: " +
                randomInteger(0, 50) +
                '%">+</p>'
            )
        },
        choices: "NO_KEYS", // No response is accepted
        // trial_duration: 0, // (for testing)
        trial_duration: function () {
            return randomInteger(600, 1100)
        },
        save_trial_parameters: {
            trial_duration: true,
        },
        data: {
            screen: "IG_FixationCross",
        },
    }
    return fixation
}

// Trial
function IG_create_trial(
    illusion_name = "Ponzo",
    type = "updown",
    marker = true
) {
    // Common trial parameters
    var trial = {
        type: jsPsychImageKeyboardResponse,
        stimulus: function () {
            return path + jsPsych.timelineVariable("stimulus")
        },
        data: function () {
            return jsPsych.timelineVariable("data")
        },
        on_load: function () {
            if (marker) {
                ig_create_marker(marker_position)
            }
        },
    }

    if (type == "updown") {
        trial.choices = ["arrowup", "arrowdown"]
    } else {
        trial.choices = ["arrowleft", "arrowright"]
    }

    // Make scoring
    trial.on_finish = function (data) {
        if (marker) {
            document.querySelector("#marker").remove()
        }
        // ISI: duration of the fixation cross
        data.isi = jsPsych.data.get().last(2).values()[0].time_elapsed

        // Save fixation cross position
        data.fixation_cross = jsPsych.data.get().last(2).values()[0].stimulus

        // Score the response as correct or incorrect.
        if (data.response != -1) {
            if (
                jsPsych.pluginAPI.compareKeys(
                    data.response,
                    data.correct_response
                )
            ) {
                data.correct = true
            } else {
                data.correct = false
            }
        } else {
            // code mouse clicks as correct or wrong
            if (type == "updown") {
                if (data.click_x < window.innerHeight / 2) {
                    // use window.innerHeight for up vs down presses
                    data.response = "arrowdown"
                } else {
                    data.response = "arrowup"
                }
            } else {
                if (data.click_x < window.innerWidth / 2) {
                    // use window.innerHeight for up vs down presses
                    data.response = "arrowleft"
                } else {
                    data.response = "arrowright"
                }
            }

            if (
                jsPsych.pluginAPI.compareKeys(
                    data.response,
                    data.correct_response
                )
            ) {
                data.correct = true
            } else {
                data.correct = false
            }
        }
        // track block and trial numbers
        data.type = illusion_name
        data.illusion_strength = function () {
            return jsPsych.timelineVariable("Illusion_Strength")
        }
        data.illusion_difference = function () {
            return jsPsych.timelineVariable("Difference")
        }
        data.block_number = block_number
        data.trial_number = trial_number
        trial_number += 1
    }
    return trial
}

function IG_make_trials(
    stimuli,
    instructions,
    illusion_name,
    type,
    marker = true,
    debrief = true
) {
    var timeline = []

    // Set stimuli (var stimuli is loaded in stimuli/stimuli.js)
    var stim_list = stimuli.filter(
        (stimuli) => stimuli.data.Illusion_Type === illusion_name
    )

    // Preload images
    timeline.push({
        type: jsPsychPreload,
        images: stim_list.map((a) => path + a.stimulus),
        data: { screen: "IG_Preload" },
    })

    // Instructions
    timeline.push({
        type: jsPsychHtmlKeyboardResponse,
        on_start: function () {
            document.body.style.cursor = "none"
        },
        choices: ["enter"],
        stimulus: instructions,
        post_trial_gap: 500,
        data: { screen: "IG_Instructions" },
    })

    // Create Trials timeline
    timeline.push({
        timeline: [
            jittered_fixation_cross(),
            IG_create_trial(illusion_name, (type = type), (marker = marker)),
        ],
        timeline_variables: stim_list,
        randomize_order: true,
        repetitions: 1,
    })

    // Debriefing Information
    if (debrief) {
        if (stimuli == stimuli_part1 || stimuli == stimuli_part2) {
            timeline.push(create_debrief((illusion_name = illusion_name)))
        } else if (stimuli === stimuli_training) {
            timeline.push({
                type: jsPsychHtmlButtonResponse,
                choices: [ig_text_continue],
                post_trial_gap: 500,
                on_start: function () {
                    document.body.style.cursor = "auto"
                },
                stimulus: function () {
                    var results = get_results(1000, 400, illusion_name)
                    var show_screen = get_debrief_display(results)
                    return (
                        show_screen.display_accuracy +
                        "<hr>" +
                        show_screen.display_rt
                        //"<hr><p>Can you do better in the next illusion?</p>"
                    )
                },
                data: { screen: "IG_PracticeResults" },
            })
        }
    }
    return timeline
}

// Practice trials ================================================================================
var ebbinghaus_practice = IG_make_trials(
    (stimuli = stimuli_training),
    (instructions = ig_text_practice + ebbinghaus_instructions),
    (illusion_name = "Ebbinghaus"),
    (type = "leftright"),
    (marker = false)
)

var mullerlyer_practice = IG_make_trials(
    (stimuli = stimuli_training),
    (instructions = ig_text_practice + mullerlyer_instructions),
    (illusion_name = "MullerLyer"),
    (type = "updown"),
    (marker = false)
)

var verticalhorizontal_practice = IG_make_trials(
    (stimuli = stimuli_training),
    (instructions = ig_text_practice + verticalhorizontal_instructions),
    (illusion_name = "VerticalHorizontal"),
    (type = "leftright"),
    (marker = false)
)

var IG_practice_end = {
    type: jsPsychHtmlButtonResponse,
    choices: [ig_text_letsplay],
    stimulus: ig_practice_end,
    data: { screen: "IG_PracticeDebrief" },
    on_finish: function () {
        block_number = 1 // reset block number for illusion trials
        trial_number = 1 // reset trial number for illusion trials
    },
}

var ig_practice = {
    timeline: [
        IG_instructions,
        { timeline: ebbinghaus_practice },
        { timeline: mullerlyer_practice },
        { timeline: verticalhorizontal_practice },
        IG_practice_end,
    ],
}

// Block trials ==================================================================================
function create_debrief(illusion_name = "Ponzo") {
    var debrief = {
        type: jsPsychHtmlButtonResponse,
        choices: [ig_text_continue],
        on_start: function () {
            document.body.style.cursor = "auto"
        },
        stimulus: function () {
            var results = get_results(
                1000, // population_scores[illusion_name]["IES_Mean"][0],
                400, // population_scores[illusion_name]["IES_SD"][0],
                illusion_name
            )
            var show_screen = get_debrief_display(results)
            return (
                show_screen.display_score +
                // // For debugging purposes, show the raw data.
                // show_screen.display_accuracy +
                // "<hr>" +
                // show_screen.display_rt +
                // "<hr>" +
                // show_screen.display_comparison +
                "<hr>" +
                ig_text_dobetter
            )
        },
        data: { screen: "IG_BlockResults" },
        // Reset trial number and update block number
        on_finish: function () {
            block_number += 1
            trial_number = 1
        },
    }
    return debrief
}

function IG_create_block(
    stimuli,
    show_blocknumber = true,
    show_marker = false
) {
    /* ---------------------- MULLERLYER ILLUSION --------------------- */
    var timeline_mullerlyer = IG_make_trials(
        stimuli,
        (instructions = function (show_blocknumber) {
            if (show_blocknumber) {
                return add_blocknumber(mullerlyer_instructions, block_number)
            } else {
                return mullerlyer_instructions
            }
        }),
        (illusion_name = "MullerLyer"),
        (type = "updown"),
        (marker = show_marker)
    )

    /* --------------------- EBBINGHAUS ILLUSION ---------------------- */
    var timeline_ebbinghaus = IG_make_trials(
        stimuli,
        (instructions = function (show_blocknumber) {
            if (show_blocknumber) {
                return add_blocknumber(ebbinghaus_instructions, block_number)
            } else {
                return ebbinghaus_instructions
            }
        }),
        (illusion_name = "Ebbinghaus"),
        (type = "leftright"),
        (marker = show_marker)
    )

    /* ----------------- VERTICAL-HORIZONTAL ILLUSION ----------------- */
    var timeline_verticalhorizontal = IG_make_trials(
        stimuli,
        (instructions = function (show_blocknumber) {
            if (show_blocknumber) {
                return add_blocknumber(
                    verticalhorizontal_instructions,
                    block_number
                )
            } else {
                return verticalhorizontal_instructions
            }
        }),
        (illusion_name = "VerticalHorizontal"),
        (type = "leftright"),
        (marker = show_marker)
    )

    /* ------------------------ Timeline ----------------------------- */
    var task_block = {
        timeline: [
            { timeline: timeline_mullerlyer },
            { timeline: timeline_ebbinghaus },
            { timeline: timeline_verticalhorizontal },
        ],
        randomize_order: true,
    }
    return task_block
}
