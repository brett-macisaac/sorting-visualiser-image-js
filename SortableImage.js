// This class offers the same functionality as the Elements one in the other sorting visualiser.

import utils from './utils.js';


class SortableImage
{
    #fCanvas;

    #fCanvasContext;

    #fImageData;

    #fIndexesPixels;

    #fCount = 0;
    #fCountWrites = 0;
    #fMaxCount = 10000;

    // A flag that, when true, indicates that the current process (sort or shuffle), should stop.
    #fStopProcess = false;

    constructor(aSrcImg, aParent)
    {
        this.#fCanvas = document.createElement("canvas");

        // Add this.#fCanvas to aParent.
        aParent.appendChild(this.#fCanvas);

        this.#fCanvasContext = this.#fCanvas.getContext('2d');

        // The image to display in this.#fCanvas.
        const lImage = document.createElement("img");
        lImage.crossOrigin = 'anonymous'; // ???
        lImage.src = `./images/${aSrcImg}`;
        lImage.alt = "Image to sort.";

        lImage.addEventListener('load', 
            () => 
            {
                console.log("Image width: " + lImage.width);
                console.log("Image height: " + lImage.height);

                // this.#fCanvas.style.width = `${lImage.width}px`;
                // this.#fCanvas.style.height = `${lImage.height}px`;

                this.#fCanvas.width = lImage.width;
                this.#fCanvas.height = lImage.height;

                this.#fCanvasContext.drawImage(lImage, 0, 0);

                const lStyleCanvas = window.getComputedStyle(this.#fCanvas);

                console.log("Canvas width: " + lStyleCanvas.width);
                console.log("Canvas height: " + lStyleCanvas.height);

                this.#fImageData = this.#fCanvasContext.getImageData(0, 0, parseFloat(lStyleCanvas.width), parseFloat(lStyleCanvas.height));

                // The number of pixels (and therefore the number of indexes).
                const lNumPixels = this.#fImageData.data.length / 4;

                this.#fIndexesPixels = Array.from({ length: lNumPixels }, (element, index) => index);
            });

    }

    get length()
    {
        return this.#fIndexesPixels.length;
    }

    get stop()
    {
        return this.#fStopProcess;
    }

    GetIndex(aIndex)
    {
        return this.#fIndexesPixels[aIndex];
    }

    SetMaxCount(aMaxCount)
    {
        this.#fMaxCount = aMaxCount;

        if (this.#fCount >= this.#fMaxCount)
        {
            this.#fCount = this.#fMaxCount - 1;
        }

    }

    async Shuffle()
    {
        this.Reset();

        const lNumPixels = this.#fIndexesPixels.length;

        for (let i = 0; i < lNumPixels; ++i)
        {
            if (this.#fStopProcess)
                break;

            const lIndexRandom = utils.GetRandom(i, lNumPixels - 1);

            await this.SwapPixels(i, lIndexRandom);
        }

        this.Reset();

        this.Update();
    }

    async Sort(aSorter, aAscending)
    {
        this.Reset();
        
        await aSorter(this, aAscending);
        //await QuickSort(gArrayIndexes, gImageData.data, true);
        //await MergeSortIterative(gArrayIndexes, gImageData.data, true);
        //await SelectionSort(gArrayIndexes, gImageData.data, true);

        // console.log("Writes: " + PixelManager.countWrites);

        this.Update();

        //this.#fCanvasContext.putImageData(this.#fImageData, 0, 0);

        // console.log("Sorting complete");
        // console.log(gArrayIndexes);
    }

    Stop()
    {
        this.#fStopProcess = true;
    }

    async SwapPixels(aIndex1, aIndex2)
    {
        const lPixelArray = this.#fImageData.data;

        this.countWrites += 2;

        const lIndexRed1 = aIndex1 * 4;
        const lIndexRed2 = aIndex2 * 4;

        for (let i = 0; i < 3; ++i)
        {
            const lColour1 = lPixelArray[lIndexRed1 + i];

            lPixelArray[lIndexRed1 + i] = lPixelArray[lIndexRed2 + i];

            lPixelArray[lIndexRed2 + i] = lColour1;
        }

        // Also swap the indexes.
        const lIndex1 = this.#fIndexesPixels[aIndex1]
        this.#fIndexesPixels[aIndex1] = this.#fIndexesPixels[aIndex2];
        this.#fIndexesPixels[aIndex2] = lIndex1;

        await this.IncrementCount();
    }

    async SetIndexAndPixel(aIndex, aIndexNew, aColour)
    {
        const lPixelArray = this.#fImageData.data;

        ++(this.countWrites);

        const lIndexRed = aIndex * 4;

        for (let i = 0; i < 3; ++i)
        {
            lPixelArray[lIndexRed + i] = aColour[i];
        }

        this.#fIndexesPixels[aIndex] = aIndexNew;

        await this.IncrementCount();
    }

    GetPixelColour(aIndex)
    {
        const lPixelArray = this.#fImageData.data;

        const lIndexRed = aIndex * 4;

        return [ lPixelArray[lIndexRed], lPixelArray[lIndexRed + 1], lPixelArray[lIndexRed + 2] ];
    }

    Reset()
    {
        this.#fCount = 0;
        this.#fCountWrites = 0;
        this.#fStopProcess = false;
    }

    async IncrementCount()
    {
        if (++(this.#fCount) === this.#fMaxCount)
        {
            this.#fCount = 0;
            this.Update();
            await utils.SleepFor(1);
        }
    }

    Update()
    {
        this.#fCanvasContext.putImageData(this.#fImageData, 0, 0);
    }

    Compare(aIndex1, aOperator, aIndex2)
    {
        return utils.Compare(this.#fIndexesPixels[aIndex1], aOperator, this.#fIndexesPixels[aIndex2])
    }

    CompareValue(aIndex, aOperator, aValue)
    {
        return utils.Compare(this.#fIndexesPixels[aIndex], aOperator, aValue);
    }

}

export default SortableImage;