class Camera {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.scale = 1;
    }

    preRender() {
        c.save();
        c.scale(this.scale, this.scale);
        c.translate(-this.x, -this.y);
    }

    postRender() {
        c.restore();
    }
}