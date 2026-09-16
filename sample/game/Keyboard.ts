export class Keyboard {
    private readonly pressed = new Set<string>();
    private readonly justPressed = new Set<string>();
    private readonly ac = new AbortController();

    constructor() {
        const { signal } = this.ac;
        window.addEventListener("keydown", (e) => {
            if (!this.pressed.has(e.code)) this.justPressed.add(e.code); // ignore auto-repeat
            this.pressed.add(e.code);
        }, { signal });
        window.addEventListener("keyup", (e) => this.pressed.delete(e.code), { signal });
        window.addEventListener("blur", () => { this.pressed.clear(); this.justPressed.clear(); }, { signal });
    }
    isDown(code: KeyCode): boolean { return this.pressed.has(code); }
    wasPressed(code: KeyCode): boolean { return this.justPressed.has(code); }
    update(): void { this.justPressed.clear(); }

    dispose(): void {
        this.ac.abort();
    }

    static readonly keys = {
        // letters
        A: "KeyA",
        B: "KeyB",
        C: "KeyC",
        D: "KeyD",
        E: "KeyE",
        F: "KeyF",
        G: "KeyG",
        H: "KeyH",
        I: "KeyI",
        J: "KeyJ",
        K: "KeyK",
        L: "KeyL",
        M: "KeyM",
        N: "KeyN",
        O: "KeyO",
        P: "KeyP",
        Q: "KeyQ",
        R: "KeyR",
        S: "KeyS",
        T: "KeyT",
        U: "KeyU",
        V: "KeyV",
        W: "KeyW",
        X: "KeyX",
        Y: "KeyY",
        Z: "KeyZ",

        // digits (top row)
        Digit0: "Digit0",
        Digit1: "Digit1",
        Digit2: "Digit2",
        Digit3: "Digit3",
        Digit4: "Digit4",
        Digit5: "Digit5",
        Digit6: "Digit6",
        Digit7: "Digit7",
        Digit8: "Digit8",
        Digit9: "Digit9",

        // arrows
        ArrowUp: "ArrowUp",
        ArrowDown: "ArrowDown",
        ArrowLeft: "ArrowLeft",
        ArrowRight: "ArrowRight",

        // whitespace & editing
        Space: "Space",
        Enter: "Enter",
        Tab: "Tab",
        Backspace: "Backspace",
        Escape: "Escape",

        // modifiers (left/right are distinct codes)
        ShiftLeft: "ShiftLeft",
        ShiftRight: "ShiftRight",
        ControlLeft: "ControlLeft",
        ControlRight: "ControlRight",
        AltLeft: "AltLeft",
        AltRight: "AltRight",
    } as const;
}

export type KeyCode = (typeof Keyboard.keys)[keyof typeof Keyboard.keys];