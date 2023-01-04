//https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas
// https://github.com/mdn/dom-examples/tree/main/canvas/pixel-manipulation

import SortableImage from "./SortableImage.js";

import sorters from "./sorters.js";

const gBtnShuffle = document.getElementById("btnShuffle");
const gBtnSort = document.getElementById("btnSort");
const gChkAscending = document.getElementById("chkAscending");
const gCmbSorters = document.getElementById("cmbSorters");

const gSortableImage = new SortableImage("mona_lisa_small.jpg", document.getElementById("conImageCanvas"),
                                         document.getElementById("btnStep"), document.getElementById("chkStep"));

const gBtnStop = document.getElementById("btnStop");
const gRngSpeed = document.getElementById("rngSpeed");


function init()
{
    gBtnShuffle.onclick = Shuffle;
    gBtnSort.onclick = Sort;
    gBtnStop.onclick = Stop;

    gRngSpeed.onchange = ChangeSortSpeed;
    ChangeSortSpeed();

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

function Stop()
{
    gSortableImage.Stop();
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
