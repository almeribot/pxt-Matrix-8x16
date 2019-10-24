//% weight=10 color=#9F79EE icon="\uf108"
namespace Matrix {

    let initializedMatrix = false
    const HT16K33_ADDRESS = 0x70
    const HT16K33_BLINK_CMD = 0x80
    const HT16K33_BLINK_DISPLAYON = 0x01
    const HT16K33_CMD_BRIGHTNESS = 0xE0
    let matBuf = pins.createBuffer(17);

    function matrixInit() {
        i2ccmd(HT16K33_ADDRESS, 0x21);// turn on oscillator
        i2ccmd(HT16K33_ADDRESS, HT16K33_BLINK_CMD | HT16K33_BLINK_DISPLAYON | (0 << 1));
        i2ccmd(HT16K33_ADDRESS, HT16K33_CMD_BRIGHTNESS | 0xF);
    }
    function i2ccmd(addr: number, value: number) {
        let buf = pins.createBuffer(1)
        buf[0] = value
        pins.i2cWriteBuffer(addr, buf)
    }
    function matrixShow() {
        matBuf[0] = 0x00;
        pins.i2cWriteBuffer(HT16K33_ADDRESS, matBuf);
    }
    //% blockId=robotbit_matrix_refresh block="Matrix Refresh"
    //% weight=69
    export function MatrixRefresh(): void {
        if (!initializedMatrix) {
            matrixInit();
            initializedMatrix = true;
        }
        matrixShow();
    }

    //% blockId=robotbit_matrix_clear block="Matrix Clear"
    //% weight=65
    //% blockGap=50
    export function MatrixClear(): void {
        if (!initializedMatrix) {
            matrixInit();
            initializedMatrix = true;
        }
        for (let i = 0; i < 16; i++) {
            matBuf[i + 1] = 0;
        }
        matrixShow();
    }
    //% blockId=robotbit_matrix_draw block="Matrix Draw|X %x|Y %y"
    //% weight=69
    export function MatrixDraw(x: number, y: number): void {
        if (!initializedMatrix) {
            matrixInit();
            initializedMatrix = true;
        }
        x = Math.round(x)
        y = Math.round(y)

        let idx = y * 2 + Math.idiv(x, 8);

        let tmp = matBuf[idx + 1];
        tmp |= (1 << (x % 8));
        matBuf[idx + 1] = tmp;
    }
}