// Chromostereopsis stimulus: a JavaScript port of Pyllusion's
// pyllusion/Chromostereopsis/chromostereopsis_parameters.py and chromostereopsis_image.py.
//
// Two square panels side by side, each a dithered coloured disc inside a dithered coloured surround,
// separated by a bare annulus of background. The two panels use the same two colours with the roles
// swapped. `illusion_strength` (-1 to 1) sets how far each disc and its surround sit apart on the
// color1-color2 axis: at 1 the discs are the pure colours, at 0 everything is the midpoint mix and the
// two panels are identical. `difference` is the objective area difference between the two discs
// (positive = left larger), defined as in Pyllusion's Delboeuf.
//
// Geometry uses Pyllusion's grid units: sizes are a proportion of the canvas height (2 = full height),
// positions run from -1 to 1 across the width.

const Chromostereopsis = (() => {
    // --- Colour helpers -------------------------------------------------------------------------
    const _ctx = document.createElement("canvas").getContext("2d")

    function parseColor(color) {
        if (Array.isArray(color)) return color.map((c) => Math.round(c))
        _ctx.fillStyle = "#000000"
        _ctx.fillStyle = color // the browser normalises any CSS colour to #rrggbb
        const hex = _ctx.fillStyle
        return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)]
    }

    function srgbToLinear(rgb) {
        return rgb.map((c) => {
            const v = c / 255
            return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
        })
    }

    function linearToSrgb(linear) {
        return linear.map((v) => {
            v = Math.min(Math.max(v, 0), 1)
            const s = v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055
            return Math.min(Math.max(Math.round(s * 255), 0), 255)
        })
    }

    // Relative luminance, 0 (black) to 1 (white), same convention as pyllusion.analyze_luminance()
    function relativeLuminance(rgb) {
        const l = srgbToLinear(rgb)
        return 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2]
    }

    // Scale a colour's luminance in linear light (0.5 really is half the luminance)
    function scaleLuminance(rgb, factor) {
        return linearToSrgb(srgbToLinear(rgb).map((v) => v * factor))
    }

    // Mix two colours in linear light; `weight` is the proportion of rgb1
    function mixColors(rgb1, rgb2, weight) {
        if (weight >= 1) return rgb1.slice()
        if (weight <= 0) return rgb2.slice()
        const a = srgbToLinear(rgb1)
        const b = srgbToLinear(rgb2)
        return linearToSrgb(a.map((v, i) => weight * v + (1 - weight) * b[i]))
    }

    // --- Geometry helpers -----------------------------------------------------------------------
    // Area of a disc clipped to the panel, in units where the panel has area 4 (runs -1..1 per axis)
    function discArea(radius) {
        if (radius <= 0) return 0
        if (radius <= 1) return Math.PI * radius * radius
        if (radius >= Math.SQRT2) return 4
        const segment = radius * radius * Math.acos(1 / radius) - Math.sqrt(radius * radius - 1)
        return Math.PI * radius * radius - 4 * segment
    }

    // Panel side at which disc area equals surround area (exact only when difference = 0)
    function sizePanelAreaMatched(size, gap) {
        const r = size / 2
        return Math.sqrt(Math.PI * (r * r + (r + gap) * (r + gap)))
    }

    // --- Parameters (port of _chromostereopsis_parameters) --------------------------------------
    const DEFAULTS = {
        difference: 0,
        illusion_strength: 0,
        size: 0.25,
        size_panel: null, // null = fill each half, "match" = area-matched, or a number in grid units
        gap: 0.02,
        distance: 1,
        width: 800,
        height: 600,
        color1: "red",
        color2: "blue",
        luminance1: 1.0,
        luminance2: 1.0,
        equiluminant: false,
        background: "black",
        density: 0.5,
        density_inner: null,
        dither_size: 2,
        dither_shared: true,
        seed: null,
    }

    function parameters(options = {}) {
        const o = Object.assign({}, DEFAULTS, options)
        if (o.density_inner === null || o.density_inner === undefined) o.density_inner = o.density
        if (o.seed === null || o.seed === undefined) o.seed = Math.floor(Math.random() * 2 ** 31)

        // Colours
        let rgb1 = scaleLuminance(parseColor(o.color1), o.luminance1)
        let rgb2 = scaleLuminance(parseColor(o.color2), o.luminance2)
        let lum1 = relativeLuminance(rgb1)
        let lum2 = relativeLuminance(rgb2)
        if (o.equiluminant === true) {
            const target = Math.min(lum1, lum2)
            if (lum1 > target && lum1 > 0) rgb1 = scaleLuminance(rgb1, target / lum1)
            if (lum2 > target && lum2 > 0) rgb2 = scaleLuminance(rgb2, target / lum2)
            lum1 = relativeLuminance(rgb1)
            lum2 = relativeLuminance(rgb2)
        }
        const rgbBackground = parseColor(o.background)
        const lumBackground = relativeLuminance(rgbBackground)
        const contrast = (lum) => {
            const total = lum + lumBackground
            return total > 0 ? (lum - lumBackground) / total : 0
        }

        // Geometry (grid units)
        // Same rule as Delboeuf: the smaller disc stays at `size`, the larger grows by sqrt(1 + |d|)
        const sizeBigger = Math.sqrt(1 + Math.abs(o.difference)) * o.size
        let sizeLeft, sizeRight
        if (o.difference > 0) {
            sizeLeft = sizeBigger
            sizeRight = o.size
        } else {
            sizeLeft = o.size
            sizeRight = sizeBigger
        }

        let sizePanel, sizePanelMode
        if (o.size_panel === null || o.size_panel === undefined) {
            sizePanelMode = "fill"
            sizePanel = (o.distance * o.width) / o.height
        } else if (o.size_panel === "match") {
            // Matched for the larger disc, so the panel always fits it whatever the difference is
            sizePanelMode = "match"
            sizePanel = sizePanelAreaMatched(sizeBigger, o.gap)
        } else if (typeof o.size_panel === "number") {
            sizePanelMode = "manual"
            sizePanel = o.size_panel
        } else {
            throw new Error("size_panel must be a number, null (fill) or 'match', not " + o.size_panel)
        }
        const positionLeft = -o.distance / 2
        const positionRight = o.distance / 2
        const sizePanelPx = (sizePanel / 2) * o.height

        const radiusLeft = sizeLeft / sizePanel
        const radiusRight = sizeRight / sizePanel
        const gapRelative = (2 * o.gap) / sizePanel
        if (Math.max(radiusLeft, radiusRight) + gapRelative > 1) {
            throw new Error(
                "The disc (size=" + Math.max(sizeLeft, sizeRight).toFixed(3) + ") plus its gap (" + o.gap +
                ") does not fit inside the panel (size_panel=" + sizePanel.toFixed(3) + ")."
            )
        }

        // Illusion strength: chromatic separation between each disc and its surround
        if (Math.abs(o.illusion_strength) > 1) {
            throw new Error("illusion_strength must be between -1 and 1, not " + o.illusion_strength)
        }
        const weight = 0.5 + Math.abs(o.illusion_strength) / 2
        const innerColor1 = mixColors(rgb1, rgb2, weight)
        const surroundColor1 = mixColors(rgb1, rgb2, 1 - weight)
        const lumInnerColor1 = relativeLuminance(innerColor1)
        const lumSurroundColor1 = relativeLuminance(surroundColor1)

        let innerLeft, surroundLeft, lumInnerLeft, lumSurroundLeft, mixInnerLeft
        if (o.illusion_strength >= 0) {
            innerLeft = innerColor1
            surroundLeft = surroundColor1
            lumInnerLeft = lumInnerColor1
            lumSurroundLeft = lumSurroundColor1
            mixInnerLeft = weight
        } else {
            innerLeft = surroundColor1
            surroundLeft = innerColor1
            lumInnerLeft = lumSurroundColor1
            lumSurroundLeft = lumInnerColor1
            mixInnerLeft = 1 - weight
        }
        const innerRight = surroundLeft
        const surroundRight = innerLeft
        const lumInnerRight = lumSurroundLeft
        const lumSurroundRight = lumInnerLeft

        // Predicted mean luminance of each panel (analytic, from areas and densities)
        const panelLuminance = (radius, lumInner, lumSurround) => {
            const areaDisc = discArea(radius) / 4
            const areaSurround = 1 - discArea(radius + gapRelative) / 4
            const areaGap = 1 - areaDisc - areaSurround
            return (
                areaDisc * (o.density_inner * lumInner + (1 - o.density_inner) * lumBackground) +
                areaSurround * (o.density * lumSurround + (1 - o.density) * lumBackground) +
                areaGap * lumBackground
            )
        }
        const panelLeft = panelLuminance(radiusLeft, lumInnerLeft, lumSurroundLeft)
        const panelRight = panelLuminance(radiusRight, lumInnerRight, lumSurroundRight)

        return {
            Difference: o.difference,
            Size_Left: sizeLeft,
            Size_Right: sizeRight,
            Illusion: "Chromostereopsis",
            Illusion_Strength: o.illusion_strength,
            Illusion_Type: "Undetermined",
            Color1: o.color1,
            Color2: o.color2,
            Color_Inner_Left: innerLeft,
            Color_Surround_Left: surroundLeft,
            Color_Inner_Right: innerRight,
            Color_Surround_Right: surroundRight,
            Color_Background: rgbBackground,
            Luminance1: o.luminance1,
            Luminance2: o.luminance2,
            Equiluminant: o.equiluminant,
            Mix_Inner_Left: mixInnerLeft,
            Mix_Inner_Right: 1 - mixInnerLeft,
            Luminance_Color1: lum1,
            Luminance_Color2: lum2,
            Luminance_Inner_Left: lumInnerLeft,
            Luminance_Inner_Right: lumInnerRight,
            Luminance_Background: lumBackground,
            Luminance_Ratio: lum2 > 0 ? lum1 / lum2 : Infinity,
            Luminance_Ratio_Inner: lumInnerRight > 0 ? lumInnerLeft / lumInnerRight : Infinity,
            Contrast_Color1: contrast(lum1),
            Contrast_Color2: contrast(lum2),
            Luminance_Panel_Left: panelLeft,
            Luminance_Panel_Right: panelRight,
            Luminance_Panel_Ratio: panelRight > 0 ? panelLeft / panelRight : Infinity,
            Size: o.size,
            Size_Panel: sizePanel,
            Size_Panel_Mode: sizePanelMode,
            Gap: o.gap,
            Distance: o.distance,
            Position_Left: positionLeft,
            Position_Right: positionRight,
            Area_Disc_Left: discArea(radiusLeft) / 4,
            Area_Surround_Left: 1 - discArea(radiusLeft + gapRelative) / 4,
            Radius_Left: radiusLeft,
            Radius_Right: radiusRight,
            Gap_Relative: gapRelative,
            Density: o.density,
            Density_Inner: o.density_inner,
            Dither_Size: o.dither_size,
            Dither_Cells_Across: o.dither_size ? sizePanelPx / o.dither_size : NaN,
            Dither_Shared: o.dither_shared,
            Seed: o.seed,
            Width: o.width,
            Height: o.height,
        }
    }

    // --- Rendering (port of _chromostereopsis_image) --------------------------------------------
    // Small seeded PRNG so a trial can be re-rendered from its recorded seed
    function mulberry32(seed) {
        let a = seed >>> 0
        return function () {
            a = (a + 0x6d2b79f5) | 0
            let t = Math.imul(a ^ (a >>> 15), 1 | a)
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296
        }
    }

    // Uniform [0, 1) draw per dither cell, upsampled to size x size pixels (row-major Float32Array)
    function dither(size, ditherSize, rng) {
        const nCells = Math.ceil(size / ditherSize)
        const cells = new Float32Array(nCells * nCells)
        for (let i = 0; i < cells.length; i++) cells[i] = rng()
        const out = new Float32Array(size * size)
        for (let y = 0; y < size; y++) {
            const cy = Math.floor(y / ditherSize)
            for (let x = 0; x < size; x++) {
                out[y * size + x] = cells[cy * nCells + Math.floor(x / ditherSize)]
            }
        }
        return out
    }

    // Draw one panel into the canvas ImageData at (x0, y0)
    function drawPanel(image, x0, y0, size, colorInner, colorSurround, radius, gap, density, densityInner, dith) {
        const half = Math.floor(size / 2) // centre on a pixel, whatever the panel's parity
        const W = image.width
        for (let y = 0; y < size; y++) {
            const dy = y - half
            const py = y0 + y
            if (py < 0 || py >= image.height) continue
            for (let x = 0; x < size; x++) {
                const px = x0 + x
                if (px < 0 || px >= W) continue
                const dx = x - half
                const d = Math.sqrt(dx * dx + dy * dy)
                const v = dith[y * size + x]
                let c = null
                if (d <= radius) {
                    if (v < densityInner) c = colorInner
                } else if (d > radius + gap) {
                    if (v < density) c = colorSurround
                }
                if (c !== null) {
                    const i = (py * W + px) * 4
                    image.data[i] = c[0]
                    image.data[i + 1] = c[1]
                    image.data[i + 2] = c[2]
                }
            }
        }
    }

    // Pixel rectangles of the two panels on the canvas: grid units -> pixels, sizes against the
    // height (scale 0..2), positions against the width (-1..1). Used by draw() and by the mask.
    function panelRects(params) {
        const size = Math.floor((params.Size_Panel / 2) * params.Height)
        const y = Math.floor((params.Height - size) / 2)
        return ["Left", "Right"].map((side) => {
            const x = Math.floor(((params["Position_" + side] + 1) / 2) * params.Width)
            return { side: side, x: x - Math.floor(size / 2), y: y, size: size }
        })
    }

    function draw(canvas, params) {
        const width = params.Width
        const height = params.Height
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")
        const image = ctx.createImageData(width, height)
        const bg = params.Color_Background
        for (let i = 0; i < image.data.length; i += 4) {
            image.data[i] = bg[0]
            image.data[i + 1] = bg[1]
            image.data[i + 2] = bg[2]
            image.data[i + 3] = 255
        }

        const rng = mulberry32(params.Seed)
        const rects = panelRects(params)
        const panelSize = rects[0].size
        let shared = null
        if (params.Dither_Shared) shared = dither(panelSize, params.Dither_Size, rng)

        for (const rect of rects) {
            const side = rect.side
            const dith = shared !== null ? shared : dither(panelSize, params.Dither_Size, rng)
            drawPanel(
                image,
                rect.x,
                rect.y,
                panelSize,
                params["Color_Inner_" + side],
                params["Color_Surround_" + side],
                ((params["Size_" + side] / 2) * height) / 2,
                (params.Gap / 2) * height,
                params.Density,
                params.Density_Inner,
                dith
            )
        }
        ctx.putImageData(image, 0, 0)
        return params
    }

    return { DEFAULTS, parameters, draw, panelRects, parseColor, relativeLuminance, mixColors, sizePanelAreaMatched }
})()
