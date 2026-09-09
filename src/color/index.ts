export const Color = {
    RED: '#ff0011',
    GREEN: '#00ff00',
    BLUE: '#0000ff',
    BLACK: '#000000',
    WHITE: '#ffffff'
} as const;

/**
 * Converts hex to Rgba
 * @param hex
 */
export function hexToRgba(hex: string): [number, number, number, number] {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    return [r, g, b, 1];
}