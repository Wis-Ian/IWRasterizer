import {Vector} from "./vector.js";

export class Triangle {
    constructor(vertexIndicies, screenBuffer) {
        this.buffer = screenBuffer;
        this.vertexIndicies = vertexIndicies
        
        this.vaIndex = vertexIndicies[0];
        this.vbIndex = vertexIndicies[1];
        this.vcIndex = vertexIndicies[2];
    }

    getDeterminant(a, b, c) {
        const ab = new Vector(b);
        ab.sub(a);

        const ac = new Vector(c);
        ac.sub(a);

        return ab[1] * ac[0] - ab[0] * ac[1]
    }

    getUnitNormal(a, b, c) {
        let u = new Vector();
        const ab = new Vector(b);
        ab.sub(a);

        const ac = new Vector(c);
        ac.sub(a);

        u[0] = (ab[1]*ac[2] - ab[2]*ac[1]);
        u[1] = (-1 * ab[0]*ac[2] - ab[2]*ac[0]);
        u[2] = (ab[0]*ac[1] - ab[1]*ac[0]);

        u.makeUnit();

        return u;
    }



    draw(coordinates, color, lp) {
        const va = coordinates[this.vaIndex];
        const vb = coordinates[this.vbIndex];
        const vc = coordinates[this.vcIndex];

        let lightVector = new Vector(va);
        lightVector.sub(lp);

        lightVector.makeUnit();
        let triNorm = this.getUnitNormal(va, vb, vc);

        let cv = lightVector.dotProduct(triNorm);

        let adjcolor = new Vector(color);

        for (let i = 0; i < 3; i++) {
            adjcolor[i] -= cv * 100;
        }


        const unitNormal = this.getUnitNormal(va, vb, vc);

        let adjcoordinates = [];
        adjcoordinates.push(new Vector(va));
        adjcoordinates.push(new Vector(vb));
        adjcoordinates.push(new Vector(vc));

        const determinant = this.getDeterminant(adjcoordinates[0], adjcoordinates[1], adjcoordinates[2]);
        if (determinant < 0) {
            return;
        }

        for (let i = 0; i <3; i++) {
            adjcoordinates[i].worldToCamera();
        }

        for (let i = 0; i < 3; i++) {
            adjcoordinates[i].perspectiveDivide(50);
        }


        for (let i = 0; i <3; i++) {
            adjcoordinates[i].NDCconv();
        }

        for (let i = 0; i <3; i++) {
            adjcoordinates[i].rasterConv();
        }

        
        const ava = adjcoordinates[0];
        const avb = adjcoordinates[1];
        const avc = adjcoordinates[2];

        const ymin = Math.round(Math.min(ava[1],avb[1],avc[1]));
        const xmin = Math.round(Math.min(ava[0],avb[0],avc[0]));

        const ymax = Math.round(Math.max(ava[1],avb[1],avc[1]));
        const xmax = Math.round(Math.max(ava[0],avb[0],avc[0]));

        let imageOffset = 4 * (ymin * this.buffer.width + xmin);

        const imageStride = 4 * (this.buffer.width - (xmax - xmin) - 1);

        const p = new Vector();
        const w = new Vector();

        for (let y = ymin; y <= ymax; y++) {
            for (let x = xmin; x <= xmax; x++) {
                p[0] = x;
                p[1] = y;

                w[0] = this.getDeterminant(avb, avc, p);
                w[1] = this.getDeterminant(avc, ava, p);
                w[2] = this.getDeterminant(ava, avb, p);

                if (this.LTEdge(vb, vc)) w[0]--;
                if (this.LTEdge(vc, va)) w[1]--;
                if (this.LTEdge(va, vb)) w[2]--;

                if (w[0] >= 0 && w[1] >= 0 && w[2] >= 0) {
                    this.buffer.data[imageOffset + 0] = adjcolor[0];
                    this.buffer.data[imageOffset + 1] = adjcolor[1];
                    this.buffer.data[imageOffset + 2] = adjcolor[2];
                    this.buffer.data[imageOffset + 3] = 255;
                }
                imageOffset += 4;
            }
            imageOffset += imageStride;
        }

    }

    LTEdge(start, end) {
        const edge = new Vector(end);
        edge.sub(start);

        const isL = edge[1] > 0;
        const isT = edge[1] == 0 && edge[0] < 0;
        return isL || isT;
    }
    
    setScreenBuffer(newSB) {
        this.buffer = newSB;
    }

}