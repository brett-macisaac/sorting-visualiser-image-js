//https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas
// https://github.com/mdn/dom-examples/tree/main/canvas/pixel-manipulation

import utils from "./utils.js";

import SortableImage from "./SortableImage.js";

import sorters from "./sorters.js";


// const gImageCanvas = document.getElementById("imgCanvas");
// const gImageContext = gImageCanvas.getContext('2d');
// let gImageData;
// let gArrayIndexes;

// The image to display in gImageCanvas.
// rhino.jpg: 300 x 227
// mona_lisa.jpg: 840 x 1183
// mona_lisa_small.jpg: 448 x 631
// mona_lisa_tiny.jpg: 283 x 399
// const gImage = document.createElement("img");
// gImage.crossOrigin = 'anonymous'; // ???
// gImage.src = './images/mona_lisa_tiny.jpg';
// gImage.alt = "Image to sort.";

// gImage.addEventListener('load', 
//     () => 
//     {
//         gImageContext.drawImage(gImage, 0, 0);

//         gImageData = gImageContext.getImageData(0, 0, gImageCanvas.width, gImageCanvas.height);

//         // The number of pixels (and therefore the number of indexes).
//         const lNumPixels = gImageData.data.length / 4;

//         gArrayIndexes = Array.from({ length: lNumPixels }, (element, index) => index);
//     });

const gBtnShuffle = document.getElementById("btnShuffle");
const gBtnSort = document.getElementById("btnSort");

const gCmbSorters = document.getElementById("cmbSorters");

const gSortableImage = new SortableImage("mona_lisa_tiny.jpg", document.getElementById("conImageCanvas"));

const gChkAscending = document.getElementById("chkAscending");

const gRngSpeed = document.getElementById("rngSpeed");


function init()
{
    gBtnShuffle.onclick = Shuffle;
    gBtnSort.onclick = Sort;
    gRngSpeed.onchange = ChangeSortSpeed;

    PopulateComboBox();
}
window.onload = init;

async function Shuffle()
{
    ToggleUIDisabled();

    await gSortableImage.Shuffle();

    ToggleUIDisabled();
};


async function Sort()
{
    ToggleUIDisabled();

    await gSortableImage.Sort(sorters[gCmbSorters.options[gCmbSorters.selectedIndex].text], gChkAscending.checked);

    ToggleUIDisabled();
}

function ChangeSortSpeed()
{
    gSortableImage.SetMaxCount(Number(gRngSpeed.value));
}

function ToggleUIDisabled()
{
    gBtnShuffle.disabled = !gBtnShuffle.disabled;
    gBtnSort.disabled = !gBtnSort.disabled;
    gChkAscending.disabled = !gChkAscending.disabled;
    gCmbSorters.disabled = !gCmbSorters.disabled;
}

function PopulateComboBox()
{
    Object.keys(sorters).forEach(sorter =>
        {
            const lOption = document.createElement("option");

            lOption.textContent = sorter;

            gCmbSorters.appendChild(lOption);
        });
}
