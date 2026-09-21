// Experimental design: sets of trials that fully cross the two main parameters, with the remaining
// stimulus factors assigned by balanced randomisation.
//
// The two parameters of interest are task difficulty (`difference`, the objective area difference
// between the discs) and `illusion_strength` (the chromatic separation between each disc and its
// surround). One *set* contains their full grid once: with 4 difficulty levels and 5 strength levels
// that is 20 trials, so the session length is a multiple of 20 (`n_sets`). Within a set the sign of
// the difference (which side is larger) is balanced within each strength level.
//
// The other stimulus factors are what the pilot is exploring. They are not crossed with the grid
// (that would need thousands of trials) but assigned within each set by *balanced randomisation*:
// every level appears equally often (up to rounding) and the orders are shuffled independently, so
// the factors are orthogonal to the grid and to each other in expectation. Pooled across
// participants, a (mixed) regression can then estimate their main effects and interactions.

const DESIGN = {
    n_sets: 10, // number of full difficulty x strength grids; 1 = 20 trials, 2 = 40, ...
    n_blocks: 4, // trials are split evenly across blocks, with a break screen in between

    // Task difficulty: magnitude of the objective area difference between the two discs (as in
    // Pyllusion's Delboeuf: 0.1 = the larger disc has 10% more area, 1 = twice the area, i.e. 1.41x
    // the diameter). Never zero, so every trial has a correct answer. The sign is balanced separately.
    difference: [0.05, 0.1, 0.25, 0.5],

    // Illusion strength: +/-1 = pure colours, sign = which panel gets the red-leaning disc; 0 = both
    // panels the same purple (no colour context at all: each participant's baseline left/right
    // bias); +/-0.5 tests whether the bias grows with the separation.
    illusion_strength: [-1, -0.5, 0, 0.5, 1],

    // Remaining stimulus factors, each with the levels to be balanced within a set. Any option of
    // Chromostereopsis.parameters can be added here. Three levels wherever the factor is continuous,
    // so that a monotonic effect can be told from a non-monotonic one.
    factors: {
        size: [0.25, 0.5, 0.75], // disc diameter (proportion of canvas height, 0.25 = Delboeuf default)
        gap: [0, 0.02, 0.06], // bare outline between disc and surround (0 = disc abuts the surround)
        density: [0.5, 0.75, 1], // proportion of dither cells coloured (1 = solid fill)
        equiluminant: [false, true], // equate the luminance of the two colours
        dither_size: [2, 4, 8], // dither cell size in pixels
        // null = surround fills its half, "match" = area-matched surround. No third level: a fixed
        // intermediate panel would either not fit the largest disc or nearly coincide with "fill".
        size_panel: [null, "match"],
    },

    // Combinations that make no sense as a trial. Each rule is a predicate on the trial's options that
    // returns true when the trial must be excluded. Offending trials are repaired by swapping factor
    // levels with another trial, so the marginal balance of every factor is preserved.
    exclude: [
        // No outline and no colour difference: the disc is indistinguishable from its surround
        (o) => o.gap === 0 && o.illusion_strength === 0,
    ],

    // Held constant
    fixed: {
        color1: "red",
        color2: "blue",
        background: "black",
        distance: 1,
        luminance1: 1,
        luminance2: 1,
        dither_shared: true,
    },

    fixation_duration: [600, 1100], // ms, uniform jitter

    // Mask shown after each response to cut the colour afterimage of the saturated stimulus:
    // achromatic dynamic noise (a new random grey pattern every `refresh` ms) over each panel.
    // Greys are kept dark (0 to `max_grey` out of 255) so the mask adds little light to the display.
    mask: { duration: 500, refresh: 50, cell: 4, max_grey: 140 },
}

// Derived
DESIGN.n_per_set = DESIGN.difference.length * DESIGN.illusion_strength.length
DESIGN.n_total = DESIGN.n_sets * DESIGN.n_per_set

// --- Helpers -----------------------------------------------------------------------------------
function shuffle(array) {
    const a = array.slice()
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
}

// n values in which each level appears floor(n/k) or ceil(n/k) times, in random order
function balancedLevels(levels, n) {
    const out = []
    const cycle = shuffle(levels)
    for (let i = 0; i < n; i++) out.push(cycle[i % cycle.length])
    return shuffle(out)
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

// --- One set: the full difficulty x strength grid, signs balanced within each strength level ------
function makeSet(design) {
    const cells = []
    for (const strength of design.illusion_strength) {
        const signs = balancedLevels([-1, 1], design.difference.length)
        design.difference.forEach((magnitude, i) => {
            cells.push({ illusion_strength: strength, difference: signs[i] * magnitude })
        })
    }
    return shuffle(cells)
}

// --- Exclusions --------------------------------------------------------------------------------
// Options of trial i as they stand (grid cell + current factor columns), for checking the rules
function trialOptions(cells, columns, i) {
    const options = Object.assign({}, cells[i])
    for (const name of Object.keys(columns)) options[name] = columns[name][i]
    return options
}

function isExcluded(design, options) {
    return (design.exclude || []).some((rule) => rule(options))
}

// Make every trial pass the exclusion rules by swapping one factor level between an offending trial
// and another trial, such that both end up valid. Swapping (rather than redrawing) keeps every
// factor's marginal counts exactly as balanced as before.
function repairExclusions(design, cells, columns) {
    const names = Object.keys(columns)
    for (let i = 0; i < cells.length; i++) {
        if (!isExcluded(design, trialOptions(cells, columns, i))) continue
        let repaired = false
        for (const name of shuffle(names)) {
            for (const j of shuffle([...cells.keys()])) {
                if (j === i || columns[name][j] === columns[name][i]) continue
                ;[columns[name][i], columns[name][j]] = [columns[name][j], columns[name][i]]
                if (!isExcluded(design, trialOptions(cells, columns, i)) && !isExcluded(design, trialOptions(cells, columns, j))) {
                    repaired = true
                    break
                }
                ;[columns[name][i], columns[name][j]] = [columns[name][j], columns[name][i]] // undo
            }
            if (repaired) break
        }
        if (!repaired) {
            throw new Error("Could not build a trial list that satisfies the exclusion rules; relax them or add levels.")
        }
    }
}

// --- Trial list --------------------------------------------------------------------------------
// Returns an array of {set, block, trial, trial_in_block, options}, where `options` is the argument
// for Chromostereopsis.parameters(). `width`/`height` are the canvas size the stimulus is drawn at.
function makeTrials(design, width, height) {
    const trials = []
    for (let set = 1; set <= design.n_sets; set++) {
        const cells = makeSet(design)
        const columns = {}
        for (const [name, levels] of Object.entries(design.factors)) {
            columns[name] = balancedLevels(levels, cells.length)
        }
        repairExclusions(design, cells, columns)
        cells.forEach((cell, i) => {
            const options = Object.assign({}, design.fixed, cell, { width: width, height: height })
            for (const name of Object.keys(columns)) options[name] = columns[name][i]
            options.seed = randomInteger(0, 2 ** 31 - 1)
            // Fail before the session starts rather than in the middle of a block if a combination
            // of levels cannot be rendered (e.g. a disc that does not fit its panel)
            Chromostereopsis.parameters(options)
            trials.push({ set: set, options: options })
        })
    }
    const perBlock = Math.ceil(trials.length / design.n_blocks)
    trials.forEach((trial, i) => {
        trial.trial = i + 1
        trial.block = Math.floor(i / perBlock) + 1
        trial.trial_in_block = (i % perBlock) + 1
    })
    return trials
}
