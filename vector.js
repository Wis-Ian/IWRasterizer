export class Vector extends Float32Array {
    constructor(x, y, z){
        super(4);

        if (arguments.length == 3) {
            this[0] = x;
            this[1] = y;
            this[2] = z;
            this[3] = 1;
        }

        if (x instanceof Vector) {
            this[0] = x[0];
            this[1] = x[1];
            this[2] = x[2];
            this[3] = x[3];
        }
    }
    getX() {
        return this[0];
    }
    getY() {
        return this[1];
    }
    getZ() {
        return this[2];
    }

    sub(v) {
        this[0] -= v[0];
        this[1] -= v[1];
        this[2] -= v[2];
    }

    add(v) {
        this[0] += v[0];
        this[1] += v[1];
        this[2] += v[2];
    }

    perspectiveDivide(near) {
        if (this[2] != 0) {
            this[0] = (1 *near * this[0]) / this[2];
            this[1] = (1 * near * this[1]) / this[2];
        }
            return;
    }

    NDCconv() {
        this[0] = 2 * this[0] / canvas.width - 1;
        this[1] = 2 * this[1] / -canvas.height + 1;
    }

    rasterConv() {
        this[0] = ((this[0] + 1) / 2 * canvas.width) + 113;
        this[1] = ((1 - this[1]) / 2 * canvas.height) + 69;
    }

    worldToCamera() {
        this[0] -= 113;
        this[1] -= 69;
    }

    dotProduct(v) {
        return this[0] * v[0] + this[1] * v[1] + this[2] * v[2];
    }

    makeUnit() {
        let vecLength = Math.sqrt(this[0]**2 + this[1]**2 + this[2]**2);

        for (let i = 0; i < 3; i++) {
            this[i] = this[i] / vecLength;
        }
        
    }

}
