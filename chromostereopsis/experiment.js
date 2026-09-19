// Experiment runtime: screens, trial loop, timing, data logging and export. No dependencies.
// Works with a keyboard (arrow keys, space) and with touch (tap the left or right half of the screen).

const Experiment = (() => {
    // --- Data log -------------------------------------------------------------------------------
    // One JSON container for the whole session. Each trial is logged as its own object holding the
    // trial's order, timing, response and the full stimulus parameter dictionary.
    // Random participant id (8 alphanumeric characters) plus the session's date and time, both as an
    // ISO timestamp (UTC) and as the participant's local date/time with their timezone
    function randomId(n = 8) {
        const alphabet = "abcdefghijkmnpqrstuvwxyz23456789"
        const bytes = new Uint8Array(n)
        ;(window.crypto || {}).getRandomValues ? crypto.getRandomValues(bytes) : bytes.forEach((_, i) => (bytes[i] = Math.random() * 256))
        return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("")
    }
    const started = new Date()
    const pad = (n) => String(n).padStart(2, "0")
    const log = {
        session: {
            participant_id: randomId(),
            start_time: started.toISOString(),
            date: started.getFullYear() + "-" + pad(started.getMonth() + 1) + "-" + pad(started.getDate()),
            time: pad(started.getHours()) + ":" + pad(started.getMinutes()) + ":" + pad(started.getSeconds()),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || null,
        },
        demographics: {},
        design: null,
        trials: [],
    }
    let trials = []
    let canvasSize = { width: 800, height: 600 }

    const isTouch = navigator.maxTouchPoints > 0 || "ontouchstart" in window

    // --- Screens --------------------------------------------------------------------------------
    function show(id) {
        document.querySelectorAll(".screen").forEach((s) => (s.style.display = "none"))
        document.getElementById(id).style.display = "flex"
    }

    // Show the keyboard or the touch wording of the instructions
    function applyInputWording() {
        document.querySelectorAll(".kb-only").forEach((e) => (e.style.display = isTouch ? "none" : ""))
        document.querySelectorAll(".touch-only").forEach((e) => (e.style.display = isTouch ? "" : "none"))
    }

    // --- Responses: keyboard and touch ----------------------------------------------------------
    // `keys` are KeyboardEvent.code values ("ArrowLeft", "Space"); event.key is accepted as well.
    // With `touch`, a tap on the left half of the screen counts as ArrowLeft, on the right half as
    // ArrowRight, and any tap counts as Space when Space is the only key expected.
    const KEY_ALIASES = { " ": "Space", Spacebar: "Space", Left: "ArrowLeft", Right: "ArrowRight" }

    function waitForResponse(keys, touch = true) {
        return new Promise((resolve) => {
            function done(key, modality, extra) {
                document.removeEventListener("keydown", onKey)
                document.removeEventListener("pointerdown", onPointer)
                resolve(Object.assign({ key: key, modality: modality, time: performance.now() }, extra))
            }
            function onKey(event) {
                if (event.repeat) return
                const pressed = keys.includes(event.code) ? event.code : KEY_ALIASES[event.key] || event.key
                if (keys.includes(pressed)) {
                    event.preventDefault()
                    done(pressed, "keyboard", {})
                }
            }
            function onPointer(event) {
                if (!touch) return
                if (event.pointerType === "mouse" && event.button !== 0) return
                let key
                if (keys.length === 1 && keys[0] === "Space") {
                    key = "Space"
                } else {
                    key = event.clientX < window.innerWidth / 2 ? "ArrowLeft" : "ArrowRight"
                }
                if (keys.includes(key)) {
                    event.preventDefault()
                    done(key, event.pointerType || "touch", { x: Math.round(event.clientX), y: Math.round(event.clientY) })
                }
            }
            document.addEventListener("keydown", onKey)
            document.addEventListener("pointerdown", onPointer)
        })
    }

    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    // Resolves, with a timestamp, at the start of the next frame: the callback runs just before the
    // browser paints, so style changes made before the call are on screen within that frame. Falls
    // back to a timer in case the browser is not painting at all (e.g. the tab is not visible), so a
    // trial cannot hang.
    function nextPaint() {
        return Promise.race([
            new Promise((resolve) => requestAnimationFrame(() => resolve(performance.now()))),
            sleep(250).then(() => performance.now()),
        ])
    }

    // --- Canvas size: fixed for the session, 4:3 like Pyllusion's 800x600, fitted to the viewport -
    function fitCanvas() {
        let h = Math.floor(Math.min(window.innerHeight * 0.85, (window.innerWidth * 0.96 * 3) / 4))
        // A window without usable dimensions (hidden tab, not yet laid out) falls back to Pyllusion's
        // default 800x600 rather than a zero-sized canvas, which cannot be drawn on
        if (!(h >= 120)) h = 600
        canvasSize = { width: Math.floor((h * 4) / 3), height: h }
        const canvas = document.getElementById("stimulus")
        canvas.width = canvasSize.width
        canvas.height = canvasSize.height
    }

    // --- Demographics ---------------------------------------------------------------------------
    function readDemographics() {
        const form = document.getElementById("demographics-form")
        const out = { correction_type: "" }
        for (const [key, value] of new FormData(form).entries()) {
            // Checkbox groups (correction type) are joined with ";"
            out[key] = out[key] ? out[key] + ";" + value : value
        }
        return out
    }

    // The correction questions only appear (and are only required) for glasses/contact wearers
    function toggleCorrectionDetails() {
        const checked = document.querySelector("input[name=glasses]:checked")
        const wears = checked !== null && checked.value !== "none"
        const details = document.getElementById("correction-details")
        details.hidden = !wears
        document.querySelector("input[name=correction_now]").required = wears
        if (!wears) {
            details.querySelectorAll("input").forEach((input) => (input.checked = false))
        }
    }

    // --- Instructions: worked examples with the correct response animated -----------------------
    // Same colour context in both (red disc on blue on the left), only the size difference changes.
    // The difference is far larger than any used in the task, so the answer is obvious.
    function drawExamples() {
        const examples = [
            { canvas: "example-left", difference: 1.5, illusion_strength: 1 },
            { canvas: "example-right", difference: -1.5, illusion_strength: 1 },
        ]
        for (const example of examples) {
            const canvas = document.getElementById(example.canvas)
            const params = Chromostereopsis.parameters(
                Object.assign({}, DESIGN.fixed, {
                    width: canvas.width,
                    height: canvas.height,
                    size: 0.4,
                    difference: example.difference,
                    illusion_strength: example.illusion_strength,
                    seed: 1,
                })
            )
            Chromostereopsis.draw(canvas, params)
        }
    }

    // --- Mask: achromatic dynamic noise over each panel, to cut the colour afterimage -------------
    // Two noise squares at exactly the positions and sizes of the two panels just shown; the rest of
    // the canvas is the background.
    async function showMask(canvas, params) {
        const m = DESIGN.mask
        if (!m || m.duration <= 0) return 0
        const ctx = canvas.getContext("2d")
        const rects = Chromostereopsis.panelRects(params)
        const size = rects[0].size
        const cols = Math.ceil(size / m.cell)
        const image = ctx.createImageData(size, size)
        const data = image.data
        const cells = new Uint8Array(cols * cols)
        const bg = params.Color_Background
        ctx.fillStyle = "rgb(" + bg.join(",") + ")"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        const start = performance.now()
        while (performance.now() - start < m.duration) {
            for (const rect of rects) {
                for (let i = 0; i < cells.length; i++) cells[i] = Math.floor(Math.random() * (m.max_grey + 1))
                for (let y = 0; y < size; y++) {
                    const row = Math.floor(y / m.cell) * cols
                    for (let x = 0; x < size; x++) {
                        const g = cells[row + Math.floor(x / m.cell)]
                        const i = (y * size + x) * 4
                        data[i] = g
                        data[i + 1] = g
                        data[i + 2] = g
                        data[i + 3] = 255
                    }
                }
                ctx.putImageData(image, rect.x, rect.y)
            }
            await sleep(Math.min(m.refresh, m.duration - (performance.now() - start)))
        }
        return Math.round(performance.now() - start)
    }

    // --- Progress bar (per block) ---------------------------------------------------------------
    function setProgress(done, total) {
        document.getElementById("progress-fill").style.width = Math.round((100 * done) / total) + "%"
    }

    // --- One trial ------------------------------------------------------------------------------
    async function runTrial(trial, perBlock) {
        const fixation = document.getElementById("fixation")
        const canvas = document.getElementById("stimulus")
        setProgress(trial.trial_in_block - 1, perBlock)

        // Fixation cross with jittered duration: this is the inter-stimulus interval (ISI). The cross
        // is painted first, then the stimulus is rendered into the hidden canvas while the cross is
        // up, with the rendering time counted as part of the ISI. Showing the stimulus is then a
        // single visibility flip of a canvas whose bitmap is already complete.
        canvas.style.visibility = "hidden"
        fixation.style.visibility = "visible"
        const isi = randomInteger(DESIGN.fixation_duration[0], DESIGN.fixation_duration[1])
        const fixationOnset = await nextPaint()
        const params = Chromostereopsis.parameters(trial.options)
        Chromostereopsis.draw(canvas, params)
        const renderTime = performance.now() - fixationOnset
        await sleep(Math.max(0, isi - renderTime))

        fixation.style.visibility = "hidden"
        canvas.style.visibility = "visible"
        const onset = await nextPaint()
        const response = await waitForResponse(["ArrowLeft", "ArrowRight"])
        // Replace the stimulus by the noise mask at once (the canvas stays visible), then blank it
        const maskDuration = await showMask(canvas, params)
        canvas.style.visibility = "hidden"
        setProgress(trial.trial_in_block, perBlock)

        const correctResponse = params.Difference > 0 ? "ArrowLeft" : "ArrowRight"
        log.trials.push({
            order: trial.trial,
            set: trial.set,
            block: trial.block,
            trial_in_block: trial.trial_in_block,
            isi: isi,
            render_time: Math.round(renderTime * 100) / 100, // ms spent drawing the stimulus during the ISI
            stimulus_onset: Math.round(onset),
            response: response.key,
            response_modality: response.modality, // "keyboard", "touch", "mouse" or "pen"
            response_x: response.x ?? null, // tap position, for touch/mouse responses
            response_y: response.y ?? null,
            correct_response: correctResponse,
            correct: response.key === correctResponse,
            rt: Math.round((response.time - onset) * 100) / 100,
            mask_duration: maskDuration,
            parameters: params,
        })
        await sleep(200) // short blank between the mask and the next fixation
    }

    // --- Blocks ---------------------------------------------------------------------------------
    function summary(items) {
        const accuracy = items.filter((t) => t.correct).length / items.length
        const rt = items.reduce((s, t) => s + t.rt, 0) / items.length
        return "<p>Accuracy: <b>" + Math.round(accuracy * 100) + "%</b>, average response time: <b>" +
            Math.round(rt) + " ms</b>.</p>"
    }

    async function runBlocks() {
        show("screen-trial")
        for (let block = 1; block <= DESIGN.n_blocks; block++) {
            const blockTrials = trials.filter((t) => t.block === block)
            document.getElementById("progress-label").textContent = "Block " + block + " / " + DESIGN.n_blocks
            for (const trial of blockTrials) await runTrial(trial, blockTrials.length)
            if (block < DESIGN.n_blocks) {
                document.getElementById("break-text").innerHTML =
                    "<p>Block " + block + " of " + DESIGN.n_blocks + " done.</p>" +
                    summary(log.trials.filter((t) => t.block === block)) +
                    "<p>Take a short break. " +
                    (isTouch ? "<b>Tap the screen</b>" : "Press <b>space</b>") +
                    " when you are ready to continue.</p>"
                show("screen-break")
                await sleep(500) // so that the response to the last trial cannot skip the break
                await waitForResponse(["Space"])
                show("screen-trial")
            }
        }
    }

    // --- Data export ----------------------------------------------------------------------------
    function sessionInfo() {
        return Object.assign(log.session, {
            touch_device: isTouch,
            canvas_width: canvasSize.width,
            canvas_height: canvasSize.height,
            window_width: window.innerWidth,
            window_height: window.innerHeight,
            screen_width: screen.width,
            screen_height: screen.height,
            device_pixel_ratio: window.devicePixelRatio,
            fullscreen: document.fullscreenElement !== null,
            user_agent: navigator.userAgent,
            end_time: new Date().toISOString(),
        })
    }

    // Flat version: one row per trial, session and demographics repeated, parameters spread out
    function flatRows() {
        return log.trials.map((t) => {
            const row = Object.assign({}, log.session, log.demographics)
            for (const [key, value] of Object.entries(t)) {
                if (key === "parameters") {
                    for (const [k, v] of Object.entries(value)) row[k] = Array.isArray(v) ? v.join(",") : v
                } else {
                    row[key] = value
                }
            }
            return row
        })
    }

    function toCSV(data) {
        const keys = []
        for (const row of data) for (const k of Object.keys(row)) if (!keys.includes(k)) keys.push(k)
        const escape = (v) => {
            if (v === null || v === undefined) return ""
            const s = String(v)
            return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s
        }
        const lines = [keys.join(",")]
        for (const row of data) lines.push(keys.map((k) => escape(row[k])).join(","))
        return lines.join("\n")
    }

    function download(filename, text, type) {
        const blob = new Blob([text], { type: type })
        const a = document.createElement("a")
        a.href = URL.createObjectURL(blob)
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(a.href)
    }

    function finish() {
        if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
        sessionInfo()
        const json = JSON.stringify(log, null, 2)
        const name = "chromostereopsis_" + log.session.participant_id
        document.getElementById("end-summary").innerHTML = summary(log.trials)
        document.getElementById("data-preview").value = json
        document.getElementById("download-json").onclick = () => download(name + ".json", json, "application/json")
        document.getElementById("download-csv").onclick = () => download(name + ".csv", toCSV(flatRows()), "text/csv")
        show("screen-end")
        window.CHROMOSTEREOPSIS_DATA = log // also reachable from the console
    }

    // --- Flow -----------------------------------------------------------------------------------
    function start() {
        applyInputWording()
        document.getElementById("consent-form").onsubmit = (event) => {
            event.preventDefault()
            log.session.consent_time = new Date().toISOString()
            document.documentElement.requestFullscreen?.().catch(() => {}) // needs a user gesture
            show("screen-demographics")
        }
        document.querySelectorAll("input[name=glasses]").forEach((input) => (input.onchange = toggleCorrectionDetails))
        document.getElementById("demographics-form").onsubmit = (event) => {
            event.preventDefault()
            log.demographics = readDemographics()
            drawExamples()
            show("screen-instructions")
        }
        document.getElementById("instructions-button").onclick = async () => {
            fitCanvas()
            trials = makeTrials(DESIGN, canvasSize.width, canvasSize.height)
            log.design = { n_sets: DESIGN.n_sets, n_per_set: DESIGN.n_per_set, n_total: DESIGN.n_total,
                n_blocks: DESIGN.n_blocks, difference: DESIGN.difference,
                illusion_strength: DESIGN.illusion_strength, factors: DESIGN.factors, fixed: DESIGN.fixed,
                fixation_duration: DESIGN.fixation_duration, mask: DESIGN.mask }
            await runBlocks()
            finish()
        }
        document.getElementById("n-trials").textContent = DESIGN.n_total
        document.getElementById("n-blocks").textContent = DESIGN.n_blocks
        show("screen-consent")
    }

    return { start, log, isTouch, get trials() { return trials } }
})()

document.addEventListener("DOMContentLoaded", Experiment.start)
